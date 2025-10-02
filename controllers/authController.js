const { where } = require("sequelize");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function generateAccessToken(id, email) {
  return jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: "15m",
      algorithm: "HS256"
  });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    //   check if body is empty
    if (!name || !email || !password) {
      console.log("Please insert everything");
      return res.status(400).json({ message: "Please fill all fields" });
    }

    //   check if user already existed
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already existed" });
    }

    //   hashing password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //   create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //   get user role
    const userRole = await Role.findOne({
      where: { id: newUser.role_id },
    });

    return res.status(200).json({
      message: "User Created Successfuly",
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: userRole.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error while register");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    //   check if body is empty
    if (!email || !password) {
      console.log("Please insert everything");
      return res.status(400).json({ message: "Please fill all fields" });
    }

    //   check if user already existed
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({ message: "User not existed" });
    }
    const jwt = generateAccessToken(existingUser.id, email);
    res.cookie("jwtToken", jwt, { httpOnly: true, secure: true });
    return res.status(200).json({
      message: "Loged In Successfuly",
      token: jwt,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json("Error while Login");
  }
}

function logout(req, res) {
    res.clearCookie("jwtToken");
    res.redirect('/');
}
module.exports = { register, login, logout };
