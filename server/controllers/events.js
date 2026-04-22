const Event = require('../models/Event');

exports.getAll = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ id: req.params.id });
  } catch (err) { next(err); }
};
