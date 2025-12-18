import { Link } from 'react-router-dom';
import { Package, BookOpen, Calendar, MapPin, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { mockEnrolledCourses } from '../../data/mockCourses';
import { mockOrders, trackingSteps } from '../../data/mockOrders';
import ProgressBar from '../../components/ProgressBar';

const UserDashboard = () => {
    const { user } = useAuth();
    const { getMyOrders } = useOrders();

    const myOrders = getMyOrders();
    const activeOrders = myOrders.length > 0 ? myOrders.filter(o => o.status !== 'delivered') : mockOrders.filter(o => o.status !== 'delivered');
    const completedOrders = myOrders.length > 0 ? myOrders.filter(o => o.status === 'delivered') : mockOrders.filter(o => o.status === 'delivered');

    // Get 2 most recent courses
    const recentCourses = mockEnrolledCourses.slice(0, 2);

    // Get most recent order for mini-tracking
    const latestOrder = mockOrders[0];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-mdla-yellow to-yellow-400 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-mdla-black mb-2">
                        Bienvenue, {user?.name?.split(' ')[0]} !
                    </h1>
                    <p className="text-mdla-black/80">
                        Gérez vos commandes, formations et documents en un seul endroit
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Commandes actives</p>
                                <p className="text-3xl font-bold text-mdla-black mt-1">{activeOrders.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-mdla-yellow rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-mdla-black" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Commandes livrées</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{completedOrders.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Formations</p>
                                <p className="text-3xl font-bold text-mdla-black mt-1">{mockEnrolledCourses.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Progression moy.</p>
                                <p className="text-3xl font-bold text-mdla-black mt-1">
                                    {Math.round(mockEnrolledCourses.reduce((acc, c) => acc + c.progress, 0) / mockEnrolledCourses.length)}%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Play className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Mon Apprentissage Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-mdla-black flex items-center gap-2">
                                    <BookOpen className="w-6 h-6" />
                                    Mon Apprentissage
                                </h2>
                                <Link
                                    to="/formations"
                                    className="text-sm text-mdla-yellow hover:text-yellow-600 font-semibold"
                                >
                                    Voir tout →
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-mdla-yellow transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="w-8 h-8 text-mdla-black" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-mdla-black">{course.title}</h3>
                                                        <p className="text-sm text-gray-600">Par {course.instructor}</p>
                                                    </div>
                                                    <span className="bg-mdla-yellow text-mdla-black px-3 py-1 rounded-full text-xs font-bold">
                                                        {course.level}
                                                    </span>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="text-gray-600">
                                                            {course.completedLessons} / {course.totalLessons} leçons
                                                        </span>
                                                        <span className="font-semibold text-mdla-black">{course.progress}%</span>
                                                    </div>
                                                    <ProgressBar percentage={course.progress} showLabel={false} />
                                                </div>

                                                <button className="w-full bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                                                    <Play className="w-4 h-4" />
                                                    Continuer le cours
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mes Commandes Récentes avec Mini-Tracking */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-mdla-black mb-6">
                                Ma Dernière Commande
                            </h2>

                            {latestOrder ? (
                                <div className="border-2 border-mdla-yellow rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-white">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl text-mdla-black mb-1">
                                                {latestOrder.product.model}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                N° {latestOrder.trackingNumber}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{latestOrder.orderDate}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{latestOrder.destination}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini-Tracking Status */}
                                    <div className="bg-white rounded-lg p-4 border-2 border-mdla-yellow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-4xl">{trackingSteps[latestOrder.status].emoji}</span>
                                                <div>
                                                    <p className="text-sm text-gray-600">Votre {latestOrder.product.model} est :</p>
                                                    <p className="text-xl font-bold text-mdla-black">
                                                        {trackingSteps[latestOrder.status].label}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {latestOrder.currentLocation}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/suivi/${latestOrder.trackingNumber}`}
                                                className="bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                                            >
                                                Suivre
                                            </Link>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-4 text-center">
                                        Livraison estimée: <strong>{latestOrder.estimatedDelivery}</strong>
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">Aucune commande pour le moment</p>
                                    <Link
                                        to="/boutique"
                                        className="inline-block bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                                    >
                                        Découvrir la boutique
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-mdla-black mb-4">
                                Actions Rapides
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    to="/boutique"
                                    className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <p className="font-semibold text-gray-900">Commander un véhicule</p>
                                    <p className="text-xs text-gray-600">Import depuis l'Allemagne</p>
                                </Link>
                                <Link
                                    to="/devis"
                                    className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <p className="font-semibold text-gray-900">Demander un devis</p>
                                    <p className="text-xs text-gray-600">Pour tous nos services</p>
                                </Link>
                                <Link
                                    to="/formations"
                                    className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <p className="font-semibold text-gray-900">S'inscrire à une formation</p>
                                    <p className="text-xs text-gray-600">Apprendre l'allemand</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
