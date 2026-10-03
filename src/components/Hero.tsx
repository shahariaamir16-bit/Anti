import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import heroBgImage from '../assets/images/hero_luxury_sanctuary_1790267960268.jpg';

interface HeroProps {
  onExploreRooms?: () => void;
  onExploreAmenities?: () => void;
  onOurStory?: () => void;
  customBgImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreRooms,
  onExploreAmenities,
  onOurStory,
  customBgImage,
}) => {
  const [bgImage, setBgImage] = useState<string>(() => {
    if (customBgImage) return customBgImage;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurelia_custom_hero_bg');
      if (saved) return saved;
    }
    return heroBgImage;
  });

  // Sync prop changes if provided externally
  useEffect(() => {
    if (customBgImage) {
      setBgImage(customBgImage);
    }
  }, [customBgImage]);

  const scrollToRooms = () => {
    if (onExploreRooms) {
      onExploreRooms();
      return;
    }
    const el = document.getElementById('rooms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSecondaryClick = () => {
    if (onExploreAmenities) {
      onExploreAmenities();
      return;
    }
    if (onOurStory) {
      onOurStory();
      return;
    }
    const el = document.getElementById('amenities') || document.getElementById('dining');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-end overflow-hidden bg-stone-950 m-0 p-0 select-none">
      {/* Background Container */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-stone-950">
        <img
          src={bgImage}
          alt="Aurelia Luxury Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        />

        {/* Cinematic Vignette: gentle top fade for Navbar & smooth dark bottom gradient for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero Content - Perfectly aligned with Navbar logo */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 pb-8 sm:pb-14 lg:pb-16 pt-20 sm:pt-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 lg:gap-12">
          {/* Left Text Block */}
          <div className="max-w-2xl space-y-3.5 sm:space-y-4">
            {/* Eyebrow with warm gold accent */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full bg-stone-950/70 border border-amber-500/30 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-[11px] sm:text-sm font-semibold tracking-[0.25em] uppercase text-amber-300/90 font-sans">
                WELCOME TO THE HOTEL
              </p>
            </motion.div>

            {/* Main Headline - Harmonious gold & white gradient typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.12] sm:leading-[1.08] drop-shadow-md break-words"
            >
              A place truly<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                worth staying.
              </span>
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-stone-200 text-xs sm:text-base font-light leading-relaxed max-w-xl pt-0.5 sm:pt-1 drop-shadow-sm"
            >
              Rooms, suites, and villas designed for rest. Dining worth booking. A team that anticipates before you ask.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-row items-center gap-2.5 sm:gap-4 pt-3 sm:pt-6 w-full sm:w-auto max-w-md sm:max-w-none"
            >
              <button
                type="button"
                onClick={scrollToRooms}
                className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center text-center px-4 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all duration-300 shadow-xl shadow-amber-600/30 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                View Rooms
              </button>
              <button
                type="button"
                onClick={handleSecondaryClick}
                className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center text-center px-4 sm:px-8 py-3 sm:py-3.5 bg-stone-950/70 hover:bg-stone-900/90 border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-lg whitespace-nowrap"
              >
                Explore Amenities
              </button>
            </motion.div>
          </div>

          {/* Right Rating Block - Luxury Frosted Badge with Glowing Golden Stars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex items-center space-x-2.5 sm:space-x-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-stone-950/80 border border-amber-600/30 backdrop-blur-md shadow-2xl self-start lg:self-end mt-1 lg:mt-0"
          >
            {/* 5 Solid Radiant Gold Stars */}
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                />
              ))}
            </div>
            <span className="text-stone-200 text-[11px] sm:text-sm font-medium tracking-wide">
              <strong className="text-white font-bold">4.9</strong> out of 5 —{' '}
              <span className="text-amber-300 font-semibold">Booking.com</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



