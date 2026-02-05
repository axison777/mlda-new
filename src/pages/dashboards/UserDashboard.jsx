import { Link, useNavigate } from 'react-router-dom';
import { Package, BookOpen, Calendar, MapPin, Play, Truck, Monitor, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProgressBar from '../../components/ProgressBar';

const UserDashboard = () => {
    const { user } = useAuth();
    const { orders: myOrders, loading } = useOrders();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(true);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoadingEnrollments(true);
            const { data } = await api.get('/enrollments');
            setEnrollments(data);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoadingEnrollments(false);
        }
    };

    const activeOrders = myOrders.filter(o => !['delivered', 'LIVRE'].includes(o.status));
    const completedOrders = myOrders.filter(o => ['delivered', 'LIVRE'].includes(o.status));

    // Get 2 most recent enrollments
    const recentCourses = enrollments.slice(0, 2);

    // Get 3 most recent orders
    const recentOrders = myOrders.slice(0, 3);

    const getStatusColor = (status) => {
        switch (status) {
            case 'LIVRE':
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'DOSSIER_OUVERT': return 'bg-blue-100 text-blue-700';
            case 'EN_MER': return 'bg-purple-100 text-purple-700';
            case 'DOUANE': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

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
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mdla-yellow"></div>
                    </div>
                ) : (
                    <>
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
                                        <p className="text-3xl font-bold text-mdla-black mt-1">{enrollments.length}</p>
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
                                            {enrollments.length > 0 ? Math.round(enrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) / enrollments.length) : 0}%
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
                                        {loadingEnrollments ? (
                                            <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mdla-yellow mx-auto"></div>
                                            </div>
                                        ) : recentCourses.length > 0 ? (
                                            recentCourses.map((enrollment) => (
                                                <div
                                                    key={enrollment.id}
                                                    className="border border-gray-200 rounded-lg p-4 hover:border-mdla-yellow transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/dashboard/cours/${enrollment.courseId}`)}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {enrollment.course?.thumbnail ? (
                                                            <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                                                        ) : (
                                                            <div className="w-20 h-20 bg-gradient-to-br from-mdla-yellow to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <BookOpen className="w-8 h-8 text-mdla-black" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <h3 className="font-bold text-mdla-black">{enrollment.course?.title}</h3>
                                                                    <p className="text-sm text-gray-600">Par {enrollment.course?.teacher?.name || 'N/A'}</p>
                                                                </div>
                                                                <span className="bg-mdla-yellow text-mdla-black px-3 py-1 rounded-full text-xs font-bold">
                                                                    {enrollment.course?.level}
                                                                </span>
                                                            </div>

                                                            {/* Learning Mode Badge */}
                                                            <div className="mb-3">
                                                                {enrollment.learningMode === 'online' ? (
                                                                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                        <Monitor className="w-3 h-3" />
                                                                        En ligne
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                        <Users className="w-3 h-3" />
                                                                        Présentiel
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="mb-3">
                                                                <div className="flex items-center justify-between text-sm mb-1">
                                                                    <span className="text-gray-600">Progression</span>
                                                                    <span className="font-semibold text-mdla-black">{enrollment.progressPercent || 0}%</span>
                                                                </div>
                                                                <ProgressBar percentage={enrollment.progressPercent || 0} showLabel={false} />
                                                            </div>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/dashboard/cours/${enrollment.courseId}`);
                                                                }}
                                                                className="w-full bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <Play className="w-4 h-4" />
                                                                Continuer le cours
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-4">Vous n'êtes inscrit à aucun cours</p>
                                                <Link
                                                    to="/formations"
                                                    className="inline-block bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                                                >
                                                    Découvrir les formations
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mes Commandes Récentes */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-mdla-black flex items-center gap-2">
                                            <Package className="w-6 h-6" />
                                            Mes Commandes Récentes
                                        </h2>
                                        <Link to="/dashboard/commandes" className="text-sm text-mdla-yellow hover:text-yellow-600 font-semibold">
                                            Voir tout →
                                        </Link>
                                    </div>

                                    {recentOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentOrders.map((order) => (
                                                <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-mdla-yellow transition-all bg-gray-50/30">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                                                            {order.type === 'vehicle' ? <Truck className="w-8 h-8 text-blue-500" /> : <Package className="w-8 h-8 text-orange-500" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="font-bold text-mdla-black">{order.items?.[0]?.description || order.type}</h3>
                                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">N° {order.trackingNumber}</p>
                                                            <div className="mt-3 flex items-center justify-between">
                                                                <span className="text-xs font-bold text-mdla-black">
                                                                    {parseFloat(order.totalAmount).toLocaleString()} FCFA
                                                                </span>
                                                                <Link to={`/suivi/${order.trackingNumber}`} className="text-xs font-black text-mdla-yellow hover:underline">
                                                                    Détails →
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
