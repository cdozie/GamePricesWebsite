import * as React from 'react'
import { useState, useEffect, useRef } from 'react';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { fetchgeneral,emptynoti} from './generalfuncs';
import { AccntPGHeader } from './accountpg';
import { Link,useNavigate } from 'react-router-dom';

const ChangePass= () => {

  const[OldPassVal, setOldPassVal] = useState("")
  const[NewPassVal, setNewPassVal] = useState("")
  const[ConfirmPassVal,setConfirmPassVal] = useState("")
  const[InvalidData, setInvalidData] = useState(true)
  const [Noti, setNoti] = useState(emptynoti);
  let navigate = useNavigate()
  useEffect(() =>{
    setInvalidData(() => !(OldPassVal && NewPassVal && ConfirmPassVal)) 
  })
  useEffect(() => {
      if (Noti.Noti == "Password Changed Successfully"){
        navigate("/")
      }
  },[Noti])

  const onOldPassChange = (e) => {
    setOldPassVal(() => e.target.value)
  }

  const onNewPassChange = (e) => {
    setNewPassVal(() => e.target.value)
  }

  const onConfirmPassChange = (e) => {
      setConfirmPassVal(() => e.target.value);
      if (e.target.value != NewPassVal){
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
        url:'/account/changepassword',
        data:{
          oldpassword: OldPassVal,
          newpassword: NewPassVal,
          confirmation: ConfirmPassVal
        },
        success:function()
        {
          fetchgeneral("getformnoti", setNoti)
        }
      })  
  }


return(
<Form action="/account/changepassword" method="post" className = "form-container-change">
  <Form.Group className="mb-3" controlId="OldPassword">
    <Form.Label>Old Password</Form.Label>
    <Form.Control type="password" placeholder="Old Password:" value = {OldPassVal} name = "password" className='w-auto mx-auto' onChange={onOldPassChange} autoComplete = "on" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="NewPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value = {NewPassVal} placeholder="New Password:" name = "newpassword" className='w-auto mx-auto' onChange={onNewPassChange} autoComplete = "on"/>
  </Form.Group>
  <Form.Group className="mb-3" controlId="ConfirmPassword">
    <Form.Label>Confirm Password</Form.Label>
    <Form.Control type="password" value = {ConfirmPassVal} placeholder="Confirm Password" name = "confirmation" className='w-auto mx-auto' onChange={onConfirmPassChange} autoComplete = "on"/>
  </Form.Group>
  <Button  type="submit" disabled={InvalidData} onClick = {submithandler}>
    Change 
  </Button>
  {(Noti != emptynoti && (Noti.Type != "trigger" && Noti.Type != "success")) &&
    <div className = {`${Noti.Type}`}> {Noti.Noti} </div> 
  }
</Form>

  )
}

const ChangePassForm = () => {
    return(
    <AccntPGHeader accntcontent = {<ChangePass />}/>
    )
}
export default ChangePassForm;
