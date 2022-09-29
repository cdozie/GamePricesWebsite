import * as React from 'react'
import { useState, useEffect, useRef } from 'react';
// import * as ReactDOM from 'react-dom';
// import {Link} from "react-router-dom";
import { fetchgeneral, dateconversion,moneyconversion } from './generalfuncs';


const Sale = (props) => {
let img
var store = props.Store
if (props.saleprice == null){
    return(null)
}
 if (store == "PlayStation Store"){
     img = "/static/img/PlayStation_Store.jpg"
 }
 else if (store == "Amazon"){
     img = "http://media.corporate-ir.net/media_files/IROL/17/176060/Oct18/Amazon%20logo.PNG"
 }
 else if (store == "Best Buy"){
     img = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Best_Buy_Logo.svg/1280px-Best_Buy_Logo.svg.png"

 }
 else if (store == "Walmart"){
     img = "https://cdn.corporate.walmart.com/dims4/WMT/71169a3/2147483647/strip/true/crop/2389x930+0+0/resize/980x381!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2Fd6%2Fe7%2F48e91bac4a8ca8f22985b3682370%2Fwalmart-logos-lockupwtag-horiz-blu-rgb.png"
 }

 else (
     img = "/static/img/crossedcamera.png"
 )



const defaultprice = moneyconversion(props.defaultprice)
const currentprice = moneyconversion(props.saleprice)

let percentoff = Math.round((100*(defaultprice-currentprice))/defaultprice)
console.log(isNaN(percentoff))
let enddate = dateconversion(props.storeenddate)
if (enddate == "Unknown"){
    return(
        <a href = {props.storelink}>
    <div className ="gmpg-ind-sale">
        <img className = "gmpg-sale-store-picture" src = {img}/> 
        <strong className="gmpg-sale-price">
            {props.saleprice} 
        </strong >
        { (props.saleprice != props.defaultprice) &&
        <span className = "gmpg-sale-conditionals">
            <span className = "gmpg-percent-off">
                -{percentoff}%
            </span>
        </span>
        }

    </div>
    </a>    
    )
}
return(
    <a href = {props.storelink}>
    <div className ="gmpg-ind-sale">
        <img className = "gmpg-sale-store-picture" src = {img}/> 
        <strong className="gmpg-sale-price">
            {props.saleprice} 
        </strong >
        { (props.saleprice != props.defaultprice  && !isNaN(percentoff)) &&
        <span className = "gmpg-sale-conditionals">
            <span className = "gmpg-percent-off">
                -{percentoff}%
            </span>

            <div className = "gmpg-sale-end">
                <strong>
                Ends on {enddate}
                </strong>
            </div>
        </span>
        }

    </div>
    </a>

 )
}

export default Sale 