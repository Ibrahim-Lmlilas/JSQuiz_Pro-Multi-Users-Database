const express = require("express");
const { sequelize } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const auth = require("./middlewares/auth");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = 3000;

const cookieParser = require("cookie-parser");
const User = require("./models/userModel");
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home page
app.get("/", async(req, res)  => {
  const user = await auth.getUser(req);
  const userRecord = await User.findOne({ where: user.id });
  const userName = userRecord.name;
  res.render("index", { userName: userName});
  
});

// register and login page
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// auth routes
app.use("/auth", authRoutes);
app.use("/users", auth.auth, userRoutes);

app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
