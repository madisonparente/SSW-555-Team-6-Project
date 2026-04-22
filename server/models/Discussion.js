const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  body: String,
  author: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
});

const discussionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: String,
  body: String,
  author: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
});

discussionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.replies) {
      ret.replies = ret.replies.map(r => {
        r.id = r._id;
        delete r._id;
        return r;
      });
    }
    return ret;
  },
});

module.exports = mongoose.model('Discussion', discussionSchema);
