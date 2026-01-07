const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [{
                model: User,
                as: 'instructor',
                attributes: ['id', 'name']
            }]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'instructor',
                attributes: ['id', 'name']
            }, {
                model: Lesson,
                as: 'courseLessons',
                order: [['order', 'ASC']]
            }]
        });

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Cours non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin/Prof
const createCourse = async (req, res) => {
    try {
        const { title, level, category, price, description, thumbnail } = req.body;

        const course = await Course.create({
            title,
            instructorId: req.user.id,
            level,
            category,
            price,
            description,
            thumbnail,
            lessons: []
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (course) {
            const enrolled = course.studentsEnrolled || [];

            if (enrolled.includes(req.user.id)) {
                return res.status(400).json({ message: 'Déjà inscrit à ce cours' });
            }

            enrolled.push(req.user.id);
            course.studentsEnrolled = enrolled;
            await course.save();

            res.json({ message: 'Inscription réussie' });
        } else {
            res.status(404).json({ message: 'Cours non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a lesson to a course
// @route   POST /api/courses/:id/lessons
// @access  Private/Admin/Prof
const addLesson = async (req, res) => {
    try {
        const { title, content, videoUrl, duration, order, isFreePreview, section } = req.body;
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        // Verify ownership (if not admin)
        if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé à modifier ce cours' });
        }

        const lesson = await Lesson.create({
            title,
            content,
            videoUrl,
            duration,
            order,
            isFreePreview,
            section: section || 'Module 1',
            courseId: course.id
        });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a lesson
// @route   PUT /api/courses/:id/lessons/:lessonId
// @access  Private/Admin/Prof
const updateLesson = async (req, res) => {
    try {
        const { title, content, videoUrl, duration, order, isFreePreview, section } = req.body;
        const lesson = await Lesson.findByPk(req.params.lessonId);

        if (!lesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }

        const course = await Course.findByPk(lesson.courseId);

        // Verify ownership (if not admin)
        if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé à modifier ce cours' });
        }

        lesson.title = title || lesson.title;
        lesson.content = content || lesson.content;
        lesson.videoUrl = videoUrl || lesson.videoUrl;
        lesson.duration = duration || lesson.duration;
        lesson.order = order || lesson.order;
        lesson.section = section || lesson.section;
        if (isFreePreview !== undefined) lesson.isFreePreview = isFreePreview;

        await lesson.save();
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a lesson
// @route   DELETE /api/courses/:id/lessons/:lessonId
// @access  Private/Admin/Prof
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.lessonId);

        if (!lesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }

        const course = await Course.findByPk(lesson.courseId);

        // Verify ownership (if not admin)
        if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé à modifier ce cours' });
        }

        await lesson.destroy();
        res.json({ message: 'Leçon supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    enrollCourse,
    addLesson,
    updateLesson,
    deleteLesson
};
