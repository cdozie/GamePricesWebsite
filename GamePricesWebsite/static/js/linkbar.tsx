import * as React from 'react'
import { useEffect, useState, useLayoutEffect} from "react";
import HDRsearchbar from './hdrsearchbar';

// import { Routes, Route, useParams, useNavigate, BrowserRouter } from "react-router-dom";

import {Link}  from "react-router-dom";
import { fetchgeneral } from './generalfuncs';

const LinkBar = (props) => {

    var position = $(window).scrollTop(); 

// should start at 0

$(window).on("scroll", function() {
    var scroll = $(window).scrollTop();
    var linkmenu = $('.link-menu')
    if(scroll > position) {
        var verticaloffset = linkmenu.offset().top
        if (verticaloffset >= linkmenu.height() * 1.5){
            linkmenu.addClass('hide');
        }
        // console.log('scrollDown');
    } else {
        //  console.log('scrollUp');
         linkmenu.removeClass('hide');
         var verticaloffset = linkmenu.offset().top
        //  console.log(verticaloffset)
         if( verticaloffset >= $('.header-items').height() + linkmenu.height()){
            linkmenu.addClass('dark');
        }
         else{
            linkmenu.removeClass('dark');

         }
        }
    position = scroll;
})
    
    return(
    <header>
        {props.logged
        ?(<div className="main-menu">
            <div className="link-menu">
                <nav className="header-menu">
                    <span className = "left-header-menu">
                    <Link to="/">Home</Link> 
                    <a href = "/logout">Log Out</a>
                    <Link to = "/wishlist">Wishlist</Link>
                    {/* <Link to = "/account"> My Account</Link> */}
                    {/* <Link to ="/aboutsite">About</Link> */}
                    </span>
                    <span className = "right-header-menu">
                    <HDRsearchbar isNonRoute = {false} />
                    <Link to = "/account/changepassword">
                    <LinkBarIcon/>
                    </Link>
                    </span>


                </nav>
                {/* <span className = "right-header-elements">

                </span> */}

            </div>

        </div>)
        :( 
            <div className="main-menu">
                <div className="row link-menu">
                    <nav className="header-menu">
                    <span className = "left-header-menu">

                        <Link to="/register">Register</Link> 
                        <Link to = "/login">Login</Link>
    
                    </span>

                    </nav>
                </div>
            </div>)
            }
                        {/* <h1> <a href = "/login"> UG Database </a></h1>   */}

    </header>    
    )
}

const LinkBarIcon  = () => {
    const[AccountDetails,setAccountDetails] = useState({userinitials:""})
    
    useEffect (() => {
        fetchgeneral("accountdetails",setAccountDetails )
    },[])
    return(
        <span className = "link-bar-icon">
            {AccountDetails.userinitials}
        </span>
    )
}
export default LinkBar; 


export const NonRouteLinkBar = (props) => {

    var position = $(window).scrollTop(); 

// should start at 0

$(window).on("scroll", function() {
    var scroll = $(window).scrollTop();
    var linkmenu = $('.link-menu')
    if(scroll > position) {
        var verticaloffset = linkmenu.offset().top
        if (verticaloffset >= linkmenu.height() * 1.5){
            linkmenu.addClass('hide');
        }
        // console.log('scrollDown');
    } else {
        //  console.log('scrollUp');
         linkmenu.removeClass('hide');
         var verticaloffset = linkmenu.offset().top
        //  console.log(verticaloffset)
         if( verticaloffset >= $('.header-items').height() + linkmenu.height()){
            linkmenu.addClass('dark');
        }
         else{
            linkmenu.removeClass('dark');

         }
        }
    position = scroll;
})
    
    return(
    <header>
        {props.logged
        ?(<div className="main-menu">
            <div className="link-menu">
                <nav className="header-menu">
                    <span className = "left-header-menu">
                    <a href="/">Home</a> 
                    <a href = "/logout">Log Out</a>
                    <a href = "/wishlist">Wishlist</a>
                    {/* <Link to = "/account"> My Account</Link> */}
                    {/* <Link to ="/aboutsite">About</Link> */}
                    </span>
                    <span className = "right-header-menu">
                    <HDRsearchbar isNonRoute = {true} />
                    <a href = "/account/changepassword">
                    <LinkBarIcon/>
                    </a>
                    </span>


                </nav>
                {/* <span className = "right-header-elements">

                </span> */}

            </div>

        </div>)
        :( 
            <div className="main-menu">
                <div className="row link-menu">
                    <nav className="header-menu">
                    <span className = "left-header-menu">

                        <a href="/register">Register</a> 
                        <a href = "/login">Login</a>
    
                    </span>

                    </nav>
                </div>
            </div>)
            }
                        {/* <h1> <a href = "/login"> UG Database </a></h1>   */}

    </header>    
    )
}