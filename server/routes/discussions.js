const router = require('express').Router();
const ctrl = require('../controllers/discussions');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.post('/:threadId/replies', ctrl.addReply);

module.exports = router;
