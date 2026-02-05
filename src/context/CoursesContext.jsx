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

    const createModule = async (courseId, moduleData) => {
        try {
            setLoading(true);
            const { data } = await api.post(`/curriculum/courses/${courseId}/modules`, moduleData);
            await fetchCourses(); // Refresh to get updated structure (optional, might be heavy)
            return { success: true, module: data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la création du module'
            };
        } finally {
            setLoading(false);
        }
    };

    const updateModule = async (moduleId, moduleData) => {
        try {
            const { data } = await api.put(`/curriculum/modules/${moduleId}`, moduleData);
            return { success: true, module: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const deleteModule = async (moduleId) => {
        try {
            await api.delete(`/curriculum/modules/${moduleId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const createItem = async (moduleId, itemData) => {
        try {
            const { data } = await api.post(`/curriculum/modules/${moduleId}/items`, itemData);
            return { success: true, item: data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Erreur lors de la création de l\'élément' };
        }
    };

    const updateItem = async (itemId, itemData) => {
        try {
            const { data } = await api.put(`/curriculum/items/${itemId}`, itemData);
            return { success: true, item: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await api.delete(`/curriculum/items/${itemId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const submitForReview = async (courseId) => {
        try {
            await api.post(`/courses/${courseId}/submit`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        courses,
        loading,
        getCourseById,
        createCourse,
        enrollCourse,
        createModule,
        updateModule,
        deleteModule,
        createItem,
        updateItem,
        deleteItem,
        submitForReview,
        refreshCourses: fetchCourses
    };

    return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};
