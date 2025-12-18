import React from 'react';
import {
    Users,
    BookOpen,
    MessageSquare,
    Clock,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import KPICard from '../../components/KPICard';

const TeacherOverview = () => {
    // Mock Data for KPIs
    const kpiData = {
        totalStudents: 156,
        activeCourses: 4,
        unreadMessages: 12
    };

    // Mock Recent Activity
    const recentActivity = [
        { id: 1, type: 'registration', user: 'Sophie Martin', detail: 's\'est inscrite au niveau A2', time: 'Il y a 2h' },
        { id: 2, type: 'submission', user: 'Jean Dupont', detail: 'a rendu le devoir "Grammaire B1"', time: 'Il y a 4h' },
        { id: 3, type: 'registration', user: 'Moussa Diop', detail: 's\'est inscrit au niveau B1', time: 'Il y a 5h' },
        { id: 4, type: 'message', user: 'Fatou Sow', detail: 'a posé une question sur le cours A1', time: 'Il y a 1j' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
                    <p className="text-gray-500">Bienvenue, Professeur</p>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Total Étudiants"
                    value={kpiData.totalStudents}
                    icon={Users}
                    color="blue"
                    trend={{ positive: true, value: "+12 this month" }}
                />
                <KPICard
                    title="Cours Actifs"
                    value={kpiData.activeCourses}
                    icon={BookOpen}
                    color="yellow"
                    subtitle="En ligne"
                />
                <KPICard
                    title="Messages Non lus"
                    value={kpiData.unreadMessages}
                    icon={MessageSquare}
                    color="red"
                    subtitle="À traiter"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Activité Récente</h2>
                        <button className="text-sm text-mdla-yellow hover:text-yellow-600 font-medium flex items-center gap-1">
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className={`p-2 rounded-full flex-shrink-0 ${activity.type === 'registration' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'submission' ? 'bg-blue-100 text-blue-600' :
                                            'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {activity.type === 'registration' ? <Users className="w-4 h-4" /> :
                                        activity.type === 'submission' ? <CheckCircle className="w-4 h-4" /> :
                                            <MessageSquare className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        <span className="font-bold">{activity.user}</span> {activity.detail}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Next Class Placeholder */}
                <div className="bg-gradient-to-br from-mdla-black to-gray-900 p-6 rounded-xl shadow-sm text-white">
                    <h2 className="text-lg font-semibold mb-4">Prochain Cours Live</h2>
                    <div className="bg-white/10 p-4 rounded-lg mb-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xl">Allemand B1 - Conversation</h3>
                            <span className="bg-mdla-yellow text-mdla-black text-xs font-bold px-2 py-1 rounded">Aujourd'hui</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">Chapitre 4 : Les voyages et les vacances</p>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                18:00 - 19:30
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                12 Inscrits
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-mdla-yellow hover:bg-yellow-400 text-mdla-black font-bold py-3 rounded-lg transition-colors">
                        Démarrer la session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherOverview;
