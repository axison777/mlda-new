import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';
import { PaymentProvider } from './context/PaymentContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import CoursesPage from './pages/CoursesPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import QuotePage from './pages/QuotePage';
import TrackingPage from './pages/TrackingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import FormationServicePage from './pages/services/FormationServicePage';
import ImportExportServicePage from './pages/services/ImportExportServicePage';
import RepresentationServicePage from './pages/services/RepresentationServicePage';
import TraductionServicePage from './pages/services/TraductionServicePage';
import UserDashboard from './pages/dashboards/UserDashboard';
import ProfDashboard from './pages/dashboards/ProfDashboard';
import TransitDashboard from './pages/dashboards/TransitDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Dashboard Router Component - renders appropriate dashboard based on role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  switch (user.role) {
    case 'client':
    case 'student':
      return <UserDashboard />;
    case 'prof':
      return <ProfDashboard />;
    case 'transit':
      return <TransitDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <UserDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <PaymentProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route path="/" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <HomePage />
                  <Footer />
                </div>
              } />
              <Route path="/a-propos" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <AboutPage />
                  <Footer />
                </div>
              } />
              <Route path="/services" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <ServicesPage />
                  <Footer />
                </div>
              } />
              <Route path="/services/formation" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <FormationServicePage />
                  <Footer />
                </div>
              } />
              <Route path="/services/import-export" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <ImportExportServicePage />
                  <Footer />
                </div>
              } />
              <Route path="/services/representation" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <RepresentationServicePage />
                  <Footer />
                </div>
              } />
              <Route path="/services/traduction" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <TraductionServicePage />
                  <Footer />
                </div>
              } />
              <Route path="/contact" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <ContactPage />
                  <Footer />
                </div>
              } />
              <Route path="/formations" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <CoursesPage />
                  <Footer />
                </div>
              } />
              <Route path="/boutique" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <ShopPage />
                  <Footer />
                </div>
              } />
              <Route path="/panier" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <CartPage />
                  <Footer />
                </div>
              } />
              <Route path="/devis" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <QuotePage />
                  <Footer />
                </div>
              } />
              <Route path="/suivi" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <TrackingPage />
                  <Footer />
                </div>
              } />
              <Route path="/suivi/:trackingNumber" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <TrackingPage />
                  <Footer />
                </div>
              } />
              <Route path="/connexion" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <LoginPage />
                  <Footer />
                </div>
              } />
              <Route path="/inscription" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <SignupPage />
                  <Footer />
                </div>
              } />
              <Route path="/checkout" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <CartSidebar />
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                  <Footer />
                </div>
              } />
              <Route path="/payment/success/:transactionId" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <PaymentSuccessPage />
                  <Footer />
                </div>
              } />
              <Route path="/payment/failed" element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <PaymentFailedPage />
                  <Footer />
                </div>
              } />

              {/* Dashboard Routes - No Navbar/Footer, uses DashboardLayout with Sidebar */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardRouter />} />
                {/* Placeholder routes for future implementation */}
                <Route path="formations" element={<div className="p-8"><h1 className="text-2xl font-bold">Mes Formations</h1></div>} />
                <Route path="commandes" element={<div className="p-8"><h1 className="text-2xl font-bold">Mes Commandes</h1></div>} />
                <Route path="messagerie" element={<div className="p-8"><h1 className="text-2xl font-bold">Messagerie</h1></div>} />
                <Route path="profil" element={<div className="p-8"><h1 className="text-2xl font-bold">Mon Profil</h1></div>} />
                <Route path="creer-cours" element={<div className="p-8"><h1 className="text-2xl font-bold">Créer un Cours</h1></div>} />
                <Route path="etudiants" element={<div className="p-8"><h1 className="text-2xl font-bold">Mes Étudiants</h1></div>} />
                <Route path="expeditions" element={<div className="p-8"><h1 className="text-2xl font-bold">Liste Expéditions</h1></div>} />
                <Route path="tracking" element={<div className="p-8"><h1 className="text-2xl font-bold">Mettre à jour Tracking</h1></div>} />
                <Route path="finances" element={<div className="p-8"><h1 className="text-2xl font-bold">Finances</h1></div>} />
                <Route path="utilisateurs" element={<div className="p-8"><h1 className="text-2xl font-bold">Utilisateurs</h1></div>} />
                <Route path="validation-cours" element={<div className="p-8"><h1 className="text-2xl font-bold">Validation Cours</h1></div>} />
                <Route path="boutique" element={<div className="p-8"><h1 className="text-2xl font-bold">Gestion Boutique</h1></div>} />
                <Route path="statistiques" element={<div className="p-8"><h1 className="text-2xl font-bold">Statistiques</h1></div>} />
              </Route>
            </Routes>
          </CartProvider>
        </PaymentProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;
