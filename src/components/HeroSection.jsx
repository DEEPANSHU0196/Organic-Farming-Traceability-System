import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import Navbar from "./Navbar";
import PortalButtons from "./PortalButtons";
import ServicePills from "./ServicePills";

const VIDEO_SRC = "/videos/tractor-hero.mp4";

const stats = [
  { value: "10K+", label: "Active Farmers" },
  { value: "500+", label: "Buyers Connected" },
  { value: "98%",  label: "Satisfaction Rate" },
];

export default function HeroSection() {
  const [phase, setPhase] = useState("intro"); // "intro" → "landing"
  const videoRef     = useRef(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const videoScale     = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  /* Transition to landing phase after ~6.5 s of video */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (v.currentTime >= 6.5 && phase === "intro") setPhase("landing");
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [phase]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-x-hidden bg-black"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ── VIDEO BACKGROUND — absolute, stretches with section ── */}
      <motion.video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ scale: videoScale, minHeight: "100vh" }}
        initial={{ filter: "brightness(0.75) saturate(0.9)" }}
        animate={
          phase === "landing"
            ? { filter: "brightness(0.42) saturate(0.8)" }
            : { filter: "brightness(0.85) saturate(1.05)" }
        }
        transition={{ duration: 1.4 }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.55)", minHeight: "100vh" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" style={{ minHeight: "100vh" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* ── INTRO OVERLAY (cinematic letterbox) — absolute ── */}
      <AnimatePresence>
        {phase === "intro" && <IntroOverlay key="intro" />}
      </AnimatePresence>

      {/* ── IN-FLOW CONTENT WRAPPER — pushes section height ── */}
      {/*
        The Navbar is already `fixed` in its own component, so it floats above.
        We use pt-20 here (≥ navbar height) so content starts below the navbar.
        pb-16 gives breathing room above the scroll hint at the bottom.
        min-h-screen ensures the section fills the full viewport even on large screens.
      */}
      <div className="relative z-20 flex flex-col min-h-screen pt-24 pb-16 px-8 md:px-16 lg:px-24">
        {/* Spacer to vertically center the block: flex-1 pushes content to middle */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence>
            {phase === "landing" && (
              <LandingContent key="landing" contentOpacity={contentOpacity} />
            )}
          </AnimatePresence>
        </div>

        {/* Scroll hint — pinned to bottom of the in-flow area */}
        {phase === "landing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-2 mt-6"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
            />
          </motion.div>
        )}
      </div>

      {/* Skip button (intro only) — absolute, always visible over intro */}
      {phase === "intro" && (
        <button
          onClick={() => setPhase("landing")}
          className="absolute bottom-8 right-8 z-30 text-xs tracking-widest uppercase px-5 py-2 rounded-full bg-white/10 text-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-200"
        >
          Skip ›
        </button>
      )}
    </section>
  );
}

/* ─────────────────────────── INTRO OVERLAY ─────────────────────────── */

function IntroOverlay() {
  return (
    <motion.div
      className="absolute inset-0 z-20 pointer-events-none"
      exit={{ opacity: 0, transition: { duration: 0.9 } }}
    >
      {/* Letterbox top bar */}
      <motion.div
        className="absolute top-0 left-0 w-full bg-black origin-top"
        initial={{ height: 0 }}
        animate={{ height: [0, 52, 52, 0] }}
        transition={{ duration: 6.5, times: [0, 0.07, 0.85, 1], ease: "easeInOut" }}
      />
      {/* Letterbox bottom bar */}
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-black origin-bottom"
        initial={{ height: 0 }}
        animate={{ height: [0, 52, 52, 0] }}
        transition={{ duration: 6.5, times: [0, 0.07, 0.85, 1], ease: "easeInOut" }}
      />

      {/* Green leaf accent line */}
      <motion.div
        className="absolute left-10 md:left-16 bottom-24 md:bottom-28"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 0, 1, 1], scaleX: [0, 0, 1, 1] }}
        transition={{ duration: 6.5, times: [0, 0.28, 0.52, 1] }}
        style={{ originX: 0 }}
      >
        <div className="w-10 h-[2px] bg-green-400 mb-3" />
      </motion.div>

      {/* Wordmark */}
      <motion.div
        className="absolute left-10 md:left-16 bottom-12 md:bottom-16 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
        transition={{ duration: 6.5, times: [0, 0.28, 0.52, 1] }}
      >
        <p className="text-[11px] tracking-[0.35em] uppercase text-white/60 mb-1 font-light">
          From the ground up
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif", letterSpacing: "-0.01em" }}
        >
          AgroVerse
        </h2>
      </motion.div>

      {/* Top-right corner tag */}
      <motion.div
        className="absolute top-20 right-10 md:right-14 text-right text-white"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: [0, 0, 0.7, 0.7], x: [12, 12, 0, 0] }}
        transition={{ duration: 6.5, times: [0, 0.35, 0.6, 1] }}
      >
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Established</p>
        <p className="text-sm font-semibold text-white/70">2024</p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── LANDING CONTENT ─────────────────────────── */

function LandingContent({ contentOpacity }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{ opacity: contentOpacity }}
      className="flex flex-col"
    >
      {/* Green accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ originX: 0 }}
        className="w-12 h-[2px] bg-green-400 mb-4"
      />

      {/* Eyebrow tag */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-[11px] tracking-[0.35em] uppercase text-green-400/90 font-medium mb-3"
      >
        Organic Farming Traceability Platform
      </motion.p>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-white font-bold leading-[1.05] max-w-3xl"
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
          textShadow: "0 2px 40px rgba(0,0,0,0.4)",
        }}
      >
        Empowering Agriculture,
        <br />
        <span className="text-green-300">Connecting Futures</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="mt-4 max-w-xl text-white/75 text-base leading-relaxed"
      >
        Your gateway to modern farming — connecting{" "}
        <strong className="text-white font-semibold">farmers</strong>,{" "}
        <strong className="text-white font-semibold">buyers</strong>, and{" "}
        <strong className="text-white font-semibold">transporters</strong> on one unified platform.
      </motion.p>

      {/* CTA Buttons (Portal Buttons) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-6"
      >
        <PortalButtons heroMode />
      </motion.div>

      {/* Service Pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.75 }}
        className="mt-5"
      >
        <ServicePills heroMode />
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="mt-8 flex gap-8 flex-wrap"
      >
        {stats.map(({ value, label }) => (
          <StatItem key={label} value={value} label={label} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="flex flex-col">
      <span
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
      >
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-[0.2em] text-white/55 mt-0.5">
        {label}
      </span>
    </div>
  );
}
