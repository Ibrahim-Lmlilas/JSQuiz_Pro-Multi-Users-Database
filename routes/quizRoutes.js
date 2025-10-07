const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { requireAdmin } = require("../middlewares/roleCheck");
const { auth } = require("../middlewares/auth");

// Public routes for users
router.get("/published", auth, quizController.getPublishedQuizzes);
router.get("/:id/take", auth, quizController.getQuizForTaking);
router.post("/submit", auth, quizController.submitQuizAttempt);
router.get("/attempts/:id", auth, quizController.getQuizAttempt);

// All other quiz routes require admin authentication
router.use(requireAdmin);

// Quiz routes
router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);
router.post("/", quizController.createQuiz);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.post("/:id/publish", quizController.publishQuiz);

// Question routes
router.post("/questions", quizController.addQuestion);
router.put("/questions/:id", quizController.updateQuestion);
router.delete("/questions/:id", quizController.deleteQuestion);

module.exports = router;
