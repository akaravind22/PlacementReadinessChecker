const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true } // Index of option 0,1,2,3
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
