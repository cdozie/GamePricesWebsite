import * as React from 'react'
import { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Link} from "react-router-dom";
import { fetchgeneral, dateconversion } from './generalfuncs';

export const AccntPGHeader = (props) => {
    let emptyaccntdict = {username : "", userinitials: "", email: ""}
    const[AccountDetails, setAccountDetails] = useState(emptyaccntdict)
    useEffect(() => {
        fetchgeneral("accountdetails", setAccountDetails)
    },[])

    return(
        <div className = "account-pg">
            <div className = "accnt-details-row">
                <span id = "accnt-username">
                    {AccountDetails.username}
                </span>
                <span id = "accnt-icon">
                    {AccountDetails.userinitials}
                </span>
            </div>
            <div className = "accnt-action-row">
               <span className = "accnt-options-row">
                   <Link to = "/account/changepassword">
                       Change Password
                   </Link>
                   <a href="/logout">
                        Log Out
                   </a>
                </span> 
                <div className='accnt-content'>
                    {props.accntcontent}
                </div>
            </div>
        </div>
        
    )
}

const AccntPG = () => {
    return(
        <AccntPGHeader accntcontent = ""/>
    )
}
export default AccntPG