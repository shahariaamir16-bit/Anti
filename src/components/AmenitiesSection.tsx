import React, { useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useSpring, 
  useTransform, 
  MotionValue 
} from 'motion/react';
import { 
  Sparkles, 
  Waves, 
  UtensilsCrossed, 
  Wine, 
  Dumbbell, 
  ShieldCheck, 
  Compass,
  CheckCircle2,
  Crown
} from 'lucide-react';

interface FacilityItem {
  id: string;
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  category: string;
  description: string;
  highlight: string;
  specification: string;
}

const facilities: FacilityItem[] = [
  {
    id: "pool",
    num: "01",
    icon: Waves,
    title: "Infinity Pool & Private Beachfront",
    category: "Aquatics & Coastal Horizon",
    description: "A 50-meter temperature-controlled azure pool seamlessly vanishing into the ocean horizon, lined with private teak cabanas and dedicated butler service.",
    highlight: "Heated 28°C Constant",
    specification: "Olympic-grade • Private Teak Cabanas"
  },
  {
    id: "spa",
    num: "02",
    icon: Sparkles,
    title: "Aurelia Sanctuary Spa",
    category: "Holistic Thermal Rejuvenation",
    description: "An oasis of restorative tranquility featuring organic Swiss botanicals, custom aromatherapy rituals, detoxifying cedarwood saunas, and candlelit thermal suites.",
    highlight: "Swiss Organic Botanicals",
    specification: "Cedarwood Saunas • Thermal Hydrotherapy"
  },
  {
    id: "dining",
    num: "03",
    icon: UtensilsCrossed,
    title: "Michelin-Star Gastronomy",
    category: "Culinary Artistry & Rare Cellar",
    description: "World-class degustation menus curated by master chefs. Celebrating locally caught coastal seafood, aged Wagyu beef, and rare vintage sommelier pairings.",
    highlight: "Chef Valerio Rossi",
    specification: "7-Course Degustation • 1,200+ Rare Labels"
  },
  {
    id: "fitness",
    num: "04",
    icon: Dumbbell,
    title: "Elite Wellness & Fitness Center",
    category: "Biomechanic & Athletic Excellence",
    description: "High-performance fitness center outfitted with the latest Technogym Artis series, open-air sunrise yoga pavilion over lotus ponds, and licensed athletic trainers.",
    highlight: "Technogym Artis Series",
    specification: "Biometric Resistance • Sunrise Yoga"
  },
  {
    id: "concierge",
    num: "05",
    icon: ShieldCheck,
    title: "24/7 VIP Concierge & Executive Fleet",
    category: "White-Glove Hospitality & Security",
    description: "Discreet VIP concierge delivering frictionless logistics, private rooftop helicopter charters, coastal yacht cruises, and chauffeured Rolls-Royce airport transfers.",
    highlight: "Personal Butler Care",
    specification: "Helipad • Yacht Charters • Rolls-Royce"
  },
  {
    id: "lounge",
    num: "06",
    icon: Wine,
    title: "The Noir Sky Lounge & Bar",
    category: "Sunset Mixology & Live Jazz",
    description: "Panoramic rooftop sanctuary offering bespoke molecular mixology, rare single-malt whiskeys, vintage champagnes, and ambient acoustic jazz performances overlooking the coast.",
    highlight: "360° Ocean Rooftop",
    specification: "Acoustic Jazz • Smoked Espresso Noir"
  }
];

// Single Item Component with 100% GPU Hardware Accelerated Animations (Zero React re-renders)
interface TimelineCardProps {
  item: FacilityItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const TimelineCard: React.FC<TimelineCardProps> = React.memo(({ item, index, total, progress }) => {
  const Icon = item.icon;
  const isEven = index % 2 === 1; // 0: left, 1: right, 2: left, 3: right...

  // Evenly spaced milestone thresholds for each facility along the scroll
  const th = (index + 0.5) / total;

  // Ultra-smooth GPU transforms that trigger EXACTLY when the ball arrives at `th`
  const cardOpacity = useTransform(progress, [th - 0.06, th - 0.01, th + 0.03], [0, 0.4, 1]);
  const cardXLeft = useTransform(progress, [th - 0.07, th], [-45, 0]);
  const cardXRight = useTransform(progress, [th - 0.07, th], [45, 0]);
  const cardXMobile = useTransform(progress, [th - 0.07, th], [35, 0]);
  const cardScale = useTransform(progress, [th - 0.07, th], [0.93, 1]);

  // Horizontal connector arm shoots out from the center ball towards the box
  const armScaleX = useTransform(progress, [th - 0.03, th + 0.01], [0, 1]);
  const armOpacity = useTransform(progress, [th - 0.04, th - 0.005], [0, 1]);

  // Center node dot on the line blooms into existence ONLY when the ball hits it
  const nodeScale = useTransform(progress, [th - 0.04, th], [0.2, 1]);
  const nodeOpacity = useTransform(progress, [th - 0.04, th - 0.01], [0, 1]);

  return (
    <div className="relative flex items-center md:justify-between">
      {/* ========================================================================= */}
      {/* DESKTOP LEFT SIDE SLOT                                                    */}
      {/* ========================================================================= */}
      <div className={`hidden md:flex w-[calc(50%-44px)] ${!isEven ? 'justify-end' : 'invisible'}`}>
        {!isEven && (
          <motion.div
            style={{
              opacity: cardOpacity,
              x: cardXLeft,
              scale: cardScale,
            }}
            className="group relative w-full bg-gradient-to-br from-stone-900/95 via-stone-900/80 to-stone-950/95 border border-amber-600/35 hover:border-amber-400/80 ring-1 ring-inset ring-amber-500/10 hover:ring-amber-400/25 rounded-3xl p-6 sm:p-7 shadow-2xl hover:shadow-[0_8px_32px_rgba(245,158,11,0.14)] backdrop-blur-xl transition-all duration-300"
          >
            {/* Architectural Border Accents: Top Gold Hairline & Micro Corner Notches */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
            <div className="absolute -top-[1px] left-6 w-3 h-[2px] bg-amber-400/60" />
            <div className="absolute -top-[1px] right-6 w-3 h-[2px] bg-amber-400/60" />

            {/* Horizontal Connector Arm - Connects flush to center node (NO duplicate ball) */}
            <div className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 w-[44px] h-[2px] pointer-events-none overflow-visible flex items-center">
              <motion.div
                style={{
                  scaleX: armScaleX,
                  opacity: armOpacity,
                  transformOrigin: 'right', // Originates from the center ball extending to the left card
                }}
                className="w-full h-full bg-gradient-to-l from-amber-300 via-amber-400 to-amber-500/70 shadow-[0_0_8px_#f59e0b]"
              />
            </div>

            {/* Card Content Row */}
            <div className="flex items-start gap-5">
              <div className="w-13 h-13 rounded-2xl bg-stone-950 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 group-hover:bg-amber-500/20 group-hover:border-amber-400 transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-amber-500/90 uppercase font-semibold">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs font-semibold text-stone-500">
                    {item.num}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                  {item.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                  <span className="font-medium text-amber-300">{item.highlight}</span>
                  <span className="text-stone-600">•</span>
                  <span className="text-stone-400 font-light text-[11px] truncate">{item.specification}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SINGLE UNIFIED CENTER NODE (Directly on the spine at x=50%)      */}
      {/* 100% attached to the center line and ball. NO separate duplicate dot!    */}
      {/* ========================================================================= */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-20 pointer-events-none">
        <motion.div
          style={{
            scale: nodeScale,
            opacity: nodeOpacity,
          }}
          className="w-4 h-4 rounded-full bg-amber-100 border-2 border-white shadow-[0_0_14px_#f59e0b,0_0_26px_#d97706]"
        />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP RIGHT SIDE SLOT                                                   */}
      {/* ========================================================================= */}
      <div className={`hidden md:flex w-[calc(50%-44px)] ${isEven ? 'justify-start' : 'invisible'}`}>
        {isEven && (
          <motion.div
            style={{
              opacity: cardOpacity,
              x: cardXRight,
              scale: cardScale,
            }}
            className="group relative w-full bg-gradient-to-br from-stone-900/95 via-stone-900/80 to-stone-950/95 border border-amber-600/35 hover:border-amber-400/80 ring-1 ring-inset ring-amber-500/10 hover:ring-amber-400/25 rounded-3xl p-6 sm:p-7 shadow-2xl hover:shadow-[0_8px_32px_rgba(245,158,11,0.14)] backdrop-blur-xl transition-all duration-300"
          >
            {/* Architectural Border Accents: Top Gold Hairline & Micro Corner Notches */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
            <div className="absolute -top-[1px] left-6 w-3 h-[2px] bg-amber-400/60" />
            <div className="absolute -top-[1px] right-6 w-3 h-[2px] bg-amber-400/60" />

            {/* Horizontal Connector Arm - Connects flush to center node (NO duplicate ball) */}
            <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 w-[44px] h-[2px] pointer-events-none overflow-visible flex items-center">
              <motion.div
                style={{
                  scaleX: armScaleX,
                  opacity: armOpacity,
                  transformOrigin: 'left', // Originates from the center ball extending to the right card
                }}
                className="w-full h-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500/70 shadow-[0_0_8px_#f59e0b]"
              />
            </div>

            {/* Card Content Row */}
            <div className="flex items-start gap-5">
              <div className="w-13 h-13 rounded-2xl bg-stone-950 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 group-hover:bg-amber-500/20 group-hover:border-amber-400 transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-amber-500/90 uppercase font-semibold">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs font-semibold text-stone-500">
                    {item.num}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                  {item.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                  <span className="font-medium text-amber-300">{item.highlight}</span>
                  <span className="text-stone-600">•</span>
                  <span className="text-stone-400 font-light text-[11px] truncate">{item.specification}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT                                                             */}
      {/* ========================================================================= */}
      <div className="md:hidden relative w-full pl-14">
        {/* Mobile Single Node on Left Spine (left: 20px) */}
        <div className="absolute left-5 top-8 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <motion.div
            style={{
              scale: nodeScale,
              opacity: nodeOpacity,
            }}
            className="w-3.5 h-3.5 rounded-full bg-amber-100 border-2 border-white shadow-[0_0_10px_#f59e0b]"
          />
        </div>

        {/* Mobile Connector Line from spine (left: 20px) to card (left: 56px) */}
        <div className="absolute left-5 top-8 -translate-y-1/2 w-9 h-[2px] pointer-events-none overflow-visible">
          <motion.div
            style={{
              scaleX: armScaleX,
              opacity: armOpacity,
              transformOrigin: 'left',
            }}
            className="w-full h-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500/70 shadow-[0_0_6px_#f59e0b]"
          />
        </div>

        <motion.div
          style={{
            opacity: cardOpacity,
            x: cardXMobile,
            scale: cardScale,
          }}
          className="group relative bg-gradient-to-br from-stone-900/95 via-stone-900/80 to-stone-950/95 border border-amber-600/35 hover:border-amber-400/80 ring-1 ring-inset ring-amber-500/10 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all duration-300"
        >
          {/* Top Hairline Highlight */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

          {/* Card Content */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-950 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
                  {item.category}
                </span>
                <span className="font-mono text-xs font-semibold text-stone-500">
                  {item.num}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {item.title}
              </h3>

              <p className="text-stone-300 text-xs leading-relaxed font-light">
                {item.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                <span className="font-medium text-amber-300 text-[11px]">{item.highlight}</span>
                <span className="text-stone-600">•</span>
                <span className="text-stone-400 text-[11px] truncate">{item.specification}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

TimelineCard.displayName = 'TimelineCard';

export const AmenitiesSection: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 75%"]
  });

  // Silky smooth spring physics with optimal damping and low mass for instant, buttery response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 22,
    mass: 0.5,
    restDelta: 0.0001
  });

  // Calculate the illuminated line height and sliding ball position
  // IMPORTANT: The line ONLY grows from top to the ball position. There is ZERO line ahead of the ball!
  const lineHeightPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const ballTopPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="amenities" className="py-24 sm:py-32 bg-stone-950 text-stone-100 relative overflow-hidden">
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

      {/* Subtle Vertical Side Hairlines (Fading Architectural Edge Guides) */}
      <div className="hidden xl:block absolute left-8 lg:left-12 top-16 bottom-16 w-[1px] bg-gradient-to-b from-transparent via-amber-500/15 to-transparent pointer-events-none" />
      <div className="hidden xl:block absolute right-8 lg:right-12 top-16 bottom-16 w-[1px] bg-gradient-to-b from-transparent via-amber-500/15 to-transparent pointer-events-none" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-600/40 text-amber-400 text-xs font-semibold tracking-widest uppercase shadow-xl backdrop-blur-md"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>World-Class Facilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]"
          >
            Curated for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Pure Indulgence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-400 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto"
          >
            Follow the illuminated journey through our sanctuary. Each facility unveils seamlessly as the light arrives.
          </motion.p>

          {/* Hospitality Highlights Ribbon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 text-xs text-stone-400 font-medium"
          >
            <div className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Forbes Five-Star Standards</span>
            </div>
            <span className="hidden sm:inline text-stone-700">•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Complimentary for All Guests</span>
            </div>
            <span className="hidden sm:inline text-stone-700">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Dedicated Butler Care</span>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE TIMELINE CONTAINER WITH CENTRAL SLIDING GLOWING BALL         */}
        {/* ZERO PRE-REVEALED LINE: Line ONLY generates directly behind the ball     */}
        {/* ARCHITECTURAL CORNER BRACKET BORDERS AROUND CONTAINER                    */}
        {/* ========================================================================= */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto py-8 sm:py-12 px-2 sm:px-6">

          {/* Container Corner Accent Brackets (Luxury Architectural Framing) */}
          <div className="hidden sm:block absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-amber-500/50 rounded-tl-sm pointer-events-none" />
          <div className="hidden sm:block absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-amber-500/50 rounded-tr-sm pointer-events-none" />
          <div className="hidden sm:block absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-amber-500/50 rounded-bl-sm pointer-events-none" />
          <div className="hidden sm:block absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-amber-500/50 rounded-br-sm pointer-events-none" />

          {/* ------------------------------------------------------------- */}
          {/* DESKTOP CENTER SPINE (Visible on md and up)                   */}
          {/* ------------------------------------------------------------- */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] pointer-events-none">
            {/* Glowing Golden Line: ONLY extends down to where the ball is  */}
            <motion.div
              style={{ height: lineHeightPercent }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-amber-500/80 via-amber-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.7)]"
            />

            {/* Sliding Glowing Ball that glides with scroll */}
            <motion.div
              style={{ top: ballTopPercent }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              {/* Radial glow halo */}
              <div className="absolute -inset-3.5 rounded-full bg-amber-400/40 blur-md animate-pulse" />
              <div className="absolute -inset-7 rounded-full bg-amber-500/25 blur-xl" />
              
              {/* Glowing core ball matching reference image */}
              <div className="relative w-4 h-4 rounded-full bg-amber-100 border-2 border-white shadow-[0_0_16px_#f59e0b,0_0_32px_#d97706]" />
            </motion.div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* MOBILE LEFT SPINE (Visible on mobile/tablet below md)        */}
          {/* ------------------------------------------------------------- */}
          <div className="md:hidden absolute left-5 top-4 bottom-4 w-[2px] pointer-events-none">
            {/* Glowing Golden Line */}
            <motion.div
              style={{ height: lineHeightPercent }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-amber-500/80 via-amber-400 to-amber-300 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.7)]"
            />

            {/* Sliding Glowing Ball for Mobile */}
            <motion.div
              style={{ top: ballTopPercent }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="absolute -inset-3 rounded-full bg-amber-400/40 blur-md animate-pulse" />
              <div className="relative w-3.5 h-3.5 rounded-full bg-amber-100 border-2 border-white shadow-[0_0_14px_#f59e0b]" />
            </motion.div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TIMELINE ITEMS: ALTERNATING LEFT & RIGHT SIDES                */}
          {/* 100% GPU TRANSFORM REVEALS RIGHT WHEN THE BALL ARRIVES        */}
          {/* ------------------------------------------------------------- */}
          <div className="space-y-16 sm:space-y-24">
            {facilities.map((item, index) => (
              <TimelineCard
                key={item.id}
                item={item}
                index={index}
                total={facilities.length}
                progress={smoothProgress}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
});

AmenitiesSection.displayName = 'AmenitiesSection';
