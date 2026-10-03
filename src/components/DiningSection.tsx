import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Star, Clock } from 'lucide-react';

export const DiningSection: React.FC = () => {
  return (
    <section id="dining" className="py-24 sm:py-32 bg-stone-900 text-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column: Smooth Slide From Left */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-950 border border-amber-600/30 text-amber-500 text-xs font-semibold tracking-wider uppercase shadow-lg">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Gastronomy Excellence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              The Aurelia Restaurant & Sky Bar
            </h2>

            <p className="text-stone-300 text-base leading-relaxed font-light">
              Savor exquisite culinary creations designed by Executive Chef Valerio Rossi. Combining Mediterranean coastal traditions with Asian modern fusion, every dish is an unforgettable sensory journey.
            </p>

            <div className="space-y-4 pt-2">
              <motion.div 
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start space-x-4 p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/30 transition shadow-md"
              >
                <div className="p-3 bg-amber-600/15 text-amber-400 rounded-xl shrink-0"><Utensils className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Le Jardin Breakfast & Brunch</h4>
                  <p className="text-xs text-stone-400">Fresh organic pastries, artisanal cheeses, and champagne breakfast daily.</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start space-x-4 p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/30 transition shadow-md"
              >
                <div className="p-3 bg-amber-600/15 text-amber-400 rounded-xl shrink-0"><Clock className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Oceanfront Dining Hours</h4>
                  <p className="text-xs text-stone-400">Breakfast: 6:30 AM - 11:00 AM | Dinner: 6:00 PM - 11:30 PM</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Photos Column: Smooth Slide From Right */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"
              alt="Fine dining"
              className="w-full h-56 sm:h-80 object-cover rounded-3xl shadow-2xl border border-stone-800"
            />
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Gourmet dish"
              className="w-full h-56 sm:h-80 object-cover rounded-3xl shadow-2xl border border-stone-800 transform sm:translate-y-6"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
