const QuizResult = require('../models/QuizResult');

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.studentId = Number(req.query.studentId);
    if (req.query.quizId) filter.quizId = req.query.quizId;
    const results = await QuizResult.find(filter);
    res.json(results);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const result = await QuizResult.create(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};
