import * as React from 'react'
import { useState, useEffect} from 'react';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Link } from "react-router-dom";
import { fetchgeneral,} from './generalfuncs';
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler';


const Wishlist = () => {
    const[WishlistData, setWishlistData] = useState ([])
    const[ShowOrgOptions,setShowOrgOptions] = useState (false)
    useEffect(() => {
        fetchgeneral("getwishlistdata", setWishlistData)
    },[] )

let wshlstoptions = ["A-Z", "Z-A",  "PSN Price (Highest-Lowest)","PSN Price (Lowest-Highest)","Default Price (Lowest-Highest)", "Default Price (Highest-Lowest)", " Release Date","Time Added (Recent-Old)"]
let optionids = ["alphabet", "rev_alphabet","currentpsnprice (high-low)", "currentpsnprice (low-high)","defaultprice (low-high)", "defaultprice (high-low)", "releasedate", "time added"]
let wshlstoptdict = []
for (let i =0; i <  wshlstoptions.length; i++){
    wshlstoptdict.push({Name:wshlstoptions[i],ID: optionids[i]  })
}
    const onwshbtnclick = () =>{
        setShowOrgOptions(() => true)
    }
    return(
        <div className ="wishlist-data">
            <div className = "wshlist-title">Your Wishlist</div>
            <OutsideClickHandler onOutsideClick={() => {setShowOrgOptions(() => false)}}>
            <span className = "wshlst-organizer">
            <span onClick  = {onwshbtnclick} className = "wshlst-organizer-btn ">↑↓</span> 
            {ShowOrgOptions &&
            <div className = "wshlst-organize-options">
                {wshlstoptdict.map((option) => 
                <WishlistOrganizeOption id = {option.ID} setShowOrgOptions = {setShowOrgOptions} setWishlistData = {setWishlistData} option = {option.Name}/>
                )
                }
            </div>
            }
            </span>
            </OutsideClickHandler> 
            <span className = "wshlst-heading"> 
            <WishlistElement gamename = "Game Name" 
                defaultprice = "Default Price" saleprice = "Best Sale Price" releasedate = "Release Date" gameimage = "Game Image"/>     
            </span> 

            {WishlistData.map((game) =>
            <Link to = {`/game/${game.gameid}`}>
                <WishlistElement key = {game.gameid} gamename = {game.gamename} 
                defaultprice = {game.defaultprice} saleprice = {game.currentpsnprice} releasedate = {game.releasedate} gameimage = {game.mainimage} /> 
            </Link>

            )
            }
        </div>
    )
}


const WishlistElement =(props) =>{
    return(
        <div className = "wishlist-element">
            {props.gameimage != "Game Image"
           ?(<img className = 'wshlst-images' src = {props.gameimage}/>)
           :(<strong className = "wshlst-gamename">{props.gameimage}</strong>
           )
    }
           <strong className = "wshlst-gamename">{props.gamename}</strong>
           <strong className = "wshlst-gameprice">{props.defaultprice}</strong> 
           <strong className= "wshlst-saleprice">{props.saleprice}</strong>
           <strong className = "wshlst-release-date"> {props.releasedate}</strong>
        </div>

    )
}
const WishlistOrganizeOption = (props) => {
    const onOptionClick = (e) => {
        $.ajax({
            type: 'POST',
            url:'/wishlistmodified',
            data:{
                orgtype : e.target.getAttribute("id")
            },
            success:function(){
                fetchgeneral("getwishlistmodified", props.setWishlistData )
                console.log(e.target.getAttribute("id"))
                props.setShowOrgOptions(()=>false)
            }

        })
    }
    return(
        <div onClick = {onOptionClick} id = {props.id} className='wshlst-organize-option'>{props.option}</div>

    )
}

export default Wishlist