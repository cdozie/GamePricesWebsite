import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import {fetchgeneral, noticentering,offscreentransition,onscreentransition} from './generalfuncs';


const EventFlasher = (props) =>{
    var emptynoti = {Type: "", Noti : ""}
    const ref = useRef(null)

    const[FlashNoti, setFlashNoti] = useState(emptynoti)

    const[ElementHeight,setElementHeight] = useState(0)
    const[ElementWidth,setElementWidth] = useState(0)
    const [dimensions, setDimensions] = useState({ 
        height: window.innerHeight,
        width: window.innerWidth
      })
    useEffect(() =>{
    fetchgeneral("getflashnoti",setFlashNoti)}, [props.change])

    useEffect(() => {
        const handleResize = () =>{
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
              })  
        }

        setElementHeight(() => ref.current.clientHeight);
        setElementWidth(() => ref.current.clientWidth);  
        var flash_noti_class = ".flash-noti" 
        const onscreentime = setTimeout(() => {
            console.log(FlashNoti)
            onscreentransition(flash_noti_class, "top")
        },50);
        noticentering(0,0, flash_noti_class);

        $(window).on('resize', handleResize)
        const offscreentime = setTimeout(() =>{
            offscreentransition(flash_noti_class, "top")
        },3500)
        const timeID = setTimeout(function() {
            setFlashNoti(emptynoti);
        }, 4500);

        return () => {
            clearTimeout(onscreentime)
            clearTimeout(timeID);
            clearTimeout(offscreentime)
            $(window).off('resize')}
    })

    return(
        <div className = "flash-noti-container" ref = {ref}>
        {FlashNoti != emptynoti
        ?(<div className={`flash-noti ${FlashNoti.Type}`}>
            {FlashNoti.Noti}
        </div>)
        :(null) 
        }
        </div>
    )
}

export default EventFlasher