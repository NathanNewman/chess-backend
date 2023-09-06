function updateElo(elo, result) {
  if (result === "draw") return elo;
  if (result === "checkmate win") {
    if (elo < 1000) {
      return elo + 100;
    } else if (elo < 2000) {
      return elo + 50;
    } else {
      return elo + 25;
    }
  }
  if (result === "checkmate loss") {
    if (elo === 0) {
      return 0;
    } else if (elo < 1000) {
      return elo - 100;
    } else if (elo < 2000) {
      return elo - 50;
    } else {
      return elo - 25;
    }
  }
  if (result === "stalemate win") {
    if (elo < 1000) {
      return elo + 100;
    } else if (elo < 2000) {
      return elo + 50;
    } else {
      return elo + 25;
    }
  }
  if (result === "stalemate loss") {
    if (elo < 1000) {
      return elo - 100;
    } else if (elo < 2000) {
      return elo - 50;
    } else {
      return elo - 25;
    }
  }
}

module.exports = updateElo;
