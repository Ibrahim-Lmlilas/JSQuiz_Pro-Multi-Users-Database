require('dotenv').config();
const express = require("express");
const User = require("./models/userModel");
const Role = require("./models/roleModel");
const { sequelize } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

// for testing
app.get("/", (req, res) => {
  console.log("Hello World");
  res.render("index", { user: "human" });
});

app.use(express.json());
// auth routes
app.use("/auth", authRoutes);

app.listen(port, async () => {
  try {
    await sequelize.sync();
      console.log("Database synced successfully!");
      
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
