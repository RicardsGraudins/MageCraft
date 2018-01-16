from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_pymongo import PyMongo
from flask_wtf import FlaskForm, RecaptchaField
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Length, Email, EqualTo
from flask_socketio import SocketIO, send, emit
from flask_mail import Mail, Message
import bcrypt
import random
import string

app = Flask(__name__)
#Setting CSRF encryption key
app.config['SECRET_KEY'] = 'mysecret'
#Setting up connection to mongoDB hosted on mlab
app.config['MONGO_DBNAME'] = 'magecraft_login'
app.config['MONGO_URI'] = 'mongodb://Richard:987654321@ds040637.mlab.com:40637/magecraft_login'
#Setting Google recaptcha keys
app.config['RECAPTCHA_PUBLIC_KEY'] = '6LfeojMUAAAAABjPzNB2ylVl-YZ0AmLG7-vdhB9F'
app.config['RECAPTCHA_PRIVATE_KEY'] = '6LfeojMUAAAAACJFOQTATc4oawWKHsdr9qv5L8Aa'
#Temporarily disabling recaptcha
app.config['TESTING'] = False
#Loading settings for flask-mail from file config.cfg
app.config.from_pyfile('config.cfg')

#Reference variables
socketio = SocketIO(app)
mongo = PyMongo(app)
mail = Mail(app)
	
#Handles the new user registration form @ register.html - WTForms integrated, validator conditions must be met for successful registration
#Uses recaptcha to prevent unsophisticated bots from creating accounts
class RegisterForm(FlaskForm):
	username = StringField('Username', validators=[InputRequired('Username is required!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.')])
	password = PasswordField('Password', validators=[InputRequired('Password is required!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.')])
	email = StringField('Email', validators=[InputRequired('Email address is required!'), Email('A valid email is required!')])
	recaptcha = RecaptchaField()
	
#Handles the changing password form @ changePassword.html - WTForms integrated, validator conditions must be met to successfully change password
class NewPasswordForm(FlaskForm):
	oldPassword = PasswordField('Current Password', validators=[InputRequired('Enter your old password!')])
	newPassword = PasswordField('New Password', validators=[InputRequired('Enter new password!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.'), EqualTo('confirmNewPassword', message='Passwords must match!')])
	confirmNewPassword = PasswordField('Confirm New Password')
	
#Return home.html
@app.route('/')
def index():
	return render_template('home.html')
	
#Return game.html
@app.route('/game')
def game():
	return render_template('game.html')
	
#Return FAQ.html
@app.route('/FAQ')
def faq():
	return render_template('FAQ.html')

#Handles new user registration @ register.html
#If the registration form is valid on submission - check for the entered username in the database, if the username does not exist then add the record to the database
#Password is hashed using bcrypt for security and the hashpass value is stored in the database
#Session is then created and redirects the user to their profile
#Note session is secure and difficult to access due to flask design
@app.route('/register', methods=['POST', 'GET'])
def register():
	form = RegisterForm()
	
	#POST
	if form.validate_on_submit():
		users = mongo.db.users
		existing_user = users.find_one({'name' : request.form['username']})
		
		if existing_user is None:
			hashpass = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())
			users.insert({'name' : request.form['username'], 'email' : request.form['email'], 'password' : hashpass})
			session['username'] = request.form['username']
			return redirect(url_for('profile'))
			
		flash('That username already exists!')
		
	return render_template('register.html', form=form)
	
#Handles user login @ login.html
#If the username exists in the database then check if the correct password is entered
#On success, create session and redirect to profile
@app.route('/login', methods=['POST'])
def login():
    users = mongo.db.users
    login_user = users.find_one({'name' : request.form['username']})

    if login_user:
		#if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
        if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password']) == login_user['password']:
            session['username'] = request.form['username']
            return redirect(url_for('profile'))

    flash('Wrong username/password!')
    return render_template('login.html')
	
#If the user is logged in return profile.html otherwise render login.html
@app.route('/profile')
def profile():
    if 'username' in session:
        return render_template('profile.html')

    return render_template('login.html')
	
#Handles change password functionality @ changePassword.html
#User must be logged in otherwise redirect occurs
#If the password form is valid on submission - find the user in the database and compare the old password to the new password
#On success, hash the new password and overwrite the password in the database with the new hashed password then save the data
#Send an email to the user notifying them that their password has been changed
#Lastly logout the user and redirect to FAQ.html where a message is displayed
@app.route('/changePassword', methods=['GET', 'POST'])
def changePassword():
	if 'username' in session:
		passwordForm = NewPasswordForm()
		if request.method == 'POST':
			if passwordForm.validate_on_submit():
				users = mongo.db.users
				user = users.find_one({'name' : session['username']})
				if bcrypt.hashpw(request.form['oldPassword'].encode('utf-8'), user['password']) == user['password']:
					newHashpass = bcrypt.hashpw(request.form['newPassword'].encode('utf-8'), bcrypt.gensalt())
					user['password'] = newHashpass
					users.save(user)
					displayMessage = "Password sucessfully changed, you can now login using your new password."
					userEmail = user['email']
					emailToString = str(userEmail)
					emailMessage = Message(body = 'Your password has been changed.\nIf this was not you follow this link to reset your password: ',
					subject = 'Changed Password', sender = 'testing984566@gmail.com', recipients = [emailToString])
					mail.send(emailMessage)
					session.pop('username', None)
					return render_template('FAQ.html', displayMessage = displayMessage)
				flash('Wrong password!')
		return render_template('changePassword.html', passwordForm=passwordForm)
	return redirect(url_for('profile'))
	
#Handles reset password functionality @ resetPassword.html
#Check if the user exists in the database
#If the user exists generate a random string, hash it, overwrite the existing password and save the data
#Send the user an email notifying that their password has been reset and include the reset password
#The user can now log in using the password sent in the email 
@app.route('/resetPassword', methods = ['GET', 'POST'])
def resetPassword():
	if request.method == 'POST':
		users = mongo.db.users
		user = users.find_one({'name' : request.form['username']})
		if user:
			#Ref random string https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits-in-python/23728630#23728630
			resetPassword = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(12))
			resetPasswordHash = bcrypt.hashpw(resetPassword.encode('utf-8'), bcrypt.gensalt())
			user['password'] = resetPasswordHash
			users.save(user)
			userEmail = user['email']
			emailToString = str(userEmail)
			emailPassword = Message(body = 'Your password has been sucessfully reset.\nYour new password is: ' + resetPassword,
			subject = 'Reset Password', sender = 'testing984566@gmail.com', recipients = [emailToString])
			mail.send(emailPassword)
			displayMessage = 'An email has been sent to the registered email address of the username that was entered.'
			if session:
				session.pop('username', None)
			return render_template('FAQ.html', displayMessage = displayMessage)
		flash('That username does not exist.')
	return render_template('resetPassword.html')
	
#When routed to /logout remove the session(logout the user) and redirect
@app.route('/logout')
def logout():
	session.pop('username', None)
	return redirect(url_for('profile'))
	
#Using socketio for multiplayer - work in progress
@socketio.on('message')
def handleMessage(msg):
	print('Message: ' + msg)
	send(msg, broadcast=True)
	
#Movement - arrow keys
@socketio.on('leftArrow')
def leftArrow(msg):
	print(msg)
	emit('leftArrow', msg, broadcast=True)
	
@socketio.on('upArrow')
def upArrow(msg):
	print(msg)
	emit('upArrow', msg, broadcast=True)
	
@socketio.on('rightArrow')
def rightArrow(msg):
	print(msg)
	emit('rightArrow', msg, broadcast=True)
	
@socketio.on('downArrow')
def downArrow(msg):
	print(msg)
	emit('downArrow', msg, broadcast=True)

#Player moved event
@socketio.on('moved')
def moved(xpos, ypos):
	print(xpos, ypos)
	#Recieving null on clientside if sending both x and y therefore sending them seperately for now
	#Emit('moved', data=(xpos, ypos), broadcast=True)
	emit('movedX', xpos, broadcast=True)
	emit('movedY', ypos, broadcast=True)

if __name__ == "__main__":
	#app.run(debug=True)
	socketio.run(app)