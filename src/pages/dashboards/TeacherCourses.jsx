import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    PlusCircle,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Eye,
    Trash2,
    BookOpen,
    Calendar,
    AlertCircle
} from 'lucide-react';

const TeacherCourses = () => {
    // Mock Data
    const [courses] = useState([
        {
            id: 1,
            title: 'Allemand Débutant A1',
            level: 'A1',
            status: 'published',
            students: 45,
            createdDate: '2024-01-15',
            image: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
            id: 2,
            title: 'Grammaire Intermédiaire B1',
            level: 'B1',
            status: 'pending',
            students: 0,
            createdDate: '2024-03-10',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
            id: 3,
            title: 'Vocabulaire Business C1',
            level: 'C1',
            status: 'draft',
            students: 0,
            createdDate: '2024-03-15',
            image: null
        },
        {
            id: 4,
            title: 'Conversation Avancée',
            level: 'B2',
            status: 'rejected',
            students: 0,
            createdDate: '2024-02-20',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        }
    ]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'published':
                return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Publié</span>;
            case 'pending':
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">En attente</span>;
            case 'draft':
                return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Brouillon</span>;
            case 'rejected':
                return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Refusé</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Mes Cours</h1>
                <Link
                    to="/dashboard/creer-cours"
                    className="bg-mdla-yellow hover:bg-yellow-400 text-mdla-black px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    Créer un nouveau cours
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                        Tous
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                        Publiés
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                        Brouillons
                    </button>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un cours..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Cours</th>
                                <th className="px-6 py-3">Niveau</th>
                                <th className="px-6 py-3">Date Création</th>
                                <th className="px-6 py-3">Étudiants</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {course.image ? (
                                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <BookOpen className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="font-medium text-gray-900">{course.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                            {course.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(course.createdDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {course.students}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(course.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/dashboard/editer-cours/${course.id}`}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Éditer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            {course.status === 'rejected' && (
                                                <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Voir motif refus">
                                                    <AlertCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherCourses;
