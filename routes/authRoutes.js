const express = require("express");
const router = express.Router();
const { registerController, loginController, logoutController } = require("../controllers/authController");
// const { login } = require("../views/login");
// const { register } = require("../views/register");



router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);


module.exports = router;