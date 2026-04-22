const Recording = require('../models/Recording');

exports.getAll = async (req, res, next) => {
  try {
    const recordings = await Recording.find();
    res.json(recordings);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const recording = await Recording.create(req.body);
    res.status(201).json(recording);
  } catch (err) { next(err); }
};
