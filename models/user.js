"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
  static async register({ username, password, imageURL }) {
    const duplicateCheck = await db.query(
      `SELECT username
             FROM users
             WHERE username = $1`,
      [username]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const elo = 500;

    const result = await db.query(
      `INSERT INTO users
             (username,
              password,
              image_url,
              elo)
             VALUES ($1, $2, $3, $4)
             RETURNING username, image_url AS "imageURL", elo`,
      [username, hashedPassword, imageURL, elo]
    );

    const user = result.rows[0];

    return user;
  }

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username, password, image_url AS "imageURL", elo     
               FROM users
               WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
                  image_url AS "imageURL",
                  elo
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    return user;
  }

  static async leaderboard() {
    const result = await db.query(
      `SELECT username, elo FROM users ORDER BY elo DESC LIMIT 10`
    );
    const users = result.rows;
    if (!users) throw new NotFoundError(`No users`);
    return users;
  }

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      imageURL: "image_url",
      elo: "elo",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                image_url AS "imageURL",
                                elo`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  static async remove(username) {
    let res = await db.query(
      `SELECT id
          FROM matches
          WHERE username = $1`,
      [username]
    );
    const matchIds = res.rows;
    for (let matchId of matchIds) {
      await db.query(
        `DELETE
          FROM moves
          WHERE match_id = $1`,
        [matchId]
      );
    }
    for (let matchId of matchIds) {
      await db.query(
        `DELETE
          FROM matches
          WHERE id = $1`,
        [matchId]
      );
    }
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
