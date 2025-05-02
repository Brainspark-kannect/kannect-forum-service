const {login } = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.route("/login").post(login);

module.exports = router;
