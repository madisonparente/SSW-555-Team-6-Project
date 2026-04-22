const router = require('express').Router();
const ctrl = require('../controllers/quizzes');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.patch('/:id/launch', ctrl.launch);
router.patch('/:id/advance', ctrl.advance);
router.patch('/:id/end', ctrl.end);

module.exports = router;
