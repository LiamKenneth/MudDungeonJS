# MudDungeonJS

[![codecov.io](https://codecov.io/github/LiamKenneth/MudDungeonJS/coverage.svg?branch=master)](https://codecov.io/github/LiamKenneth/MudDungeonJS?branch=master)

![Alt text](http://i.imgur.com/k3Kp2OY.png "Javascript Mud Codebase")


MudDungonJS is a text based MMORPG also known as a MUD(Multi User Dungeon). The goal of this project is to build an immersive fantasy world that you can get lost in. As well as improve your Javascript, node.js and Testing skills!

#How to run it
Due to ES6 use this requires Node version >= 4.2.6

- Download the project
- Enter npm install
- Enter gulp to start the project
- go to 127.0.0.1:4000 in a mud client or http://localhost:4001 in your browser

#Testing
- Enter gulp test to run the unit tests

Project needs more tests, i've had too much fun coding for tests! Will fix that soon.

#Commands
Currently implemented commands

- N,E,S,W,U,D - Movement
- Get, drop, look, look at/in, examine
- inventory
- score
- help
- say

#Features
What's available now

- Character Creation
    - name
    - password (plain text)
    - race selection
    - class selection
- 2 rooms for testing, no real thought in to world design yet
- look at items, look in containers
- examine items for more information
- drop items
- view inventory
- view your player sheet
- view helpfiles (Only one file at the moment and needs to be rewritten)

#Todo
I'll Update this as i remember also will add these in the issue tracker.

- put command for storing items in containers
- give command for giving items to players or npc
- all keyword to take all or drop all, etc
- World design
- starter Town Rooms
- shops
    - commands for buying, selling, inspecting items
- tick update HP, mana, mvs
- Fighting
- Spells
- Skills
- Quests
- Main story?

