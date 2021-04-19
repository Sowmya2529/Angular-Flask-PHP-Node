import flask
import sys
from flask import Flask,request,render_template,jsonify,json,session
from flask_cors import CORS
import random
from collections import defaultdict
from io import StringIO
import smtplib
from flask_mail import Mail, Message
from flask_mysqldb import MySQL 
import MySQLdb.cursors 
import re
import datetime 
import json

app = Flask(__name__)
CORS(app)

app.secret_key = '12345678910' 
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'login'
mysql = MySQL(app) 

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'mailid'
app.config['MAIL_PASSWORD'] = 'pwd'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

otp_dict={}
def readJsonOtp():
	with open('otp.json') as f:
		otp_dict = json.load(f)

def writeJsonOtp():
	with open('otp.json', 'w') as f:
		json.dump(otp_dict, f)


@app.route('/login',methods=['GET','POST'])
def login():
	print("api hit")
	data=request.get_json()
	print(data)
	username=data['username']
	
	pwd=data['password']

	print(username,pwd)
	cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor) 
	cursor.execute('SELECT * FROM `user-accounts` WHERE username = % s AND password = % s', (username, pwd, )) 
	account = cursor.fetchone() 
	if account: 
		session['loggedin'] = True
		session['id'] = account['id'] 
		session['username'] = account['username'] 
		msg = 'Logged in successfully !'
		status=1
	else: 
		msg = 'Incorrect username / password !'
		status=0
	return jsonify({"result":msg,"status":status})


@app.route('/register',methods=['GET','POST'])
def register():
	print("api hit")
	data=request.get_json()
	msg=''
	username=data['username']
	email=data['email']
	pwd=data['password']
	status=0
	print(username,email,pwd)
	cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	cursor.execute('SELECT * FROM `user-accounts` WHERE username = %s or email=%s', (username,email,))
	account = cursor.fetchone() 
	if account: 
		msg = 'Account already exists !'
	elif not re.match(r'[^@]+@[^@]+\.[^@]+', email): 
		msg = 'Invalid email address !'
	elif not re.match(r'[A-Za-z0-9]+', username): 
		msg = 'Username must contain only characters and numbers !'
	elif not username or not pwd or not email: 
		msg = 'Please fill out the form !'
	else: 
		cursor.execute('INSERT INTO `user-accounts` VALUES (NULL, % s, % s, % s)', (username, pwd, email, )) 
		mysql.connection.commit() 
		cursor.close()
		msg = 'You have successfully registered !'
		sender = 'sowmyaprabha75@gmail.com'
		receivers = [email]
		message = 'Hello ' + username + ',' +'\nThank you registering with the CIT Library Portal!'
		smtpObj = smtplib.SMTP('smtp.gmail.com', 587)
		smtpObj.starttls()
		smtpObj.login('sowmyaprabha75@gmail.com', 'sowmya25302575')
		smtpObj.sendmail(sender, receivers, message)
		msg='Check your email for confirmation'
		status=1
	return jsonify({"result":msg,"status":status})
    # except SMTPException:

def generateOtp():
	res_str=""
	s="1234567809"
	for i in range(0,6):
		res_str+=random.choice(s)
	return int(res_str)

@app.route('/get-otp',methods=['GET','POST'])
def sendOtp():
	print("api hit")
	data=request.get_json()
	msg=''
	email=data['email']
	#print(otp_dict)
	cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	cursor.execute('SELECT count(email) AS count FROM `user-accounts` WHERE email = %s', (email,))
	account = cursor.fetchone()
	if account['count']==0:
		msg='Email Id is not registered with CIT Portal!'
		status=0
	else:
		otp=generateOtp()
		curtime=datetime.datetime.now()
		valid_period=curtime+datetime.timedelta(minutes = 10)
		otp_dict['otp']=otp
		valid_period_f=valid_period.isoformat(' ', 'seconds')
		otp_dict['validity']=str(valid_period_f)
		otp_dict['email']=email
		writeJsonOtp()
	#date_time = datetime.datetime.strptime(valid_period, "%Y-%m-%d %H:%M")
		print(email)
		sender = 'sowmyaprabha75@gmail.com'
		receivers = [email]
		message = 'Hello,' +'\nOTP for New Password Generation is:'+str(otp)+" OTP valid upto:"+str(valid_period_f)+' IST.'
		smtpObj = smtplib.SMTP('smtp.gmail.com', 587)
		smtpObj.starttls()
		smtpObj.login('sowmyaprabha75@gmail.com', 'sowmya25302575')
		smtpObj.sendmail(sender, receivers, message)
		msg='Check your email for OTP!'
		status=1
	mysql.connection.commit() 
	cursor.close()
	return jsonify({"result":msg,"status":status})

@app.route('/verify-otp',methods=['GET','POST'])
def verifyOtp():
	print("api hit")
	with open('otp.json') as f:
		otp_dict = json.load(f) 

	curtime=datetime.datetime.now()
	curtime=curtime.isoformat(' ', 'seconds')
	curtime=datetime.datetime.fromisoformat(curtime)
	data=request.get_json()
	received_otp=data['otp']
	datetime_object = datetime.datetime.fromisoformat(otp_dict['validity'])
	if(otp_dict["otp"]==received_otp):
		if curtime>datetime_object:
			status=0
			msg="OTP expired! Please request for new OTP to proceed"
		else:
			status=1
			msg="success"
	else:
		status=0
		msg="Incorrect OTP!"
	return jsonify({"result":msg,"status":status})

@app.route('/set-pwd',methods=['GET','POST'])
def setPwd():
	print("api hit")
	data=request.get_json()	
	email=data['email']	
	pwd=data['password']
	msg=''
	cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	cursor.execute('SELECT password FROM `user-accounts` WHERE email = %s', (email,))
	account = cursor.fetchone()
	if account:
		cursor.execute("UPDATE `user-accounts` SET password='%s' where email='%s'"%(pwd,email)) 
		mysql.connection.commit() 
		cursor.close()
		status=1
		msg="success"
	else:
		status=0
		msg="Account with the given email doesn't exists!"
	
	return jsonify({"result":msg,"status":status})
if __name__=='__main__':
	 app.run(debug=True) #run app in debug mode on port 5000