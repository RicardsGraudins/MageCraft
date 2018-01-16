# MageCraft
This repository contains code and information for my fourth-year (hons) undergraduate project for the module **Applied Project and Minor Dissertation.**
The module is taught to undergraduate students at [GMIT](http://www.gmit.ie/) in the Department of Computer Science and Applied Physics for the course [B.S.c. (Hons) in Software Developement.](https://www.gmit.ie/software-development/bachelor-science-honours-software-development)
The lecturer is John Healey and this project is supervised by Martin Hynes.  

This project revolves around re-creating the arcade game MageCraft from the StarCraft 2 engine to the browser.  
The following image depicts the proposed technologies to be used from the October 2017 presentation:

<p align="center">
  <img width="875" height="648" src="https://github.com/RicardsGraudins/MageCraft/blob/master/resources/October_Design.png">
</p>

## What is MageCraft:
MageCraft is an arcade game built on the StarCraft 2 engine by Team Syntax in 2011. It is a multiplayer game where each player controls a mage with the objective of being the last remaining mage in a free for all mode. There are a variety of spells to chose from and certain spells synergize/combine for a more devestating spell, however each player is limited to 4 offensive spells and 2 defensive spells - once picked, the spells are locked for the remainder of the match therefore each player should consider carefully which spells to take in order to counter the opponent/s and achieve victory. Visit the MageCraft FAQ page for additional information on how to play and the game controls.

## How to run locally:  
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

## References:
