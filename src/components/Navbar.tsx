import { useState } from 'react';
import { Menu, X, ChevronDown, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const servicesMenu = [
    { label: 'Formation & Langue', href: '/services/formation' },
    { label: 'Import / Export & Véhicules', href: '/services/import-export' },
    { label: 'Représentation & B2B', href: '/services/b2b' },
    { label: 'Traduction & Démarches', href: '/services/traduction' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 -ml-4">
            <a href="/" className="flex items-center">
              <img src={logo} alt="MDLA Service Logo" className="h-20 w-auto object-contain" />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
              Accueil
            </a>
            <a href="/a-propos" className="text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
              À Propos
            </a>

            <div
              className="relative group"
            >
              <button
                className="flex items-center text-mdla-black hover:text-mdla-yellow font-medium transition-colors"
                onMouseEnter={() => setIsServicesOpen(true)}
              >
                Services
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServicesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  {servicesMenu.map((service, index) => (
                    <a
                      key={index}
                      href={service.href}
                      className="block px-4 py-3 text-mdla-black hover:bg-mdla-yellow hover:text-mdla-black transition-colors"
                    >
                      {service.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/formations" className="text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
              Formations
            </a>
            <a href="/boutique" className="text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
              Boutique
            </a>
            <a href="/contact" className="text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
              Contact
            </a>
          </div>

          {/* Cart Icon & Connexion */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-mdla-black hover:text-mdla-yellow transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-mdla-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                >
                  <User className="w-5 h-5" />
                  {user?.name?.split(' ')[0] || 'Mon Compte'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50"
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <a
                      href="/dashboard"
                      className="block px-4 py-3 text-mdla-black hover:bg-gray-100 transition-colors"
                    >
                      Mon Tableau de Bord
                    </a>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-mdla-red hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/connexion"
                className="bg-mdla-yellow text-mdla-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Connexion
              </a>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-mdla-black hover:text-mdla-yellow"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-mdla-yellow">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a
              href="/"
              className="block px-4 py-3 text-mdla-black font-medium hover:bg-mdla-black hover:text-mdla-yellow rounded transition-colors"
            >
              Accueil
            </a>
            <a
              href="/a-propos"
              className="block px-4 py-3 text-mdla-black font-medium hover:bg-mdla-black hover:text-mdla-yellow rounded transition-colors"
            >
              À Propos
            </a>

            <div className="px-4 py-3">
              <div className="font-medium text-mdla-black mb-2">Services</div>
              <div className="pl-4 space-y-2">
                {servicesMenu.map((service, index) => (
                  <a
                    key={index}
                    href={service.href}
                    className="block py-2 text-mdla-black hover:text-mdla-red transition-colors"
                  >
                    {service.label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/formations"
              className="block px-4 py-3 text-mdla-black font-medium hover:bg-mdla-black hover:text-mdla-yellow rounded transition-colors"
            >
              Formations
            </a>
            <a
              href="/boutique"
              className="block px-4 py-3 text-mdla-black font-medium hover:bg-mdla-black hover:text-mdla-yellow rounded transition-colors"
            >
              Boutique
            </a>
            <a
              href="/contact"
              className="block px-4 py-3 text-mdla-black font-medium hover:bg-mdla-black hover:text-mdla-yellow rounded transition-colors"
            >
              Contact
            </a>

            <a
              href="/connexion"
              className="block mx-4 mt-4 px-4 py-3 bg-mdla-red text-white text-center font-medium rounded hover:bg-opacity-90 transition-all"
            >
              Connexion
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
