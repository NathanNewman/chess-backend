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
