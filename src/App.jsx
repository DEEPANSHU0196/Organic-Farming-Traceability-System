import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { BuyerProvider } from './contexts/BuyerContext';
import { AuthProvider } from './contexts/AuthContext';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

// Home page component
function HomePage() {
  return (
    <div className="relative bg-white text-primary font-sans selection:bg-surface-warm selection:text-primary antialiased overflow-x-hidden">
      {/* ── Cinematic Hero — full-screen video section with embedded Navbar ── */}
      <HeroSection />

      {/* ── Features Section ── */}
      <div className="relative z-10 bg-white">
        <FeaturesSection />
      </div>

      {/* ── About Us Section ── */}
      <div className="relative z-10 bg-surface/40">
        <AboutSection />
      </div>

      {/* ── Contact Section ── */}
      <div className="relative z-10 bg-white">
        <ContactSection />
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 bg-white border-t border-surface-alt">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-accent-muted/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🌿</span>
            <p>&copy; 2026 AgroVerse. All rights reserved.</p>
          </div>
          <p className="hidden sm:block">Empowering Indian Agriculture · Built with ❤️</p>
          <div className="flex items-center gap-4">
            <a href="mailto:support@agroverse.com" className="hover:text-primary transition-colors">Contact</a>
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
    <AuthProvider>
      <DashboardProvider>
        <ProductProvider>
          <BuyerProvider>

            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/farmer-dashboard/*" element={<FarmerDashboard />} />
                <Route path="/buyer-dashboard/*" element={<BuyerDashboard />} />
                <Route path="/transporter-dashboard/*" element={<TransporterDashboard />} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
              </Routes>
            </Router>
          </BuyerProvider>
        </ProductProvider>
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
