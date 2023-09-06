const db = require("../db");
const Match = require("./match");

const testMatch = {
  username: "nadiia",
  result: "checkmate win",
  userColor: "white",
  elo: 2000,
  moves: ["e2e4", "e7e5"],
};

describe("test Match class", function () {
  beforeAll(async function () {
    await db.query(`DELETE FROM matches`);
  });
  test("updateUserElo", async function () {
    const user = await Match.updateUserElo(
      testMatch.username,
      testMatch.elo,
      testMatch.result
    );
    expect(user.elo).toBe(2025);
    await db.query(`UPDATE users SET elo = $1 WHERE username = $2`, [
      testMatch.elo,
      testMatch.username,
    ]);
  });
  test("insertMatch", async function () {
    const match = await Match.insertMatch(
      testMatch.username,
      testMatch.result,
      testMatch.userColor
    );
    expect(match.result).toBe("checkmate win");
    expect(match.user_color).toBe("white");
    await db.query(`DELETE FROM matches WHERE id = $1`, [match.id]);
  });
  test("insertMoves", async function () {
    const match = await db.query(
      `INSERT INTO matches
           (username,
            result,
            user_color)
           VALUES ($1, $2, $3)
           RETURNING id, result, user_color`,
      [testMatch.username, testMatch.result, testMatch.userColor]
    );
    await Match.insertMoves(match.rows[0].id, testMatch.moves);
    const moves = await db.query(`SELECT * FROM moves WHERE match_id = $1`, [
      match.rows[0].id,
    ]);
    expect(moves.rows.length).toBe(2);
    await db.query(`DELETE FROM matches WHERE id = $1`, [match.rows[0].id]);
  });
  test("Record", async function () {
    const user = await Match.record(
      testMatch.username,
      testMatch.result,
      testMatch.elo,
      testMatch.moves,
      testMatch.userColor
    );
    expect(user.username).toBe(testMatch.username);
    expect(user.elo).toBe(2025);
    await db.query(`DELETE FROM matches WHERE username = $1`, [user.username]);
  });
  test("getMatch", async function () {
    const result = await db.query(
      `INSERT INTO matches
             (username,
              result,
              user_color)
             VALUES ($1, $2, $3)
             RETURNING id, result, user_color`,
      [testMatch.username, testMatch.result, testMatch.userColor]
    );
    const match = await Match.getMatch(result.rows[0].id);
    expect(match.id).toBe(result.rows[0].id);
    expect(match.username).toBe(testMatch.username);
    expect(match.result).toBe(testMatch.result);
    expect(match.user_color).toBe(testMatch.userColor);
    await db.query(`DELETE FROM matches WHERE id = $1`, [result.rows[0].id]);
  });
  test("getMoves", async function () {
    const match = await db.query(
      `INSERT INTO matches
             (username,
              result,
              user_color)
             VALUES ($1, $2, $3)
             RETURNING id, result, user_color`,
      [testMatch.username, testMatch.result, testMatch.userColor]
    );
    let index = 1;
    for (move of testMatch.moves) {
      await db.query(
        `INSERT INTO moves
            (match_id,
                notation,
                move_order)
                VALUES ($1, $2, $3)`,
        [match.rows[0].id, move, index]
      );
      index++;
    }
    const moves = await Match.getMoves(match.rows[0].id);
    expect(moves.length).toBe(2);
    await db.query(`DELETE FROM matches WHERE id = $1`, [match.rows[0].id]);
  });
  test("Replay", async function () {
    const match = await db.query(
      `INSERT INTO matches
           (username,
            result,
            user_color)
           VALUES ($1, $2, $3)
           RETURNING id, result, user_color`,
      [testMatch.username, testMatch.result, testMatch.userColor]
    );
    let index = 1;
    for (move of testMatch.moves) {
      await db.query(
        `INSERT INTO moves
            (match_id,
                notation,
                move_order)
                VALUES ($1, $2, $3)`,
        [match.rows[0].id, move, index]
      );
      index++;
    }
    const replay = await Match.replay(match.rows[0].id);
    expect(replay.moves.length).toBe(2);
    await db.query(`DELETE FROM matches WHERE id = $1`, [match.rows[0].id]);
  });
  test("Matches", async function () {
    const match = await db.query(
      `INSERT INTO matches
               (username,
                result,
                user_color)
               VALUES ($1, $2, $3)
               RETURNING id, result, user_color`,
      [testMatch.username, testMatch.result, testMatch.userColor]
    );
    const matches = await Match.matches(testMatch.username);
    expect(matches.length).toBe(1);
    await db.query(`DELETE FROM matches WHERE id = $1`, [match.rows[0].id]);
  });
  test("winLoss", async function () {
    const match = await db.query(
      `INSERT INTO matches
                 (username,
                  result,
                  user_color)
                 VALUES ($1, $2, $3)
                 RETURNING id, result, user_color`,
      [testMatch.username, testMatch.result, testMatch.userColor]
    );
    const record = await Match.winLoss(testMatch.username);
    expect(record).toBe("1-0-0");
    await db.query(`DELETE FROM matches WHERE id = $1`, [match.rows[0].id]);
  });
  afterAll(async function () {
    await db.end();
  });
});
