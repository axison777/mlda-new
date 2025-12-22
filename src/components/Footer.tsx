import { MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-mdla-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="mb-4 inline-flex items-center justify-center w-auto px-4 h-12 bg-mdla-yellow rounded font-bold text-mdla-black text-2xl whitespace-nowrap">
              MDLA Service
            </div>
            <p className="text-gray-300 mt-4 leading-relaxed">
              Votre partenaire de confiance pour réussir vos projets professionnels en Allemagne.
            </p>
          </div>

          <div>
            <h3 className="text-mdla-yellow font-bold text-lg mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-mdla-yellow transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/boutique" className="text-gray-300 hover:text-mdla-yellow transition-colors">
                  Boutique
                </a>
              </li>
              <li>
                <a href="/formations" className="text-gray-300 hover:text-mdla-yellow transition-colors">
                  Formations
                </a>
              </li>
              <li>
                <a href="/connexion" className="text-gray-300 hover:text-mdla-yellow transition-colors">
                  Connexion
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-mdla-yellow font-bold text-lg mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-mdla-yellow flex-shrink-0 mt-1" />
                <div className="text-gray-300 text-sm">
                  <p>Burkina Faso, Ouagadougou</p>
                  <p>Commune de Saaba (près de l'USTA)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-mdla-yellow flex-shrink-0 mt-1" />
                <div className="text-gray-300 text-sm">
                  <p>
                    <a href="tel:+22650194949" className="hover:text-mdla-yellow transition-colors">
                      +226 50 19 49 49
                    </a>
                  </p>
                  <p>
                    <a href="tel:+491799281957" className="hover:text-mdla-yellow transition-colors">
                      +49 179 928 1957
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-mdla-yellow flex-shrink-0 mt-1" />
                <div className="text-gray-300 text-sm">
                  <p>Lun-Ven : 08H-16H</p>
                  <p>Sam : 09H-15H</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 MDLA Service - La Maison de l'Allemagne. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
