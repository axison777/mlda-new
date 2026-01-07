
const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    enrollCourse,
    addLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCourses).post(protect, createCourse);
router.route('/:id').get(getCourseById);
router.route('/:id/enroll').post(protect, enrollCourse);
router.route('/:id/lessons').post(protect, addLesson);
router.route('/:id/lessons/:lessonId').put(protect, updateLesson).delete(protect, deleteLesson);

module.exports = router;
