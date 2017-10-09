from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_pymongo import PyMongo
import bcrypt
from flask_wtf import FlaskForm, RecaptchaField
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Length, Email
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['MONGO_DBNAME'] = 'magecraft_login'
app.config['MONGO_URI'] = 'mongodb://Richard:987654321@ds040637.mlab.com:40637/magecraft_login'
app.config['RECAPTCHA_PUBLIC_KEY'] = '6LfeojMUAAAAABjPzNB2ylVl-YZ0AmLG7-vdhB9F'
app.config['RECAPTCHA_PRIVATE_KEY'] = '6LfeojMUAAAAACJFOQTATc4oawWKHsdr9qv5L8Aa'
app.config['TESTING'] = False
socketio = SocketIO(app)

mongo = PyMongo(app)

@app.route('/')
def index():
	return render_template('home.html')
	
@app.route('/game')
def game():
	return render_template('game.html')
	
class RegisterForm(FlaskForm):
	username = StringField('Username', validators=[InputRequired('Username is required!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.')])
	password = PasswordField('Password', validators=[InputRequired('Password is required!'), Length(min=4, max=12, message='Must be between 4 and 12 characters.')])
	email = StringField('Email', validators=[InputRequired('Email address is required!'), Email('A valid email is required!')])
	recaptcha = RecaptchaField()
	
@socketio.on('message')
def handleMessage(msg):
	print('Message: ' + msg)
	send(msg, broadcast=True)

	
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

if __name__ == "__main__":
	#app.run(debug=True)
	socketio.run(app)