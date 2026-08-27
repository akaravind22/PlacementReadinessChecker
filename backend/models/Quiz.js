const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Technical', 'Aptitude', 'Core CS', 'Verbal'], default: 'Technical' },
  totalMarks: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
