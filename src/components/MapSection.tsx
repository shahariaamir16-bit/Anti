import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Compass } from 'lucide-react';

export const MapSection: React.FC = React.memo(() => {
  return (
    <section id="location" className="py-24 sm:py-32 bg-stone-950 text-stone-100 relative overflow-hidden">
      {/* ========================================================================= */}
      {/* LUXURY ARCHITECTURAL SECTION BORDERS                                      */}
      {/* ========================================================================= */}
      {/* TOP BORDER: Hairline gradient + Central Crest Diamond + Accent Ticks */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent z-20 pointer-events-none">
        {/* Soft Golden Flare Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 sm:w-[500px] h-[2px] bg-amber-400/80 blur-[2px]" />
        
        {/* Center Diamond Ornament Crest */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
          <div className="w-5 h-5 rotate-45 bg-stone-950 border border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_6px_#fbbf24]" />
          </div>
        </div>

        {/* Flanking Micro Architectural Accent Ticks */}
        <div className="hidden sm:block absolute top-0 left-[calc(50%-70px)] -translate-y-1/2 w-4 h-[1px] bg-amber-400/70" />
        <div className="hidden sm:block absolute top-0 left-[calc(50%+54px)] -translate-y-1/2 w-4 h-[1px] bg-amber-400/70" />
      </div>

      {/* Subtle Vertical Side Hairlines */}
      <div className="hidden xl:block absolute left-8 lg:left-12 top-16 bottom-16 w-[1px] bg-gradient-to-b from-transparent via-amber-500/15 to-transparent pointer-events-none" />
      <div className="hidden xl:block absolute right-8 lg:right-12 top-16 bottom-16 w-[1px] bg-gradient-to-b from-transparent via-amber-500/15 to-transparent pointer-events-none" />

      {/* Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-600/5 rounded-full blur-[190px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-900 border border-amber-600/40 text-amber-400 text-xs font-semibold tracking-widest uppercase shadow-xl backdrop-blur-md"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Resort Location</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Location</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-400 text-base font-light leading-relaxed max-w-2xl mx-auto"
          >
            One Aurelia Boulevard — Oceanfront Sanctuary, California
          </motion.p>
        </div>

        {/* ========================================================================= */}
        {/* CLEAN MAP VIEW (ONLY LOCATION) - Smooth slide from left                   */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="bg-stone-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.15)] relative"
        >
          <div className="relative h-[480px] sm:h-[580px] w-full bg-stone-950">
            <iframe
              title="Aurelia Hotel Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0195551842885!2d-122.41941542345598!3d37.77492977197177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb1ded36d31548e67!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(125%)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full opacity-90"
            />

            {/* Floating Location Card Overlay (Address Only) - Smooth slide from right */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-stone-950/95 border border-amber-500/50 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl text-stone-100 flex items-center space-x-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-white text-base truncate">Aurelia Resort & Spa</h4>
                <p className="text-xs text-stone-300 font-light truncate">One Aurelia Boulevard, California</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
});

MapSection.displayName = 'MapSection';

