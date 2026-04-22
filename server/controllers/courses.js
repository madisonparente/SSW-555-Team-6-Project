const Course = require('../models/Course');

exports.getAll = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) { next(err); }
};

exports.addAnnouncement = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    course.announcements.unshift({ text: req.body.text });
    await course.save();
    res.status(201).json(course);
  } catch (err) { next(err); }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    course.announcements = course.announcements.filter(
      a => a._id.toString() !== req.params.annId
    );
    await course.save();
    res.json(course);
  } catch (err) { next(err); }
};

exports.addFiles = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    course.files.push(...req.body.files);
    await course.save();
    res.status(201).json(course);
  } catch (err) { next(err); }
};
