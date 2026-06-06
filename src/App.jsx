import { useState } from 'react';
import { useMousePosition } from './hooks/useMousePosition';
import Navbar from './components/Navbar';
import BackgroundScene from './components/BackgroundScene';
import FarmerCharacter from './components/FarmerCharacter';
import HeroSection from './components/HeroSection';
import PortalButtons from './components/PortalButtons';
import ServicePills from './components/ServicePills';
import FarmerDashboard from './pages/FarmerDashboardSimple';

function App() {
  const [activePage, setActivePage] = useState('home');
  const mousePosition = useMousePosition(0.08);

  // If farmer dashboard is active, show only the dashboard
  if (activePage === 'farmer-dashboard') {
    return <FarmerDashboard />;
  }

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

            {/* Portal Navigation Buttons */}
            <PortalButtons onPortalSelect={setActivePage} />

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

export default App;
