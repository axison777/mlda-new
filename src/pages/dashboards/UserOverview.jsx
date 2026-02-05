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
import { useOrders } from '../../context/OrdersContext';

const UserOverview = () => {
    const { orders: myOrders, loading: ordersLoading } = useOrders();
    const { user: authUser } = useAuth();

    const isStudent = false; // Add real course integration later
    const isClient = myOrders && myOrders.length > 0;
    const activeOrders = myOrders.filter(o => o.status !== 'delivered');
    const completedOrders = myOrders.filter(o => o.status === 'delivered');

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

                <Link to="/dashboard/mes-cours" className="bg-mdla-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
                    <Play className="w-4 h-4" />
                    Reprendre la leçon
                </Link>
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
                        <h3 className="font-bold text-gray-900 text-lg">{order.items?.[0]?.name || order.type}</h3>
                        <p className="text-sm text-gray-500">Tracking: {order.trackingNumber}</p>
                    </div>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    {order.currentLocation || 'En transit'}
                </span>
            </div>

            <div className="space-y-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut Actuel</p>
                        <p className="text-sm font-bold text-gray-900">
                            {order.status || 'En attente traitement'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <Link to={`/suivi/${order.trackingNumber}`} className="w-full bg-gray-900 text-white px-4 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all flex justify-center items-center shadow-lg group">
                    Suivre mon colis
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
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
                        title={`Ravi de vous revoir, ${authUser?.name?.split(' ')[0] || 'Utilisateur'}`}
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
                            {/* Assuming enrollments will come from authUser or another context later */}
                            {/* For now, this section will be empty if isStudent is false */}
                            {/* {authUser.enrollments.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))} */}
                        </div>

                        {/* Right: Orders */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 font-outfit uppercase tracking-tighter">
                                    <Package className="w-5 h-5 text-mdla-yellow" /> Mes Commandes
                                </h2>
                                <Link to="/dashboard/commandes" className="text-[10px] font-black text-mdla-yellow uppercase tracking-widest hover:underline">Voir tout</Link>
                            </div>
                            <div className="space-y-4">
                                {myOrders.slice(0, 3).map(order => (
                                    <TrackingCard key={order.id} order={order} />
                                ))}
                            </div>
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
                            title={`Bon retour en classe, ${authUser?.name?.split(' ')[0] || 'Utilisateur'} 🎓`}
                            subtitle="Prêt à continuer votre progression ?"
                            bgClass="bg-blue-100 text-blue-900"
                        />

                        <h2 className="text-xl font-bold text-gray-900 mb-4">Dernier cours consulté</h2>
                        {/* For now, this section will be empty if isStudent is false */}
                        {/* {authUser.enrollments.map(course => (
                            <CourseCard key={course.id} course={course} fullWidth={true} />
                        ))} */}
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
                        title={`Suivi de vos achats, ${authUser?.name?.split(' ')[0] || 'Utilisateur'} 📦`}
                        subtitle="Suivez vos expéditions en temps réel."
                    />

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-2xl font-black text-gray-900 font-outfit uppercase tracking-tighter flex items-center gap-3">
                                <Clock className="w-6 h-6 text-mdla-yellow" />
                                Suivis en cours
                            </h2>
                            <div className="grid gap-6">
                                {activeOrders.map(order => (
                                    <div key={order.id} className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 hover:border-mdla-yellow transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-mdla-yellow/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
                                            <div className="flex items-center gap-5">
                                                <div className={`p-4 rounded-2xl ${order.type === 'vehicle' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600 shadow-md ring-4 ring-white'}`}>
                                                    {order.type === 'vehicle' ? <Truck className="w-8 h-8" /> : <Package className="w-8 h-8" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{order.items?.[0]?.name || order.type}</h3>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {order.trackingNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-right mt-4 md:mt-0">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mise à jour</p>
                                                <p className="text-sm font-black text-mdla-black">{new Date(order.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* Simplified Step Bar */}
                                        <div className="relative h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-mdla-yellow transition-all duration-1000"
                                                style={{ width: `${(order.currentStep / (order.timeline?.length || 5)) * 100}%` }}
                                            />
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="bg-gray-50 flex-1 w-full px-6 py-4 rounded-[20px] flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <Link
                                                to={`/suivi/${order.trackingNumber}`}
                                                className="w-full md:w-auto bg-mdla-yellow text-mdla-black px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/20"
                                            >
                                                Suivre en temps réel
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-900 font-outfit uppercase tracking-tighter mb-4">Historique</h2>
                            <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-100">
                                {completedOrders.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Aucun historique</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {completedOrders.slice(0, 3).map(order => (
                                            <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-gray-900 uppercase leading-none">{order.items?.[0]?.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Livré le {new Date(order.updatedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Link to="/dashboard/commandes" className="w-full mt-6 bg-white border-2 border-gray-100 text-gray-900 px-4 py-3 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:border-mdla-yellow hover:bg-yellow-50/50 transition-all flex justify-center items-center">
                                    Voir tout l'historique
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            {renderContent()}
        </div>
    );
};

export default UserOverview;
