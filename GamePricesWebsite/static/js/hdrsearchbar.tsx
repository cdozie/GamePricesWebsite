import * as React from 'react'
import { useState, useEffect, useRef} from 'react';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Link } from "react-router-dom";
import { fetchgeneral,emptynoti,searchbarcentering} from './generalfuncs';
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
const HDRsearchbar = (props) => {
    const[SearchResults, setSearchResults] = useState([])
    const[SearchBarVal, setSearchBarVal] = useState("")
    const[ShowSearchLST, setShowSearchLST] = useState(false)
    const[ElementHeight,setElementHeight] = useState(0)
    const[ElementWidth,setElementWidth] = useState(0)
    const [dimensions, setDimensions] = useState({ 
        height: window.innerHeight,
        width: window.innerWidth
      })

    const ref = useRef(null)
    const searchref = useRef(null)
    let navigate = useNavigate()

    const onSearchBarChange = (e) => {
        setSearchBarVal(() => e.target.value);
        
        $.ajax({
            type:'POST',
            url: "/searchbar",
            data:{
                search: (e.target.value).trim()
            },
            success: function(){
                fetchgeneral("searchresults", setSearchResults)
                setShowSearchLST(() => true)

            }
        });

    }
    const optionClickHandler = (e) => {
        let id = e.target.getAttribute('id')
        let link = `/game/${id}`
        if (props.isNonRoute){
            window.location.href = link 
        }
        else{
        navigate(link)
        setShowSearchLST(() => false)
        setSearchBarVal(() => "")
        }
        

    }
    const onSearchBTNClick = () =>{
        // $.ajax({
        //     type: "POST",
        //     url: "/fullsearch",
        //     data:{
        //         fullsearchinput : SearchBarVal
        //     },
        //     success:function(){
                navigate(`/gamesearch?search=${encodeURIComponent(SearchBarVal.toLowerCase().trim())}&page=1`)
                setSearchBarVal(() => "")
                setShowSearchLST(() => false)

        // }

        // )
    }
    useEffect(() => {
        console.log(SearchResults)
    },[SearchResults])
    useEffect(() => {
        const handleResize = () =>{
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
              })  
        }
        console.log($('.hide').length)
        setElementHeight(() => ref.current.clientHeight);
        setElementWidth(() => ref.current.clientWidth); 
        var barclass = "gamedropdown"
        searchbarcentering(ElementHeight,ElementWidth,barclass)
        $(window).on('resize', handleResize)
        if ($(".hdr-search-input").is(":focus")){
           $(".hdr-search-input").on("keypress", function(e){
                if (e.key == "Enter" ){
                    onSearchBTNClick()
                }
           }) 
        }

        return () => {
            $(window).off('resize')}
        // if ($('.hide').length) {
        //     setShowSearchLST(() => false)
        //     }     
        }
    )

    if (!ShowSearchLST){
        return(
        <span>
        <span className = "main-search-bar">
        <OutsideClickHandler onOutsideClick={() => {setShowSearchLST(() => false)}}>
            <Form.Control  className = 'mx-auto hdr-search-input' type = "text" placeholder = "Search Game:" value ={SearchBarVal}
            ref = {ref} onChange={e => {onSearchBarChange(e);}}/>
        </OutsideClickHandler>

        </span>
        <Button type = "submit" className = "search-bar-button" onClick = {onSearchBTNClick}> 🔍</Button> 
        </span>
        )

    }
    return(
        <span>
        <span className = "main-search-bar">
        <OutsideClickHandler onOutsideClick={() => {setShowSearchLST(() => false)}}>
            <Form.Control className = 'mx-auto hdr-search-input' type = "text" placeholder = "Search Game:" value ={SearchBarVal} 
            onChange={e => {onSearchBarChange(e);}}/> 


            {/* { (ShowSearchLST) && */}
            <datalist className= "gamedropdown" ref = {ref}>
            <div className = "fullsearchresults">
            {
            SearchResults.map((result) => 
                <div className = "search-result-block" key = {`${result.idpsngamedata}`} >
                    <img className = "gameoptionimages" id= {`${result.mainimage}`} src ={`${result.mainimage}`}></img>
                    {/* <button className = "searchbar-buttons"><option  onClick = {optionClickHandler} className = "item-text gamedboptions" slug = {`${result.slug}`} id ={`${result.name}`}> {`${result.name}`}</option></button> */}
                {/* <div><Link to = {`/game/${result.slug}`}> <option   className = "item-text gamedboptions" slug = {`${result.slug}`} id ={`${result.name}`}> {`${result.name}`}</option></Link></div> */}
                    <div className = "search-result-text"> 
                        <option  onClick = {optionClickHandler} className = "item-text gamedboptions" id ={`${result.idpsngamedata}`}> {`${result.gamename}`} </option> 
                        <span className = "search-bar-platform">{result.platform}</span>
                    </div>
                </div>
            )
            }
            </div>
            </datalist>
        </OutsideClickHandler>
        </span>
        <Button type = "submit" className = "search-bar-button" onClick = {onSearchBTNClick}> 🔍</Button> 
        </span>
        
        )
}
export default HDRsearchbar