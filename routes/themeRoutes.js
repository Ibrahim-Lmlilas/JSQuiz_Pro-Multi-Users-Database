const express = require("express");
const router = express.Router();
const themeController = require("../controllers/themeController");
const { requireAdmin } = require("../middlewares/roleCheck");

// All theme routes require admin authentication
router.use(requireAdmin);

// GET all themes
router.get("/", themeController.getAllThemes);

// POST create new theme
router.post("/", themeController.createTheme);

// PUT update theme
router.put("/:id", themeController.updateTheme);

// DELETE theme
router.delete("/:id", themeController.deleteTheme);

module.exports = router;
