const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  teacher: String,
  meetLink: String,
  color: String,
  schedule: String,
  students: { type: Number, default: 0 },
  announcements: [{
    text: String,
  }],
  files: [{
    name: String,
    size: Number,
    type: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
});

courseSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.announcements) {
      ret.announcements = ret.announcements.map(a => ({
        id: a._id,
        text: a.text,
      }));
    }
    if (ret.files) {
      ret.files = ret.files.map(f => {
        const obj = { ...f };
        obj.id = obj._id;
        delete obj._id;
        return obj;
      });
    }
    return ret;
  },
});

module.exports = mongoose.model('Course', courseSchema);
