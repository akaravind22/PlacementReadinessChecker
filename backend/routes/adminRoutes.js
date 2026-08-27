const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const officerController = require('../controllers/officerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

// Dashboard Overview Stats
router.get('/dashboard-stats', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.updateUserRole);

// Reports
router.get('/reports', officerController.getReports);

module.exports = router;
