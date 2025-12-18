import React, { useState } from 'react';
import {
    Search,
    Filter,
    MessageSquare,
    MoreVertical,
    User,
    BookOpen,
    Clock,
    Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherStudents = () => {
    // Mock Data
    const [students] = useState([
        {
            id: 1,
            name: 'Moussa Diop',
            course: 'Allemand Débutant A1',
            progress: 45,
            lastActive: 'Il y a 2h',
            avatar: null,
            status: 'active'
        },
        {
            id: 2,
            name: 'Fatou Sow',
            course: 'Allemand Débutant A1',
            progress: 12,
            lastActive: 'Il y a 3j',
            avatar: null,
            status: 'warning' // Low activity
        },
        {
            id: 3,
            name: 'Jean Michel',
            course: 'Grammaire Intermédiaire B1',
            progress: 89,
            lastActive: 'Il y a 1h',
            avatar: null,
            status: 'active'
        },
        {
            id: 4,
            name: 'Sophie Martin',
            course: 'Vocabulaire Business C1',
            progress: 100,
            lastActive: 'Il y a 5h',
            avatar: null,
            status: 'completed'
        },
        {
            id: 5,
            name: 'Paul Ndiaye',
            course: 'Allemand Débutant A1',
            progress: 0,
            lastActive: 'Jamais',
            avatar: null,
            status: 'inactive'
        }
    ]);

    const getProgressColor = (progress) => {
        if (progress === 100) return 'bg-green-500';
        if (progress > 50) return 'bg-blue-500';
        if (progress > 20) return 'bg-mdla-yellow';
        return 'bg-gray-400';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mes Étudiants</h1>
                    <p className="text-gray-500">Suivi de la progression et accompagnement</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
                    Total: <span className="text-gray-900 font-bold">{students.length}</span> étudiants
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un étudiant..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mdla-yellow/50 bg-white">
                        <option value="">Tous les cours</option>
                        <option value="A1">Allemand A1</option>
                        <option value="B1">Allemand B1</option>
                    </select>
                </div>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Étudiant</th>
                                <th className="px-6 py-3">Cours Suivi</th>
                                <th className="px-6 py-3">Progression</th>
                                <th className="px-6 py-3">Dernière Activité</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{student.name}</div>
                                                {student.status === 'completed' && (
                                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                                        <Award className="w-3 h-3" /> Certifié
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            {student.course}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 w-1/4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getProgressColor(student.progress)}`}
                                                    style={{ width: `${student.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium w-8">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {student.lastActive}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to="/dashboard/messagerie-prof"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            title="Envoyer un message"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </Link>
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

export default TeacherStudents;
