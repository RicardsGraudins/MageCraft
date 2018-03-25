# MageCraft
This repository contains code and information for my fourth-year (hons) undergraduate project for the module **Applied Project and Minor Dissertation.**
The module is taught to undergraduate students at [GMIT](http://www.gmit.ie/) in the Department of Computer Science and Applied Physics for the course [B.S.c. (Hons) in Software Developement.](https://www.gmit.ie/software-development/bachelor-science-honours-software-development)
The lecturer is John Healey and this project is supervised by Martin Hynes.  

This project revolves around re-creating the arcade game MageCraft from the StarCraft 2 engine to the browser.  
The following image depicts the proposed technologies to be used from the October 2017 presentation:

<p align="center">
  <img width="875" height="648" src="https://github.com/RicardsGraudins/MageCraft/blob/master/static/resources/images/documentation/October_Design.png">
</p>

## What is MageCraft:
MageCraft is an arcade game built on the StarCraft 2 engine by Team Syntax in 2011. It is a multiplayer game where each player controls a mage with the objective of being the last remaining mage in a free for all mode. There are a variety of spells to choose from and certain spells synergize/combine for a more devestating spell, however each player is limited to 6 offensive spells and 2 defensive spells - once picked, the spells are locked for the remainder of the match therefore each player should consider carefully which spells to take in order to counter the opponent/s and achieve victory. Visit the MageCraft FAQ page for additional information on how to play and the game controls.

## Gameplay Demo @ Cloud:
[![Link to cloud](https://github.com/RicardsGraudins/MageCraft/blob/master/static/resources/images/documentation/Cloud_Link.gif)](https://magecraft.herokuapp.com/)  

<p align="center">
:video_game:
  <strong>
To play the game either click the above gif or this <a href="https://magecraft.herokuapp.com/">link</a>.
  </strong>
:video_game:
</p>
<p align="center">
  <strong>
    If theres any issues take a look at this <a href="#Firefox">section</a> and the <a href="https://magecraft.herokuapp.com/FAQ">FAQ</a>.
  </strong>
</p>

<p align="center">
  <i>
Alternatively you can view a short gameplay demo versus AI by clicking this <a href="https://www.youtube.com/watch?v=oAvB4e6fvr4">link</a>.
  </i>
</p>

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

Used the following extensions:
- [Babylon GUI](https://github.com/BabylonJS/Babylon.js/tree/master/gui)
- [Babylon Inspector Bundle](https://github.com/BabylonJS/Babylon.js/blob/master/dist/inspector/babylon.inspector.bundle.js)
- [Fire Material](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.fireMaterial.js)
- [Fire Procedural Texture](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.fireProceduralTexture.js)
- [Water Material](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.waterMaterial.js)

If you would like to know additional information about these extensions please view the following [link](https://doc.babylonjs.com/extensions).

## Heroku:  
Heroku is a cloud platform as a service (PaaS) supporting several programming languages that is used as a web application deployment model. Heroku, one of the first cloud platforms, has been in development since June 2007, when it supported only the Ruby programming language, but now supports Java, Node.js, Scala, Clojure, Python, PHP, and Go. For this reason, Heroku is said to be a polyglot platform as it lets the developer build, run and scale applications in a similar manner across all the languages.

## Bcrypt:  
Bcrypt is a password hashing function designed by Niels Provos and David Mazières, based on the Blowfish cipher, and presented at USENIX in 1999. Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function: over time, the iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with increasing computation power.

There is a Flask extension for bcrypt([Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/en/latest/)) however for this project we are simply using the library provided by Python.  

## CannonJS:
CannonJS is an open source JavaScript 3D physics engine. Unlike other physics engine libraries ported from C++ to JavaScript, CannonJS was written in JavaScript from the start and can take advantage of its features. When compared to other engines it does lack in features however it is easier to get into and more comprehensible than the alternatives which makes it the perfect physics engine for this project since we are not focusing on complicated concepts but rather implementing some really basic ones.

## Bugs - Firefox Version 58: <a name="Firefox"></a>
The purpose of the bugs folder is to demonstrate the current bugs with BabylonJS when using Firefox version 58 that I have encountered. To view the bugs open a html file in Firefox 58 and a different browser for comparison. In the interest of providing the same game experience I have went out of my way to make the game run in a similar manner on Firefox 58 however there are still a few differences which all arise from the manner in which Firefox handles materials i.e the first change(e.g. color/alpha) applied to one material is applied to any and every other material in the game.
- Do **not** use Firefox version 58 for this game.

## Important: Resolution
The game is currently optimized for 1920 x 1080 resolution, if you're using a smaller resolution some of the game will most likely be out of place, specifically the menus. To get around this limitation use chrome, press f12 to access the developer tools and press the toggle device toolbar button which is the second top left icon to automatically scale down the canvas so the entire game is visible. The canvas size can further be altered by pulling on the edge of the toolbar or by using input fields at the top to change the size. The game hasn’t been tested on a resolution above 1920 x 1080.

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
15. Debug Layer: Added debug layer and FPS tracker to spot bugs/issues easier.
16. Player Grid: Added player grid with a couple of testing functions, textures and animations.
17. Bugs: Added bugs folder demonstrating material bugs with Firefox version 58.
18. Player Movement & Ground Collision: Added proper player movement and Cannon.js physics engine for ground collision.
19. Camera & Player Sprites: Changed camera to follow player and added player sprite animations.
20. Fireball: Added Fireball spell, replaced mouse tracking and implemented a basic spell cycle.
21. Fireball Particles: Added particles to Fireball.
22. Updated Spell Cycle: Improved spell cycle(action manager, cooldowns, spell selection) and added setup for Frostbolt and Splitter.
23. Fire Sprite @ Lava: Added sprite animation for when the player goes on the lava.
24. User Interface: Added user interface that tracks spell cooldowns and health with animations.
25. Babylon GUI - Gold + Status Trackers: Added gold and status trackers to UI.
26. Frostbolt + Splitter: Added both spells with sprite animations and updated UI.
27. Recharger: Added recharger spell with sprite animations.
28. Molten Boulder & Fireball Sprite: Added molten boulder spell with sprite animations and updated fireball.
29. Deflection Shield: Added deflection shield spell with sprite animations.
30. Warlock's Mark: Added warlock's mark spell with sprite animations.
31. Cauterize: Added cauterize spell.
32. Particle Systems - Molten Boulder & Warlock's Mark: Added sprite systems for both spells.
33. Game Over Menu: Added game over menu and upload gold functionality.
34. Pause Menu: Added pause menu.
35. Updated UI + Keybinds Text: Updated UI textures & added text for keybinds on UI.
36. Enemy AI Movement: Added basic enemy with basic movement towards the player.
37. Music + Enforced Y Limit: Added music and enforcing all objects to stay below a certain Y level.
38. Red Dragon Sprite: Added red dragon sprite with movement animations.
39. All Spell Collisions + Interactions: Added collision detection and various interactions for every spell.
40. Dragon Death + Burn Frost Animations: Added additional dragon animations.
41. Dragon Collections: Added dragon collections and interactions for each dragon functioning properly.
42. Profile Menu, Improved Navigation & Delete Account: Replaced placeholder profile menu, improved navigation between pages such that it works on the cloud and added delete account functionality.
43. Status Updates: Added various status updates for interactions.
44. Edited Index Page + Chat: Updated index page to be a bit more interesting and improved the chat.
45. Code Clean Up + Additional Documentation: Cleaned up the code and added more documentation as to how everything works.
46. Constants + Minor Value Changes: Added constants to player_grid.js & player_ui.js to make it easier to understand and tweaked spawning/positioning of meshes.
47. Alternative AI Movement: Added a different AI movement pattern that can be triggered using the in game chat.
48. Updated FAQ: Updated the FAQ page to help new players.
49. Spell Cooldown Constants: Added constants to player.js for spell cooldowns and relevant documentation.
50. Cloud: Uploaded the project to Heroku and added some code to demonstrate how it runs on the cloud.

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
* [BabylonJS Forum](http://www.html5gamedevs.com/forum/16-babylonjs/)
* [CannonJS](http://www.cannonjs.org/)
