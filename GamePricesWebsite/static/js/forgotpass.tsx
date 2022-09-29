import * as React from 'react'

import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral, websiteformcentering, showLoader,hideLoader, emptynoti } from './generalfuncs';
import { Link,useNavigate } from 'react-router-dom';
const ForgotPassForm = () => {
    

    const[EmailVal, setEmailVal] = useState("")
    const[OTPVal, setOTPVal] = useState("")
    const[PassVal,setPassVal] = useState("")
    const[ConfirmPassVal,setConfirmPassVal] = useState("")
    const[InvalidData, setInvalidData] = useState(true)
    const[ShowEmail,setShowEmail] = useState(true)
    const [Noti, setNoti] = useState(emptynoti);
    const navigate = useNavigate();

  
    useEffect(() =>{
    websiteformcentering(0,0,".form-container")

    if (ShowEmail){
        setInvalidData(() =>!(EmailVal)) 

    }
    else{
      setInvalidData(() =>!(OTPVal && PassVal && ConfirmPassVal))
    };
    // console.log(ElementHeight)

    })
  
    const onEmailChange = (e) => {
      setEmailVal(() => e.target.value)
    }
  
    const onOTPChange = (e) => {
      setOTPVal(() => e.target.value)
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
    const submithandler = (e) => {
      e.preventDefault()
      $.ajax({
          type:'POST',
          url:'/forgotpassword',
          data:{
            email: EmailVal,
            emailOTP: OTPVal,
            password: PassVal,
            confirmation: ConfirmPassVal
          },
          success:function()
          {
            fetchgeneral("getformnoti", setNoti)
            // websiteformcentering(0,0,".form-container")

          }
        })  
    }
    const emailhandler = (e) =>{
        showLoader()
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:'/forgotpassword',
            data:{
              email: EmailVal,
            },
            success:function()
            {
              fetchgeneral("getformnoti", setNoti)
              hideLoader()
            //   websiteformcentering(0,0,".form-container")

            }
          });
        

    }

    const sendfunc = () => {
        $.ajax({
            type:'POST',
            url:'/forgotpassword',
            data:{
                resend: "Yes",
            },
        })
    } 
    const resendmessage = () => {
        setNoti({Type:"success", Noti: `Resent Email to ${EmailVal}`})
    } 
  useEffect(()=>{
    // console.log(Noti.Noti)
    // console.log(Noti.Noti =="Show Form")
    if (Noti.Type =="trigger" && Noti.Noti == "Email Confirmed"){
        setShowEmail(() => false);
        sendfunc();
    };
    if (Noti.Type == "success" && Noti.Noti == "Password Changed"){
        navigate("/login")
    }

  },[Noti])
//   useEffect(() => {
//     hideLoader()
//   },[])
  
  return(
<div className="container-fluid form-container">
    <h3 className = "login-title"> FORGOT PASSWORD </h3>
  <Form action="/forgotpassword" method="post" >
    <div></div>
    {ShowEmail 
    
    ?(<div><Form.Group className="mb-3" controlId="Email">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email" placeholder="Email:" value = {EmailVal} name = "email" className='w-auto mx-auto' onChange={onEmailChange} autoComplete = "on" />
    </Form.Group>
    <Button  type="submit" disabled={InvalidData} onClick = {emailhandler}>
      Verify 
    </Button></div>)
    :(
    <div>
    <Form.Group className="mb-3" controlId="Forgot-OTP">
      <Form.Label>OTP</Form.Label>
      <Form.Control type="text" value = {OTPVal} placeholder="OTP:" name = "OTP" className='w-auto mx-auto' onChange={onOTPChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="Password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" value = {PassVal} placeholder="Password:" name = "password" className='w-auto mx-auto' onChange={onPassChange} autoComplete = "on"/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="ConfirmPassword">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control type="password" value = {ConfirmPassVal} placeholder="Confirm Password:" name = "confirmation" className='w-auto mx-auto' onChange={onConfirmPassChange} autoComplete = "on"/>
    </Form.Group>
    <Button  type="submit" disabled={InvalidData} onClick = {submithandler}>
      Change 
    </Button>
    <div className="mb-3">
            <h4>Didn't Get An Email? Click <button onClick = {(e) => {e.preventDefault(); sendfunc(); resendmessage()}} className="btn btn-link" id = "resendbutton" type="submit">Here</button>To Resend.</h4>
    </div>
    </div>
)
}
    {(Noti != emptynoti && Noti.Type != "trigger") &&
      <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
    }

  </Form>
</div>
  
    )
  }
  export default ForgotPassForm;