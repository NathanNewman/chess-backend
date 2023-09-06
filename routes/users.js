"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { ensureLoggedIn } = require("../middleware/auth");
const { createToken } = require("../helpers/tokens");
const userRegisterSchema = require("../schemas/userRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const userLoginSchema = require("../schemas/userLogin.json");

const router = express.Router();

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userLoginSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.authenticate(req.body.username, req.body.password);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    console.log(req.body);
    return next(err);
  }
});

router.get("/leaderboard", async function (req, res, next) {
  try {
    const users = await User.leaderboard();
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
