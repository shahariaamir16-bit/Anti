import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenMyBookings: () => void;
  onExploreRooms: () => void;
  onNavigate?: (targetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ onOpenMyBookings, onExploreRooms, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothNav = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(targetId);
    } else {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        mobileMenuOpen
          ? 'bg-transparent py-4'
          : scrolled
          ? 'bg-stone-950/90 backdrop-blur-md border-b border-amber-600/20 py-4 shadow-2xl'
          : 'bg-gradient-to-b from-black/30 via-transparent to-transparent py-5'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
        {/* Brand */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-stone-950 font-serif font-bold text-xl shadow-lg shadow-amber-600/20 group-hover:scale-105 transition-transform duration-300">
            A
          </div>
          <div>
            <span className="text-xl font-serif font-bold tracking-widest text-amber-500">AURELIA</span>
            <span className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-medium">Coffee & Noir Hotel</span>
          </div>
        </a>

        {/* Desktop Nav Links with Smooth Scroll */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-300">
          <a href="#rooms" onClick={(e) => handleSmoothNav(e, 'rooms')} className="hover:text-amber-400 transition-colors">Suites & Rooms</a>
          <a href="#amenities" onClick={(e) => handleSmoothNav(e, 'amenities')} className="hover:text-amber-400 transition-colors">Amenities</a>
          <a href="#dining" onClick={(e) => handleSmoothNav(e, 'dining')} className="hover:text-amber-400 transition-colors">Fine Dining</a>
          <a href="#gallery" onClick={(e) => handleSmoothNav(e, 'gallery')} className="hover:text-amber-400 transition-colors">Gallery</a>
          <a href="#contact" onClick={(e) => handleSmoothNav(e, 'contact')} className="hover:text-amber-400 transition-colors">Contact</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={onOpenMyBookings}
            className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-amber-400 hover:text-white border border-amber-600/30 hover:border-amber-500 rounded-xl transition bg-stone-900/50 cursor-pointer active:scale-95"
          >
            My Bookings
          </button>
          <button
            onClick={onExploreRooms}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 rounded-xl shadow-lg shadow-amber-600/25 transition transform hover:-translate-y-0.5 cursor-pointer active:scale-95 font-bold"
          >
            Book Now (Pay at Hotel)
          </button>
        </div>

        {/* Mobile Hamburger / Menu Toggle */}
        <div className="md:hidden flex items-center">
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-300 hover:text-amber-400 bg-transparent border-none shadow-none cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0, scale: mobileMenuOpen ? 1.05 : 1 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-stone-300" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu with Transparent Background & Smooth Staggered Reveal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="origin-top md:hidden bg-transparent backdrop-blur-md border-b border-white/10 px-6 pt-4 pb-7 space-y-2 overflow-hidden"
          >
            {[
              { id: 'rooms', label: 'Suites & Rooms' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'dining', label: 'Fine Dining' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'contact', label: 'Contact' },
            ].map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                  delay: idx * 0.05 + 0.05,
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleSmoothNav(e, item.id)}
                  className="group flex items-center justify-between py-2.5 text-stone-200 hover:text-amber-400 font-medium text-sm transition-all drop-shadow-sm"
                >
                  <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                    {item.label}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/0 group-hover:bg-amber-400 transition-colors duration-200" />
                </a>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.28, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pt-4 border-t border-white/10 flex flex-col space-y-3"
            >
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenMyBookings(); }}
                className="w-full py-3 text-xs font-semibold tracking-wider uppercase text-amber-400 hover:text-white border border-amber-500/40 hover:border-amber-400 rounded-xl transition bg-transparent hover:bg-white/10 active:scale-[0.98]"
              >
                My Bookings
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onExploreRooms(); }}
                className="w-full py-3 text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 rounded-xl shadow-lg shadow-amber-600/25 active:scale-[0.98] transition hover:brightness-110"
              >
                Book Now (Pay at Hotel)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

Navbar.displayName = 'Navbar';
