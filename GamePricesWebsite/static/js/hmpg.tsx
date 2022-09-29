import * as React from 'react'
import { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Link} from "react-router-dom";
import { fetchgeneral, dateconversion } from './generalfuncs';
const Homepage  = () => {
    const [PSNsales, setPSNsales] = useState([])
    useEffect(() => {
    fetchgeneral('gethmpgpsnsalelst',setPSNsales)
    },[])
    return(
        <DisplayHMPGList title = "PSN GAMES ON SALE" data = {PSNsales} /> 
    )
}

const DisplayHMPGList  = (props) => {
    return(
        <div className= "hmpg-psn-section general-padding">
            <h2 className = "hmpg-titles left-align">{props.title}</h2>
            <div className = "hmpg-psn-sale-games">
            {
                props.data.map((psnsale) => 
                <span className='col-lg-2 col-md-3 col-sm-4 col-6' key = {`${psnsale.idpsngamedata}`}>
                <Link to = {`/game/${psnsale.idpsngamedata}`} >
                    <div className = "item" > 
                        {/* <div className='img-cell'> */}
                        {/* <input name = "rand-game-slug" style={{display: "none"}} value={formval} onChange = {value}></input> */}
                        <img  className = "game-image-items" src = {psnsale.mainimage}></img> 
                        {/* </div> */}
                        <div className = "item-text"
                        id = {`${psnsale.idpsngamedata}`}>{psnsale.gamename}</div>
                        <div className = "platform-text">
                            Platforms: {psnsale.platform}
                        </div>
                        <div className = "hmpg-price-details">
                        <s className = "muted-text">{psnsale.defaultprice}</s> 
                        <strong> {psnsale.currentpsnprice} </strong>
                        <span className="hmpg-discount">{psnsale.percentoff}</span>
                        </div>
                        {dateconversion(psnsale.psn_sale_end) != "Unknown" &&
                        <div className ="hmpg-sale-ends">
                            Sale Ends on: {dateconversion(psnsale.psn_sale_end)}
                        </div>
                        }

                        {/* <div className = "gradientcolor">Metacritic Rating:</div > 
                            <div  className = {`rankings inlinemarker ${colorclassnames (randmodule.GOR)}`}>{randmodule.GOR}</div>  */}
                    </div> 
                </Link>
                </span> 
                )
            }

            </div>
        </div>  
    )
}

export default Homepage