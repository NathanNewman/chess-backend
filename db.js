"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri()
    // connectionString: process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/chess'
    // database:'chess', host:'localhost', port:5432, password:'Valvenis'
  });
}
db.connect();

module.exports = db;
