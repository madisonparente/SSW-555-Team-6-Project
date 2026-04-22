const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  studentId: Number,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  title: String,
  score: Number,
  total: Number,
  percentage: Number,
  responses: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

quizResultSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
