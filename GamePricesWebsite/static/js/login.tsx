import * as React from 'react'
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral,websiteformcentering,emptynoti} from './generalfuncs';
import {Link, useNavigate, Navigate} from 'react-router-dom'
// import { Navigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const[UserVal, setUserVal] = useState("")
  const[PassVal, setPassVal] = useState("")
  const[InvalidData, setInvalidData] = useState(true)
  const [Noti, setNoti] = useState(emptynoti);
//   const[ElementHeight,setElementHeight] = useState(0)
//   const[ElementWidth,setElementWidth] = useState(0)

//   const ref = useRef(null)
  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })


  useEffect(() =>{


//     const handleResize = () =>{
//       setDimensions({
//           height: window.innerHeight,
//           width: window.innerWidth
//         })  
//   }
//   $(window).on('resize', handleResize)
    websiteformcentering(0,0,".form-container")

    setInvalidData(() => !(UserVal && PassVal));
    // setElementHeight(() => ref.current.clientHeight);
    // setElementWidth(() => ref.current.clientWidth);    
    // formcentering(ElementHeight);
    console.log(Noti.Noti)
    if (Noti.Noti == "Correct Credentials"){
      navigate("/")
     } 

     return() => {
        $(window).off('resize')
     } 
  })



  const onUserChange = (e) => {
    setUserVal(() => e.target.value)
  }

  const onPassChange = (e) => {
    setPassVal(() => e.target.value)
  }

  const submithandler = (e) => {
    e.preventDefault()
    $.ajax({
        type:'POST',
        url:'/login',
        data:{
          username: UserVal,
          password: PassVal,
        },
        success:function()
        {
          fetchgeneral("getformnoti", setNoti)
          websiteformcentering(0,0,".form-container")

          // console.log(Noti.Noti)
        }
      });
  }
//   useEffect(()=>{
//     hideLoader();
//   },[])
  return(
<div className="container-fluid form-container">
    <h3 className = "login-title"> LOGIN </h3>
<Form action="/login" method="post" >
  <Form.Group className="mb-3" controlId="formBasicUsername">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Username:" value = {UserVal} name = "username" className='w-75 mx-auto' onChange={onUserChange} autoComplete = "on" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value = {PassVal} placeholder="Password" name = "password" className='w-75 mx-auto' onChange={onPassChange} autoComplete = "on"/>
  </Form.Group>
  <Button  type="submit" className = "w-50 mx-auto" disabled={InvalidData} onClick = {submithandler}>
    Login
  </Button>
  {(Noti !=emptynoti && Noti.Type != "status") &&
    <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
  }
{/* <hr/> */}
<div className="login-alts">
        <h4><Link to="/register" className="login-altops">New around here? Register</Link> </h4>
        <h4><Link to= "/forgotpassword" className="login-altops">Forgot password?</Link></h4>
  </div>
{/* <hr/> */}
</Form>
</div>
  )
}
export default LoginForm;
