const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// View resources (all authenticated users)
router.get('/', officerController.getResources);

// Upload & Delete resources (Placement Officer & Admin)
router.post('/', roleMiddleware('Placement Officer', 'Admin'), officerController.createResource);
router.delete('/:id', roleMiddleware('Placement Officer', 'Admin'), officerController.deleteResource);

module.exports = router;
