import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    BookOpen,
    ShoppingBag,
    MessageSquare,
    User,
    PlusCircle,
    Users,
    Package,
    MapPin,
    BarChart3,
    DollarSign,
    CheckSquare,
    Store,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logout();
            navigate('/');
        }
    };

    // Navigation items based on role
    const getNavigationItems = () => {
        const role = user?.role;

        switch (role) {
            case 'client':
            case 'student':
                return [
                    { path: '/dashboard', label: 'Accueil', icon: Home },
                    { path: '/dashboard/formations', label: 'Mes Formations', icon: BookOpen },
                    { path: '/dashboard/commandes', label: 'Mes Commandes', icon: ShoppingBag },
                    { path: '/dashboard/messagerie', label: 'Messagerie', icon: MessageSquare },
                    { path: '/dashboard/profil', label: 'Profil', icon: User },
                ];

            case 'prof':
                return [
                    { path: '/dashboard', label: 'Vue d\'ensemble', icon: Home },
                    { path: '/dashboard/mes-cours', label: 'Mes Cours', icon: BookOpen },
                    { path: '/dashboard/etudiants', label: 'Mes Étudiants', icon: Users },
                    { path: '/dashboard/messagerie-prof', label: 'Messagerie', icon: MessageSquare },
                ];

            case 'transit':
                return [
                    { path: '/dashboard', label: 'Vue d\'ensemble', icon: Home },
                    { path: '/dashboard/transit-dossiers', label: 'Dossiers en Cours', icon: Package },
                    { path: '/dashboard/transit-sourcing', label: 'Demandes de Devis', icon: ShoppingBag },
                    { path: '/dashboard/transit-nouveau', label: 'Créer un Dossier', icon: PlusCircle },
                    { path: '/dashboard/transit-messagerie', label: 'Messagerie', icon: MessageSquare },
                ];

            case 'admin':
                return [
                    { path: '/dashboard', label: 'Vue d\'ensemble', icon: Home },
                    { path: '/dashboard/formation', label: 'Pôle Formation', icon: BookOpen },
                    { path: '/dashboard/logistique', label: 'Pôle Logistique', icon: Package },
                    { path: '/dashboard/boutique', label: 'Pôle Boutique', icon: Store },
                    { path: '/dashboard/communication', label: 'Communication', icon: MessageSquare },
                    { path: '/dashboard/utilisateurs', label: 'Utilisateurs & Staff', icon: Users },
                    { path: '/dashboard/marketing', label: 'Marketing & Pubs', icon: BarChart3 },
                    { path: '/dashboard/finances', label: 'Finances', icon: DollarSign },
                ];

            default:
                return [
                    { path: '/dashboard', label: 'Accueil', icon: Home },
                ];
        }
    };

    const navigationItems = getNavigationItems();

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <>
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-800">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-mdla-yellow rounded-lg flex items-center justify-center">
                        <span className="text-mdla-black font-bold text-2xl">M</span>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-xl">MDLA Service</h1>
                        <p className="text-gray-400 text-xs capitalize">{user?.role || 'Dashboard'}</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active
                                        ? 'bg-mdla-yellow text-mdla-black font-semibold'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Info Section with Dropdown */}
            <div className="p-4 border-t border-gray-800">
                <div className="relative group">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-mdla-black" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100"
                        >
                            <Home className="w-4 h-4" />
                            <span className="text-sm font-medium">Retour au site</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-mdla-black text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-mdla-black h-screen fixed left-0 top-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Sidebar */}
                    <aside className="lg:hidden fixed left-0 top-0 w-64 bg-mdla-black h-screen z-50 flex flex-col">
                        <SidebarContent />
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;
