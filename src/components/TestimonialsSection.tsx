import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Quote, 
  X, 
  Send,
  Plus,
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  room: string;
  stayDuration: string;
  categoryLabel: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
}

const INITIAL_REVIEWS: Testimonial[] = [
  {
    id: "rev-1",
    name: "Lord & Lady Kensington",
    role: "Private Suite Guests",
    location: "London, United Kingdom",
    room: "Presidential Oceanfront Penthouse",
    stayDuration: "7 Nights · Private Butler",
    categoryLabel: "Honeymoon & Romantic",
    title: "",
    comment: "Aurelia Hotel provided the most breathtaking anniversary getaway of our lives. The private butler service anticipated our every desire before we articulated it. Waking up to the azure horizon vanishing past our heated private pool was an experience beyond words.",
    rating: 5,
    date: "September 2026"
  },
  {
    id: "rev-2",
    name: "Dr. Marcus Vance",
    role: "Biotech Founder & Investor",
    location: "Zurich, Switzerland",
    room: "Royal Azure Horizon Villa",
    stayDuration: "5 Nights · Helipad Transfer",
    categoryLabel: "Executive & VIP",
    title: "",
    comment: "As someone who travels 200+ days a year, Aurelia sets a rare standard. The high-speed encrypted connectivity, private meeting salon, and Michelin-starred private in-suite dining were impeccable. A masterclass in refined hospitality.",
    rating: 5,
    date: "August 2026"
  },
  {
    id: "rev-3",
    name: "Sophia Laurent",
    role: "Architectural Critic & Author",
    location: "Paris, France",
    room: "Aurelia Teak Sanctuary Villa",
    stayDuration: "4 Nights · Aurelia Spa Package",
    categoryLabel: "Wellness & Spa",
    title: "",
    comment: "The spatial harmony between raw travertine stone, cedarwood thermal suites, and panoramic ocean reflections is breathtaking. Every detail—from custom acoustic soundscapes to organic Swiss spa rituals—is curated with soul and grace.",
    rating: 5,
    date: "August 2026"
  },
  {
    id: "rev-4",
    name: "Alexander & Elena Rostova",
    role: "Fine Wine Collectors & Epicureans",
    location: "Milan, Italy",
    room: "Grand Waterfront Residence",
    stayDuration: "6 Nights · Sommelier Reserve",
    categoryLabel: "Michelin Dining",
    title: "",
    comment: "Chef Valerio Rossi's coastal seafood degustation paired with the 1996 vintage Krug champagne at The Noir Sky Lounge was transcendental. Aurelia doesn't just offer accommodation; they curate memories etched into eternity.",
    rating: 5,
    date: "July 2026"
  }
];

interface Card3DProps {
  review: Testimonial;
}

const Card3D: React.FC<Card3DProps> = React.memo(({ review }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 5;
    const rX = -((y - centerY) / centerY) * 5;

    setRotateX(rX);
    setRotateY(rY);
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setSheenPos({ x: 50, y: 50 });
  };

  return (
    <div 
      className="relative w-full perspective-[1400px] max-w-2xl mx-auto px-3 sm:px-0"
      style={{ perspective: '1400px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.008, 1.008, 1.008)` 
            : `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="group relative flex flex-col justify-between rounded-3xl p-6 sm:p-9 md:p-10 backdrop-blur-3xl bg-gradient-to-br from-stone-900/98 via-stone-900/92 to-stone-950/98 border border-amber-500/40 hover:border-amber-400 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.15)]"
      >
        {/* Top Gold Hairline */}
        <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />

        {/* Corner Architectural Brackets */}
        <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-amber-500/50 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-amber-500/50 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-3.5 left-3.5 w-3 h-3 border-b-2 border-l-2 border-amber-500/50 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-3.5 right-3.5 w-3 h-3 border-b-2 border-r-2 border-amber-500/50 rounded-br-sm pointer-events-none" />

        {/* Dynamic Specular Sheen Glow */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle 400px at ${sheenPos.x}% ${sheenPos.y}%, rgba(245, 158, 11, 0.22), transparent 70%)`
          }}
        />

        {/* Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
              <Quote className="w-5 h-5 fill-amber-400/20" />
            </div>

            <div className="flex items-center text-amber-400 gap-1 bg-stone-950/90 px-3 py-1.5 rounded-full border border-amber-500/30 shadow-inner">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_#fbbf24]" />
              ))}
              <span className="text-xs font-mono text-amber-300 ml-1.5 font-semibold">5.0</span>
            </div>
          </div>

          <p className="text-stone-200 text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose font-light italic tracking-wide">
            "{review.comment}"
          </p>
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-stone-800/90 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h4 className="font-serif font-bold text-white text-base sm:text-lg truncate group-hover:text-amber-300 transition-colors">
              {review.name}
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 truncate mt-0.5">{review.role} • <span className="text-amber-400/90 font-mono font-medium">{review.location}</span></p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-stone-400 font-mono bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">{review.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

Card3D.displayName = 'Card3D';

export const TestimonialsSection: React.FC = React.memo(() => {
  const [reviews, setReviews] = useState<Testimonial[]>(INITIAL_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Modal open/close Lenis synchronization
  useEffect(() => {
    if (!isModalOpen) return;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurelia:modal-open'));
      if ((window as any).__lenis) {
        (window as any).__lenis.stop();
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('aurelia:modal-close'));
        if ((window as any).__lenis) {
          (window as any).__lenis.start();
        }
      }
    };
  }, [isModalOpen]);

  const nextReview = () => {
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  // Keyboard support for arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextReview();
      if (e.key === 'ArrowLeft') prevReview();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reviews.length]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry: Testimonial = {
        id: `rev-${Date.now()}`,
        name: newReviewName,
        role: newReviewRole || 'Esteemed Guest',
        location: newReviewLocation || 'Verified Stay',
        room: 'Presidential Suite',
        stayDuration: 'Verified Guest Stay',
        categoryLabel: 'VIP',
        title: '',
        comment: newReviewComment,
        rating: newReviewRating,
        date: 'Just now'
      };

      setReviews(prev => [newEntry, ...prev]);
      setCurrentIndex(0);
      setIsSubmitting(false);
      setSubmissionSuccess(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setSubmissionSuccess(false);
        setNewReviewName('');
        setNewReviewRole('');
        setNewReviewLocation('');
        setNewReviewComment('');
      }, 1500);
    }, 600);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-stone-950 text-stone-100 relative overflow-hidden">
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

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-600/6 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-stone-900/90 border border-amber-600/30 text-amber-400 text-xs font-semibold tracking-widest uppercase shadow-md">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Guest Chronicles</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Echoes of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Splendor</span>
          </h2>

          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Unscripted recollections from our esteemed guests.
          </p>
        </div>

        {/* Share Button */}
        <div className="flex items-center justify-center mb-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Share Experience</span>
          </button>
        </div>

        {/* Card & Arrows */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview.id}
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card3D review={currentReview} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls: Pure Arrows & Dots */}
          <div className="flex items-center justify-between mt-8 max-w-2xl mx-auto px-4">
            <button
              onClick={prevReview}
              aria-label="Previous Story"
              className="w-12 h-12 rounded-full bg-stone-900 border border-amber-500/40 hover:border-amber-400 text-amber-400 flex items-center justify-center shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentIndex 
                      ? 'w-8 h-2.5 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_#fbbf24]' 
                      : 'w-2.5 h-2.5 bg-stone-800 hover:bg-stone-700'
                  }`}
                  aria-label={`Go to chronicle ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              aria-label="Next Story"
              className="w-12 h-12 rounded-full bg-stone-900 border border-amber-500/40 hover:border-amber-400 text-amber-400 flex items-center justify-center shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-serif font-bold text-white mb-2">
                Share Your Experience
              </h3>
              <p className="text-xs text-stone-400 mb-6 font-light">
                Add your personal reflection to the guest chronicle.
              </p>

              {submissionSuccess ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-white">Published Successfully</h4>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-xs text-white placeholder-stone-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">Title / Profession</label>
                      <input
                        type="text"
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        placeholder="e.g. Architect"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-xs text-white placeholder-stone-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={newReviewLocation}
                        onChange={(e) => setNewReviewLocation(e.target.value)}
                        placeholder="e.g. London, UK"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-xs text-white placeholder-stone-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Your Recollection *</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your stay experience..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-xs text-white placeholder-stone-600 focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Experience'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

