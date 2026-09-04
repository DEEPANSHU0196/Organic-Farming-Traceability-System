import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { BuyerProvider } from './contexts/BuyerContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import ProtectedRoute from './components/ProtectedRoute';

import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ProductTraceability from './pages/ProductTraceability';


// Home Page
function HomePage() {
  return (
    <div className="home-page relative text-primary font-sans selection:bg-surface-warm selection:text-primary antialiased overflow-x-hidden">

      <HeroSection />

      <div className="relative z-10">
        <FeaturesSection />
      </div>

      <div className="relative z-10">
        <AboutSection />
      </div>

      <div className="relative z-10">
        <ContactSection />
      </div>

      <footer className="relative z-10 border-t border-surface-alt">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-accent-muted/60">

          <div className="flex items-center gap-2">
            <span className="text-base">🌿</span>
            <p>
              &copy; 2026 AgroVerse.
              All rights reserved.
            </p>
          </div>

          <p className="hidden sm:block">
            Empowering Indian Agriculture · Built with ❤️
          </p>

          <div className="flex items-center gap-4">
            <a
              href="mailto:support@agroverse.com"
              className="hover:text-primary transition-colors"
            >
              Contact
            </a>

            <span>·</span>

            <span>India</span>
          </div>

        </div>
      </footer>

    </div>
  );
}



function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardProvider>
          <ProductProvider>
            <BuyerProvider>

              <Router>

                <Routes>

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

                  {/* QR Traceability */}
                  <Route
                    path="/trace/:id"
                    element={
                      <ProductTraceability />
                    }
                  />

                </Routes>

              </Router>

            </BuyerProvider>
          </ProductProvider>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;