require('dotenv').config();
const express = require("express");
const { sequelize } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const themeRoutes = require("./routes/themeRoutes");
const quizRoutes = require("./routes/quizRoutes");
const auth = require("./middlewares/auth");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = 3000;

const cookieParser = require("cookie-parser");
const User = require("./models/userModel");
const { requireAdmin, requireUser } = require("./middlewares/roleCheck");
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home page
app.get("/", async(req, res)  => {
  const user = await auth.getUser(req);
  
  if (!user) {
    return res.render("index", { userName: "Guest" });
  }
  
  const userRecord = await User.findOne({ where: { id: user.id } });
  const userName = userRecord ? userRecord.name : "Guest";
  res.render("index", { userName: userName});
  
});

// register and login page
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// about page
app.get("/about", (req, res) => {
  res.render("about");
});

// Dashboard routes with role protection
app.get("/user/dashboard", requireUser, async (req, res) => {
  res.render("user/dashboard");
});

app.get("/user/quizzes", requireUser, async (req, res) => {
  res.render("user/quizzes");
});

app.get("/user/quiz/take", requireUser, async (req, res) => {
  res.render("user/takeQuiz");
});

app.get("/user/quiz/results", requireUser, async (req, res) => {
  res.render("user/quizResults");
});

app.get("/admin/dashboard", requireAdmin, async (req, res) => {
  res.render("admin/dashboard");
});

app.get("/admin/students", requireAdmin, async (req, res) => {
  res.render("admin/students");
});

app.get("/admin/quizzes", requireAdmin, async (req, res) => {
  res.render("admin/quizzes");
});

app.get("/admin/quiz/create", requireAdmin, async (req, res) => {
  res.render("admin/createQuiz");
});

app.get("/admin/settings", requireAdmin, async (req, res) => {
  res.render("admin/settings");
});

// auth routes
app.use("/auth", authRoutes);
app.use("/users", auth.auth, userRoutes);
app.use("/api/users", userRoutes); // Add API route for users
app.use("/api/themes", themeRoutes);
app.use("/api/quizzes", quizRoutes);

app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
