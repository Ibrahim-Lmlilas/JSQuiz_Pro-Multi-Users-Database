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
app.set("view engine", "ejs");

// for testing
app.get("/", (req, res) => {
  console.log("Hello World");
  res.render("index", { user: "human" });
});

app.use(cookieParser());
app.use(express.json());
// auth routes
app.use("/auth", authRoutes);
app.use("/users", auth, userRoutes);

app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
