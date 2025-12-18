import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Package,
    Play,
    CheckCircle,
    Clock,
    MapPin,
    ArrowRight,
    Award,
    Truck,
    Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserSidebar from '../../components/UserSidebar';

const UserOverview = () => {
    const { user: authUser } = useAuth();

    // --- MOCK USER FOR TESTING SCENARIOS ---
    // Change these values to test different views:
    // Case A (Student): enrollments: [...], orders: []
    // Case B (Client): enrollments: [], orders: [...]
    // Case C (Hybrid): enrollments: [...], orders: [...]
    // Case D (New): enrollments: [], orders: []

    const [mockUser, setMockUser] = useState({
        ...authUser,
        name: authUser?.name || 'Utilisateur',
        enrollments: [
            { id: 1, title: 'Allemand B1 : Intermédiaire', progress: 65, lastLesson: 'Les verbes de modalité', image: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?auto=format&fit=crop&q=80&w=300&h=200' }
        ],
        orders: [
            { id: 'ORD-2023-001', item: 'Mercedes C300', status: 'shipping', tracking: 'TRK-9988', location: 'En Mer', eta: '15 Nov' }
        ]
    });

    // Toggle helpers for testing UI (Optional, can be removed in prod)
    const toggleRole = (role) => {
        if (role === 'student') {
            setMockUser(prev => ({
                ...prev,
                enrollments: prev.enrollments.length ? [] : [{ id: 1, title: 'Allemand B1', progress: 65, lastLesson: 'Les verbes', image: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b' }]
            }));
        } else if (role === 'client') {
            setMockUser(prev => ({
                ...prev,
                orders: prev.orders.length ? [] : [{ id: 'ORD-1', item: 'Mercedes C300', status: 'shipping', tracking: 'TRK-99', location: 'En Mer', eta: '15 Nov' }]
            }));
        }
    };

    const isStudent = mockUser.enrollments && mockUser.enrollments.length > 0;
    const isClient = mockUser.orders && mockUser.orders.length > 0;

    // --- COMPONENTS ---

    const HeroSection = ({ title, subtitle, bgClass = "bg-mdla-yellow" }) => (
        <div className={`${bgClass} rounded-3xl p-8 mb-8 text-mdla-black relative overflow-hidden`}>
            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="text-lg opacity-90">{subtitle}</p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 transform skew-x-12"></div>
        </div>
    );

    const CourseCard = ({ course, fullWidth = false }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col ${fullWidth ? 'md:flex-row items-center gap-8' : 'gap-4'}`}>
            <div className={`${fullWidth ? 'w-full md:w-1/3 h-48' : 'w-full h-40'} rounded-xl overflow-hidden bg-gray-200`}>
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">En cours</span>
                    <span className="text-sm font-bold text-gray-500">{course.progress}%</span>
                </div>
                <h3 className={`font-bold text-gray-900 mb-1 ${fullWidth ? 'text-2xl' : 'text-lg'}`}>{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">Dernière leçon : {course.lastLesson}</p>

                <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                    <div className="bg-mdla-yellow h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>

                <button className="bg-mdla-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
                    <Play className="w-4 h-4" />
                    Reprendre la leçon
                </button>
            </div>
        </div>
    );

    const TrackingCard = ({ order, fullWidth = false }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${fullWidth ? '' : 'h-full flex flex-col'}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 rounded-xl">
                        <Truck className="w-8 h-8 text-mdla-yellow" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{order.item}</h3>
                        <p className="text-sm text-gray-500">Tracking: {order.tracking}</p>
                    </div>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    {order.location}
                </span>
            </div>

            <div className="space-y-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Statut Actuel</p>
                        <p className="text-sm text-gray-500">{order.location} - Arrivée prévue le {order.eta}</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <button className="w-full border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                    Voir détails complets
                </button>
            </div>
        </div>
    );

    // --- RENDER LOGIC ---

    const renderContent = () => {
        // CASE D: NEW USER (Ni étudiant, ni client)
        if (!isStudent && !isClient) {
            return (
                <div className="max-w-5xl mx-auto py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue chez MDLA ! 👋</h1>
                        <p className="text-xl text-gray-500">Que souhaitez-vous faire aujourd'hui ?</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Link to="/formations" className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-100 hover:border-mdla-yellow transition-all shadow-lg hover:shadow-xl p-8 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-10 h-10 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apprendre l'Allemand</h2>
                            <p className="text-gray-500 mb-8">Des cours interactifs pour tous les niveaux. Commencez votre apprentissage maintenant.</p>
                            <span className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                                Découvrir les cours <ArrowRight className="w-5 h-5" />
                            </span>
                        </Link>

                        <Link to="/boutique" className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-100 hover:border-mdla-yellow transition-all shadow-lg hover:shadow-xl p-8 text-center">
                            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Package className="w-10 h-10 text-mdla-yellow" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Commander / Importer</h2>
                            <p className="text-gray-500 mb-8">Importez des véhicules ou marchandises depuis l'Europe en toute simplicité.</p>
                            <span className="inline-flex items-center gap-2 text-mdla-yellow font-bold group-hover:gap-4 transition-all">
                                Voir la boutique <ArrowRight className="w-5 h-5" />
                            </span>
                        </Link>
                    </div>
                </div>
            );
        }

        // CASE C: HYBRID (Étudiant & Client)
        if (isStudent && isClient) {
            return (
                <div className="max-w-7xl mx-auto">
                    <HeroSection
                        title={`Ravi de vous revoir, ${mockUser.name.split(' ')[0]}`}
                        subtitle="Voici un résumé de vos activités en cours."
                    />

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: Learning */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" /> Mon Apprentissage
                                </h2>
                                <Link to="/dashboard/mes-cours" className="text-sm text-blue-600 font-bold hover:underline">Voir tout</Link>
                            </div>
                            {mockUser.enrollments.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {/* Right: Orders */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Package className="w-5 h-5" /> Mes Commandes
                                </h2>
                                <Link to="/dashboard/commandes" className="text-sm text-mdla-yellow font-bold hover:underline">Voir tout</Link>
                            </div>
                            {mockUser.orders.map(order => (
                                <TrackingCard key={order.id} order={order} />
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // CASE A: STUDENT ONLY
        if (isStudent) {
            return (
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <HeroSection
                            title={`Bon retour en classe, ${mockUser.name.split(' ')[0]} 🎓`}
                            subtitle="Prêt à continuer votre progression ?"
                            bgClass="bg-blue-100 text-blue-900"
                        />

                        <h2 className="text-xl font-bold text-gray-900 mb-4">Dernier cours consulté</h2>
                        {mockUser.enrollments.map(course => (
                            <CourseCard key={course.id} course={course} fullWidth={true} />
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" /> Certificats
                            </h3>
                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucun certificat pour le moment.</p>
                                <p className="text-xs">Terminez un cours pour en obtenir un !</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" /> Prochains Quiz
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    Verbes irréguliers (Demain)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                    Vocabulaire B1 (Dans 3 jours)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }

        // CASE B: CLIENT ONLY
        if (isClient) {
            return (
                <div className="max-w-7xl mx-auto">
                    <HeroSection
                        title={`Suivi de vos achats, ${mockUser.name.split(' ')[0]} 📦`}
                        subtitle="Suivez vos expéditions en temps réel."
                    />

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Suivi en cours</h2>
                            {mockUser.orders.map(order => (
                                <div key={order.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{order.item}</h3>
                                            <p className="text-gray-500">Tracking ID: {order.tracking}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Arrivée estimée</p>
                                            <p className="text-xl font-bold text-green-600">{order.eta}</p>
                                        </div>
                                    </div>

                                    {/* Tracking Timeline */}
                                    <div className="relative flex justify-between items-center mb-8">
                                        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10"></div>
                                        <div className="absolute left-0 top-1/2 w-1/2 h-1 bg-mdla-yellow -z-10"></div>

                                        {['Commande', 'Expédition', 'Douane', 'Livraison'].map((step, index) => (
                                            <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 2 ? 'bg-mdla-yellow text-mdla-black' :
                                                    index === 2 ? 'bg-mdla-yellow text-mdla-black ring-4 ring-yellow-100' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className={`text-xs font-medium ${index <= 2 ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="font-bold text-gray-900">Dernière position connue</p>
                                            <p className="text-sm text-gray-600">{order.location} - Le 12 Oct à 14:30</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Historique</h2>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="text-center py-8 text-gray-400">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Pas d'anciennes commandes.</p>
                                </div>
                                <button className="w-full mt-4 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                    Voir tout l'historique
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Dev Tools for Testing */}
            <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-xl backdrop-blur-sm z-50 text-xs">
                <p className="font-bold mb-2 uppercase tracking-wider text-gray-400">Dev Mode: Toggle Roles</p>
                <div className="flex gap-2">
                    <button onClick={() => toggleRole('student')} className={`px-3 py-1 rounded ${isStudent ? 'bg-blue-600' : 'bg-gray-700'}`}>
                        Student {isStudent ? 'ON' : 'OFF'}
                    </button>
                    <button onClick={() => toggleRole('client')} className={`px-3 py-1 rounded ${isClient ? 'bg-yellow-600' : 'bg-gray-700'}`}>
                        Client {isClient ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default UserOverview;
