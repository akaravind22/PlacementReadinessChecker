const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');
const { calculateReadinessScore } = require('../utils/scoreCalculator');

// Get Quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    // Also include question count for each quiz
    const quizList = await Promise.all(quizzes.map(async (q) => {
      const count = await Question.countDocuments({ quizId: q._id });
      return {
        ...q.toObject(),
        questionCount: count
      };
    }));
    res.json({ success: true, quizzes: quizList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, category, totalMarks } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Quiz title is required.' });

    const quiz = await Quiz.create({
      title,
      category: category || 'Technical',
      totalMarks: totalMarks ? parseInt(totalMarks, 10) : 100
    });
    res.status(201).json({ success: true, message: 'Quiz created.', quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ quizId: req.params.id });
    res.json({ success: true, message: 'Quiz deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Question to Quiz
exports.addQuestion = async (req, res) => {
  try {
    const { quizId, question, options, correctAnswer } = req.body;
    if (!quizId || !question || !options || options.length < 2 || correctAnswer === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide quizId, question, options array (min 2), and correctAnswer index.' });
    }

    const q = await Question.create({
      quizId,
      question,
      options,
      correctAnswer: parseInt(correctAnswer, 10)
    });
    res.status(201).json({ success: true, message: 'Question added.', question: q });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Start Quiz (Gets questions without revealing correct answers)
exports.startQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

    const existingResult = await QuizResult.exists({ studentId: req.user.id, quizId: req.params.id });
    if (existingResult) {
      return res.status(409).json({ success: false, message: 'You have already completed this assessment.' });
    }

    const questions = await Question.find({ quizId: req.params.id }).select('-correctAnswer');
    res.json({
      success: true,
      quiz,
      questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedOption }
    const quizId = req.params.id;
    const studentId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

    const existingResult = await QuizResult.exists({ studentId, quizId });
    if (existingResult) {
      return res.status(409).json({ success: false, message: 'You have already completed this assessment.' });
    }

    const questions = await Question.find({ quizId });
    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Quiz contains no questions.' });
    }

    let correctCount = 0;
    const answersMap = {};
    if (Array.isArray(answers)) {
      answers.forEach(a => {
        answersMap[a.questionId] = parseInt(a.selectedOption, 10);
      });
    }

    questions.forEach(q => {
      if (answersMap[q._id.toString()] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const result = await QuizResult.create({
      studentId,
      quizId,
      score: scorePercentage,
      totalQuestions: questions.length,
      correctAnswersCount: correctCount,
      attemptDate: new Date()
    });

    // Recalculate Student Readiness Score
    await calculateReadinessScore(studentId);

    res.json({
      success: true,
      message: 'Quiz submitted successfully.',
      result: {
        scorePercentage,
        correctAnswersCount: correctCount,
        totalQuestions: questions.length,
        attemptDate: result.attemptDate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Quiz Results for logged-in Student
exports.getStudentResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ studentId: req.user.id })
      .populate('quizId', 'title category totalMarks')
      .sort({ createdAt: -1 });
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
