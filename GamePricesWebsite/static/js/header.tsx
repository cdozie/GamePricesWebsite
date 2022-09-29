import * as React from 'react' 
import { useEffect, useState, useLayoutEffect } from 'react';
import {Link} from 'react-router-dom';
import LinkBar from './linkbar';
import { NonRouteLinkBar } from './linkbar';
import HDRsearchbar from './hdrsearchbar';
// import SearchBar from './mainsearchbar';
const Header = (props) => {
return(
<div>
    {props.logged
    ?(<div className='logged-heading'>
        <LinkBar logged = {true} />
        {/* <div className = "link-menu spacing"></div> */}

        <h1 className = "Website-Heading"> <Link to = "/"> UG Prices </Link></h1>            
        {/* <SearchBar /> */}
        {/* <HDRsearchbar /> */}

        <div className = "mb-3"/>

        </div>  
)
    :(<div className='not-logged-heading'>
        <LinkBar logged = {false}/>
        {/* <div className = "link-menu spacing"></div> */}
        <h1 className = "Website-Heading"> <a href = "/login"> UG Prices </a></h1> 
        <div className = "mb-3"/>

        </div>  
)
}
</div>  
)
}

export default Header;

export const NonRouteHeader = (props) => {
    return(
    <div>
        {props.logged
        ?(<div className='logged-heading'>
            <NonRouteLinkBar logged = {true} />
            {/* <div className = "link-menu spacing"></div> */}
    
            <h1 className = "Website-Heading"> <a href = "/"> UG Prices </a></h1>            
            {/* <SearchBar /> */}
            {/* <HDRsearchbar /> */}
    
            <div className = "mb-3"/>
    
            </div>  
    )
        :(<div className='not-logged-heading'>
            <NonRouteLinkBar logged = {false}/>
            {/* <div className = "link-menu spacing"></div> */}
            <h1 className = "Website-Heading"> <a href = "/login"> UG Prices </a></h1> 
            <div className = "mb-3"/>
    
            </div>  
    )
    }
    </div>  
    )
    }