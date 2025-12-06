import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

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
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <div className="w-32 h-12 bg-mdla-yellow flex items-center justify-center rounded font-bold text-mdla-black text-2xl">
                MDLA
              </div>
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
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
                Services
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden">
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

            <a href="/boutique" className="text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
              Boutique
            </a>
            <a href="/contact" className="text-mdla-black hover:text-mdla-yellow font-medium transition-colors">
              Contact
            </a>
          </div>

          <div className="hidden md:block">
            <a
              href="/connexion"
              className="bg-mdla-red text-white px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all"
            >
              Connexion
            </a>
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
