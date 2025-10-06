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

async function registerController(req, res) {
  try {
    
    const { name, email, password } = req.body;

    //   check if body is empty
    if (!name || !email || !password) {
      console.log("Please insert everything");
      return res.status(400).send("Please fill all fields");
    }

    //   check if user already existed
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    //   hashing password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //   check if this is the first user (make them admin)
    const userCount = await User.count();
    const role_id = userCount === 0 ? 2 : 1; // 2 = admin, 1 = user

    //   create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id: role_id,
    });

    console.log(`User created with role_id: ${role_id} (${role_id === 2 ? 'admin' : 'user'})`);

    //   redirect to login page after successful registration
    return res.redirect('/login');
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error while registering");
  }
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    //   check if body is empty
    if (!email || !password) {
      console.log("Please insert everything");
      return res.status(400).send("Please fill all fields");
    }

    //   check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(400).send("Email or password incorrect");
    }

    //   check password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).send("Email or password incorrect");
    }

    //   generate token
    const token = generateAccessToken(existingUser.id, email);
    res.cookie("jwtToken", token, { httpOnly: true, secure: false }); // secure: false for development
    
    //   redirect based on user role
    if (existingUser.role_id === 2) {
      // Admin user
      return res.redirect('/admin/dashboard');
    } else {
      // Regular user
      return res.redirect('/user/dashboard');
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send("Error while Login");
  }
}

function logoutController(req, res) {
    res.clearCookie("jwtToken");
    res.redirect('/');
}
module.exports = { registerController, loginController, logoutController };
