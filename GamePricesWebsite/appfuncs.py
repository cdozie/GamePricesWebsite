from flask import redirect, render_template, session
from functools import wraps
from flask_mail import *
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from app import app
from collections import Counter
from bs4 import BeautifulSoup
import mysql.connector
from mysql.connector import errorcode
import asyncio
import aiohttp
import time
import json
from decimal import Decimal
from re import L, sub

mail = Mail(app)
def listToString(s): 
    # initialize an empty string
    str1 = ""
    # traverse in the string  
    for ele in s: 
        str1 += ele + ","+ " "  
    str1 = str1[:-2]
    # return string  
    return str1
# Mail Send Functions
def mailsend(email,secret):
        msg = Message(
                'UG Prices Registration',
                sender ='cdozcodeprojects@gmail.com',
                recipients = [f'{email}']
               )
        msg.body = f'We Have Received Your Registration. Here is Your OTP: {secret}'
        mail.send(msg)
        return(None)
def forgotmailsend(email,secret):
        msg = Message(
                'UG Prices Registration',
                sender ='cdozcodeprojects@gmail.com',
                recipients = [f'{email}']
               )
        msg.body = f'We Have Received Your Recovery Attempt. Here is Your OTP: {secret}'
        mail.send(msg)
        return(None)
def sale_mail_update(gameuserdict):
    msg = Message(
        subject = 'UG Prices Sale Update',
        sender = 'cdozcodeprojects@gmail.com',
        recipients = [f'{gameuserdict["email"]}']
    )
    if len(games) > 5:
        games = games[0:4]
        gamestring = listToString(gameuserdict["games"]) + " and more"
    else:
        gamestring = listToString(gameuserdict["games"])

    msg.html = f"""\
<html>
  <head></head>
  <body>
    <p>Thank You for Using UG Prices!<br>
       Your games {gamestring} on your wishlist are on sale.<br>
       Here is the <a href="http://127.0.0.1:5000/wishlist">wishlist link</a> to check on the games.
    </p>
  </body>
</html>"""
    mail.send(msg)
    return(None)