const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const request = require("supertest");
const app = require("../app");

let authToken;

describe("User routes", function () {
  beforeEach(async function () {
    const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);
    const user = await db.query(
      `INSERT INTO users(username, password, elo) 
          VALUES ('testUser', $1, 500) 
          RETURNING username, password, elo`,
      [hashedPassword]
    );
  });
  afterEach(async function () {
    await db.query(`DELETE FROM users WHERE username = 'testUser'`);
  });
  test("/users/register", async function () {
    const response = await request(app).post("/users/register").send({
      username: "testUser2",
      password: "password",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.user.username).toBe("testUser2");
    expect(response.body.user.elo).toBe(500);
    await db.query(`DELETE FROM users WHERE username = $1`, [
      response.body.user.username,
    ]);
  });
  test("/users/login", async function () {
    const response = await request(app).post("/users/login").send({
      username: "testUser",
      password: "password",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.user.username).toBe("testUser");
    expect(response.body.user.elo).toBe(500);
    expect(typeof response.body.token).toBe("string");
    if (response.body.token) authToken = response.body.token;
  });
  test("/users/leaderboard", async function () {
    const response = await request(app).get("/users/leaderboard");
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(10);
  });
  test("/users/:username GET", async function () {
    const username = "testUser";
    const response = await request(app)
      .get(`/users/${username}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.user.username).toBe("testUser");
    expect(response.body.user.elo).toBe(500);
  });
  test("/users/:username PATCH", async function () {
    const username = "testUser";
    const response = await request(app)
      .patch(`/users/${username}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ username: "testUser", password: "password", elo: 600 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user.username).toBe("testUser");
    expect(response.body.user.elo).toBe(600);
  });
  test("/users/:username DELETE", async function () {
    const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);
    const user = await db.query(
      `INSERT INTO users(username, password, elo) 
          VALUES ('testUser2', $1, 500) 
          RETURNING username, password, elo`,
      [hashedPassword]
    );
    const response = await request(app)
      .delete(`/users/${user.rows[0].username}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.deleted).toBe("testUser2");
  });
  afterAll(async function () {
    await db.end();
  });
});
