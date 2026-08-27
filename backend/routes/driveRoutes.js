const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Get drives (all authenticated users)
router.get('/', officerController.getDrives);

// Manage drives (Placement Officer & Admin)
router.post('/', roleMiddleware('Placement Officer', 'Admin'), officerController.createDrive);
router.put('/:id', roleMiddleware('Placement Officer', 'Admin'), officerController.updateDrive);
router.delete('/:id', roleMiddleware('Placement Officer', 'Admin'), officerController.deleteDrive);

module.exports = router;
