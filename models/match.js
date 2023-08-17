"use strict";

const db = require("../db");
const User = require("./user");
const updateElo = require("../helpers/elo");

class Match {
  static async record(username, result, elo, moves, userColor) {
    try {
      const user = await this.updateUserElo(username, elo, result);
      const match = await this.insertMatch(username, result, userColor);
      await this.insertMoves(match.id, moves);
      return user;
    } catch (error) {
      console.error("Match.record:", error.message);
    }
  }
  static async updateUserElo(username, elo, result) {
    try {
      const newElo = { elo: updateElo(elo, result) };
      return User.update(username, newElo);
    } catch (error) {
      console.error("Match.updateElo:", error.message);
    }
  }
  static async insertMatch(username, result, userColor) {
    try {
      const res = await db.query(
        `INSERT INTO matches
           (username,
            result,
            user_color)
           VALUES ($1, $2, $3)
           RETURNING id, result, user_color`,
        [username, result, userColor]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Match.insertMatch:", error.message);
    }
  }
  static async insertMoves(matchId, moves) {
    try {
      for (let move of moves) {
        await db.query(
          `INSERT INTO moves
             (match_id,
              notation,
              move_order)
             VALUES ($1, $2, $3)`,
          [matchId, move, moves.indexOf(move) + 1]
        );
      }
    } catch (error) {
      console.error("Match.insertMoves:", error.message);
    }
  }
  static async replay(matchId) {
      const moves = await this.getMoves(matchId);
      const match = await this.getMatch(matchId);
      match.moves = moves;
      return match;
  }
  static async getMoves(matchId) {
    try {
      const moves = await db.query(
        `SELECT notation
            FROM moves
            WHERE match_id = $1
            ORDER BY move_order`,
        [matchId]
      );
      return moves.rows;
    } catch (error) {
      console.error("Match.replay:", error.message);
    }
  }
  static async matches(username) {
    try {
      const result = await db.query(
        `SELECT *
            FROM matches
            WHERE username = $1`,
        [username]
      );
      return result.rows;
    } catch (error) {
      console.error("Match.matches:", error.message);
    }
  }
  static async getMatch(matchId) {
    try {
      const result = await db.query(
        `SELECT *
            FROM matches
            WHERE id = $1`,
        [matchId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Match.matches:", error.message);
    }
  }
  static async winLoss(username) {
    const matches = await this.matches(username);
    let win = 0;
    let loss = 0;
    let tie = 0;
    for(let match of matches) {
      const [condition, result] = match.result.split(" ");
      if(condition === "draw") {
        tie++;
      } else if(result === "win") {
        win++;
      } else {
        loss++;
      }
    }
    return win.toString() + "-" + loss.toString() + "-" + tie.toString();
  }
}

module.exports = Match;
