import * as  React from 'react'
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import Header from './header';
import { fetchgeneral, websitecentering,websiteformcentering,showLoader,hideLoader } from './generalfuncs';
import HDRsearchbar from './hdrsearchbar';
import EventFlasher from './eventflasher';
// import { Link } from 'react-router-dom';
const ResizeLayout = (props) => {
    const ref = useRef(null)

    const[ElementHeight,setElementHeight] = useState(0)
    const[ElementWidth,setElementWidth] = useState(0)
    const [dimensions, setDimensions] = useState({ 
        height: window.innerHeight,
        width: window.innerWidth
      })


    useEffect(() => {
        const handleResize = () =>{
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
              })  
        }

        setElementHeight(() => ref.current.clientHeight);
        setElementWidth(() => ref.current.clientWidth);  
        var flash_noti_class = ".website-component" 
        console.log(ElementHeight)
        if (props.form == null){
            websitecentering(ElementHeight,ElementWidth, flash_noti_class);

        }
        else{
            websiteformcentering(0,0,".form-container")
        }
        $(window).on('resize', handleResize)


        return () => {
            $(window).off('resize')}
    })
    useEffect(()=>{
        websiteformcentering(0,0,".form-container")

    },[props.child]
    )
    return(

        <div className = "full-page">
            <EventFlasher change = {props.child}/>
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

                <div className = "website-component" ref = {ref}>
                    {props.child} 
                </div>

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

export default ResizeLayout;