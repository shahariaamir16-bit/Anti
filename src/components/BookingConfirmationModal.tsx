import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Booking } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  onClose: () => void;
}

// Ultra-smooth Luxury Golden & Teal Confetti Rain
const ConfettiRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Premium Gold & Teal Palette
    const colors = [
      '#FFD700', // Pure Luxury Gold
      '#D4AF37', // Metallic Gold
      '#F59E0B', // Amber Gold
      '#FDE68A', // Pale Champagne Gold
      '#14B8A6', // Vibrant Teal
      '#0D9488', // Deep Emerald Teal
      '#2DD4BF', // Radiant Mint Teal
      '#99F6E4', // Soft Pastel Teal
      '#E6C280', // Champagne Shimmer
      '#047857', // Forest Teal
    ];

    interface Particle {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      tilt: number;
      tiltSpeed: number;
      angle: number;
      angularSpeed: number;
      shape: 'rect' | 'circle' | 'ribbon';
    }

    const count = 130;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height * 0.9, // Start above the viewport
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2.2,
        vy: Math.random() * 2.8 + 2.0, // Buttery soft falling speed
        tilt: Math.random() * 10 - 5,
        tiltSpeed: Math.random() * 0.06 + 0.03,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.08,
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'ribbon',
      });
    }

    const startTime = Date.now();
    const duration = 5000; // Runs for 5 seconds as requested
    let animId: number;

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      // Smooth gradual fade-out in the last 1.5 seconds
      let globalAlpha = 1;
      if (elapsed > 3500) {
        globalAlpha = Math.max(0, 1 - (elapsed - 3500) / 1500);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = globalAlpha;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.angle) * 0.8;
        p.y += p.vy;
        p.angle += p.angularSpeed;
        p.tilt += p.tiltSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.tilt), 1);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.w / 2, -p.h, p.w, p.h * 1.8);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();

        // Recycle particles while within active rain time
        if (p.y > height + 20 && elapsed < 3200) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
    />
  );
};

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div 
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto"
    >
      {/* 1. Confetti Rain Overlay (5 seconds duration, golden & teal) */}
      <ConfettiRain />

      {/* 3. Entire screen slide-in upwards with a light and premium easing */}
      <motion.div
        initial={{ opacity: 0, y: 75, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1], // Luxury cubic-bezier deceleration
        }}
        className="bg-stone-900 border border-teal-500/30 rounded-2xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl relative text-center text-stone-100 overflow-y-auto backdrop-blur-2xl my-auto max-h-[92dvh]"
      >
        {/* Soft background ambient gradient glows */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 2. Check-mark icon with Reveal + Pulsing Glow Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -40, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            rotate: [-40, 8, 0],
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.34, 1.56, 0.64, 1], // Spring bounce reveal
          }}
          className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center"
        >
          {/* Pulsing Aura Rings */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-500/30 to-amber-500/20 blur-md pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.28, 1],
              opacity: [0.8, 0.15, 0.8],
            }}
            transition={{
              duration: 1.9,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.25,
            }}
            className="absolute inset-0 rounded-2xl border border-teal-400/40 pointer-events-none"
          />

          <div className="w-16 h-16 bg-gradient-to-br from-teal-950/80 via-stone-900 to-emerald-950/90 border-2 border-teal-400/60 text-teal-400 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20 relative z-10">
            <CheckCircle2 className="w-9 h-9 text-teal-300 drop-shadow-[0_0_12px_rgba(45,212,191,0.6)]" />
          </div>
        </motion.div>

        {/* 2. 'RESERVATION CONFIRMED' with Reveal + Pulsing Shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 14, letterSpacing: '0.12em' }}
          animate={{
            opacity: 1,
            y: 0,
            letterSpacing: '0.25em',
          }}
          transition={{
            duration: 0.65,
            delay: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mb-1"
        >
          <motion.span
            animate={{
              opacity: [0.85, 1, 0.85],
              textShadow: [
                '0 0 8px rgba(45,212,191,0.2)',
                '0 0 16px rgba(245,158,11,0.4)',
                '0 0 8px rgba(45,212,191,0.2)',
              ],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-xs font-bold bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent uppercase font-mono tracking-[0.25em]"
          >
            Reservation Confirmed
          </motion.span>
        </motion.div>

        <h2 className="text-3xl font-serif font-bold text-white mt-1 mb-2">Welcome to Aurelia</h2>
        <p className="text-stone-300 text-sm max-w-md mx-auto mb-6">
          Your booking has been successfully recorded and synchronized in real-time to the hotel front desk system.
        </p>

        <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 mb-6 inline-block w-full">
          <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Confirmation Reference ID</div>
          <div className="text-2xl font-mono font-bold text-amber-400 tracking-wider">{booking.id}</div>
        </div>

        {/* Confirmation Details Card - Fully Responsive Flex Layout for Mobile & Desktop */}
        <div className="bg-stone-950/80 rounded-2xl p-4 sm:p-5 border border-stone-800 text-left space-y-3 sm:space-y-3.5 mb-5 sm:mb-6 text-xs sm:text-sm shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
            <span className="text-stone-400 text-xs shrink-0 font-medium">Guest Name:</span>
            <span className="font-semibold text-white break-words sm:text-right">{booking.guestName}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
            <span className="text-stone-400 text-xs shrink-0 font-medium">Suite Booked:</span>
            <span className="font-semibold text-white break-words sm:text-right">{booking.roomName}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
            <span className="text-stone-400 text-xs shrink-0 font-medium">Check-in / Out:</span>
            <span className="font-semibold text-white break-words sm:text-right font-mono text-[11px] sm:text-xs text-amber-200/90">{booking.checkIn} to {booking.checkOut}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
            <span className="text-stone-400 text-xs shrink-0 font-medium">Payment Term:</span>
            <span className="font-semibold text-amber-400 break-words sm:text-right text-xs leading-relaxed">{booking.paymentMethod}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 border-t border-stone-800 pt-3 mt-1">
            <span className="text-stone-300 text-xs sm:text-sm font-medium">Total Amount Due at Check-in:</span>
            <span className="font-bold text-xl sm:text-2xl text-emerald-400 sm:text-right">${booking.totalPrice}</span>
          </div>
        </div>

        {/* Action Button Container */}
        <div className="w-full pt-1">
          {/* Done Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] py-3.5 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-lg shadow-amber-600/25 hover:shadow-amber-500/35 transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation"
          >
            <span>Done</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
