const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, default: 0 },
  correctAnswersCount: { type: Number, default: 0 },
  attemptDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
