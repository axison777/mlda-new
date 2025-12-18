import { Link } from 'react-router-dom';
import { BookOpen, Users, DollarSign, PlusCircle, Edit, BarChart3, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockTeacherCourses } from '../../data/mockCourses';
import StatusBadge from '../../components/StatusBadge';

const ProfDashboard = () => {
    const { user } = useAuth();

    // Calculate stats
    const stats = {
        totalCourses: mockTeacherCourses.length,
        totalStudents: mockTeacherCourses.reduce((sum, course) => sum + course.students, 0),
        activeCourses: mockTeacherCourses.filter(c => c.status === 'published').length,
        monthlyEarnings: 2450000 // CFA
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `${(amount / 1000000).toFixed(2)}M F CFA`;
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-mdla-black mb-2">
                        Tableau de Bord Professeur
                    </h1>
                    <p className="text-mdla-black/80">
                        Bienvenue, {user?.name}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Cours</p>
                                <p className="text-3xl font-bold text-mdla-black mt-1">{stats.totalCourses}</p>
                            </div>
                            <div className="w-12 h-12 bg-mdla-yellow rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-mdla-black" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Étudiants</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalStudents}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Cours Actifs</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.activeCourses}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Revenus Mensuels</p>
                                <p className="text-3xl font-bold text-mdla-black mt-1">
                                    {formatCurrency(stats.monthlyEarnings)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Add New Course CTA */}
                        <div className="bg-gradient-to-r from-mdla-yellow to-yellow-400 rounded-xl shadow-md p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-mdla-black mb-2">
                                        Créer un nouveau cours
                                    </h2>
                                    <p className="text-mdla-black/80">
                                        Partagez vos connaissances avec vos étudiants
                                    </p>
                                </div>
                                <Link
                                    to="/dashboard/creer-cours"
                                    className="bg-mdla-black text-mdla-yellow px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center gap-2"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Ajouter un nouveau cours
                                </Link>
                            </div>
                        </div>

                        {/* Courses List */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-mdla-black">
                                    Mes Cours
                                </h2>
                                <span className="text-sm text-gray-600">
                                    {mockTeacherCourses.length} cours
                                </span>
                            </div>

                            <div className="space-y-4">
                                {mockTeacherCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="border border-gray-200 rounded-lg p-5 hover:border-mdla-yellow transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <BookOpen className="w-6 h-6 text-mdla-black" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-mdla-black">
                                                            {course.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {course.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <StatusBadge status={course.status} type="course" />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            {course.status === 'published' && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-700">
                                                        <strong>{course.students}</strong> étudiants
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-700">
                                                    {formatDate(course.createdDate)}
                                                </span>
                                            </div>
                                            {course.publishedDate && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <BarChart3 className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-700">
                                                        Publié le {formatDate(course.publishedDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {course.status === 'draft' && (
                                                <button className="flex-1 bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                                                    <Edit className="w-4 h-4" />
                                                    Modifier le brouillon
                                                </button>
                                            )}
                                            {course.status === 'published' && (
                                                <>
                                                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                                        <Edit className="w-4 h-4" />
                                                        Modifier
                                                    </button>
                                                    <button className="flex-1 bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                                                        <BarChart3 className="w-4 h-4" />
                                                        Voir les stats
                                                    </button>
                                                </>
                                            )}
                                            {course.status === 'pending' && (
                                                <div className="flex-1 bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg text-sm text-center">
                                                    <p className="text-orange-700 font-semibold">
                                                        En attente de validation par l'administrateur
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-mdla-black mb-4">
                                Statistiques Rapides
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">Cours publiés</span>
                                        <span className="font-bold text-green-600">
                                            {mockTeacherCourses.filter(c => c.status === 'published').length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{
                                                width: `${(mockTeacherCourses.filter(c => c.status === 'published').length / mockTeacherCourses.length) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">En attente</span>
                                        <span className="font-bold text-orange-600">
                                            {mockTeacherCourses.filter(c => c.status === 'pending').length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full"
                                            style={{
                                                width: `${(mockTeacherCourses.filter(c => c.status === 'pending').length / mockTeacherCourses.length) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">Brouillons</span>
                                        <span className="font-bold text-gray-600">
                                            {mockTeacherCourses.filter(c => c.status === 'draft').length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gray-500 h-2 rounded-full"
                                            style={{
                                                width: `${(mockTeacherCourses.filter(c => c.status === 'draft').length / mockTeacherCourses.length) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Students */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-mdla-black mb-4">
                                Étudiants Récents
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Marie Kaboré', course: 'Allemand A1', progress: 75 },
                                    { name: 'Jean Dupont', course: 'Allemand B1', progress: 45 },
                                    { name: 'Sophie Sawadogo', course: 'Allemand A1', progress: 90 }
                                ].map((student, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-gray-900">{student.name}</p>
                                            <span className="text-xs text-gray-500">{student.progress}%</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{student.course}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-mdla-yellow h-1.5 rounded-full"
                                                style={{ width: `${student.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-mdla-black mb-4">
                                Actions Rapides
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    to="/dashboard/etudiants"
                                    className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <p className="font-semibold text-gray-900">Gérer les étudiants</p>
                                    <p className="text-xs text-gray-600">Voir tous les étudiants</p>
                                </Link>
                                <Link
                                    to="/dashboard/messagerie"
                                    className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <p className="font-semibold text-gray-900">Messagerie</p>
                                    <p className="text-xs text-gray-600">Contacter les étudiants</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfDashboard;
