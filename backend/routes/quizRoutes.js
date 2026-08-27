const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Public (all logged-in users)
router.get('/', quizController.getQuizzes);
router.get('/results', quizController.getStudentResults);
router.post('/:id/start', quizController.startQuiz);
router.post('/:id/submit', quizController.submitQuiz);

// Officer & Admin management
router.post('/', roleMiddleware('Placement Officer', 'Admin'), quizController.createQuiz);
router.delete('/:id', roleMiddleware('Placement Officer', 'Admin'), quizController.deleteQuiz);
router.post('/questions', roleMiddleware('Placement Officer', 'Admin'), quizController.addQuestion);

module.exports = router;
