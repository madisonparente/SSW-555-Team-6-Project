const router = require('express').Router();
const ctrl = require('../controllers/courses');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.post('/:id/announcements', ctrl.addAnnouncement);
router.delete('/:id/announcements/:annId', ctrl.deleteAnnouncement);
router.post('/:id/files', ctrl.addFiles);

module.exports = router;
