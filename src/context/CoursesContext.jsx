import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const CoursesContext = createContext();

export const useCourses = () => {
    const context = useContext(CoursesContext);
    if (!context) {
        throw new Error('useCourses must be used within a CoursesProvider');
    }
    return context;
};

export const CoursesProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCourseById = async (id) => {
        try {
            const { data } = await api.get(`/courses/${id}`);
            return data;
        } catch (error) {
            console.error('Error fetching course:', error);
            return null;
        }
    };

    const createCourse = async (courseData) => {
        try {
            const { data } = await api.post('/courses', courseData);
            setCourses([data, ...courses]);
            return { success: true, course: data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la création du cours'
            };
        }
    };

    const enrollCourse = async (courseId) => {
        try {
            const { data } = await api.post(`/courses/${courseId}/enroll`);
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de l\'inscription'
            };
        }
    };

    const addLesson = async (courseId, lessonData) => {
        try {
            setLoading(true);
            const { data } = await api.post(`/courses/${courseId}/lessons`, lessonData);
            await fetchCourses();
            return { success: true, lesson: data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de l\'ajout de la leçon'
            };
        } finally {
            setLoading(false);
        }
    };

    const updateLesson = async (courseId, lessonId, lessonData) => {
        try {
            setLoading(true);
            const { data } = await api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
            await fetchCourses();
            return { success: true, lesson: data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la modification de la leçon'
            };
        } finally {
            setLoading(false);
        }
    };

    const deleteLesson = async (courseId, lessonId) => {
        try {
            setLoading(true);
            await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
            await fetchCourses();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la suppression de la leçon'
            };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        courses,
        loading,
        getCourseById,
        createCourse,
        enrollCourse,
        addLesson,
        updateLesson,
        deleteLesson,
        refreshCourses: fetchCourses
    };

    return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};
