from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_pymongo import PyMongo
import bcrypt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['MONGO_DBNAME'] = 'magecraft_login'
app.config['MONGO_URI'] = 'mongodb://Richard:987654321@ds040637.mlab.com:40637/magecraft_login'

mongo = PyMongo(app)

@app.route('/')
def index():
	return render_template('game.html')
	
@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'name' : request.form['username']})
	
        if existing_user is None:
            hashpass = bcrypt.hashpw(request.form['pass'].encode('utf-8'), bcrypt.gensalt())
            users.insert({'name' : request.form['username'], 'email' : request.form['email'], 'password' : hashpass})
            session['username'] = request.form['username']
            return redirect(url_for('profile'))
        
        return 'That username already exists!'

    return render_template('register.html')
	
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
	app.run(debug=True)