const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  topic: String,
  description: String,
  maxParticipants: Number,
  link: String,
  host: String,
  createdAt: { type: Date, default: Date.now },
});

studySessionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('StudySession', studySessionSchema);
