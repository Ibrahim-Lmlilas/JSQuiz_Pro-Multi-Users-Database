const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./userModel");
const Quiz = require("./quizModel");

const QuizAttempt = sequelize.define(
  "QuizAttempt",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "quizzes",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "Final score percentage (0-100)",
    },
    total_questions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    correct_answers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    time_taken: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Time taken in seconds",
    },
    status: {
      type: DataTypes.ENUM("in_progress", "completed", "abandoned"),
      defaultValue: "in_progress",
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Store user's answers as JSON
    // Format: { questionId: { selected: [answerIndex], isCorrect: boolean, points: number } }
    answers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    tableName: "quiz_attempts",
    timestamps: true,
  }
);

// Associations
QuizAttempt.belongsTo(User, { foreignKey: "user_id", as: "user" });
QuizAttempt.belongsTo(Quiz, { foreignKey: "quiz_id", as: "quiz" });

module.exports = QuizAttempt;
