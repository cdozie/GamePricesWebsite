import * as React from 'react'
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export var emptynoti = {Type: "", Noti : ""}

export const fetchgeneral = (place:string,stateChange) =>{
    // var url: string  = 
    fetch(`http://127.0.0.1:5000/${place}`,{
        method:'GET',
        headers : {
          'Content-Type':'application/json'
        }
      })
    .then(response => (response.json()))
    .then(response => {
      var gr = response
      console.log(gr)
     stateChange(() => gr);
    
    })
    .catch(error => console.log(error))   
}

export const isNumbCheck  =(val) => {
    if (val == "" ||!(val)){
      return ""
    }
    else {
      var valnumb = parseInt(val)
      if (isNaN(valnumb)){
        return 0
      }
      else{
        return valnumb
      }
    }
    }

export var dropdownlist = ["Plan to Play", "Dropped", "Playing", "On Hold", "Completed", "Wishlist"]
export const limittyping = (e,bool, int) =>{ 
    if ((bool) 
    && e.key !=="Delete" // keycode for delete
    && e.key !== "Backspace" // keycode for backspace
    ) 
    {
      e.preventDefault();
      e.target.value = int
    }
  }

  export const isBetween =  (x, min, max) => {
    return x >= min && x<=max
  }
  export const colorclassnames = (val) => {

    var mc = {
      '0-59'     : 'red',
      '60-79'    : 'orange',
      '80-99'   : 'green',
      '100-100'     : 'gold'
    }
    var theclass = ""
    $.each(mc,function (numbs,classname){

      var min = parseInt(numbs.split("-")[0],10);
      var max = parseInt(numbs.split("-")[1],10);
      // console.log(classname)
      // console.log(classname)
      var valint = parseInt(val)    
    if (isBetween(valint,min,max)){
      theclass = classname
    }
    }
    )
  return (theclass) 
  }

  export const formcentering = (ElementHeight,ElementWidth) => {
    $(function(){

        console.log($(window).height())
        $(".form-container").css('top', ($(window).height()+ $('.Website-Heading').height() + $('.link-menu').height() - $('footer').height()- ElementHeight)/2)
        $(".form-container").css('left', ($(window).width() - ElementWidth)/2)

      }) 
  }

  export const websiteformcentering = (ElementHeight, ElementWidth, cssclass) => {
    $(function(){
      // $(".form-container").each(function(){
        // var length = $(this).height();
        let h = $(cssclass).height()
        let w = $(cssclass).width()

        console.log($(window).height())
        $(cssclass).css('top', ($(window).height() + $('.Website-Heading').height() + $('.link-menu').height() - $('footer').height() - h)/2)
        $(cssclass).css('left', ($(window).width() - w)/2)

      }) 
  }

  export const websitecentering = (ElementHeight: number , ElementWidth:number, cssclass:string) => {
    $(function(){
      // $(".form-container").each(function(){
        // var length = $(this).height();
        console.log($(window).height())
        $(cssclass).css('top', ($(window).height()+ $('.Website-Heading').height() + $('.link-menu').height() - $('footer').height() - ElementHeight)/2)
        $(cssclass).css('left', ($(window).width() - ElementWidth)/2)

      }) 
  }

  export const noticentering = (ElementHeight, ElementWidth, cssclass) => {
    $(function(){
        let h = $(cssclass).height()
        let w = $(cssclass).width()
        console.log($(window).height())
        $(cssclass).css('top', ($(window).height() - h)*.1)
        console.log(ElementWidth)
        $(cssclass).css('left', ($(window).width() - w)/2)

      }) 
  }

  export const offscreentransition = (cssclass, type) => {
    $(function(){

        console.log($(window).height())
        if (type == "top"){
        $(cssclass).css('top', (-300))
        }
        else if (type == "left"){
          $(cssclass).css('left', -300)
        }
        else if (type == "right"){
          $(cssclass).css('left', ($(window).width() + 300))
        }
        else if (type == "bottom"){
          $(cssclass).css('top', ($(window).height() + 200 ))

        }
      }) 
  }

  export const onscreentransition = (cssclass, type) => {
    $(function(){

        console.log($(window).height())
        if (type == "top"){
        $(cssclass).css('top', ($(window).height() * .1))
        }
        else if (type == "left"){
          $(cssclass).css('left', 300)
        }
        else if (type == "right"){
          $(cssclass).css('left', ($(window).width() - 300))
        }
        else if (type == "bottom"){
          $(cssclass).css('top', ($(window).height() - 200 ))

        }
      }) 
  }
export const loader = document.querySelector('.loader');

export const showLoader = () => loader.classList.remove('loader--hide');

export const hideLoader = () => loader.classList.add('loader--hide');

export const dateconversion = (date:string) =>{
  let datecomponents = date.split("-")
  let year = datecomponents[0]
  let month = datecomponents[1]
  let day = datecomponents[2]
  if (month == null || day == null){
    return("Unknown")
  }

  return (month + "/" + day)

}

export const moneyconversion  = (price:string) => {
  if (price.toLowerCase().trim() == "free"){    
    return 0.0}

  var temp = price.replace(/[^0-9.-]+/g,"");
  return parseFloat(temp);

}
export const searchbarcentering = (ElementHeight, ElementWidth, cssclass) => {
  $(function(){
    // $(".form-container").each(function(){
      // var length = $(this).height();
      console.log($(window).height())
      console.log(ElementWidth)
      $(cssclass).css('left', ($(window).width() - ElementWidth)/2)

    }) 
}

