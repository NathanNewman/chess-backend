const db = require("../db");
const User = require("./user");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

describe("Test User class", function () {
  beforeEach(async function () {
    const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);
    await db.query(
      `INSERT INTO users(username, password, elo) 
      VALUES ('testUser', $1, 500) 
      RETURNING username, elo`,
      [hashedPassword]
    );
  });
  afterEach(async function () {
    await db.query(`DELETE FROM users WHERE username = 'testUser'`);
  });
  test("register", async function () {
    let user = await User.register({
      username: "testUser2",
      password: "password",
    });
    expect(user.username).toBe("testUser2");
    expect(user.elo).toBe(500);
    await db.query(`DELETE FROM users WHERE username = 'testUser2'`);
  });
  test("login", async function () {
    let user = await User.authenticate("testUser", "password");
    expect(user.username).toBe("testUser");
  });
  test("get user by username", async function () {
    let user = await User.get("testUser");
    expect(user.username).toBe("testUser");
  });
  test("get leaderboard", async function () {
    let users = await User.leaderboard();
    expect(users.length).toBe(10);
  });
  test("update user", async function () {
    let user = await User.update("testUser", {
      username: "testUser",
      password: "password",
      elo: 600,
    });
    expect(user.elo).toBe(600);
  });
  test("delete user", async function () {
    let user = await User.remove("testUser");
    expect(user).toBe("testUser");
  });
  afterAll(async function () {
    await db.end();
  });
});
