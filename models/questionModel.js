const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    question_type: {
      type: DataTypes.ENUM("single", "multiple"),
      defaultValue: "single",
      comment: "single = Multiple Choice (one answer), multiple = Multiple Choice (multiple answers)",
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: "Points awarded for correct answer",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Question display order",
    },
    // Answers stored as JSON array
    // Format: [{ text: "Answer 1", is_correct: true }, { text: "Answer 2", is_correct: false }]
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "questions",
    timestamps: true,
  }
);

module.exports = Question;
