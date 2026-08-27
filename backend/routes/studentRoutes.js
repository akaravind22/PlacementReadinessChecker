const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Student'));

// Profile
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/upload-resume', upload.single('resume'), studentController.uploadResume);

// Readiness Score & Suggestions
router.get('/readiness-score', studentController.getReadinessScore);
router.get('/suggestions', studentController.getSuggestions);
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/:id/read', studentController.markNotificationRead);
router.get('/report', studentController.getStudentReport);

// Skills
router.get('/skills', studentController.getSkills);
router.post('/skills', studentController.addSkill);
router.put('/skills/:id', studentController.updateSkill);
router.delete('/skills/:id', studentController.deleteSkill);

// Projects
router.get('/projects', studentController.getProjects);
router.post('/projects', studentController.addProject);
router.put('/projects/:id', studentController.updateProject);
router.delete('/projects/:id', studentController.deleteProject);

// Certifications
router.get('/certifications', studentController.getCertifications);
router.post('/certifications', studentController.addCertification);
router.delete('/certifications/:id', studentController.deleteCertification);

// Internships
router.get('/internships', studentController.getInternships);
router.post('/internships', studentController.addInternship);
router.delete('/internships/:id', studentController.deleteInternship);

module.exports = router;
