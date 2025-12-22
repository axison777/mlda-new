import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    User,
    MessageSquare,
    BookOpen,
    Package,
    LogOut,
    Compass,
    Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserSidebar = ({ mockUserOverride }) => {
    const { user: authUser, logout } = useAuth();
    const location = useLocation();

    // Allow overriding user for testing purposes via props, otherwise use auth context
    // In a real scenario, we might merge them or just use authUser
    // For this task, we'll assume the parent might pass a mockUser to control the sidebar state
    const user = mockUserOverride || authUser;

    // Determine profiles based on data
    // Fallback to empty arrays if undefined to prevent errors
    const isStudent = user?.enrollments?.length > 0;
    const isClient = user?.orders?.length > 0;

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(to)
                ? 'bg-mdla-yellow text-mdla-black font-bold shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </Link>
    );

    return (
        <aside className="fixed inset-y-0 left-0 bg-white w-64 border-r border-gray-200 z-30 hidden lg:flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-mdla-black rounded-lg flex items-center justify-center text-mdla-yellow font-bold text-2xl">
                        M
                    </div>
                    <span className="text-xl font-bold text-mdla-black tracking-tight">MDLA Service</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                    <NavItem to="/dashboard" icon={Home} label="Accueil" />
                    <NavItem to="/dashboard/profil" icon={User} label="Mon Profil" />
                    <NavItem to="/dashboard/messagerie" icon={MessageSquare} label="Messagerie" />
                </div>

                {/* Conditional Sections */}
                {(isStudent || isClient) && (
                    <div className="mb-6">
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mes Activités</p>

                        {isStudent && (
                            <NavItem to="/dashboard/mes-cours" icon={BookOpen} label="Mon Apprentissage" />
                        )}

                        {isClient && (
                            <NavItem to="/dashboard/commandes" icon={Package} label="Mes Commandes" />
                        )}
                    </div>
                )}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-mdla-yellow transition-colors group"
                >
                    <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    <div>
                        <p className="text-sm font-medium">Découverte</p>
                        <p className="text-xs text-gray-400">Voir nos autres services</p>
                    </div>
                </Link>

                <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span>Retour au site</span>
                </Link>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;
