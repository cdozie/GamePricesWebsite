# import MySQLdb
from flask import Flask, redirect, render_template, session, Blueprint,current_app
from functools import wraps
from flask_mail import *
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
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
from datetime import datetime
# import app
# mail_bp= Blueprint('mail_bp', __name__, template_folder='templates')
# current_app.config.from_object('config')

# import pandas as pd



try:
    from googlesearch import search
except ImportError:
    print("No module named 'google' found")
def create_app():
    global mail
    app = Flask(__name__)

    with app.app_context():
        app.config.from_object('config')


    return app
newapp = create_app()
mail = Mail(newapp)

# Ensures user is logged in prior to page access
def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

# def connection():
#     dbconn = MySQLdb.connect(host = "myusername.mysql.pythonanywhere-services.com",
#                              user = "myusername",
#                              passwd = "******",
#                              db = "myusername$mydatabasename")
#     cur = dbconn.cursor()
#     return (cur, dbconn)


# from flask import Flask, flash, redirect, render_template, request, session, url_for, g, jsonify
from flask_mysqldb import MySQL
# from helperfuncs import * 
# from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
# from werkzeug.security import check_password_hash, generate_password_hash

# import mysql.connector

# config = {
#   'user': 'root',
#   'password': 'Chimchid8912!',
#   'host': '127.0.0.1',
#   'database': 'main_schema',
#   'raise_on_warnings': True
# }

# cnx = mysql.connector.connect(**config)

# cnx.close()



def create_connection():
    try:
        cnx = mysql.connector.connect(user='root',
        password = "Chimchid8912!",
                                        database='main_schema')
        cursor = cnx.cursor(buffered=True, dictionary = True)
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        return(cnx,cursor)
db,cursor = create_connection()




# adduser = ("INSERT INTO users (username, password, email) VALUES (%(username)s,%(password)s,%(email)s) ")

# user_info = {
#   'username': "michael",
#   'password': "michael",
#   'email': "dozie128@gmail.com",
# }

# cursor.execute(adduser, user_info)
# db.commit()

# userquery = ("SELECT * FROM users WHERE username = %s")
# cursor.execute(userquery,(['michael']))
# users= cursor.fetchall()
# if users:
#     print("Cannot use that username")





# print(users)
# cursor.close 
# db.close()
        # print("yes")
        # cnx.close()
# Flask Configuring
# app = Flask(__name__,template_folder='templates',static_folder='static')
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# app.config["TEMPLATES_AUTO_RELOAD"] = True

# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'Chimchid8912!'
# app.config['MYSQL_DB'] = 'main_schema'
# mysql = MySQL(app)

# conn = mysql.connection
# print(conn)
# db = conn.cursor()

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
def changepassmailsend(email,secret):
        msg = Message(
                'UG Prices Registration',
                sender ='cdozcodeprojects@gmail.com',
                recipients = [f'{email}']
               )
        msg.body = f'We Have Received Your Change Password Attempt. Here is Your OTP: {secret}'
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

def send_sale_updates ():
    def create_recent_mail_user_list():
        # requestssss= "user_game_data.userid = {userid}"
        # userquery = ("SELECT idUsers from users")
        # cursor.execute(userquery)
        # userids = cursor.fetchall()
        properquery = (f"SELECT * from recent_sales_table  LEFT JOIN user_game_data on user_game_data.gameid=recent_sales_table.gameid")


        cursor.execute(properquery)
        allsales = cursor.fetchall()
        print (allsales)

        userlist=[] 
        for sale in allsales:
            if sale["userid"] not in userlist:
                userlist.append(sale["userid"])
        return userlist

    async def send_recent_mail_dicts (userid):

            recentquery = (f"SELECT * from recent_sales_table LEFT JOIN user_game_data on user_game_data.gameid=recent_sales_table.gameid WHERE user_game_data.userid = {userid}")
            userquery = (f"SELECT (email) from users WHERE idUsers = {userid} ")
            if userid:
                cursor.execute(userquery)
            
                useremail = cursor.fetchone()
                if useremail:
                    useremail = useremail["email"]

                    cursor.execute(recentquery)
                    usersales = cursor.fetchall()
                    gamelist = []
                    for usersale in usersales:
                        gamelist.append(usersale["gamename"])
                    gamesaledict = {"email": useremail, "games":gamelist}
                    sale_mail_update(gamesaledict)
                else:
                    clear_table_query = ("TRUNCATE TABLE recent_sales_table")
                    cursor.execute(clear_table_query)
                    db.commit()
                    print("Finished Mailing")

        
    async def send_sale_update(userids):
        if userids:
            ret = await asyncio.gather(*[send_recent_mail_dicts(userid) for userid in userids])
            clear_table_query = ("TRUNCATE TABLE recent_sales_table")
            cursor.execute(clear_table_query)
            db.commit()
            print("Finished Mailing")
        else:
            return (None)
    start = time.time()
    userlist = create_recent_mail_user_list()
    print(userlist)
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(send_sale_update(userlist))
    end = time.time()
    total = end-start
    print(f'Sending Emails took {total} seconds or {total/60} minutes.')

    
    # if len(games)> 5:
def listToString(s): 
    # initialize an empty string
    str1 = ""
    # traverse in the string  
    for ele in s: 
        str1 += ele + ","+ " "  
    str1 = str1[:-2]
    # return string  
    return str1

def moneytodecimal(money):
    if money:
        if "$" in money:
            value = Decimal(sub(r'[^\d.]', '', money))
        else:
            value = 0
    else:
        value = 0
    return value 

def storesearchfunc(store, gamename, uniquefilter = False, ending =False):
    if not ending: 
        searchfilter = "www." + store + ".com"
    else:
        searchfilter = "www." + store + ending

    print (uniquefilter)
    querylist = []
    query = gamename + " " + store
    for j in search(query, tld="com", num=10, stop=10, pause=2):
        if not uniquefilter:
            if searchfilter in j:
                querylist.append(j)
        else: 
            if searchfilter in j and uniquefilter in j :
                querylist.append(j)

    return(querylist)

def amazonsearchfunc(gamename):
    return storesearchfunc("amazon", gamename, "dp/B0")
def bbuysearchfunc(gamename):
    return storesearchfunc("bestbuy", gamename, "skuId")
def walmartsearchfunc(gamename):
    return storesearchfunc("walmart", gamename, "ip")

# print(walmartsearchfunc("Persona 5"))


gameinfo = {"Name" : "", "Base Price": "", "Sites": ()}

def pricesort(price):
    if price == "Free" or "$" not in price  :
        value = 0
    elif "$" in price:
        value = moneytodecimal(price)
    # print(value)
    return(value) 
def pricesortpsn(price):
    return pricesort(price[0])
def currentpricesortwshlst(data):
    return pricesort(data["currentpsnprice"])
def defaultpricesortwshlst(data):
    return(pricesort(data["defaultprice"]))
def dayaddedsortwshlst(data):
    if data["dayadded"]:
        return(data["dayadded"])
    else:
        return("1000-01-01 00:00:00")
def releasedatewshlst(data):
    print(data["releasedate"])
    return(datetime.strptime(data["releasedate"].strip(), "%Y-%m-%d"))
# print(pricesort("$46.78"))
def getspecificdata(data):
    try:
        # offset = 0 
        # print("specific")
        # print('HI')
        # urlall = f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/{id}?size=1&start=0"
        # gameresponse2 = requests.get(urlall)
        # print("specific")
        insertcolumns = "gamename, psntitleid, releasedate, publisher, platform, mainimage, defaultprice,currentpsnprice,psnwebsite, psn_sale_end, gametype, genre"
        checkcolumns = "idpsngamedata, " + insertcolumns
        checkquery = ("SELECT idpsngamedata, psntitleid FROM psngamedata WHERE psntitleid = %s")
        checksamequery = ("SELECT " + checkcolumns + " FROM psngamedata WHERE psntitleid = %s")

        changegamequery = ("UPDATE psngamedata set gamename  = %(gamename)s, psntitleid =  %(psntitleid)s, releasedate = %(releasedate)s, publisher = %(publisher)s, platform = %(platform)s, mainimage = %(mainimage)s, defaultprice =  %(defaultprice)s, currentpsnprice = %(currentpsnprice)s, psnwebsite = %(psnwebsite)s, psn_sale_end = %(psn_sale_end)s,  gametype =  %(gametype)s, genre = %(genre)s WHERE idpsngamedata = %(idpsngamedata)s")
        addgamequery = ("INSERT INTO psngamedata (" +  insertcolumns + ") VALUES (%(gamename)s, %(psntitleid)s, %(releasedate)s, %(publisher)s, %(platform)s, %(mainimage)s, %(defaultprice)s, %(currentpsnprice)s, %(psnwebsite)s,%(psn_sale_end)s, %(gametype)s, %(genre)s)")
        # data = gameresponse2.json()
        # print (data["links"])
        # print(len(data["links"]))
        
        gdindex = data
            # print(gdindex)

        # Game Type
        gamecontenttype = gdindex["game_contentType"]

        # Game PSN ID
        gameid = gdindex["id"]
        psnwebsite = f'https://store.playstation.com/en-us/product/{gameid}'
        # Game Name
        gamename = gdindex["name"]

        # Main Game Image 
        primarygameimage = gdindex["images"][0]["url"]
        
        # Game Developers/Publishers
        publisher = gdindex["provider_name"]

        # Game Platforms
        try:
            platforms = gdindex["playable_platform"]
            platforms = listToString(platforms)
        except: 
            platforms = gdindex["metadata"]["playable_platform"]["values"]
            platforms = listToString(platforms)
        # print(platforms)

        # Game Normal Price 
        defaultprice = gdindex["default_sku"]["display_price"]
        # print (defaultprice)

        # Game Sale Price (If On Sale)
        try:
            sales = gdindex["default_sku"]['rewards']
        except:
            sales = [] 
        # print(sales)
        try:
            genre = data["metadata"]["genre"]["values"]
            genre = listToString(genre)
        except:
            genre = "N/A"
        if len(sales) == 0:
            currentpsnprice = defaultprice
            psn_sale_end = "N/A"
        else:
            saleprices = []
            for i in sales:
                
                # psn_sale_start = i["start_date"]
                try:
                    psn_sale_end = i["end_date"]
                except:
                    psn_sale_end = "N/A"
                # Creating Tuple Structured (Sale Price, Sale End)
                saleprices.append((i["display_price"],psn_sale_end ))

                 
            orderedsales = sorted(saleprices, key = pricesortpsn)
            # print(orderedsales)
            currentsale = orderedsales[0]
            
            currentpsnprice = currentsale[0]
            psn_sale_end  = currentsale[1]
            psnsaleindex = psn_sale_end.find("T")
            psn_sale_end = psn_sale_end[0:psnsaleindex]
        # print(currentpsnprice)
            
        # print(defaultprice)
        # print(currentpsnprice)
        # RELEASE DATE
        releasedate = gdindex["release_date"]
        rdindex = releasedate.find("T")
        releasedate = releasedate[0:rdindex]

        

        # print(releasedate)
        # if datalength:
        #     psnurl = gdindex ["url"]
        # else:
        #     psnurl = "None"
        # print(psnurl)
        cursor.execute(checkquery,[gameid])
        db.commit()
        gamepresent = cursor.fetchone()
        # print(gamepresent)
        # print(platforms)


        # print(psnwebsite)

        # print(gamepresent)

        gamedata = {
            'gamename' : gamename,
            'psntitleid' : gameid,
            'releasedate' :  releasedate,
            'publisher' : publisher,
            'platform' : platforms,
            'mainimage': primarygameimage,
            'defaultprice': defaultprice,
            'gametype': gamecontenttype,
            'currentpsnprice': currentpsnprice,
            'psnwebsite': psnwebsite,
            'psn_sale_end' : psn_sale_end,
            'genre' : genre
            
        }
        # print(checksamequery)
        cursor.execute(checksamequery,[gameid])
        preprefullgd = cursor.fetchone()
        # print(prefullgd)
        if gamepresent: 
            preprefullgd.pop('idpsngamedata', None)
            prefullgd = Counter(preprefullgd)

        # checksamequery = ("SELECT (gamename, psntitleid,releasedate, publisher,platform, mainimage,defaultprice, currentpsnprice, gametype) FROM psngamedata WHERE psntitleid = %s")

        newfullgd = Counter(gamedata) 
        # print (prefullgd)
        # print(newfullgd)
        # print(prefullgd==newfullgd)
        # print("Yes Sir")
        lowercase_platforms = platforms.lower()
        if not gamepresent  and ("ps4" in lowercase_platforms or "ps5" in lowercase_platforms):
            cursor.execute(addgamequery, gamedata)
            db.commit()
        elif (gamepresent and prefullgd != newfullgd) and ("ps4" in lowercase_platforms or  "ps5" in lowercase_platforms) :
            id = gamepresent["idpsngamedata"]

            if moneytodecimal(preprefullgd["currentpsnprice"]) >  moneytodecimal(gamedata["currentpsnprice"]) :
                
                searchrecentsalequery = ("SELECT * from recent_sales_table WHERE gameid = %s") 
                print("changing")
                cursor.execute(searchrecentsalequery, [id])
                saleexists = cursor.fetchone()
                if not saleexists:
                    recentsalescolumns = "gameid, gamename, gamestore"
                    saledata = {
                        "gameid" : gameid,
                        "gamename": gamename,
                        "gamestore": "PlayStation Store"
                    }
                    addrecentsalequery = ("INSERT INTO recent_sales_table (" + recentsalescolumns + ") VALUES (%(gameid)s, %(gamename)s, %(gamestore)s)" )
                    cursor.execute (addrecentsalequery,saledata)
                    db.commit()
            id = gamepresent["idpsngamedata"]
            # print(id)
            cursor.execute(changegamequery, gamedata|{"idpsngamedata" : id })
            db.commit()

        # print(gdindex)

            

        # lenallgames = len(data["links"])
        # for i in range(lenallgames):

        # print(gameid)
        # for i in allgames:
        #     print(i)
    except Exception as e:
        print(e,e.__class__)
        return ("Error Addition Occurred")
# urlall = f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/STORE-MSF77008-ALLGAMES?size=50&start=0"
# gameresponse = requests.get(urlall)
# data = gameresponse
# print(data)
# neeg=requests.get("https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/UP6673-CUSA30730_00-0957437476024690?size=1&start=0")
# responser = neeg.json()
# getspecificdata(responser)
def getallgames(offset):
    try:
        # print(j)
        urlall = f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/STORE-MSF77008-ALLGAMES?size=50&start={offset}"
        gameresponse = requests.get(urlall)
        

    except requests.RequestException:
        return None
    gamedata = []
    try:
        data = gameresponse.json()
        # print(data)
        # allgames = data ["links"][2]["id"]
        lenallgames = len(data["links"])
        # print(lenallgames)
        for i in range(lenallgames):
            gameid = data ["links"][i]["id"]
            print(gameid)
            gamedata.append(gameid)
            # print (gameid)
            # getspecificdata(gameid)
        # print(allgames)
        # for i in allgames:
        #     print(i)
        return(gamedata)
    except (KeyError, TypeError, ValueError):
        print("nah")
        return None
gamedata = []

def creategameurls(data):
        global gamedata

        # print(data["links"])
    # offset = 0 

    # while offset <= total:
    #     try:
    #         # print(j)
            
    #         data = gameresponse.json()

    #     except requests.RequestException:
    #         return None  
        
        try:
            # print(data)
            # allgames = data ["links"][2]["id"]
            lenallgames = len(data["links"])
            # print(lenallgames)
            for i in range(lenallgames):
                gameid = data ["links"][i]["id"]
                # print(gameid)
                urlsingle = f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/{gameid}?size=1&start=0"

                gamedata.append(urlsingle)
                # print (gameid)
                # getspecificdata(gameid)
            # print(allgames)
            # for i in allgames:
            #     print(i)
        except (KeyError, TypeError, ValueError):
            print("nah")
            return None  
        # offset+= 50 
        return(gamedata)  


try:
    urltotalresults = f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/STORE-MSF77008-ALLGAMES?size=0&start=0"
    gameresponse = requests.get(urltotalresults)
    trdata = gameresponse.json()

    totalresults = trdata["total_results"]
    # print(totalresults)
except requests.RequestException:
    totalresults = 1000
    print("Couldn't Receive Data from the API")
# psnapirequests = creategameurls(totalresults)
def updatepsndata ():

    async def getallgamesnew(url,session):
        # print(url)
        try:
            async with session.get(url=url) as response:
                resp = await response.read()
                data = json.loads(resp)
                getspecificdata(data)
                await asyncio.sleep(10)
        except Exception as e:
            print(f'Could not get URL due to {e, e.__class__}')
            # pass
    async def gamefetcher(urls):
        async with aiohttp.ClientSession() as session:
            ret = await asyncio.gather(*[getallgamesnew(url, session) for url in urls])
        print("Done")

    async def createurls(url,session):
        try:
            async with session.get(url=url) as response:
                resp = await response.read()
                data = json.loads(resp)
                creategameurls(data)
        except Exception as e:
            # print(f'Could not get URL due to {e}')
            pass
    async def linkgetter(urls):
        async with aiohttp.ClientSession() as session:
            ret = await asyncio.gather(*[createurls(url, session) for url in urls])
        print("Done 0 ")
    def urllist (total):
        offset = 0
        urllist = [] 
        while offset <total:
            urllist.append(f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/STORE-MSF77008-ALLGAMES?size=1000&start={offset}")
            offset +=1000
        # urllist = [f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/STORE-MSF77008-ALLGAMES?size={total}&start=0"]
        return urllist


    
    start = time.time()
    allurls = urllist(totalresults)
    print("yessir")
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(linkgetter(allurls))
    # print("yes2")
    # print(gamedata)
    split = 50
    chunks = [gamedata[x:x+split] for x in range(0, len(gamedata), split)]

    # print(len(gamedata))
    for i in chunks:
        asyncio.run(gamefetcher(i))
    end = time.time()
    total = end-start
    print(f'Took {total} seconds')
# updatepsndata()
    
# for i in range(0,totalresults):
#     if i % 50 == 0:
#         getallgames(i)

# getspecificdata("UP2611-CUSA14836_00-CATHERINEFBUS009")

# def searchgame(name):
#     searchgamequery = ("SELECT * from psngamedata WHERE gamename = %s LIMIT 10")
#     cursor.execute (searchgamequery,[name,id])
#     db.commit()
#     gameinfo = cursor.fetchall()

#     amazonlinks = (amazonsearchfunc(f"{name} {gameinfo['psntitleid']} "))

#     return(gameinfo) 
    
# print(searchgame(" Persona®5 Royal"))

# cursor.close()
# options = webdriver.ChromeOptions()
# options.headless = True
# browser.get("https://www.walmart.com/ip/Persona-5-Royal-Sega-PlayStation-4-Physical-Edition/298470678")
# body = browser.find_element(By.TAG_NAME, "body").get_attribute("innerHTML")
# print(body)
# browser.quit()
# testsoup = BeautifulSoup(body,'html.parser')
# price = testsoup.find(id = "priceView-hero-price priceView-customer-price").findChildren()
# # amazonprice = testsoup.find(itemprop="price")


# print(price)
# # price = browser.find_element(By.ID, "priceblock_ourprice")
# # print(price.text)
# # browser.close()

# my_headers = ({'User-Agent':
#             'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
#             'Accept-Language': 'en-US, en;q=0.5'})
# # print ("here")

# testpage = requests.get("https://www.walmart.com/ip/Persona-5-Royal-Sega-PlayStation-4-Physical-Edition/298470678", headers=my_headers)
# print("here")
# testsoup = BeautifulSoup(testpage.content,'html.parser')
# print(testsoup)
# amazonprice = testsoup.find(itemprop="price")
# price = amazonprice.get_text()
# print(price)

# class Store :
#     def __init__(self,store):
#         self.store = store
#     def __str__(self) -> str:
#         return (self.store)

# def pricesort(price):
#     price = price.replace('$', '')
#     return(-float(price)) 


# def scrapeheader(link):
#     browser = webdriver.Chrome()

#     browser.get(link)
#     body = browser.find_element(By.TAG_NAME, "body").get_attribute("innerHTML")
#     # print(body)
#     browser.quit()
#     soup = BeautifulSoup(body,'html.parser')
#     return(soup)

# def fetchfunc(gamelinklist:list,store:str, uniqueid = False):
#     assert isinstance(gamelinklist,list)
#     assert isinstance(store, str)

#     my_headers = ({'User-Agent':
#             'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
#             'Accept-Language': 'en-US, en;q=0.5'})
#     pricelst = []
#     if len(gamelinklist) != 0 :
#         for i in gamelinklist:
#             if store == "amazon":
#                 page = requests.get(i,headers=my_headers)
#                 soup = BeautifulSoup(page.content, 'html.parser')
#                 try:
#                     amazonprice = soup.find(id= "priceblock_ourprice")
#                 except:
#                     # try:
#                     amazonprice = soup.find(id = "price_inside_buybox")
                    
#                     # except:
#                     #     amazonprice = soup.find(data-asin = )
#                 if amazonprice:
#                     price = amazonprice.get_text()
#                     pricelst.append(price)
#                 else:
#                     return None
#             # if store == "bbuy":
#             elif store == "psn" and uniqueid:
#                 psnurl = f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/{uniqueid}?size=1&start=0"
#                 psnresponse = requests.get(psnurl)
#                 psndata = psnresponse.json()
#                 sales = psndata["default_sku"]['rewards']
#                 defaultprice = psndata["default_sku"]["display_price"]

#                 if len(sales) == 0:
#                     currentpsnprice  = defaultprice
#                 else:
#                     currentpsnprice = sales[0]['display_price']
#                 pricelst.append(currentpsnprice)
#             elif store == "walmart":
#                 soup = scrapeheader(i)
#                 # print(soup)
#                 walprice = soup.find(itemprop="price")
#                 if walprice:
#                     price = walprice.get_text()
#                     pricelst.append(price)
#                 else:
#                     return None
#             # elif store == "bbuy":
#             #     soup = scrapeheader(i)
#             #     bbuyprice = soup.find()

#             else:

#                 soup = scrapeheader(i)
#                 walprice = soup.find(itemprop="price")
#                 price = walprice.get_text()
#                 pricelst.append(price)
#                 # bbuyprice = soup.find(id = "priceView-hero-price priceView-customer-price").findChildren()




        
#         sortedlst = sorted(pricelst, key = pricesort)

            

#         return (sortedlst[0])
#     else:
#         return("None")

            


# # def amazonfetchfunc(gamelinklist):
# #     amznpricelst = []
# #     for i in gamelinklist:
# #         page = requests.get(i,headers=my_headers)
        
# #         soup = BeautifulSoup(page.content, 'html.parser')

# #         amazonprice = soup.find(id= "priceblock_ourprice")
# #         price = amazonprice.get_text()
# #         amznpricelst.append(price)

# #     sortedamznlst = sorted(amznpricelst, key= pricesort)

#     # return(sortedamznlst[0])
# # def bbuyfetchfunc(gamelinklist):
# #     bbuylist = []
# #     for i in gamelinklist

# def updateprices(uniqueid = False):
#         updatequery =("UPDATE psngamedata SET currentpsnprice = %(currentpsnprice)s, currentamazonprice = %(currentamazonprice)s, currentwalmartprice = %(currentwalmartprice)s WHERE idpsngamedata = %(idpsngamedata)s")

#     # try: 
#         if uniqueid :
#             searchgamequery = ("SELECT * from psngamedata WHERE idpsngamedata= %s")
#             # updatequery =("UPDATE psngamedata set currentpsnrpice = %(currentpsnprice)s, currentamazonprice = %(currentamazonprice)s, currentbestbuyprice = %(currentbestbuyprice)s, currentwalmartprice = %(currentwalmartprice)s WHERE idpsngamedata = %(idpsngamedata)s")
#             cursor.execute (searchgamequery,[uniqueid])
#             db.commit()
#             gameinfo = cursor.fetchone()
#             searchtxt = f"{gameinfo['gamename']} {gameinfo['psntitleid']}"
#             gameid = gameinfo["idpsngamedata"]
#             psnid = gameinfo['psntitleid']
#             print(gameid)
#             amznlinks = (amazonsearchfunc(searchtxt))
#             amznprice = fetchfunc(amznlinks, "amazon")
#             if amznprice == "None":
#                 amznprice = None
            

#             # bbuylinks = (bbuysearchfunc(searchtxt))
#             # bbuyprice =  fetchfunc(bbuylinks, "bbuy")
            
#             wallinks = (walmartsearchfunc(searchtxt))
#             walprice = fetchfunc(wallinks, "walmart")
#             if walprice == "None":
#                 walprice = None




#             psnurl = f"https://store.playstation.com/store/api/chihiro/00_09_000/container/us/en/999/{psnid}?size=1&start=0"
#             psnresponse = requests.get(psnurl)
#             psndata = psnresponse.json()
#             sales = psndata["default_sku"]['rewards']
#             defaultprice = psndata["default_sku"]["display_price"]

#             if len(sales) == 0:
#                 psnprice  = defaultprice
#             else:
#                 psnprice = sales[0]['display_price']
            
#             # pricelst =[amznprice,walprice,psnprice]
#             # print(pricelst)
#             # pricelst = sorted(pricelst, key = pricesort)
#             # minprice = pricelst[0]
#             newprices = {
#                 "currentpsnprice" : psnprice,
#                 "currentamazonprice": amznprice,
#                 "currentwalmartprice": walprice,
#                 # "currentbestbuyprice":bbuyprice,
#                 "idpsngamedata":gameid
#             }

#             cursor.execute(updatequery,newprices)
#             db.commit()
#             return ("Successfully Changed")
#         else:
#             searchallquery = ("SELECT * from psngamedata WHERE gametype = 'Full Game'")
#             cursor.execute(searchallquery)
#             allgames = cursor.fetchall()
#             # print(allgames)
#             for game in allgames:
#                 gameid = game["idpsngamedata"]
#                 # print(gameid)
#                 updateprices(gameid)


    # except:
    #     print("Failed Change")
    #     return ("Failed Change")
    

# updateprices()

        
