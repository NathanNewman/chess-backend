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
  static async register({ username, password }) {
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
              elo)
             VALUES ($1, $2, $3)
             RETURNING username, elo`,
      [username, hashedPassword, elo]
    );

    const user = result.rows[0];

    return user;
  }

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username, password, elo     
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
      `SELECT username, elo
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
      elo: "elo",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                elo`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  static async remove(username) {
    try {
      const result = await db.query(
        `DELETE FROM users WHERE username = $1 RETURNING username`,
        [username]
      );
  
      const deletedUser = result.rows[0];
      if (!deletedUser) {
        throw new NotFoundError(`No user: ${username}`);
      }
  
      return deletedUser.username;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

module.exports = User;
