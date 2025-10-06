const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");
const Theme = require("../models/themeModel");

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Theme,
          as: "theme",
          attributes: ["id", "name", "icon", "color"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching quizzes",
      error: error.message,
    });
  }
};

// Get single quiz with questions
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id, {
      include: [
        {
          model: Theme,
          as: "theme",
          attributes: ["id", "name", "icon", "color"],
        },
      ],
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Get questions for this quiz
    const questions = await Question.findAll({
      where: { quiz_id: id },
      order: [["order", "ASC"]],
    });

    res.status(200).json({
      success: true,
      quiz,
      questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching quiz",
      error: error.message,
    });
  }
};

// Create new quiz
exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      theme_id,
      time_limit,
      passing_score,
      randomize_questions,
      immediate_results,
    } = req.body;

    // Validation
    if (!title || !theme_id) {
      return res.status(400).json({
        success: false,
        message: "Title and theme are required",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      theme_id,
      time_limit: time_limit || 15,
      passing_score: passing_score || 70,
      randomize_questions: randomize_questions || false,
      immediate_results: immediate_results !== undefined ? immediate_results : true,
      status: "draft",
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({
      success: false,
      message: "Error creating quiz",
      error: error.message,
    });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    await quiz.update(updateData);

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({
      success: false,
      message: "Error updating quiz",
      error: error.message,
    });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    await quiz.destroy();

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting quiz",
      error: error.message,
    });
  }
};

// Add question to quiz
exports.addQuestion = async (req, res) => {
  try {
    const { quiz_id, question_text, question_type, points, answers, order } = req.body;

    // Validation
    if (!quiz_id || !question_text || !answers || answers.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID, question text, and at least 2 answers are required",
      });
    }

    // Check if quiz exists
    const quiz = await Quiz.findByPk(quiz_id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const question = await Question.create({
      quiz_id,
      question_text,
      question_type: question_type || "single",
      points: points || 10,
      order: order || 0,
      answers,
    });

    // Update total questions count
    await quiz.update({
      total_questions: quiz.total_questions + 1,
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      question,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({
      success: false,
      message: "Error adding question",
      error: error.message,
    });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await question.update(updateData);

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Error updating question",
      error: error.message,
    });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const quiz_id = question.quiz_id;
    await question.destroy();

    // Update total questions count
    const quiz = await Quiz.findByPk(quiz_id);
    if (quiz) {
      await quiz.update({
        total_questions: Math.max(0, quiz.total_questions - 1),
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
};

// Publish quiz
exports.publishQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if quiz has questions
    if (quiz.total_questions === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot publish quiz without questions",
      });
    }

    await quiz.update({ status: "published" });

    res.status(200).json({
      success: true,
      message: "Quiz published successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error publishing quiz:", error);
    res.status(500).json({
      success: false,
      message: "Error publishing quiz",
      error: error.message,
    });
  }
};
