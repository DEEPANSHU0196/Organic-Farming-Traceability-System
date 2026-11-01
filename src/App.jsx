import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import GlobalEffects from './components/GlobalEffects';
import SiteFooter from './components/SiteFooter';
import { ProductProvider } from './contexts/ProductContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { BuyerProvider } from './contexts/BuyerContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import WorkflowSection from './components/WorkflowSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import ProtectedRoute from './components/ProtectedRoute';

import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ProductTraceability from './pages/ProductTraceability';
import ScanPage from './pages/ScanPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import AgroChatbot from './components/Chatbot/AgroChatbot';


// Home Page
function HomePage() {
  return (
    <div className="home-page font-sans antialiased overflow-x-clip">
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
      <SiteFooter />

    </div>
  );
}



const pageVariants = {
  // Opacity only: transforms/filters on this wrapper would break the
  // position:fixed navbars and sidebars rendered inside each page.
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname.split('/')[1] || 'home'} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location} key={location.pathname.split('/')[1] || 'home'}>

          {/* Home */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Farmer */}
          <Route
            path="/farmer-dashboard/*"
            element={
              <ProtectedRoute requiredRole={["farmer", "admin"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Buyer */}
          <Route
            path="/buyer-dashboard/*"
            element={
              <ProtectedRoute requiredRole={["buyer", "admin"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Transporter */}
          <Route
            path="/transporter-dashboard/*"
            element={
              <ProtectedRoute requiredRole={["transporter", "admin"]}>
                <TransporterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Camera QR scanner */}
          <Route path="/scan" element={<ScanPage />} />

          {/* Public farmer profile */}
          <Route path="/farmer/:id" element={<FarmerProfilePage />} />

          {/* QR Traceability */}
          <Route
            path="/trace/:id"
            element={
              <ProductTraceability />
            }
          />

        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
    <LanguageProvider>
    <ToastProvider>
      <AuthProvider>
        <DashboardProvider>
          <ProductProvider>
            <BuyerProvider>

              <Router>

                <AnimatedRoutes />

                <GlobalEffects />
                <AgroChatbot />

              </Router>

            </BuyerProvider>
          </ProductProvider>
        </DashboardProvider>
      </AuthProvider>
    </ToastProvider>
    </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;