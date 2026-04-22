const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  courseName: { type: String, default: '' },
  courseCode: { type: String, default: '' },
  type: { type: String, enum: ['class', 'tutoring', 'deadline', 'office-hours', 'study', 'other'] },
  title: { type: String, required: true },
  date: String,
  startTime: String,
  endTime: String,
  dueTime: String,
  location: String,
  meetLink: String,
  dayOfWeek: String,
  instructor: String,
  description: String,
  attended: { type: Boolean, default: false },
});

eventSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Event', eventSchema);
