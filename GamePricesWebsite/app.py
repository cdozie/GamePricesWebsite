from distutils.log import error
from flask import Flask, flash, redirect, render_template, request, session, url_for, g, jsonify
from flask_mysqldb import MySQL
from itsdangerous import TimedJSONWebSignatureSerializer
from sqlalchemy import except_all
from helperfuncs import * 
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
import re
from re import sub
from decimal import Decimal
import pyotp
from random import randint
from celery import Celery
from celery.utils.log import get_task_logger
from celery.schedules import crontab
import os 
from datetime import datetime
from time import gmtime, strftime
import math
from urllib.parse import unquote


# import test_routes


# logger = get_task_logger(__name__)

# Flask and Celery Configuration
app = Flask(__name__,template_folder='templates',static_folder='static')
app.config.from_object('config')
mail= Mail(app)
def nonumstringtoint(value:str):
    totalval = 0
    for letter in value:
        totalval+= ord(letter)
    return totalval

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)


# app.config['CELERYBEAT_SCHEDULE'] = {
#     'update-every-hour': {
#         'task': 'updatepsn',
#         'schedule': crontab(minute = "3", hour="*")
#     },
# }
os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')

# GLOBAL VARIABLE AND FUNCTION DEFINITIONS
db,cursor = create_connection()
def select_single_query(query,args = False):
    if args: 
        cursor.execute(query,args)
    else: 
        cursor.execute(query)

    query = cursor.fetchone()
    return(query)


emptynoti = {"Type" : "", "Noti" : ""}
formnoti = emptynoti
flashnoti = emptynoti
# Game Data for a single game page
gamedata = ""
# REGEX for determining an email
emailregex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

searchquery = ("SELECT * FROM psngamedata")
cursor.execute(searchquery)
allgames = cursor.fetchall()
def setnoti(type, noti):
    return({"Type" : type, "Noti" : noti})


@celery.task ()
def updatepsn(name = "updatepsn"):
    updatepsndata()
    searchquery = ('SELECT * FROM psngamedata')
    cursor.execute(searchquery)
    allgames = cursor.fetchall()
    send_sale_updates()
@celery.task() 
@celery.on_after_configure.connect
def setup_periodic_tasks (sender, **kwargs):
    sender.add_periodic_task(crontab(minute = "5", hour='*/2'),updatepsn.s(),)
@app.route('/', methods=['GET', 'POST'])
@login_required
def index():
    return render_template("index.html")

@app.route('/getformnoti',methods = ['GET'])
# @login_required
def getformnoti():
    print(formnoti)
    return(jsonify(formnoti))

def returnflashnoti():
    print(flashnoti)
    return(jsonify(flashnoti))

@app.route('/getflashnoti',methods = ['GET'])
# @login_required
def getflashnoti():
    global flashnoti
    newflashnoti = returnflashnoti()
    print(flashnoti)

    flashnoti=emptynoti
    return(newflashnoti)

@app.route('/',methods = ['GET', 'POST'] )
@login_required
def hmpg():
    return render_template("index.html")

def calcpercentoff (defaultprice,currentprice):
    percentoff = round((100*(defaultprice-currentprice))/defaultprice)
    percentoff = str(percentoff)
    return percentoff


@app.route('/gethmpgpsnsalelst', methods = ["GET"])
@login_required
def gethmpgpsnsalelst():
    newpsnsalelst = []
    randpsnsalelst = []
    getsalequery = ("SELECT * from psngamedata where currentpsnprice < defaultprice")

    cursor.execute(getsalequery)
    psnsalelst = cursor.fetchall()
    
    while len(randpsnsalelst)<10:
        random_index = randint(0,len(psnsalelst)-1)
        psnsale = psnsalelst[random_index]
        if psnsale not in randpsnsalelst:
            randpsnsalelst.append(psnsale)
    

    for i in randpsnsalelst:

        currentprice = moneytodecimal(i["currentpsnprice"])
        defaultprice = moneytodecimal(i["defaultprice"])
        # print(defaultprice)
        try:
            percentoff = calcpercentoff(defaultprice,currentprice)
        except:
            percentoff = "?"
        j = i|{"percentoff" : "-" + percentoff + "%"}
        newpsnsalelst.append(j)    
    return(jsonify(newpsnsalelst))

@app.route('/gamesearch',methods = ["GET","POST"])
@login_required
def gamesearch():
    search =(request.args.get('search',None))

    print(search)
    search = unquote(search)
    print(search)
    global totalsrchpgs, searchgamedatafull,page
    searchgamedatafull = []
    optsperpage = 30
    getdataquery = ("SELECT * from psngamedata")
    cursor.execute(getdataquery)
    allsearchdata = cursor.fetchall()
    if search :
        if search.strip != "":
            filteredlst = [x for x in allsearchdata if search.lower() in (x["gamename"]).lower() or (abs(nonumstringtoint(search.lower()) - nonumstringtoint((x["gamename"]).lower())) < 1  and search[0].lower() in (x["gamename"]).lower())]
        else:
             filteredlst =  allsearchdata
    else:
        filteredlst =  allsearchdata

    totalsrchpgs = math.ceil(len(filteredlst) / optsperpage)
    page = int(request.args.get('page',None, type = int))
    # print(page)
    # filteredlst = [x for x in allsearchdata if search in (x["gamename"]).lower()]
    chunks = [filteredlst[x:x+optsperpage] for x in range (0, len(filteredlst), optsperpage)]
    # print(chunks)
    if len(chunks) > 0:
        if page:
            if page > 0:
                searchgamedata = chunks[page-1]
            else:
                searchgamedata = chunks[0]
    
        else:
            searchgamedata = chunks[0]
    else:
        searchgamedata = []
    if len(searchgamedata) > 0:
        for i in searchgamedata:
            currentprice = moneytodecimal(i["currentpsnprice"])
            defaultprice = moneytodecimal(i["defaultprice"])
                # print(defaultprice)
            try:
                percentoff = calcpercentoff(defaultprice,currentprice)
            except:
                percentoff = "?"
            j = i|{"percentoff" : "-" + percentoff + "%"}
            searchgamedatafull.append(j)    

    return(render_template("index.html"))
 

@app.route('/getsearchdata')
@login_required
def getsearchdata():
    global searchgamedatafull
    return(jsonify(searchgamedatafull))
@app.route('/getsearchpgs')
@login_required
def getsearchpgtotal():
    global totalsrchpgs,srchpglst
    lowlist = [1,2]
    lowinsert = [1,2]
    highlist = [totalsrchpgs]
    highinsert = [totalsrchpgs]
    if totalsrchpgs <=2:
        if totalsrchpgs <=1:
            srchpglst = []
        else:
            srchpglst = [1,2]
        
        # return(jsonify(srchpglst))

    else:
        if page >1:
            pagelist = [page-1,page,page+1]
            pageinsert = [page-1, page, page+1]
            if 1 in pagelist:
                pagelist.remove(1)
            if 1 in pageinsert:
                pageinsert.remove(1)

            # inlowlist = any( item in lowlist for item in  pagelist)
            # inhighlist = any( item in highlist for item in  pagelist)
            testlowlist = [i for i in lowlist if i in pagelist]
            testhighlist = [i for i in highlist if i in pagelist]

            print(testlowlist)
            print(testhighlist)
            if len(testlowlist)!=0:
                inlowlist = True
            else:
                inlowlist = False 
            if len(testhighlist)!=0:
                inhighlist = True
            else:
                inhighlist = False

            
            if inlowlist and not inhighlist :
                srchpglst = [1] + pageinsert+ ["..."] + highinsert

            elif inlowlist and inhighlist and page != totalsrchpgs:
                srchpglst = [1]+pageinsert
            elif inlowlist and inhighlist and page == totalsrchpgs:
                srchpglst = [1]+pageinsert
            elif inhighlist and page != totalsrchpgs:
                srchpglst = lowinsert + ["..."] + pageinsert 
            elif inhighlist and page == totalsrchpgs:
                srchpglst = lowinsert+ ["..."] + [totalsrchpgs-1] + highlist
            elif not inlowlist and not inhighlist:
                if totalsrchpgs - 1 not in pageinsert:
                    srchpglst = [1] + ["..."] + pageinsert + ["..."] + highlist
                else:
                    srchpglst = [1] + ["..."] + pageinsert + highlist

        else:
            srchpglst = [1,2] + ["..."] + highlist
    print(srchpglst)
    return(jsonify(srchpglst))


    

@app.route('/login', methods  = ['GET', 'POST'])
def login(): 
    global formnoti, password
    userquery = ("SELECT * FROM users WHERE username = %s")

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if not (username or password ):
            formnoti = setnoti("warning", "Provide Both Username"+
            " and Password")
        else:
            cursor.execute(userquery,([username]))
            db.commit()
            user= cursor.fetchone()
            if not user or not(check_password_hash(user["password"], password)):
                formnoti = setnoti("warning","Invalid Username/Password")
                # cursor.close()
            else:
                session['user_id'] = user['idUsers']
                session['username'] = user['username']
                session['email'] = user['email']
                formnoti = setnoti("status","Correct Credentials")
                # cursor.close()
                return(redirect("/"))
                
        return("login")
    else:
        formnoti = emptynoti
        return render_template("index.html") 

@app.route('/register', methods=['GET', 'POST'])
def register():
    global formnoti, registration_otp, email, username,registerpassword, flashnoti

    adduser = ("INSERT INTO users (username, password, email) VALUES (%(username)s,%(password)s,%(email)s)")

    userquery = ("SELECT * FROM users WHERE username = %s")

    if request.method == "POST":
        if "username" in request.form and "password" in request.form:
            username  = request.form.get("username")
            register_password  = request.form.get("password")
            confirmationpassword = request.form.get("confirmation")
            email = request.form.get("email")

            if not (username or register_password or email) :
                formnoti = setnoti("warning", "Provide a Username"+
                " Password, and Email")
            elif register_password !=confirmationpassword:

                formnoti = setnoti("warning", "Password Confirmation Must Match"+
                " Pasword")
            elif re.fullmatch(emailregex, email) == None:
                formnoti = setnoti("warning", "Not a Valid Email")

            else:
                usercheck = select_single_query(userquery,[username])
                emailcheck = select_single_query(userquery,[email])
                if usercheck or emailcheck:
                    formnoti = setnoti("warning", "Username and/or Email Taken")
                else:
                    # Send Confirmation Email
                    registration_otp = pyotp.random_base32()
                    mailsend(email,registration_otp)
                    flashnoti = setnoti("success", "Email Confirmed")
                    formnoti = setnoti("trigger", "Email Confirmation")
                    
            return("Registration Covered")
        # For The Inputting of the OTP
        elif "OTP" in request.form:
            one_time_input=request.form.get("OTP")
            
            if one_time_input == registration_otp:
                user_data ={
                            'username' : username,
                            'password' : generate_password_hash(register_password),
                            'email' : email
                        } 
                cursor.execute(adduser, user_data)
                db.commit()
                formnoti = setnoti("success","Successfully Registered")
                flashnoti = setnoti("success","Successfully Registered")
                cursor.close()
            else: 
                formnoti = setnoti("warning", "Wrong OTP. A New One Has Been Sent")
                registration_otp = pyotp.random_base32()
                mailsend(email,registration_otp)
            return("Registration Covered")

        # For When User Wants to Resend Confirmation Code To Email
        elif "resend" in request.form:
            mailsend(email,registration_otp)
            return("Resend Run")
        else:
            formnoti = setnoti("warning", "Please Fill Out All Boxes")
            return ("Done")

    else: 
        formnoti = emptynoti
        return(render_template("index.html"))

@app.route('/forgotpassword', methods = ["GET", "POST"])
def forgotpassword():
    print ("here")
    global forgot_pass_otp, formnoti,forgot_pass_email,flashnoti
    useremailquery = ("SELECT * FROM users WHERE email = %s")
    # change_pass_query = ("INSERT INTO users (password) VALUES (%s)")
    change_pass_query = ("UPDATE users set password = %s WHERE email = %s")

    if request.method == "POST":
        if "email" in request.form and "emailOTP" not in request.form:
            # print("email")

            forgot_pass_email = request.form.get("email")

            user  = select_single_query(useremailquery,[forgot_pass_email])
            if not user:
                formnoti = setnoti("warning", "This Email Does Not Appear" + 
                " to Be Associated with an Account")
            else: 
                formnoti = setnoti("trigger", "Email Confirmed")
                forgot_pass_otp = pyotp.random_base32()
                forgotmailsend(forgot_pass_email,forgot_pass_otp)
        elif "emailOTP" in request.form and "password" in request.form and "confirmation" in request.form:
            # print ("OTP")
            forgot_otp_input = request.form.get("emailOTP")
            forgot_otp_input = forgot_otp_input.strip()
            password = request.form.get("password")
            confirmation = request.form.get("confirmation")

            if forgot_otp_input == forgot_pass_otp and password == confirmation:
                cursor.execute(change_pass_query, [generate_password_hash(password),forgot_pass_email])
                db.commit()
                # cursor.close()
                formnoti = setnoti("success", "Password Changed")
                flashnoti = setnoti("success", "Password Changed")
                
            elif forgot_otp_input != forgot_pass_otp:
                forgot_pass_otp =pyotp.random_base32()
                forgotmailsend(forgot_pass_email,forgot_pass_otp)
                formnoti =setnoti("warning", "Wrong OTP: New One Has Been Sent")
            elif password !=confirmation:
                formnoti = setnoti("error", "Passwords Have To Match")

        elif "resend" in request.form: 
            # print("resend")
            forgotmailsend(forgot_pass_email,forgot_pass_otp)


        else:
            # print ("else")
            formnoti = setnoti("warning", "Please Fill Out All Boxes")
        return("forgotpass")
    else: 
        formnoti = emptynoti
        print("empty")
        return(render_template("index.html"))
@app.route("/account/changepassword", methods = ["GET","POST"])
@login_required
def password_change():
    global formnoti, flashnoti
    """Let user change the password"""
    oldpassword = request.form.get("oldpassword")
    password = request.form.get("newpassword")
    confirmingpassword = request.form.get("confirmation")
    change_pass_query = ("UPDATE users set password = %s WHERE email = %s AND username = %s")
    get_pass_hash = ("SELECT password from users WHERE email = %s and username =%s")
    cursor.execute(get_pass_hash,[session["email"],session["username"]])
    userhash = cursor.fetchone()
    userhash = userhash["password"]
    # print(userhash)
    if request.method == "POST":
        
        # Ensure form was filled out
        if not oldpassword:
            formnoti = setnoti("error","Please Provide Your Current Password")

        elif not password:
            formnoti = setnoti("error","Please Submit a Password")

        elif not check_password_hash(userhash, oldpassword):
             formnoti = setnoti("error","Please Ensure That Your Old Password is Correct", "error")

        elif password != confirmingpassword:
            formnoti = setnoti("error","Passwords Don't Match")            

        else:
            # hash the password
            pwdhash = generate_password_hash(password)
            cursor.execute(change_pass_query, [pwdhash, session["email"], session["username"]])
            db.commit()
            # Redirect user to home page
            formnoti = setnoti("success", "Password Changed Successfully")
            flashnoti = setnoti("success", "Password Changed Successfully")


          # return redirect("/")
        return(jsonify(formnoti))
    # For Loading the Page
    else:
        return render_template("index.html")

@app.route("/logout")
def logout():
    """Log user out"""

    # Clears all user ids for next login
    session.clear()

    # Takes user to the main login form
    return redirect("/")      
@app.route("/accountdetails", methods = ["GET"])
@login_required
def accountdetails():
    username = session["username"]
    user_len = len(username)
    userinitials = username[0] + username[user_len-1]
    email = session["email"]
    accountinfo = {"username":username, "userinitials": userinitials.upper(), "email": email}

    return(jsonify(accountinfo))
    
# GAME DATA SECTION -----------------------------------------------------------------
@app.route("/game/<gameid>", methods = ["GET", "POST"])
@login_required
def gamepage(gameid):
    global gamedata
    game_data_query = (f"SELECT * FROM psngamedata where idpsngamedata = {gameid}")

    gamedata = select_single_query(game_data_query)

    return(render_template("index.html"))


@app.route("/getgamedata", methods = ["GET"])
@login_required
def getgamedata():
    checkquery = ("SELECT * FROM user_game_data WHERE userid = %(userid)s AND gameid = %(gameid)s")
    # try:
    gameparameters = {
        "userid": session["user_id"],
        "gameid": gamedata["idpsngamedata"]
    }
    # except:


    cursor.execute(checkquery, gameparameters)
    game_in_lst = cursor.fetchone()

    if game_in_lst:
        inwshlst = True
    else:
        inwshlst = False
    extragmdata = {"userid": session ["user_id"], "inwshlst":inwshlst }
    return(jsonify(gamedata| extragmdata))
@app.route ("/getsales", methods = ["GET"])
@login_required
def getsales():
    sales_lst = ["currentpsnprice","currentamazonprice","currentbestbuyprice","currentwalmartprice"]
    sales_store = ["PlayStation Store", "Amazon", "Best Buy", "Walmart"]
    sales_store_lst = []

    salescolumns = "currentpsnprice, currentamazonprice, currentbestbuyprice,currentwalmartprice"
    # salesquery = ("SELECT " + salescolumns + " from psngamedata WHERE idpsngamedata = %s")
    # allsales = select_single_query(salesquery,[gamedata["idpsngamedata"]])
    for i in range (len(sales_lst)-1):
        sales_store_lst.append({"Store":sales_store[i],"Price": gamedata[sales_lst[i]]})
    
    return (jsonify (sales_store_lst))

hdr_search_lst = [] 
@app.route("/searchbar", methods =["GET","POST"])
@login_required
def searchbar():
    global hdr_search_lst
    emptyquery = ("SELECT * from psngamedata LIMIT 10")

    # if request.method == "POST":
    search = request.form.get("search")
    search = search.lower()
    print(search)
    filteredlst =  [x for x in allgames if search.lower() in (x["gamename"]).lower() or (abs(nonumstringtoint(search.lower()) - nonumstringtoint((x["gamename"]).lower())) < 1  and search[0].lower() in (x["gamename"]).lower())]

    db.commit()
    filterlength = len(filteredlst)
    if filterlength == 0:
        cursor.execute(emptyquery)
        hdr_search_lst =  cursor.fetchall()

    elif filterlength<= 10:
        hdr_search_lst = filteredlst
    else:
        hdr_search_lst = filteredlst[0:9]
    
    # print(hdr_search_lst)

    return("YES")
@app.route("/searchresults", methods = ["GET"])
@login_required
def searchresults():
    global hdr_search_lst
    return (jsonify(hdr_search_lst))

# WISHLIST CODE SECTION

@app.route("/wishlist", methods = ["GET", "POST"])
@login_required
def wishlist():
    return(render_template("index.html"))
@app.route("/getwishlistdata",methods = ["GET"] )
@login_required
def getwishlistdata():
    
    getwishlistquery = ("SELECT * from user_game_data LEFT JOIN psngamedata ON psngamedata.idpsngamedata=user_game_data.gameid WHERE user_game_data.userid = %s UNION SELECT * FROM user_game_data RIGHT JOIN psngamedata ON psngamedata.idpsngamedata=user_game_data.gameid WHERE user_game_data.userid = %s")
    print(session["user_id"])
    cursor.execute(getwishlistquery,[session["user_id"], session["user_id"]])
    db.commit()
    wishlistdata = cursor.fetchall()
    # print(wishlistdata)

    return(jsonify(wishlistdata))

def alphabetsort(data):
   return((data["gamename"].strip()).lower())
        
        
@app.route("/wishlistmodified", methods = ["POST"])
@login_required
def wishlistmodified():
    global modwshlstdata
    userid = session["user_id"]
    getwishlistquery = (f'SELECT * from user_game_data LEFT JOIN psngamedata ON psngamedata.idpsngamedata=user_game_data.gameid WHERE user_game_data.userid = {userid} UNION SELECT * FROM user_game_data RIGHT JOIN psngamedata ON psngamedata.idpsngamedata=user_game_data.gameid WHERE user_game_data.userid = {userid}')
    cursor.execute(getwishlistquery)
    db.commit()
    wishlistdata = cursor.fetchall()
    orgtype = request.form.get("orgtype")
    print(orgtype) 
    if "alphabet" == orgtype:
        modwshlstdata = sorted(wishlistdata,key = alphabetsort)
    elif "rev_alphabet" == orgtype: 
        modwshlstdata = sorted(wishlistdata,key = alphabetsort, reverse = True)
    elif "currentpsnprice (low-high)" == orgtype:
        modwshlstdata = sorted(wishlistdata, key = currentpricesortwshlst)
    elif "currentpsnprice (high-low)" == orgtype:
        modwshlstdata = sorted(wishlistdata, key = currentpricesortwshlst, reverse = True)
    elif "defaultprice (low-high)" == orgtype:
        modwshlstdata = sorted(wishlistdata, key = defaultpricesortwshlst)
    elif "defaultprice (high-low)" == orgtype:
        modwshlstdata = sorted(wishlistdata, key = defaultpricesortwshlst,reverse = True)
    elif  "releasedate" == orgtype:
        modwshlstdata = sorted(wishlistdata, key = releasedatewshlst)
    elif "time added" == orgtype:
        modwshlstdata = sorted (wishlistdata, key = dayaddedsortwshlst, reverse= True)
    else: 
        modwshlstdata = wishlistdata
    return("Modified")
@app.route("/getwishlistmodified", methods = ["GET", "POST"])
@login_required
def getwishlistmodified():
    global modwshlstdata
    return(jsonify(modwshlstdata))



@app.route("/wishlistedit", methods = ["GET", "POST"])
@login_required
def wishlistedit():
    if request.method == "POST" and "add" in request.form:
        print("Yes")
        gameid = request.form.get("gameid")
        gamename = request.form.get("gamename")
        userid = request.form.get("userid")
        addquery = ("INSERT INTO user_game_data (gameid, gamename, userid,dayadded) VALUES(%(gameid)s,%(gamename)s, %(userid)s, %(dayadded)s)")
        checkquery = ("SELECT * FROM user_game_data WHERE userid = %(userid)s AND gameid = %(gameid)s")
        gamedata = {
            "gameid" : gameid,
            "gamename": gamename,
            "userid": userid,
            "dayadded":strftime("%Y-%m-%d %H:%M:%S", gmtime())
        }
        cursor.execute(checkquery,gamedata)
        inwshlst = cursor.fetchone()

        if not inwshlst:
            cursor.execute(addquery, gamedata)
            db.commit()
            return ("Game Added to Wishlist")
        elif inwshlst:

            return("Game Already in Wishlist")
    elif request.method == "POST" and "remove" in request.form:
        gameid = request.form.get("gameid")
        gamename = request.form.get("gamename")
        userid = request.form.get("userid")
        gamedata = {
            "gameid" : gameid,
            "gamename": gamename,
            "userid": userid
        }
        removequery = ("DELETE FROM user_game_data WHERE gameid = %(gameid)s AND gamename = %(gamename)s AND userid = %(userid)s")
        cursor.execute(removequery, gamedata)
        db.commit()
        return ("Removed from Wishlist")
    else:
        return(render_template("index.html"))

# ACCOUNT PAGE ROUTES/CODE------------------------------------------------------
@app.route("/account", methods = ["GET", "POST"])
@login_required
def accountpg():
     return(render_template("index.html"))

# ERROR HANDLING PORTING--------------------------------------------------------

errorname = ""
errcode = 0
@login_required

def errorhandler(e):
    global errorname, errcode
    errorname = e.name
    errcode = e.code
    print(errorname)
    print(errcode)


    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
        errorname = e.name
        errcode = e.code
    return render_template("error.html",errorname=e.name, errcode = e.code)

for code in default_exceptions:
    app.errorhandler(code)(errorhandler)

@app.route("/geterrors",methods = ["GET"])
def geterrors():
    global errorname,errcode
    errordetails= {"Name": errorname, "Code": errcode}
    return(jsonify(errordetails))





if __name__ == '__main__':
    app.debug = True
    app.run(debug=True)