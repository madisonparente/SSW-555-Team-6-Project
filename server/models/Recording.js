const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  date: String,
  duration: String,
  videoUrl: String,
  description: String,
  topics: [String],
});

recordingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Recording', recordingSchema);
