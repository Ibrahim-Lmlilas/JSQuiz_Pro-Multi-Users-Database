const Theme = require("../models/themeModel");

// Get all themes
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      themes,
    });
  } catch (error) {
    console.error("Error fetching themes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching themes",
      error: error.message,
    });
  }
};

// Create new theme
exports.createTheme = async (req, res) => {
  try {
    const { name, icon, description, color } = req.body;

    // Validation
    if (!name || !icon) {
      return res.status(400).json({
        success: false,
        message: "Name and icon are required",
      });
    }

    // Check if theme already exists
    const existingTheme = await Theme.findOne({ where: { name } });
    if (existingTheme) {
      return res.status(400).json({
        success: false,
        message: "Theme with this name already exists",
      });
    }

    const theme = await Theme.create({
      name,
      icon,
      description: description || "",
      color: color || "purple",
    });

    res.status(201).json({
      success: true,
      message: "Theme created successfully",
      theme,
    });
  } catch (error) {
    console.error("Error creating theme:", error);
    res.status(500).json({
      success: false,
      message: "Error creating theme",
      error: error.message,
    });
  }
};

// Update theme
exports.updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, color } = req.body;

    const theme = await Theme.findByPk(id);
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Theme not found",
      });
    }

    // Check if new name already exists (excluding current theme)
    if (name && name !== theme.name) {
      const existingTheme = await Theme.findOne({ where: { name } });
      if (existingTheme) {
        return res.status(400).json({
          success: false,
          message: "Theme with this name already exists",
        });
      }
    }

    // Update theme
    await theme.update({
      name: name || theme.name,
      icon: icon || theme.icon,
      description: description !== undefined ? description : theme.description,
      color: color || theme.color,
    });

    res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      theme,
    });
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).json({
      success: false,
      message: "Error updating theme",
      error: error.message,
    });
  }
};

// Delete theme
exports.deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;

    const theme = await Theme.findByPk(id);
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Theme not found",
      });
    }

    await theme.destroy();

    res.status(200).json({
      success: true,
      message: "Theme deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting theme:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting theme",
      error: error.message,
    });
  }
};
