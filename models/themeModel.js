                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "📚",
      comment: "Emoji icon for the theme",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "purple",
      comment: "Tailwind color name (purple, blue, green, etc.)",
    },
  },
  {
    tableName: "themes",
    timestamps: true,
  }
);

module.exports = Theme;
