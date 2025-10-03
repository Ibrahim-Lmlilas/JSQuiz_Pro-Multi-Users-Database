const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/", (req, res) => {
    const users = User.findAll();
    return res.status(200).json({ "users": users });
});

module.exports = router;