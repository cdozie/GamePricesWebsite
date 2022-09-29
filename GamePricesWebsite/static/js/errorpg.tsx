import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { fetchgeneral } from './generalfuncs';

const ErrPG = () => {
    let blankErr = {Name : "", Code : ""}
    const[ErrorDetails, setErrorDetails] = useState(blankErr)

    useEffect(() => {
        fetchgeneral('/geterrors', setErrorDetails )
    },[])
    return(
        <div className = "err-total">
            <div className = "err-title">{ErrorDetails.Code}</div>
            <div className = "err-details">{ErrorDetails.Name}: Please Use the Menu to Return Home</div>
        </div>
    )
}
export default ErrPG