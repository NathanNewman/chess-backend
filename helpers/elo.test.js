const updateElo = require("../helpers/elo");

describe("helpers/elo", function () {
  test("Checkmate Win! 400", function () {
    const elo = updateElo(400, "checkmate win");
    expect(elo).toBe(500);
  });
  test("Checkmate Win! 1000", function () {
    const elo = updateElo(1000, "checkmate win");
    expect(elo).toBe(1050);
  });
  test("Checkmate Win! 2000", function () {
    const elo = updateElo(2000, "checkmate win");
    expect(elo).toBe(2025);
  });
  test("Checkmate Loss! 400", function () {
    const elo = updateElo(400, "checkmate loss");
    expect(elo).toBe(300);
  });
  test("Checkmate Loss! 1000", function () {
    const elo = updateElo(1000, "checkmate loss");
    expect(elo).toBe(950);
  });
  test("Checkmate Loss! 2000", function () {
    const elo = updateElo(2000, "checkmate loss");
    expect(elo).toBe(1975);
  });
  test("Stalemate Win! 400", function () {
    const elo = updateElo(400, "stalemate win");
    expect(elo).toBe(500);
  });
  test("Stalemate Win! 1000", function () {
    const elo = updateElo(1000, "stalemate win");
    expect(elo).toBe(1050);
  });
  test("Stalemate win! 2000", function () {
    const elo = updateElo(2000, "stalemate win");
    expect(elo).toBe(2025);
  });
  test("Stalemate Loss! 400", function () {
    const elo = updateElo(400, "stalemate loss");
    expect(elo).toBe(300);
  });
  test("Stalemate Loss! 1000", function () {
    const elo = updateElo(1000, "stalemate loss");
    expect(elo).toBe(950);
  });
  test("Stalemate Loss! 2000", function () {
    const elo = updateElo(2000, "stalemate loss");
    expect(elo).toBe(1975);
  });
  test("Draw! 500", function () {
    const elo = updateElo(500, "draw");
    expect(elo).toBe(500);
  });
});
