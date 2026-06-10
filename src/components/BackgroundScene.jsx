import React from "react";
import bgImage from "../assets/background.png";

const BackgroundScene = ({ mousePosition }) => {
  const mx = mousePosition?.x || 0;
  const my = mousePosition?.y || 0;

  // Shared smooth-transition style generator
  const parallaxStyle = (xFactor, yFactor) => ({
    transform: `translate(${mx * xFactor}px, ${my * yFactor}px)`,
    willChange: "transform",
    transition: "transform 0.1s ease-out",
  });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* ── Layer 1: Background Farm Image ── */}
      <div className="absolute inset-0" style={parallaxStyle(15, 10)}>
        <img
          src={bgImage}
          alt="Farm background"
          className="w-full h-full object-cover scale-110"
          draggable={false}
        />
      </div>

      {/* ── Layer 2: Gradient Overlays ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left-to-right white fade for text readability */}
        <div className="absolute inset-0 w-[60%] bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        {/* Bottom white fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
      </div>

      {/* ── Layer 3: Animated Clouds ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={parallaxStyle(5, 3)}
      >
        {/* Cloud 1 – large, slow */}
        <svg
          className="absolute animate-drift-slow"
          style={{ top: "8%", left: "-10%" }}
          width="320"
          height="100"
          viewBox="0 0 320 100"
          fill="none"
        >
          <ellipse cx="160" cy="60" rx="150" ry="40" fill="white" fillOpacity="0.25" />
          <ellipse cx="110" cy="50" rx="90" ry="35" fill="white" fillOpacity="0.2" />
          <ellipse cx="210" cy="55" rx="80" ry="30" fill="white" fillOpacity="0.22" />
        </svg>

        {/* Cloud 2 – medium, normal speed */}
        <svg
          className="absolute animate-drift"
          style={{ top: "18%", left: "30%" }}
          width="240"
          height="80"
          viewBox="0 0 240 80"
          fill="none"
        >
          <ellipse cx="120" cy="45" rx="110" ry="30" fill="white" fillOpacity="0.22" />
          <ellipse cx="80" cy="40" rx="70" ry="25" fill="white" fillOpacity="0.18" />
          <ellipse cx="170" cy="42" rx="60" ry="22" fill="white" fillOpacity="0.2" />
        </svg>

        {/* Cloud 3 – small, slow */}
        <svg
          className="absolute animate-drift-slow"
          style={{ top: "12%", left: "65%", animationDelay: "4s" }}
          width="180"
          height="60"
          viewBox="0 0 180 60"
          fill="none"
        >
          <ellipse cx="90" cy="35" rx="80" ry="22" fill="white" fillOpacity="0.2" />
          <ellipse cx="60" cy="30" rx="50" ry="18" fill="white" fillOpacity="0.18" />
        </svg>

        {/* Cloud 4 – tiny accent, normal speed */}
        <svg
          className="absolute animate-drift"
          style={{ top: "25%", left: "80%", animationDelay: "7s" }}
          width="140"
          height="50"
          viewBox="0 0 140 50"
          fill="none"
        >
          <ellipse cx="70" cy="28" rx="65" ry="18" fill="#fffdf5" fillOpacity="0.2" />
          <ellipse cx="100" cy="25" rx="35" ry="14" fill="#fffdf5" fillOpacity="0.18" />
        </svg>
      </div>

      {/* ── Layer 4: Ambient Particles (pollen / fireflies) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={parallaxStyle(8, 6)}
      >
        {[
          { top: "15%", left: "20%", size: 4, delay: "0s" },
          { top: "30%", left: "55%", size: 3, delay: "1.2s" },
          { top: "50%", left: "35%", size: 5, delay: "2.5s" },
          { top: "65%", left: "70%", size: 3, delay: "0.8s" },
          { top: "25%", left: "80%", size: 4, delay: "3.4s" },
          { top: "72%", left: "15%", size: 3, delay: "1.8s" },
          { top: "40%", left: "90%", size: 4, delay: "4.2s" },
          { top: "58%", left: "48%", size: 3, delay: "2.1s" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: "#d4a017",
              opacity: 0.5,
              animationDelay: p.delay,
              boxShadow: "0 0 6px 2px rgba(212, 160, 23, 0.35)",
            }}
          />
        ))}
      </div>

      {/* ── Layer 5: Bird Silhouettes ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={parallaxStyle(12, 7)}
      >
        {/* Bird 1 */}
        <svg
          className="absolute animate-drift"
          style={{ top: "10%", left: "40%", animationDelay: "2s" }}
          width="28"
          height="14"
          viewBox="0 0 28 14"
          fill="none"
        >
          <path
            d="M0 8 Q7 0 14 7 Q21 0 28 8"
            stroke="#374151"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
        </svg>

        {/* Bird 2 */}
        <svg
          className="absolute animate-drift-slow"
          style={{ top: "6%", left: "60%", animationDelay: "5s" }}
          width="22"
          height="11"
          viewBox="0 0 22 11"
          fill="none"
        >
          <path
            d="M0 6 Q5.5 0 11 5.5 Q16.5 0 22 6"
            stroke="#374151"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
        </svg>

        {/* Bird 3 – smaller, higher */}
        <svg
          className="absolute animate-drift"
          style={{ top: "14%", left: "75%", animationDelay: "8s" }}
          width="16"
          height="8"
          viewBox="0 0 16 8"
          fill="none"
        >
          <path
            d="M0 5 Q4 0 8 4 Q12 0 16 5"
            stroke="#374151"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
          />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundScene;
