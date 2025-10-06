const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Theme = require("./themeModel");

const Quiz = sequelize.define(
  "Quiz",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    theme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "themes",
        key: "id",
      },
    },
    time_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 15,
      comment: "Time limit in minutes",
    },
    passing_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 70,
      comment: "Passing score percentage",
    },
    randomize_questions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Randomize question order",
    },
    immediate_results: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Show results immediately after completion",
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "draft",
    },
    total_questions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_completions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "quizzes",
    timestamps: true,
  }
);

// Associations
Quiz.belongsTo(Theme, { foreignKey: "theme_id", as: "theme" });

module.exports = Quiz;
