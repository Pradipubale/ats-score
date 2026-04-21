const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/ResumeController');
const auth = require('../middleware/auth');

router.get('/', auth, resumeController.getAllResumes);
router.post('/scan', auth, resumeController.scanResume);
router.post('/', auth, resumeController.createResume);
router.put('/:id', auth, resumeController.updateResume);
router.delete('/:id', auth, resumeController.deleteResume);

module.exports = router;
