import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { BuyerProvider } from './contexts/BuyerContext';
import { AuthProvider } from './contexts/AuthContext';
import { useMousePosition } from './hooks/useMousePosition';
import Navbar from './components/Navbar';
import BackgroundScene from './components/BackgroundScene';
import FarmerCharacter from './components/FarmerCharacter';
import HeroSection from './components/HeroSection';
import PortalButtons from './components/PortalButtons';
import ServicePills from './components/ServicePills';
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
  const mousePosition = useMousePosition(0.08);

  return (
    <div className="relative bg-white text-primary font-sans selection:bg-surface-warm selection:text-primary antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* ── Hero viewport: background + farmer are scoped here ── */}
      <div className="relative w-full min-h-screen flex flex-col">
        {/* Background Scene — parallax agricultural landscape */}
        <BackgroundScene mousePosition={mousePosition} />

        {/* Farmer Character — absolute bottom-0 inside this hero viewport */}
        <FarmerCharacter mousePosition={mousePosition} />

        {/* Fixed Navbar */}
        <Navbar />

        {/* Hero content */}
        <main
          id="agro-hero"
          className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 lg:pt-36 pb-12 flex-1 flex flex-col justify-center"
        >
          <div className="max-w-2xl flex flex-col gap-6">
            {/* Typewriter Headline + Subtitle + Stats */}
            <HeroSection />

            {/* Portal Navigation Buttons - updated to use React Router */}
            <PortalButtons />

            {/* Service Selection Pills */}
            <div className="mt-4">
              <ServicePills />
            </div>
          </div>
        </main>
      </div>

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
