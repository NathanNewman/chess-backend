const db = require("../db");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const app = require("../app");
const { createToken } = require("../helpers/tokens");

const user = { username: "testUser" };
const authToken = createToken(user);
let testMatch;

describe("Game Routes", function () {
  beforeEach(async function () {
    const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);
    await db.query(
      `INSERT INTO users (username, password, elo) VALUES ($1, $2, $3)`,
      ["testUser", hashedPassword, 500]
    );

    const match = await db.query(
      `INSERT INTO matches (username, result, user_color) VALUES ($1, $2, $3) RETURNING id, username, result, user_color`,
      ["testUser", "checkmate win", "white"]
    );
    testMatch = match.rows[0];
    const moves = ["e2e4", "e7e5"];
    let index = 1;
    for (let move of moves) {
      await db.query(
        `INSERT INTO moves (match_id, notation, move_order) VALUES ($1, $2, $3)`,
        [match.rows[0].id, move, index]
      );
    }
  });
  afterEach(async function () {
    await db.query(`DELETE FROM users WHERE username = 'testUser'`);
  });
  test("/game/record POST", async function () {
    const response = await request(app)
      .post("/game/record")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        username: "testUser",
        result: "checkmate loss",
        elo: "500",
        moves: ["c7c5", "c2c4"],
        userColor: "black",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.user.username).toBe("testUser");
    expect(response.body.user.elo).toBe(400);
    await db.query(`DELETE FROM users WHERE username = $1`, [
      response.body.user.username,
    ]);
  });
  test("/game/replay/:matchId GET", async function () {
    const response = await request(app)
      .get(`/game/replay/${testMatch.id}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.match.username).toBe("testUser");
    expect(response.body.match.result).toBe("checkmate win");
    expect(response.body.match.user_color).toBe("white");
  });
  test("/game/matches/:username GET", async function () {
    const response = await request(app)
      .get(`/game/matches/testUser`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.matches.length).toBe(1);
    expect(response.body.matches[0].username).toBe("testUser");
    expect(response.body.matches[0].user_color).toBe("white");
  });
  test("/game/win-loss/:username", async function () {
    const response = await request(app)
      .get(`/game/win-loss/testUser`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe("1-0-0");
  });
  afterAll(async function () {
    await db.query(`DELETE FROM users WHERE username = 'testUser'`);
    await db.end();
  });
});
