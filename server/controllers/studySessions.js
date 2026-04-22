const StudySession = require('../models/StudySession');

exports.getAll = async (req, res, next) => {
  try {
    const sessions = await StudySession.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const session = await StudySession.create(req.body);
    res.status(201).json(session);
  } catch (err) { next(err); }
};
