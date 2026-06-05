import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, X } from "lucide-react";

const navLinks = ["Home", "About", "Services", "Contact"];

const mobilePortalLinks = [
  { label: "Farmer Portal", href: "#farmer-portal" },
  { label: "Buyers", href: "#buyers" },
  { label: "Transporter", href: "#transporter" },
  { label: "Admin", href: "#admin" },
];

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ── Fixed Top Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-white/80 backdrop-blur-md border-b border-primary/5">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1.5 select-none">
          <Leaf className="text-accent w-6 h-6" />
          <span className="text-[21px] sm:text-[26px] tracking-tight text-primary font-semibold select-none font-display">
            AgroVerse
            <sup className="text-[9px] sm:text-[10px] align-super ml-[1px] text-primary/40 font-normal">
              ®
            </sup>
          </span>
        </a>

        {/* Desktop Nav Links (hidden below md) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, idx) => (
            <span key={link} className="flex items-center">
              <a
                href={`#${link.toLowerCase()}`}
                className="text-[18px] text-primary/80 hover:opacity-60 transition-opacity duration-200"
              >
                {link}
              </a>
              {idx < navLinks.length - 1 && (
                <span className="text-primary/20 mx-2 select-none">,</span>
              )}
            </span>
          ))}
        </nav>

        {/* Desktop CTA (hidden below md) */}
        <a
          href="#contact"
          className="hidden md:inline-block text-[16px] text-primary/80 underline underline-offset-4 decoration-primary/30 hover:opacity-60 transition-opacity duration-200"
        >
          Get in Touch
        </a>

        {/* Mobile Hamburger Button (visible below md) */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden relative z-50 flex flex-col items-center justify-center gap-[5px] w-10 h-10"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span
            className={`block w-6 h-[2px] bg-primary transition-all duration-300 origin-center ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-primary transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-primary transition-all duration-300 origin-center ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* ── Full-screen Mobile Overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-6">
              {/* Main nav links */}
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  className="text-[28px] text-primary font-display font-semibold tracking-tight hover:opacity-60 transition-opacity duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </motion.a>
              ))}

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-16 h-[1px] bg-primary/15 my-2"
              />

              {/* Portal shortcuts */}
              {mobilePortalLinks.map((portal, idx) => (
                <motion.a
                  key={portal.label}
                  href={portal.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{
                    delay: 0.15 + 0.05 * idx,
                    duration: 0.3,
                  }}
                  className="text-[18px] text-primary/60 hover:text-primary/90 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {portal.label}
                </motion.a>
              ))}

              {/* CTA */}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-4 text-[16px] text-primary/80 underline underline-offset-4 decoration-primary/30 hover:opacity-60 transition-opacity duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get in Touch
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
