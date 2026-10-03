import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, Booking } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  X, Calendar, Users, ShieldCheck, 
  Sparkles, Check, ArrowRight, Phone, Mail, User,
  CheckCircle, Lock, ArrowLeft,
  ChevronLeft, ChevronRight, BedDouble, Maximize2,
  Eye, Bath, Building2, Cigarette, Clock, ShieldAlert,
  CreditCard, Sparkle
} from 'lucide-react';

interface RoomLandingModalProps {
  room: Room | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const RoomLandingModal: React.FC<RoomLandingModalProps> = ({ room, onClose, onBookingSuccess }) => {
  if (!room) return null;

  const validRoom: Room = {
    id: room.id || 'room-1',
    name: room.name || 'Executive Luxury Suite',
    type: room.type || 'Deluxe',
    price: Number(room.price) || 220,
    capacity: Number(room.capacity) || 2,
    image: room.image || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    images: Array.isArray(room.images) && room.images.length > 0 
      ? room.images 
      : [
          room.image || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
        ],
    description: room.description || 'Spacious and elegantly appointed suite designed for ultimate comfort.',
    amenities: Array.isArray(room.amenities) && room.amenities.length > 0 
      ? room.amenities 
      : ['Ocean View', 'King Bed', 'Free WiFi', 'Balcony', 'Air Conditioning'],
    available: room.available ?? true,
    roomSize: room.roomSize || '520 sq.ft. (48 m²)',
    bedType: room.bedType || '1 King Size Plush Bed',
    view: room.view || 'Panoramic Oceanfront Horizon',
    bathroom: room.bathroom || 'Italian Marble Bath with Rainfall Shower',
    floor: room.floor || 'Floors 10 - 22',
    smokingPolicy: room.smokingPolicy || '100% Non-Smoking Room',
    cancellationPolicy: room.cancellationPolicy || 'Free cancellation up to 24h prior to check-in'
  };

  // Multiple photos carousel setup - guaranteed multi-photo luxury gallery
  const defaultExtraImages = [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
  ];

  const gallery = Array.from(new Set([
    validRoom.image,
    ...(Array.isArray(validRoom.images) ? validRoom.images : []),
    ...defaultExtraImages
  ])).filter(Boolean).slice(0, 5);

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [photoTouchStart, setPhotoTouchStart] = useState<number | null>(null);
  const [photoTouchEnd, setPhotoTouchEnd] = useState<number | null>(null);
  const [step, setStep] = useState<'landing' | 'booking'>('landing');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const threeDaysLater = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(threeDaysLater);
  const [guests, setGuests] = useState(Math.min(2, Math.max(1, validRoom.capacity)));
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, gallery.length]);

  const handlePrevPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  // Mobile Touch Swipe Handlers for Room Photo Carousel
  const handlePhotoTouchStart = (e: React.TouchEvent) => {
    setPhotoTouchEnd(null);
    setPhotoTouchStart(e.targetTouches[0].clientX);
  };

  const handlePhotoTouchMove = (e: React.TouchEvent) => {
    setPhotoTouchEnd(e.targetTouches[0].clientX);
  };

  const handlePhotoTouchEnd = () => {
    if (!photoTouchStart || !photoTouchEnd) return;
    const distance = photoTouchStart - photoTouchEnd;
    if (distance > 45) {
      handleNextPhoto();
    } else if (distance < -45) {
      handlePrevPhoto();
    }
  };

  const validCheckIn = checkIn || todayStr;
  const validCheckOut = checkOut || threeDaysLater;
  const startDate = new Date(validCheckIn);
  const endDate = new Date(validCheckOut);
  const diffTime = (endDate.getTime() || 0) - (startDate.getTime() || 0);
  const rawNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const nights = !isNaN(rawNights) && rawNights > 0 ? rawNights : 1;
  const nightlyRate = Math.max(1, validRoom.price);
  const totalPrice = nightlyRate * nights;

  // Essential hotel specifications list
  const hotelSpecs = [
    { label: 'Room Size', value: validRoom.roomSize, icon: Maximize2, note: 'Spacious private living area' },
    { label: 'Bed Configuration', value: validRoom.bedType, icon: BedDouble, note: 'Hypoallergenic premium linen' },
    { label: 'Room & Window View', value: validRoom.view, icon: Eye, note: 'Unobstructed scenic exposure' },
    { label: 'Bath & Wellness', value: validRoom.bathroom, icon: Bath, note: 'Designer marble fixtures' },
    { label: 'Floor Level', value: validRoom.floor, icon: Building2, note: 'Elevator & concierge accessible' },
    { label: 'Smoking Policy', value: validRoom.smokingPolicy, icon: Cigarette, note: 'Strict clean-air standard' },
    { label: 'Maximum Occupancy', value: `Up to ${validRoom.capacity} Guests`, icon: Users, note: 'Adults & children welcome' },
    { label: 'Cancellation Policy', value: validRoom.cancellationPolicy, icon: ShieldAlert, note: 'Guaranteed pay-at-hotel booking' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your phone number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const bookingPayload = {
      roomId: validRoom.id,
      roomName: validRoom.name,
      roomPrice: nightlyRate,
      price: nightlyRate,
      roomType: validRoom.type,
      roomImage: validRoom.image,
      guestName: guestName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      checkIn: validCheckIn,
      checkOut: validCheckOut,
      guests: Number(guests) || 1,
      nights,
      specialRequests: specialRequests.trim(),
      totalPrice,
      paymentMethod: 'Pay at Hotel (Cash / Card at Check-in)',
      status: 'Confirmed' as const,
      createdAt: new Date().toISOString()
    };

    let newBooking: Booking | null = null;
    let serverSuccess = false;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      if (res.ok) {
        newBooking = await res.json();
        serverSuccess = true;
      }
    } catch (apiErr) {
      console.warn('API booking sync note:', apiErr);
    }

    if (!newBooking) {
      const bookingId = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
      newBooking = {
        id: bookingId,
        ...bookingPayload
      };
    }

    try {
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (fsErr) {
      console.warn('Firestore booking note:', fsErr);
    }

    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('aurelia_realtime_sync');
          bc.postMessage({ type: 'NEW_BOOKING', booking: newBooking });
          setTimeout(() => bc.close(), 2000);
        }
        localStorage.setItem('aurelia_last_live_booking', JSON.stringify({ booking: newBooking, timestamp: Date.now() }));
        localStorage.setItem('aurelia_bookings_sync_trigger', Date.now().toString());
        window.dispatchEvent(new CustomEvent('aurelia_new_booking', { detail: newBooking }));
      } catch {}
    }

    setIsSubmitting(false);
    onBookingSuccess(newBooking);
  };

  return (
    <motion.div 
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-stone-950/90 backdrop-blur-lg p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center items-start min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-stone-900 border border-amber-500/40 rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-[0_25px_100px_rgba(0,0,0,0.9)] relative overflow-hidden text-stone-100 my-2 sm:my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close suite details"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-40 text-stone-300 hover:text-white p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-stone-950/90 hover:bg-stone-800 border border-amber-500/40 transition shadow-2xl cursor-pointer active:scale-95 group"
        >
          <X className="w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <AnimatePresence mode="wait">
          {step === 'landing' ? (
            /* ======================================================== */
            /* STEP 1: ROOM DETAILS & RESTORED LUXURY PHOTO CAROUSEL    */
            /* ======================================================== */
            <motion.div 
              key="landing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col"
            >
              {/* 1. LUXURY PHOTO CAROUSEL SECTION (WITH MOBILE-FIRST ARROWS & SWIPE) */}
              <div 
                className="relative h-64 sm:h-[380px] md:h-[440px] w-full overflow-hidden bg-stone-950 select-none"
                onTouchStart={handlePhotoTouchStart}
                onTouchMove={handlePhotoTouchMove}
                onTouchEnd={handlePhotoTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentPhotoIdx}
                    src={gallery[currentPhotoIdx]} 
                    alt={`${validRoom.name} - Photo ${currentPhotoIdx + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent pointer-events-none" />

                {/* Left Navigation Chevron - Thumb-friendly on Mobile */}
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  aria-label="Previous photograph"
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-950/85 hover:bg-stone-900 border border-amber-500/50 text-amber-300 hover:text-white flex items-center justify-center shadow-2xl transition cursor-pointer active:scale-90 z-30 group"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform drop-shadow" />
                </button>

                {/* Right Navigation Chevron - Thumb-friendly on Mobile */}
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  aria-label="Next photograph"
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-950/85 hover:bg-stone-900 border border-amber-500/50 text-amber-300 hover:text-white flex items-center justify-center shadow-2xl transition cursor-pointer active:scale-90 z-30 group"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform drop-shadow" />
                </button>

                {/* Top Category & Availability Badges */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-950/90 text-amber-400 border border-amber-500/40 shadow-xl backdrop-blur-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{validRoom.type}</span>
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-1.5 border ${
                    validRoom.available 
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                      : 'bg-stone-950/80 text-stone-400 border-stone-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{validRoom.available ? 'Available' : 'Booked'}</span>
                  </span>
                </div>

                {/* Bottom Center Photo Indicator Pill */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center items-center z-20 pointer-events-none">
                  <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/35 shadow-xl">
                    <span className="text-[11px] font-mono text-amber-300 font-bold">
                      {currentPhotoIdx + 1} / {gallery.length}
                    </span>
                    <div className="flex items-center gap-1.5 ml-1">
                      {gallery.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentPhotoIdx(idx)}
                          aria-label={`Photo ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            currentPhotoIdx === idx 
                              ? 'w-5 sm:w-6 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' 
                              : 'w-1.5 bg-stone-600 hover:bg-stone-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SUITE CONTENT SECTIONS WITH CASCADE REVEAL ANIMATIONS */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.05
                    }
                  }
                }}
                className="p-4 sm:p-7 lg:p-8 space-y-6 bg-stone-900"
              >
                {/* SUITE TITLE & NIGHTLY TARIFF HEADER (Reveals first) */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                  className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-800"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                      {validRoom.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 font-light flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-semibold text-amber-300">Up to {validRoom.capacity} Guests</span>
                      <span className="text-stone-600">·</span>
                      <span>{validRoom.roomSize}</span>
                      <span className="text-stone-600">·</span>
                      <span className="truncate">{validRoom.bedType}</span>
                    </p>
                  </div>
                  <div className="bg-stone-950 border border-amber-500/40 rounded-2xl p-3 sm:p-4 text-left sm:text-right shrink-0 shadow-xl self-start sm:self-auto w-full sm:w-auto flex sm:block items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Nightly Tariff</p>
                      <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400 leading-tight">
                        ${validRoom.price} <span className="text-xs text-stone-300 font-sans font-light">/ night</span>
                      </p>
                    </div>
                    <span className="inline-block sm:hidden text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Pay at Hotel
                    </span>
                  </div>
                </motion.div>
                {/* A. SUITE ATMOSPHERE & DESCRIPTION */}
                <motion.div 
                  initial={{ opacity: 0, x: -45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="p-5 sm:p-7 rounded-2xl bg-stone-950 border border-amber-500/30 relative overflow-hidden shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Suite Atmosphere & Description
                    </h3>
                  </div>
                  <p className="text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                    {validRoom.description}
                  </p>
                </motion.div>

                {/* B. ESSENTIAL HOTEL SPECIFICATIONS & GUEST INCLUSIONS */}
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3"
                >
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2 mb-1">
                      <Sparkle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Essential Hotel Specifications & Guest Inclusions</span>
                    </h3>
                    <p className="text-xs text-stone-400">
                      Comprehensive room amenities, bedding configuration, floor level, and hotel policies.
                    </p>
                  </div>

                  {/* Hotel Specs 8-Grid (Staggered Left-Side Reveal Ripple) */}
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.07,
                          delayChildren: 0.05
                        }
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                  >
                    {hotelSpecs.map((spec, i) => {
                      const Icon = spec.icon;
                      return (
                        <motion.div 
                          key={i} 
                          variants={{
                            hidden: { opacity: 0, x: -45, scale: 0.96 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              scale: 1,
                              transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                            }
                          }}
                          whileHover={{ y: -4, borderColor: 'rgba(245, 158, 11, 0.5)', transition: { duration: 0.2 } }}
                          className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-200 shadow-md space-y-1 hover:border-amber-500/40 transition hover:-translate-y-0.5 group"
                        >
                          <div className="flex items-center gap-2 text-amber-400">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{spec.label}</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-1">{spec.value}</p>
                          <p className="text-[10px] text-stone-400 font-light truncate">{spec.note}</p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>

                {/* C. COMPLIMENTARY ROOM AMENITIES CHIPS (Staggered Left-Side Glide) */}
                {validRoom.amenities && validRoom.amenities.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>Complimentary Room Amenities</span>
                    </h3>
                    <motion.div 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-20px" }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.05
                          }
                        }
                      }}
                      className="flex flex-wrap gap-2"
                    >
                      {validRoom.amenities.map((amenity, i) => (
                        <motion.div 
                          key={i} 
                          variants={{
                            hidden: { opacity: 0, x: -35, scale: 0.95 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              scale: 1,
                              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                            }
                          }}
                          whileHover={{ scale: 1.04, y: -2, transition: { duration: 0.2 } }}
                          className="flex items-center gap-2 bg-stone-950 text-stone-200 text-xs px-3.5 py-2.5 rounded-xl border border-stone-800 hover:border-amber-500/40 font-medium shadow-sm transition"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{amenity}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* D. PAY AT HOTEL POLICY GUARANTEE (Smooth Left-Side Entrance) */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs text-stone-300 shadow-md"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-white font-semibold">Pay at Hotel Guarantee:</strong> No advance credit card charge required. Settle your balance at hotel check-in with free cancellation up to 24 hours prior.
                  </span>
                </motion.div>

              </motion.div>

              {/* FOOTER CTA */}
              <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4 sticky bottom-0 z-30">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400">Nightly Rate</p>
                  <p className="text-lg sm:text-xl font-serif font-bold text-white">
                    ${validRoom.price} <span className="text-xs text-amber-400 font-sans font-normal">/ night · Pay at Hotel</span>
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[44px] px-4 sm:px-5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold uppercase tracking-wider text-stone-300 hover:text-white transition cursor-pointer active:scale-95"
                  >
                    Close
                  </button>
                  {validRoom.available ? (
                    <button
                      type="button"
                      onClick={() => setStep('booking')}
                      className="min-h-[44px] py-2.5 px-6 sm:px-8 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] group font-extrabold"
                    >
                      <span>Booking Now</span>
                      <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="min-h-[44px] py-2.5 px-6 bg-stone-800 text-stone-500 text-xs font-bold uppercase tracking-wider rounded-xl cursor-not-allowed"
                    >
                      Currently Booked
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ======================================================== */
            /* STEP 2: BOOKING RESERVATION FORM                         */
            /* ======================================================== */
            <motion.div 
              key="booking-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="p-4 sm:p-8 bg-stone-900 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-5">
                <button
                  type="button"
                  onClick={() => setStep('landing')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer bg-stone-950 px-3 py-2 rounded-xl border border-amber-500/30"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Suite Details
                </button>
                <span className="text-xs text-stone-400 font-mono">Reserve {validRoom.name}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hotel Reservation Desk</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                    Confirm Stay Details
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Enter your booking schedule and contact details. Payment is settled at the hotel check-in desk.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Check-In Date</span>
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Check-Out Date</span>
                    </label>
                    <input
                      type="date"
                      min={checkIn || todayStr}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Number of Guests (Max {validRoom.capacity})</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    {Array.from({ length: Math.max(1, validRoom.capacity) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n} className="bg-stone-900 text-white">
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Johnathan Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Special Requests (Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Late arrival, high floor, quiet room..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Nightly Rate ({nights} {nights === 1 ? 'Night' : 'Nights'})</span>
                    <span className="font-mono text-white">${nightlyRate} × {nights} = ${totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Payment Method</span>
                    <span className="text-amber-400 font-medium">Pay at Hotel Check-In</span>
                  </div>
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <p className="text-xs uppercase font-bold text-amber-400">Total Payable</p>
                    <p className="text-xl sm:text-2xl font-serif font-bold text-amber-400">${totalPrice}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('landing')}
                    className="min-h-[44px] px-5 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[44px] px-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xl shadow-amber-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 flex-1 sm:flex-initial"
                  >
                    {isSubmitting ? (
                      <span>Reserving...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm Reservation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
