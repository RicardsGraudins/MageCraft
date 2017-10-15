from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_pymongo import PyMongo
from flask_wtf import FlaskForm, RecaptchaField
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Length, Email, EqualTo
from flask_socketio import SocketIO, send
from flask_mail import Mail, Message
import bcrypt
import random
import string

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['MONGO_DBNAME'] = 'magecraft_login'
app.config['MONGO_URI'] = 'mongodb://Richard:987654321@ds040637.mlab.com:40637/magecraft_login'
app.config['RECAPTCHA_PUBLIC_KEY'] = '6LfeojMUAAAAABjPzNB2ylVl-YZ0AmLG7-vdhB9F'
app.config['RECAPTCHA_PRIVATE_KEY'] = '6LfeojMUAAAAACJFOQTATc4oawWKHsdr9qv5L8Aa'
app.config['TESTING'] = False
app.config.from_pyfile('config.cfg')
socketio = SocketIO(app)

mongo = PyMongo(app)
mail = Mail(app)
	
class RegisterForm(FlaskForm):
	username = StringField('Username', validators=[InputRequired('Username is required!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.')])
	password = PasswordField('Password', validators=[InputRequired('Password is required!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.')])
	email = StringField('Email', validators=[InputRequired('Email address is required!'), Email('A valid email is required!')])
	recaptcha = RecaptchaField()
	
class NewPasswordForm(FlaskForm):
	oldPassword = PasswordField('Current Password', validators=[InputRequired('Enter your old password!')])
	newPassword = PasswordField('New Password', validators=[InputRequired('Enter new password!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.'), EqualTo('confirmNewPassword', message='Passwords must match!')])
	confirmNewPassword = PasswordField('Confirm New Password')
	
@socketio.on('message')
def handleMessage(msg):
	print('Message: ' + msg)
	send(msg, broadcast=True)
	
@app.route('/')
def index():
	return render_template('home.html')
	
@app.route('/game')
def game():
	return render_template('game.html')
	
@app.route('/FAQ')
def faq():
	return render_template('FAQ.html')

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
	
@app.route('/profile')
def profile():
    if 'username' in session:
        return render_template('profile.html')

    return render_template('login.html')
	
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
	
@app.route('/resetPassword', methods = ['GET', 'POST'])
def resetPassword():
	if request.method == 'POST':
		users = mongo.db.users
		user = users.find_one({'name' : request.form['username']})
		if user:
			#ref random string https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits-in-python/23728630#23728630
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

if __name__ == "__main__":
	#app.run(debug=True)
	socketio.run(app)