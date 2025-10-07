const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");
const Theme = require("../models/themeModel");
const QuizAttempt = require("../models/quizAttemptModel");

// Get published quizzes for regular users
exports.getPublishedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { status: "published" },
      include: [
        {
          model: Theme,
          as: "theme",
          attributes: ["id", "name", "icon", "color"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Get question count for each quiz
    const quizzesWithCount = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await Question.count({
          where: { quiz_id: quiz.id },
        });

        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          theme: quiz.theme,
          time_limit: quiz.time_limit,
          passing_score: quiz.passing_score,
          question_count: questionCount,
          createdAt: quiz.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      quizzes: quizzesWithCount,
    });
  } catch (error) {
    console.error("Error fetching published quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching published quizzes",
      error: error.message,
    });
  }
};

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

// Get quiz with questions for taking
exports.getQuizForTaking = async (req, res) => {
  try {
    const { id } = req.params;

    // Get quiz details
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

    // Check if quiz is published
    if (quiz.status !== "published") {
      return res.status(403).json({
        success: false,
        message: "This quiz is not available",
      });
    }

    // Get questions with answers
    const questions = await Question.findAll({
      where: { quiz_id: id },
      order: [["order", "ASC"]],
      attributes: ["id", "question_text", "question_type", "points", "order", "answers"],
    });

    // Randomize questions if enabled
    if (quiz.randomize_questions) {
      questions.sort(() => Math.random() - 0.5);
    }

    res.status(200).json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        theme: quiz.theme,
        time_limit: quiz.time_limit,
        passing_score: quiz.passing_score,
        immediate_results: quiz.immediate_results,
      },
      questions: questions,
    });
  } catch (error) {
    console.error("Error fetching quiz for taking:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching quiz",
      error: error.message,
    });
  }
};

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quiz_id, answers, time_taken } = req.body;
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    
    const user_id = req.user.id;

    // Get quiz and questions
    const quiz = await Quiz.findByPk(quiz_id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const questions = await Question.findAll({
      where: { quiz_id },
      attributes: ["id", "question_text", "points", "answers"],
    });

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    const processedAnswers = {};

    questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id] || [];
      const correctIndices = [];
      
      // Find correct answers
      question.answers.forEach((answer, idx) => {
        if (answer.is_correct) {
          correctIndices.push(idx);
        }
      });

      // Check if user's answer is correct
      const isCorrect = 
        userAnswer.length === correctIndices.length &&
        userAnswer.every((idx) => correctIndices.includes(idx));

      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }

      processedAnswers[question.id] = {
        selected: userAnswer,
        correct: correctIndices,
        isCorrect: isCorrect,
        points: isCorrect ? question.points : 0,
      };
    });

    // Calculate percentage score
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    // Create quiz attempt record
    const attempt = await QuizAttempt.create({
      user_id,
      quiz_id,
      score: score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      time_taken,
      status: "completed",
      started_at: new Date(Date.now() - time_taken * 1000),
      completed_at: new Date(),
      answers: processedAnswers,
    });

    // Update quiz completion count
    await quiz.update({
      total_completions: quiz.total_completions + 1,
    });

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      attemptId: attempt.id,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: questions.length,
      passed: score >= quiz.passing_score,
    });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting quiz",
      error: error.message,
    });
  }
};

// Get quiz attempt results
exports.getQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const attempt = await QuizAttempt.findOne({
      where: { id, user_id },
      include: [
        {
          model: Quiz,
          as: "quiz",
          attributes: ["id", "title", "description", "passing_score"],
          include: [
            {
              model: Theme,
              as: "theme",
              attributes: ["id", "name", "icon", "color"],
            },
          ],
        },
      ],
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found",
      });
    }

    res.status(200).json({
      success: true,
      attempt: attempt,
    });
  } catch (error) {
    console.error("Error fetching quiz attempt:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching quiz attempt",
      error: error.message,
    });
  }
};
