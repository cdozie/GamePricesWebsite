import * as  React from 'react'
import { useEffect, useState, useLayoutEffect } from 'react';
import Header from './header';
// import { Link } from 'react-router-dom';
const Layout = (props) => {

    
    return(

        <div className = "full-page">
            <div className = "main-page-content">
                {props.Logged 
                ?(
                    <div className='header-items'>
                    <Header logged = {true}/>
                    </div>)
                :( 
                    <div className='header-items'>
                    <Header logged = {false}/>
                    </div>
                )
                }
                {props.child} 

            </div>
        <footer>
            <hr/>
            <h4 className = "gradientcolorpinkwhite">Creator: Chidozie Nwabuebo</h4>
            <h4 className = "gradientcolorpinkwhite">Email:<a href="mailto:dozie128@gmail.com">dozie128@gmail.com</a></h4>
            <hr/>
        </footer>  
        </div>

    )
}

export default Layout;