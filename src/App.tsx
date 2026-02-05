import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';
import { OrdersProvider } from './context/OrdersContext';
import { PaymentProvider } from './context/PaymentContext';
import { ChatProvider } from './context/ChatContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import EmergencyOverlayKiller from './components/EmergencyOverlayKiller';
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
import TeacherOverview from './pages/dashboards/TeacherOverview';
import TeacherCourses from './pages/dashboards/TeacherCourses';
import TeacherStudents from './pages/dashboards/TeacherStudents';
import TeacherMessages from './pages/dashboards/TeacherMessages';
import CourseBuilder from './pages/dashboards/CourseBuilder';
import TransitDashboard from './pages/dashboards/TransitDashboard';
import TransitOverview from './pages/dashboards/TransitOverview';
import ActiveShipments from './pages/dashboards/ActiveShipments';
import SourcingRequests from './pages/dashboards/SourcingRequests';
import CreateFolder from './pages/dashboards/CreateFolder';
import TransitChat from './pages/dashboards/TransitChat';
import CourseViewer from './pages/dashboards/CourseViewer';
import AdminOverview from './pages/dashboards/AdminOverview';
import AdminEducation from './pages/dashboards/AdminEducation';
import AdminLogistics from './pages/dashboards/AdminLogistics';
import AdminCreateFolder from './pages/dashboards/AdminCreateFolder';
import AdminShop from './pages/dashboards/AdminShop';
import AdminMessages from './pages/dashboards/AdminMessages';
import AdminContactMessages from './pages/dashboards/AdminContactMessages';
import AdminUsers from './pages/dashboards/AdminUsers';
import AdminMarketing from './pages/dashboards/AdminMarketing';
import AdminFinance from './pages/dashboards/AdminFinance';
import Messages from './pages/Messages';

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
      return <TeacherOverview />;
    case 'transit':
      return <TransitOverview />;
    case 'admin':
      return <AdminOverview />;
    default:
      return <UserDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <OrdersProvider>
          <PaymentProvider>
            <CartProvider>
              <ChatProvider>
                <EmergencyOverlayKiller />
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
                    <Route path="formation" element={<AdminEducation />} />
                    <Route path="logistique" element={<AdminLogistics />} />
                    <Route path="admin-creation-dossier" element={<AdminCreateFolder />} />
                    <Route path="boutique" element={<AdminShop />} />
                    <Route path="communication" element={<AdminMessages />} />
                    <Route path="messages-contact" element={<AdminContactMessages />} />
                    <Route path="utilisateurs" element={<AdminUsers />} />
                    <Route path="marketing" element={<AdminMarketing />} />
                    <Route path="finances" element={<AdminFinance />} />

                    {/* Teacher Routes */}
                    <Route path="mes-cours" element={<TeacherCourses />} />
                    <Route path="mes-cours/:courseId/view" element={<CourseViewer />} />
                    <Route path="creer-cours" element={<CourseBuilder />} />
                    <Route path="editer-cours/:courseId" element={<CourseBuilder />} />
                    <Route path="etudiants" element={<TeacherStudents />} />
                    <Route path="messagerie-prof" element={<TeacherMessages />} />

                    {/* Transit Routes */}
                    <Route path="transit-dossiers" element={<ActiveShipments />} />
                    <Route path="transit-sourcing" element={<SourcingRequests />} />
                    <Route path="transit-nouveau" element={<CreateFolder />} />
                    <Route path="transit-messagerie" element={<TransitChat />} />
                    <Route path="transit-archives" element={<div className="p-8">Archives (À venir)</div>} />

                    {/* Client Routes */}
                    <Route path="cours/:courseId" element={<CourseViewer />} />
                    <Route path="formations" element={<div className="p-8"><h1 className="text-2xl font-bold">Mes Formations</h1></div>} />
                    <Route path="commandes" element={<div className="p-8"><h1 className="text-2xl font-bold">Mes Commandes</h1></div>} />
                    <Route path="messagerie" element={<Messages />} />
                    <Route path="profil" element={<div className="p-8"><h1 className="text-2xl font-bold">Mon Profil</h1></div>} />
                  </Route>
                </Routes>
              </ChatProvider>
            </CartProvider>
          </PaymentProvider>
        </OrdersProvider>
      </CoursesProvider>
    </AuthProvider>
  );
}

export default App;
