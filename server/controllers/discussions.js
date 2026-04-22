const Discussion = require('../models/Discussion');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const discussions = await Discussion.find(filter).sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const discussion = await Discussion.create(req.body);
    res.status(201).json(discussion);
  } catch (err) { next(err); }
};

exports.addReply = async (req, res, next) => {
  try {
    const thread = await Discussion.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    thread.replies.push(req.body);
    await thread.save();
    res.status(201).json(thread);
  } catch (err) { next(err); }
};
