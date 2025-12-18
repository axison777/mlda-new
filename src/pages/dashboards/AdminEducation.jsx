import React, { useState } from 'react';
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
    Percent
} from 'lucide-react';

const AdminEducation = () => {
    const [activeTab, setActiveTab] = useState('validation');
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [priceData, setPriceData] = useState({ basePrice: '', discount: 0 });

    // Mock Data for Course Validation
    const pendingCourses = [
        { id: 1, title: 'Import Chine - Module Avancé', instructor: 'Jean Dupont', category: 'Import/Export', submittedDate: '2024-03-14', status: 'pending' },
        { id: 2, title: 'Douane & Transit au Sénégal', instructor: 'Marie Diop', category: 'Logistique', submittedDate: '2024-03-13', status: 'pending' },
        { id: 3, title: 'E-commerce Dropshipping', instructor: 'Paul Martin', category: 'Business', submittedDate: '2024-03-12', status: 'reviewing' },
    ];

    // Mock Data for Attendance
    const students = [
        { id: 1, name: 'Amadou Sow', email: 'amadou@test.com', course: 'Import Chine', lastLogin: '2024-03-15', progress: 75, status: 'active' },
        { id: 2, name: 'Fatou Ndiaye', email: 'fatou@test.com', course: 'Transit', lastLogin: '2024-03-05', progress: 30, status: 'warning' }, // > 7 days
        { id: 3, name: 'Moussa Fall', email: 'moussa@test.com', course: 'Business', lastLogin: '2024-02-20', progress: 10, status: 'danger' }, // > 14 days
        { id: 4, name: 'Sophie Diallo', email: 'sophie@test.com', course: 'Import Chine', lastLogin: '2024-03-14', progress: 90, status: 'active' },
    ];

    const handleOpenValidation = (course) => {
        setSelectedCourse(course);
        setPriceData({ basePrice: '', discount: 0 });
        setShowValidationModal(true);
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
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Titre du cours</th>
                                    <th className="px-6 py-3">Instructeur</th>
                                    <th className="px-6 py-3">Catégorie</th>
                                    <th className="px-6 py-3">Date soumission</th>
                                    <th className="px-6 py-3">Statut</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingCourses.map((course) => (
                                    <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                                        <td className="px-6 py-4">{course.instructor}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{course.submittedDate}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                En attente
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleOpenValidation(course)}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                Valider
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Suivi des Étudiants</h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                                />
                            </div>
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <Filter className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Étudiant</th>
                                    <th className="px-6 py-3">Cours suivi</th>
                                    <th className="px-6 py-3">Dernière connexion</th>
                                    <th className="px-6 py-3">Progression</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className={`border-b ${getRowStyle(student.lastLogin)}`}>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{student.name}</div>
                                                <div className="text-xs text-gray-500">{student.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{student.course}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {student.lastLogin}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-mdla-yellow h-2.5 rounded-full"
                                                    style={{ width: `${student.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">{student.progress}%</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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

                            <button
                                className="w-full bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                onClick={() => setShowValidationModal(false)}
                            >
                                <CheckCircle className="w-5 h-5" />
                                Confirmer la validation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEducation;
