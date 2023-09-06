# Chess Server

This is the backend server for a React chess project.

## About

This server is written in Node and utilizes a postgres database.

## Deployment

https://chess-backend-pcpc.onrender.com

## Features

- User routes get, create, edit, and delete user data from database.
- Game routes get and post match data.
- Database consists of three tables: Users, Matches, and Moves

## Routes

- "users/register" method post
- "users/login" method post
- "users/leaderboard" method get
- "users/:username" method patch
- "users/:username" method delete
- "game/record" method post
- "game/replay/:matchId" get
- "game/matches/:username" get
- "game/win-loss/:username" get

## Installing

To run this server, first download all the files off of gitHub. Make sure you have Node, NPM, and postgres installed on your computer. In the ternimal, navigate to the chess-backend directory and install the dependencies using 'npm install' or 'npm i'. That should automatically install all the necessary dependencies.

To create the database and run the seed file, navigate to the chess-backend directory using the terminal if you are not already there. Use 'psql -U {your_username} -d postgres -a -f chess.sql' to run the file. It will prompt you to 'delete and create chess.db.' Type 'yes' and hit enter. The database and seed should now be created.

Next, create a .env file. Within this file you need several things.
 - NODE_ENV=development
 - DEVELOPMENT_DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/chess
 prxzgwvg
 - SECRET_KEY=secret-dev
This puts you in development, which allows you access to the database you just created. That is necessary for testing.

## Testing/Running

 - To run the server, in your termnial use 'npm start' within the chess-backend directory.
 - To test the server, in your terminal use 'npm test' within the chess-backend directory.
 - If you want to run a specific test, use 'npm test -- nameoftest' example: 'npm test -- users.test.js'