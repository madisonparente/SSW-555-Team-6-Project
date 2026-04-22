const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: String,
  options: [String],
  correctIndex: Number,
  topics: [String],
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['inactive', 'active', 'finished'], default: 'inactive' },
  currentQuestionIndex: { type: Number, default: 0 },
  questions: [questionSchema],
});

quizSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.questions) {
      ret.questions = ret.questions.map(q => {
        q.id = q._id;
        delete q._id;
        return q;
      });
    }
    return ret;
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
