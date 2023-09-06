"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "";

const PORT = +process.env.PORT || 3001;
const URL = 'postgres://prxzgwvg:fy5DAec4J-pMOQRwh5jzsJDeMjxMgECK@bubble.db.elephantsql.com/prxzgwvg';

// Use dev database, testing database, or via env var, production database
// function getDatabaseUri() {
//   return (process.env.NODE_ENV === "production")
//       ? DATABASE_URL
//       : URL
// }

function getDatabaseUri() {
  return (process.env.NODE_ENV === "production")
    ? process.env.PRODUCTION_DATABASE_URL
    : process.env.DEVELOPMENT_DATABASE_URL
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Chess Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
