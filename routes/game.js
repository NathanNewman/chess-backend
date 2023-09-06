"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const Match = require("../models/match");
const { ensureLoggedIn } = require("../middleware/auth");
const gameRecordSchema = require("../schemas/gameRecord.json");

const router = express.Router();

router.post("/record", ensureLoggedIn, async function (req, res, next) {
  const { username, result, elo, moves, userColor } = req.body;
  console.log(req.body);
  try {
    const validator = jsonschema.validate(req.body, gameRecordSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await Match.record(username, result, parseInt(elo), moves, userColor);
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
});

router.get("/replay/:matchId", ensureLoggedIn, async function (req, res, next) {
  const { matchId } = req.params;

  try {
    const match = await Match.replay(matchId);
    return res.status(200).json({ match });
  } catch (error) {
    return next(error);
  }
});

router.get("/matches/:username", ensureLoggedIn, async function(req, res, next) {
  const { username } = req.params;

  try {
    const matches = await Match.matches(username);
    return res.status(200).json({ matches });
  } catch (error) {
    return next(error);
  }
});

router.get("/win-loss/:username", ensureLoggedIn, async function(req, res, next) {
  const { username } = req.params;

  try {
    const result = await Match.winLoss(username);
    return res.status(200).json({ result });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;