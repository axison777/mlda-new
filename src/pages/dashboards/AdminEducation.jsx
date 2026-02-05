import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    Search,
    Filter,
    MoreVertical,
    AlertCircle,
    DollarSign,
    Percent,
    Eye,
    ChevronDown,
    ChevronRight,
    Edit,
    Trash2,
    X,
    FileText,
    Video,
    Music,
    ExternalLink
} from 'lucide-react';
import api from '../../utils/api';
import AttendanceTab from '../../components/AttendanceTab';

const AdminEducation = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('validation');
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [priceData, setPriceData] = useState({ basePrice: '', discount: 0 });
    const [pendingCourses, setPendingCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [expandedModule, setExpandedModule] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');



    useEffect(() => {
        if (activeTab === 'validation') {
            fetchPendingCourses();
        } else if (activeTab === 'allCourses') {
            fetchAllCourses();
        }
    }, [activeTab]);

    const fetchPendingCourses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/courses?status=pending_review');
            setPendingCourses(data);
        } catch (error) {
            console.error('Error fetching pending courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCourses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/courses');
            setAllCourses(data);
        } catch (error) {
            console.error('Error fetching all courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = (course) => {
        setSelectedCourse(course);
        setExpandedModule(null);
        setShowDetailsModal(true);
    };

    const handleDeleteCourse = async () => {
        try {
            await api.delete(`/courses/${courseToDelete.id}`);
            alert('Cours supprimé avec succès !');
            setShowDeleteConfirm(false);
            setCourseToDelete(null);
            if (activeTab === 'allCourses') {
                fetchAllCourses();
            } else {
                fetchPendingCourses();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleOpenValidation = (course) => {
        setSelectedCourse(course);
        setPriceData({ basePrice: course.price || '', discount: 0 });
        setRejectionReason('');
        setShowValidationModal(true);
    };

    const handleApproveCourse = async () => {
        try {
            await api.post(`/courses/${selectedCourse.id}/approve`, {
                price: parseFloat(priceData.basePrice) || 0,
                discount: parseFloat(priceData.discount) || 0
            });
            alert('Cours approuvé et publié avec succès !');
            setShowValidationModal(false);
            fetchPendingCourses();
            // Refresh all courses if on that tab
            if (activeTab === 'allCourses') {
                fetchAllCourses();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'approbation');
        }
    };

    const handleRejectCourse = async () => {
        if (!rejectionReason.trim()) {
            alert('Veuillez fournir un motif de refus');
            return;
        }
        try {
            await api.post(`/courses/${selectedCourse.id}/reject`, {
                reason: rejectionReason
            });
            alert('Cours refusé');
            setShowValidationModal(false);
            setRejectionReason('');
            fetchPendingCourses();
            // Refresh all courses if on that tab
            if (activeTab === 'allCourses') {
                fetchAllCourses();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors du refus');
        }
    };

    const calculateFinalPrice = () => {
        const base = parseFloat(priceData.basePrice) || 0;
        const discount = parseFloat(priceData.discount) || 0;
        return base - (base * (discount / 100));
    };

    const getRowStyle = (lastLogin) => {
        const days = (new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24);
        if (days > 14) return 'border-l-4 border-l-red-500 bg-red-50/30';
        if (days > 7) return 'border-l-4 border-l-orange-500 bg-orange-50/30';
        return 'border-l-4 border-l-transparent hover:bg-gray-50';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Pôle Formation</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('validation')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'validation' ? 'bg-mdla-yellow text-mdla-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Validation Cours
                    </button>
                    <button
                        onClick={() => setActiveTab('allCourses')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'allCourses' ? 'bg-mdla-yellow text-mdla-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Tous les Cours
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'attendance' ? 'bg-mdla-yellow text-mdla-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Suivi Assiduité
                    </button>
                </div>
            </div>

            {activeTab === 'validation' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Cours en attente de validation</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {pendingCourses.length} cours
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Chargement...</div>
                        ) : pendingCourses.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">Aucun cours en attente</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Image</th>
                                        <th className="px-6 py-3">Titre du cours</th>
                                        <th className="px-6 py-3">Instructeur</th>
                                        <th className="px-6 py-3">Niveau</th>
                                        <th className="px-6 py-3">Date soumission</th>
                                        <th className="px-6 py-3">Modules</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingCourses.map((course) => (
                                        <React.Fragment key={course.id}>
                                            <tr className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-16 h-16 object-cover rounded-lg" />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                                                            <BookOpen className="w-8 h-8 text-mdla-black opacity-50" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                                                <td className="px-6 py-4">{course.teacher?.name || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                        {course.level}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{new Date(course.updatedAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-600">{course.modules?.length || 0} modules</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenDetails(course)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Voir détails"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenValidation(course)}
                                                            className="font-medium text-green-600 hover:underline"
                                                        >
                                                            Valider
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedCourse === course.id && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-gray-700">Description:</p>
                                                            <p className="text-sm text-gray-600">{course.description}</p>
                                                            {course.modules && course.modules.length > 0 && (
                                                                <div className="mt-4">
                                                                    <p className="text-sm font-medium text-gray-700 mb-2">Programme:</p>
                                                                    {course.modules.map((module, idx) => (
                                                                        <div key={module.id} className="ml-4 mb-2">
                                                                            <p className="text-sm font-medium text-gray-800">
                                                                                {idx + 1}. {module.title}
                                                                            </p>
                                                                            {module.items && module.items.length > 0 && (
                                                                                <ul className="ml-4 mt-1 space-y-1">
                                                                                    {module.items.map((item) => (
                                                                                        <li key={item.id} className="text-xs text-gray-600">
                                                                                            • {item.title} ({item.type})
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* All Courses Tab */}
            {activeTab === 'allCourses' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Tous les cours</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {allCourses.filter(c => statusFilter === 'all' || c.status === statusFilter).length} cours
                            </span>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-mdla-yellow text-mdla-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tous
                            </button>
                            <button
                                onClick={() => setStatusFilter('draft')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'draft' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Brouillons
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending_review')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'pending_review' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                En attente
                            </button>
                            <button
                                onClick={() => setStatusFilter('rejected')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Refusés
                            </button>
                            <button
                                onClick={() => setStatusFilter('published')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'published' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Publiés
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par titre ou instructeur..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Chargement...</div>
                        ) : allCourses.filter(c => {
                            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
                            const matchesSearch = !searchQuery ||
                                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                c.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase());
                            return matchesStatus && matchesSearch;
                        }).length === 0 ? (
                            <div className="p-8 text-center text-gray-500">Aucun cours trouvé</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Image</th>
                                        <th className="px-6 py-3">Titre du cours</th>
                                        <th className="px-6 py-3">Instructeur</th>
                                        <th className="px-6 py-3">Niveau</th>
                                        <th className="px-6 py-3">Statut</th>
                                        <th className="px-6 py-3">Date création</th>
                                        <th className="px-6 py-3">Modules</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allCourses.filter(c => {
                                        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
                                        const matchesSearch = !searchQuery ||
                                            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            c.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        return matchesStatus && matchesSearch;
                                    }).map((course) => (
                                        <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt={course.title} className="w-16 h-16 object-cover rounded-lg" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-mdla-black opacity-50" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                                            <td className="px-6 py-4">{course.teacher?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {course.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${course.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    course.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                                                        course.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {course.status === 'draft' ? 'Brouillon' :
                                                        course.status === 'pending_review' ? 'En attente' :
                                                            course.status === 'rejected' ? 'Refusé' :
                                                                course.status === 'published' ? 'Publié' : course.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(course.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600">{course.modules?.length || 0} modules</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenDetails(course)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Voir détails"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/dashboard/editer-cours/${course.id}`)}
                                                        className="text-gray-600 hover:text-gray-800"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setCourseToDelete(course);
                                                            setShowDeleteConfirm(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    {course.status === 'pending_review' && (
                                                        <button
                                                            onClick={() => handleOpenValidation(course)}
                                                            className="font-medium text-green-600 hover:underline ml-2"
                                                        >
                                                            Valider
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <AttendanceTab />
            )}

            {/* Validation Modal */}
            {showValidationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Valider le cours</h3>
                            <button onClick={() => setShowValidationModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">{selectedCourse?.title}</p>
                                <p className="text-xs text-gray-500">Par {selectedCourse?.teacher?.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base (FCFA)</label>
                                <div className="relative">
                                    <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        value={priceData.basePrice}
                                        onChange={(e) => setPriceData({ ...priceData, basePrice: e.target.value })}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:border-mdla-yellow"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Réduction (%)</label>
                                <div className="relative">
                                    <Percent className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        value={priceData.discount}
                                        onChange={(e) => setPriceData({ ...priceData, discount: e.target.value })}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow/50 focus:border-mdla-yellow"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                                    <span>Prix initial:</span>
                                    <span>{priceData.basePrice || 0} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-red-600 mb-2">
                                    <span>Réduction:</span>
                                    <span>-{priceData.discount}%</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg text-gray-900 border-t border-gray-200 pt-2">
                                    <span>Prix Final:</span>
                                    <span>{calculateFinalPrice().toFixed(0)} FCFA</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motif de refus (optionnel)</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                                    placeholder="Expliquez pourquoi le cours est refusé..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    onClick={handleRejectCourse}
                                >
                                    <XCircle className="w-5 h-5" />
                                    Refuser
                                </button>
                                <button
                                    className="flex-1 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    onClick={handleApproveCourse}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Approuver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Details Modal */}
            {showDetailsModal && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between z-10">
                            <div className="flex gap-4">
                                {selectedCourse.thumbnail ? (
                                    <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-32 h-32 object-cover rounded-lg shadow-md" />
                                ) : (
                                    <div className="w-32 h-32 bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-lg flex items-center justify-center shadow-md">
                                        <BookOpen className="w-16 h-16 text-mdla-black opacity-50" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
                                    <p className="text-gray-600 mb-1">Par: {selectedCourse.teacher?.name || 'N/A'}</p>
                                    <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                                        Niveau: {selectedCourse.level}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Pricing */}
                            {selectedCourse.price > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Tarification</h3>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Prix de base</p>
                                            <p className="text-xl font-bold text-gray-900">{selectedCourse.price?.toLocaleString()} FCFA</p>
                                        </div>
                                        {selectedCourse.discount_price && (
                                            <>
                                                <div className="text-gray-400">→</div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Prix final</p>
                                                    <p className="text-xl font-bold text-green-600">{selectedCourse.discount_price?.toLocaleString()} FCFA</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{selectedCourse.description || 'Aucune description'}</p>
                            </div>

                            {/* Curriculum */}
                            {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Programme ({selectedCourse.modules.length} modules)</h3>
                                    <div className="space-y-2">
                                        {selectedCourse.modules.map((module, idx) => (
                                            <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {expandedModule === module.id ? <ChevronDown className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
                                                        <span className="font-medium text-gray-900">
                                                            Module {idx + 1}: {module.title}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{module.items?.length || 0} leçons</span>
                                                </button>
                                                {expandedModule === module.id && module.items && module.items.length > 0 && (
                                                    <div className="p-4 bg-white space-y-3">
                                                        {module.items.map((item, itemIdx) => (
                                                            <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-gray-400 font-medium">{itemIdx + 1}.</span>
                                                                        <span className="font-medium text-gray-900">{item.title}</span>
                                                                    </div>
                                                                    <span className={`text-xs font-medium px-2 py-1 rounded ${item.type === 'video' ? 'bg-purple-100 text-purple-800' :
                                                                        item.type === 'quiz' ? 'bg-orange-100 text-orange-800' :
                                                                            item.type === 'session' ? 'bg-green-100 text-green-800' :
                                                                                'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                        {item.type}
                                                                    </span>
                                                                </div>

                                                                {/* Description */}
                                                                {item.description && (
                                                                    <p className="text-sm text-gray-600 mb-2 ml-6">{item.description}</p>
                                                                )}

                                                                <div className="ml-6 space-y-1">
                                                                    {/* Video URL is stored in 'content' field for type='video' */}
                                                                    {item.type === 'video' && item.content && (
                                                                        <a
                                                                            href={item.content}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                                                                        >
                                                                            <Video className="w-4 h-4" />
                                                                            <span>Voir la vidéo</span>
                                                                            <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    )}
                                                                    {item.audioUrl && (
                                                                        <a
                                                                            href={item.audioUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 hover:underline"
                                                                        >
                                                                            <Music className="w-4 h-4" />
                                                                            <span>Écouter l'audio</span>
                                                                            <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    )}
                                                                    {item.pdfUrl && (
                                                                        <a
                                                                            href={item.pdfUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:underline"
                                                                        >
                                                                            <FileText className="w-4 h-4" />
                                                                            <span>Télécharger le PDF</span>
                                                                            <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    )}
                                                                    {/* Show "no content" only if truly no content */}
                                                                    {!item.content && !item.audioUrl && !item.pdfUrl && item.type !== 'quiz' && item.type !== 'live_session' && (
                                                                        <p className="text-xs text-gray-400 italic">Aucun contenu disponible</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between text-sm">
                                <div>
                                    <span className="text-gray-600">Créé le: </span>
                                    <span className="font-medium text-gray-900">{new Date(selectedCourse.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Statut: </span>
                                    <span className={`font-medium ${selectedCourse.status === 'published' ? 'text-green-600' :
                                        selectedCourse.status === 'pending_review' ? 'text-yellow-600' :
                                            selectedCourse.status === 'rejected' ? 'text-red-600' :
                                                'text-gray-600'
                                        }`}>
                                        {selectedCourse.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                            <button
                                onClick={() => navigate(`/dashboard/editer-cours/${selectedCourse.id}`)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                Modifier
                            </button>
                            <button
                                onClick={() => {
                                    setCourseToDelete(selectedCourse);
                                    setShowDetailsModal(false);
                                    setShowDeleteConfirm(true);
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                Supprimer
                            </button>
                            {selectedCourse.status === 'pending_review' && (
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleOpenValidation(selectedCourse);
                                    }}
                                    className="flex-1 bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Valider
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && courseToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer le cours <strong>{courseToDelete.title}</strong> ?
                            Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setCourseToDelete(null);
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEducation;
