import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { BuyerProvider } from './contexts/BuyerContext';
import { useMousePosition } from './hooks/useMousePosition';
import Navbar from './components/Navbar';
import BackgroundScene from './components/BackgroundScene';
import FarmerCharacter from './components/FarmerCharacter';
import HeroSection from './components/HeroSection';
import PortalButtons from './components/PortalButtons';
import ServicePills from './components/ServicePills';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';

// Home page component
function HomePage() {
  const mousePosition = useMousePosition(0.08);

  return (
    <div className="relative bg-white text-primary font-sans selection:bg-surface-warm selection:text-primary antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Background Scene — parallax agricultural landscape */}
      <BackgroundScene mousePosition={mousePosition} />

      {/* Farmer Character — interactive cursor tracking */}
      <FarmerCharacter mousePosition={mousePosition} />

      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col w-full lg:min-h-screen">
        <main
          id="agro-hero"
          className="w-full max-w-7xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 lg:pt-36 pb-12 flex-1 flex flex-col justify-center"
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

        {/* Footer hint */}
        <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-6">
          <div className="flex items-center justify-between text-xs text-accent-muted/60">
            <p>&copy; 2026 AgroVerse. All rights reserved.</p>
            <p className="hidden sm:block">Empowering Indian Agriculture</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <DashboardProvider>
      <ProductProvider>
        <BuyerProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/farmer-dashboard/*" element={<FarmerDashboard />} />
              <Route path="/buyer-dashboard/*" element={<BuyerDashboard />} />
            </Routes>
          </Router>
        </BuyerProvider>
      </ProductProvider>
    </DashboardProvider>
  );
}

export default App;
