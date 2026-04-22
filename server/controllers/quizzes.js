const Quiz = require('../models/Quiz');

exports.getAll = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) { next(err); }
};

exports.launch = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { status: 'active', currentQuestionIndex: 0 },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) { next(err); }
};

exports.advance = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    quiz.currentQuestionIndex += 1;
    await quiz.save();
    res.json(quiz);
  } catch (err) { next(err); }
};

exports.end = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { status: 'finished' },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) { next(err); }
};
