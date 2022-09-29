import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import {fetchgeneral, websiteformcentering, showLoader, hideLoader} from './generalfuncs';
import EventFlasher from './eventflasher';
import { Link,useNavigate } from 'react-router-dom';
const RegisterForm = () => {
    var emptynoti = {Type: "", Noti : ""}
    const[EmailVal, setEmailVal] = useState("")
    const[UserVal, setUserVal] = useState("")
    const[PassVal,setPassVal] = useState("")
    const[ConfirmPassVal,setConfirmPassVal] = useState("")
    
    const[InvalidData, setInvalidData] = useState(true)
    
    const [Noti, setNoti] = useState({Type: "", Noti : ""});
    
    const [showOTP, setshowOTP] = useState(false)
    const[OTPVal, setOTPVal] =useState("")

    const[ElementHeight,setElementHeight] = useState(0)
    const[ElementWidth,setElementWidth] = useState(0)

    // TEMP
    const ref = useRef(null)
    var navigate = useNavigate()
  
    useEffect(() =>{
      setInvalidData(() =>{
        if (!showOTP){
          return(!(EmailVal && UserVal && PassVal && ConfirmPassVal))
        } 
        else{
          return(!(OTPVal))
        }
      }) 
      websiteformcentering(0,0,".form-container")

      setElementHeight(() => ref.current.clientHeight)
      setElementWidth(() => ref.current.clientWidth);
      ;
      // formcentering(ElementHeight,ElementWidth)

    })
  
    const onEmailChange = (e) => {
      setEmailVal(() => e.target.value)
    }
  
    const onUserChange = (e) => {
      setUserVal(() => e.target.value)
    }
    const onPassChange = (e) => {
        setPassVal(()=> e.target.value)
    }
    const onConfirmPassChange = (e) => {
        setConfirmPassVal(() => e.target.value);
        if (e.target.value != PassVal){
            setNoti({Type: "error", Noti : "Confirmation Must Match Original"})
        }
        else{
            setNoti(emptynoti)

        }   
    }
    const onOTPChange = (e) => {
      setOTPVal(() => e.target.value)
    }
    const usersubmithandler = (e) => {
      e.preventDefault()
      $.ajax({
          type:'POST',
          url:'/register',
          data:{
            email: EmailVal,
            username: UserVal,
            password: PassVal,
            confirmation: ConfirmPassVal
          },
          success:function()
          {
            fetchgeneral("getformnoti", setNoti)
            websiteformcentering(0,0,".form-container")


          }
        })  
    }
    const otpsubmithandler = (e) => {
      e.preventDefault()
      $.ajax({
          type:'POST',
          url:'/register',
          data:{
            OTP: OTPVal,
          },
          success:function()
          {
            fetchgeneral("getformnoti", setNoti)
            websiteformcentering(0,0,".form-container")

          }
        })  
    }
    useEffect(()=> {
      if (Noti.Type == "trigger"){
        setshowOTP(() => true)
      }
      if (Noti.Type == "success"){
        navigate("/login")
      }
    },[Noti])
    useEffect(()=> {
      setNoti(() => emptynoti)
      // setshowOTP(() => false)
  },[])
  
  return(
<div>
  <EventFlasher />
<div className="container-fluid form-container" ref = {ref}>
    <h3 className = "login-title"> REGISTER </h3>
  <Form action="/register" method="post" >

  {showOTP 
    ?(<div className = "OTP-register">

    <Form.Group className="mb-3" controlId="Email">
      <Form.Label>Email</Form.Label>
      <Form.Control type="text" placeholder="OTP" value = {OTPVal} name = "OTP" className='w-auto mx-auto' onChange={onOTPChange} autoComplete = "on" />
    </Form.Group>
    <Button  type="submit" disabled={InvalidData} onClick = {otpsubmithandler}>
      Confirm
    </Button>

    </div>)
    :(<div className = "user-register">
    <Form.Group className="mb-3" controlId="Email">
      <Form.Label>Email</Form.Label>
      <Form.Control type="text" placeholder="Email:" value = {EmailVal} name = "Email" className='w-auto mx-auto' onChange={onEmailChange} autoComplete = "on" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="Username">
      <Form.Label>Username</Form.Label>
      <Form.Control type="text" value = {UserVal} placeholder="Username:" name = "username" className='w-auto mx-auto' onChange={onUserChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="Password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" value = {PassVal} placeholder="Password:" name = "confirmation" className='w-auto mx-auto' onChange={onPassChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="ConfirmPassword">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control type="password" value = {ConfirmPassVal} placeholder="Confirm Password:" name = "confirmation" className='w-auto mx-auto' onChange={onConfirmPassChange} autoComplete = "on"/>
    </Form.Group>
    <Button  type="submit" disabled={InvalidData} onClick = {usersubmithandler}>
      Register 
    </Button>
    </div>)
    }
    {(Noti != emptynoti && Noti.Type != "trigger") &&
      <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
    }
  <div className="login-alts">
        <h4><Link to="/login" className="login-altops">Back To Login</Link> </h4>
        {/* <h4><a href="/forgotpassword" className="login-altops">Forgot password?</a></h4> */}
  </div>
  </Form>
  
  </div>
  </div>
  
    )
  }
  export default RegisterForm;
  