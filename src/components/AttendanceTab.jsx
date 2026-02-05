import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    BookOpen,
    CheckCircle,
    Clock,
    TrendingUp,
    Download
} from 'lucide-react';
import api from '../utils/api';

const AttendanceTab = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        courseId: '',
        learningMode: '',
        status: '',
        search: ''
    });
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchStats();
        fetchEnrollments();
    }, []);

    useEffect(() => {
        fetchEnrollments();
    }, [filters]);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/enrollments/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.courseId) params.append('courseId', filters.courseId);
            if (filters.learningMode) params.append('learningMode', filters.learningMode);
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const { data } = await api.get(`/enrollments/admin/all?${params.toString()}`);
            setEnrollments(data.enrollments || []);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getLearningModeBadge = (mode) => {
        if (mode === 'online') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    📱 En ligne
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                🏫 Présentiel
            </span>
        );
    };

    const getStatusBadge = (status) => {
        if (status === 'completed') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Terminé
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                <Clock className="w-3 h-3" />
                En cours
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Inscriptions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">En ligne / Présentiel</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.byLearningMode.online} / {stats.byLearningMode.in_person}
                                </p>
                            </div>
                            <BookOpen className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Taux de Complétion</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Progression Moyenne</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher un étudiant..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Course Filter */}
                    <select
                        value={filters.courseId}
                        onChange={(e) => handleFilterChange('courseId', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tous les cours</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>

                    {/* Learning Mode Filter */}
                    <select
                        value={filters.learningMode}
                        onChange={(e) => handleFilterChange('learningMode', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tous les modes</option>
                        <option value="online">En ligne</option>
                        <option value="in_person">Présentiel</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="active">En cours</option>
                        <option value="completed">Terminé</option>
                    </select>
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Étudiant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cours
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mode
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progression
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date d'inscription
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Aucune inscription trouvée
                                    </td>
                                </tr>
                            ) : (
                                enrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {enrollment.user?.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {enrollment.user?.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {enrollment.course?.title || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {enrollment.course?.level}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getLearningModeBadge(enrollment.learningMode)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${enrollment.progressPercent || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {enrollment.progressPercent || 0}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(enrollment.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(enrollment.enrolledAt)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTab;
