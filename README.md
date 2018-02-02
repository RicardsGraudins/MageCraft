# MageCraft
This repository contains code and information for my fourth-year (hons) undergraduate project for the module **Applied Project and Minor Dissertation.**
The module is taught to undergraduate students at [GMIT](http://www.gmit.ie/) in the Department of Computer Science and Applied Physics for the course [B.S.c. (Hons) in Software Developement.](https://www.gmit.ie/software-development/bachelor-science-honours-software-development)
The lecturer is John Healey and this project is supervised by Martin Hynes.  

This project revolves around re-creating the arcade game MageCraft from the StarCraft 2 engine to the browser.  
The following image depicts the proposed technologies to be used from the October 2017 presentation:

<p align="center">
  <img width="875" height="648" src="https://github.com/RicardsGraudins/MageCraft/blob/master/static/resources/images/October_Design.png">
</p>

## What is MageCraft:
MageCraft is an arcade game built on the StarCraft 2 engine by Team Syntax in 2011. It is a multiplayer game where each player controls a mage with the objective of being the last remaining mage in a free for all mode. There are a variety of spells to chose from and certain spells synergize/combine for a more devestating spell, however each player is limited to 4 offensive spells and 2 defensive spells - once picked, the spells are locked for the remainder of the match therefore each player should consider carefully which spells to take in order to counter the opponent/s and achieve victory. Visit the MageCraft FAQ page for additional information on how to play and the game controls.

## Technologies Used:
This section briefly describes the technologies used in this project and the purpose they serve. If you would like to run the project locally the majority of the technologies mentioned will need to be installed - take a look at this [section](#Installation) for a quick step by step guide on how to run the project.

## Flask:
Flask is a micro web framework written in Python and based on the Werkzeug toolkit and Jinja2 template engine. Flask is called a micro framework because it does not require particular tools or libraries. It has no database abstraction layer, form validation, or any other components where pre-existing third-party libraries provide common functions. However, Flask supports extensions that can add application features as if they were implemented in Flask itself. Extensions exist for object-relational mappers, form validation, upload handling, various open authentication technologies and several common framework related tools. Extensions are updated far more regularly than the core Flask program.  

**Flask-PyMongo**:  
Essentially Flask-PyMongo bridges Flask and PyMongo, so that you can use Flask’s normal mechanisms to configure and connect to MongoDB.

**Flask-Mail**:  
The Flask-Mail extension provides a simple interface to set up [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) with your Flask application and to send messages from your views and scripts.  

**Flask-SocketIO**:  
Flask-SocketIO gives Flask applications access to low latency bi-directional communications between the clients and the server. The client-side application can use any of the SocketIO official clients libraries in Javascript, C++, Java and Swift, or any compatible client to establish a permanent connection to the server.

**Flask-WTF**:  
This extension provides integration of Flask and WTForms, including CSRF, file upload, and reCAPTCHA.

## MongoDB:
MongoDB stores data in flexible, JSON-like documents, meaning fields can vary from document to document and data structure can be changed over time. The document model maps to the objects in your application code, making data easy to work with. Ad hoc queries, indexing, and real time aggregation provide powerful ways to access and analyze your data. MongoDB is a distributed database at its core, so high availability, horizontal scaling, and geographic distribution are built in and easy to use. MongoDB is free and open-source, published under the GNU Affero General Public License.

Instead of using a local MongoDB database, the database for user login is hosted on the cloud by [mLab](https://mlab.com/) which is a fully managed cloud database service designed specifically for storing MongoDB databases.

## SocketIO:  
SocketIO is a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library. Both components have a nearly identical API. Like Node.js, it is event-driven. SocketIO primarily uses the WebSocket protocol with polling as a fallback option, while providing the same interface. Although it can be used as simply a wrapper for WebSocket, it provides many more features, including broadcasting to multiple sockets, storing data associated with each client, and asynchronous I/O.

## BabylonJS:
BabylonJS is a complete JavaScript framework for building 3D games with HTML 5 and WebGL. A lot of browser games can be built simply using JavaScript however there are limitations to this approach and in order to reduce the difficultly of drawing more complex shapes and animations we will be using this library. Note, since this course does not cover graphic design or WebGL the visuals will most likely be subpar. 

## Heroku:  
Heroku is a cloud platform as a service (PaaS) supporting several programming languages that is used as a web application deployment model. Heroku, one of the first cloud platforms, has been in development since June 2007, when it supported only the Ruby programming language, but now supports Java, Node.js, Scala, Clojure, Python, PHP, and Go. For this reason, Heroku is said to be a polyglot platform as it lets the developer build, run and scale applications in a similar manner across all the languages.

## Bcrypt:  
Bcrypt is a password hashing function designed by Niels Provos and David Mazières, based on the Blowfish cipher, and presented at USENIX in 1999. Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function: over time, the iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with increasing computation power.

There is a Flask extension for bcrypt([Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/en/latest/)) however for this project we are simply using the library provided by Python.

## How to run locally: <a name="Installation"></a>
1. Have the following **prerequisites** installed:  
* Python.
  - Recommended version [3.6.1](https://www.python.org/downloads/release/python-361/).
* Flask.
  - Installation guide available [here](http://flask.pocoo.org/).
* Flask-PyMongo.
  - `pip install Flask-PyMongo`
* Flask-Mail.
  - `pip install Flask-Mail`
* Flask-SocketIO.
  - `pip install Flask-SocketIO`
* Flask-WTF.
  - `pip install Flask-WTF`
* Bcrypt.
  - `pip install Bcrypt`
2. `CD path/to/MageCraft` and either `python runme.py` or `py runme.py` depending on your version of python.

## Commit Summary:
Simple commit summary for project supervisor to keep track of progress.  
1. Flask Setup: Basic flask setup, projects running on localhost.
2. MongoDB Login: Users can register & login with the data being stored on mLab.
3. WTForms Integration: WTForms for registration.
4. Recaptcha: Integrated reCAPTCHA using the Google reCAPTCHA API.
5. Homepage: Basic index page - Play, Login and Github links.
6. SocketIO Chat Basics: Chat systems using SocketIO.
7. Change Password: Added change password functionality.
8. Flask-Mail + Reset Password: Added reset password functionality and email notifications.
9. FAQ: Added FAQ page - the goto redirection page that also displays relevant messages.
10. Testing jQuery + SocketIO: Testing software to create basic player movement.
11. Canvas Tweak + Placeholder Profile Menu: Added menu to profile for testing various functionalities.
12. Player Movement: Essentially testing SocketIO - multiple users controlling one object.
13. Documentation: Added documentation for overall project.
14. BabylonJS Setup & Background Texture: Setting up BabylonJS and adding lava texture background.

## References:
* [Flask](http://flask.pocoo.org/docs/0.12/)  
* [MongoDB](https://www.mongodb.com/)
* [mLab](https://mlab.com/)
* [SocketIO](https://socket.io/)
* [BabylonJS](http://www.babylonjs.com/)
* [Heroku](https://www.heroku.com/home)
* [Flask-PyMongo](https://flask-pymongo.readthedocs.io/en/latest/)
* [Flask-Mail](https://pythonhosted.org/Flask-Mail/)
* [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/)
* [Flask-WTF](https://flask-wtf.readthedocs.io/en/stable/)
* [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt)
* [BabylonJS](https://www.babylonjs.com/)
