import { Link, useLocation } from 'react-router-dom';
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
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                    { path: '/dashboard', label: 'Accueil', icon: Home },
                    { path: '/dashboard/creer-cours', label: 'Créer un Cours', icon: PlusCircle },
                    { path: '/dashboard/etudiants', label: 'Mes Étudiants', icon: Users },
                    { path: '/dashboard/messagerie', label: 'Messagerie', icon: MessageSquare },
                ];

            case 'transit':
                return [
                    { path: '/dashboard', label: 'Accueil', icon: Home },
                    { path: '/dashboard/expeditions', label: 'Liste Expéditions', icon: Package },
                    { path: '/dashboard/tracking', label: 'Mettre à jour Tracking', icon: MapPin },
                ];

            case 'admin':
                return [
                    { path: '/dashboard', label: 'Vue d\'ensemble', icon: Home },
                    { path: '/dashboard/finances', label: 'Finances', icon: DollarSign },
                    { path: '/dashboard/utilisateurs', label: 'Utilisateurs', icon: Users },
                    { path: '/dashboard/validation-cours', label: 'Validation Cours', icon: CheckSquare },
                    { path: '/dashboard/boutique', label: 'Gestion Boutique', icon: Store },
                    { path: '/dashboard/statistiques', label: 'Statistiques', icon: BarChart3 },
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
                    <div className="w-10 h-10 bg-mdla-yellow rounded-lg flex items-center justify-center">
                        <span className="text-mdla-black font-bold text-xl">M</span>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">MDLA</h1>
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
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        active
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

            {/* User Info Section */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-mdla-yellow rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-mdla-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user?.email}</p>
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
