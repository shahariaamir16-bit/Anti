import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Booking } from '../types';
import { X, Search, Calendar, MapPin, DollarSign, ShieldAlert } from 'lucide-react';

interface MyBookingsModalProps {
  onClose: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setBookings(data);
      setSearched(true);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        className="bg-stone-900 border border-amber-600/30 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 md:p-8 shadow-2xl relative my-auto max-h-[90dvh] overflow-y-auto text-stone-100"
      >
        <button
          onClick={onClose}
          aria-label="Close my bookings modal"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 text-stone-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-stone-800/60 hover:bg-stone-800 transition active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 sm:mb-6 pr-10 sm:pr-0">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Guest Portal</span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">Lookup My Bookings</h2>
          <p className="text-xs text-stone-400 mt-0.5">Enter your email address to check reservation status and Pay-at-Hotel details.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-6">
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-amber-600"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] px-6 py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-600/20 active:scale-95 cursor-pointer flex items-center justify-center"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searched && (
          <div className="space-y-4 max-h-[50vh] sm:max-h-[55vh] overflow-y-auto pr-1">
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                No active bookings found associated with <strong className="text-stone-300">{email}</strong>.
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400 text-sm">{b.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      b.status === 'Confirmed' ? 'bg-amber-600/15 text-amber-400 border-amber-600/30' :
                      b.status === 'Checked-in' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      b.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{b.roomName}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
                    <div>Check-in: <strong className="text-stone-200">{b.checkIn}</strong></div>
                    <div>Check-out: <strong className="text-stone-200">{b.checkOut}</strong></div>
                    <div>Guests: <strong className="text-stone-200">{b.guests}</strong></div>
                    <div>Total: <strong className="text-amber-400">${b.totalPrice}</strong></div>
                  </div>
                  <div className="pt-2 border-t border-stone-900 text-[11px] text-amber-500 font-medium">
                    Payment Method: {b.paymentMethod}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
