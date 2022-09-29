import * as React from 'react'
import { useState, useEffect} from 'react';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Link } from "react-router-dom";
import { fetchgeneral,emptynoti} from './generalfuncs';
import Sale from './gamesale';
import { Button } from 'react-bootstrap';

// var emptygamedatatitles = ["gamename", "psntitleid", "releasedate", "publisher", "platform", "mainimage", "defaultprice", "currentpsnprice", "psn_sale_end"]
var emptygamedata = {userid : "", inwshlst : "" , idpsngamedata :"" ,gamename : "", psntitleid: "", releasedate: "", publisher : "", platform:"", mainimage: "", defaultprice: "", currentpsnprice: "", psn_sale_end: "", psnwebsite:""}
// for( const element of emptygamedatatitles){
//     emptygamedata[element] = ""
// }
console.log(emptygamedata)
const Gamepage = (props) => {
    const[GameData, setGameData] = useState(emptygamedata)
    const[Sales, setSales] = useState([])
    const[AddMessage, setAddMessage] = useState("")
    const[Loaded, setLoaded] = useState(false)
    let params = useParams()


    useEffect(() => {
        $.ajax({
            type:'POST',
            url:`/game/${params.gameid}`,
            success:function()
            {           
    
                fetchgeneral("getgamedata",setGameData);
                fetchgeneral("getsales",setSales);
                setLoaded(() => true)


            }
          });
    },[params])

    const addwshlsthandler = (e) => {
        $.ajax({
            type: 'POST',
            url:'/wishlistedit',
            data:{
                add: "Yes",
                gameid : GameData.idpsngamedata,
                gamename: GameData.gamename,
                userid : GameData.userid 
            },
            success: function(){
                fetchgeneral("getgamedata",setGameData)

            }
        })
    }
    const removewshlsthandler = (e) =>{
        $.ajax({
            type: 'POST',
            url:'/wishlistedit',
            data:{
                remove: "Yes",
                gameid : GameData.idpsngamedata,
                gamename: GameData.gamename,
                userid : GameData.userid 
            },
            success: function(){
                fetchgeneral("getgamedata",setGameData)

            }
        })
    }  
        if (Loaded != true || GameData == emptygamedata){
            return null
        }
    console.log(Sales)
    return(
        
        <div id='main-game-page' >
            {/* {Loaded && */}
                <span className = 'main-game-name left-align subtitle'>{GameData.gamename}</span>
                {GameData.inwshlst 
                ?( <Button  className = "gmpg-wshlst-btn error" onClick = {removewshlsthandler}> Wishlist - </Button>)
                :(<Button className = "gmpg-wshlst-btn success" onClick = {addwshlsthandler}> Wishlist + </Button>)
                }
            {/* </div> */}

            <div id = 'left-column' className = "left-align">
                <div >
                    <img  className = "main-game-image" src = {`${GameData.mainimage}`}/>
                </div>

                <div className = "main-release-date">
                    Release Date: {GameData.releasedate}
                </div>
                <div className = "main-default-price">
                    Default Price: {GameData.defaultprice}
                </div>
                <div className = "main-developer">
                    Developer/Publisher: {GameData.publisher}
                </div>
                <div className = "main-platform">
                    Platforms: {GameData.platform}
                </div>

            </div>
            <div id = 'right-column'>
                <div className = "gmpg-sales">
                    { Sales.map((sale) =>
                    <Sale key = {sale.Store} Store = {sale.Store} defaultprice = {GameData.defaultprice} saleprice = {sale.Price} storelink = {GameData.psnwebsite} storeenddate = {GameData.psn_sale_end}/> 
                    )

                    }
                </div> 

            </div>
            {/* } */}
        </div>
    )
}
export default Gamepage