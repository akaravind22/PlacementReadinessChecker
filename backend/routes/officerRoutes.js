const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Placement Officer', 'Admin'));

// Students Monitoring
router.get('/students', officerController.getStudents);
router.get('/students/:id', officerController.getStudentDetail);

// Notifications & Reports
router.post('/notifications', officerController.sendNotification);
router.post('/reports', officerController.generateReport);
router.get('/reports', officerController.getReports);

module.exports = router;
