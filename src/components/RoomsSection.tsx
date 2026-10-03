import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Room } from '../types';
import { 
  Users, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  RotateCcw,
  BedDouble,
  Maximize2,
  Eye
} from 'lucide-react';
import Slider06 from '@/components/ui/slider-06';

interface RoomsSectionProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

interface RoomCardProps {
  room: Room;
  index: number;
  onSelectRoom: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = React.memo(({ room, index, onSelectRoom }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Subtle, buttery 3D tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = Number(((x - centerX) / centerX * 3.5).toFixed(2));
    const rotateX = Number(((centerY - y) / centerY * 3.5).toFixed(2));

    setMousePos({ x, y, isHovered: true });
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, isHovered: false }));
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const suiteNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 65, scale: 0.94, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.9, 
        delay: Math.min((index % 3) * 0.15, 0.45),
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ 
        y: -10, 
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-stone-950 border border-stone-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-amber-500/70 hover:shadow-[0_28px_75px_-15px_rgba(245,158,11,0.32)] backdrop-blur-md transition-colors duration-300 relative select-none transform-gpu"
    >
      {/* Inner 3D Tilt Wrapper */}
      <motion.div
        animate={{
          rotateX: mousePos.isHovered ? tilt.rotateX : 0,
          rotateY: mousePos.isHovered ? tilt.rotateY : 0,
        }}
        transition={{
          rotateX: { duration: 0.18, ease: 'easeOut' },
          rotateY: { duration: 0.18, ease: 'easeOut' },
        }}
        className="w-full h-full flex flex-col justify-between relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 4 Architectural Corner Accent Brackets */}
        <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-amber-400/40 rounded-tl-sm pointer-events-none group-hover:border-amber-400/90 transition-colors z-30" />
        <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-amber-400/40 rounded-tr-sm pointer-events-none group-hover:border-amber-400/90 transition-colors z-30" />
        <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-amber-400/40 rounded-bl-sm pointer-events-none group-hover:border-amber-400/90 transition-colors z-30" />
        <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-amber-400/40 rounded-br-sm pointer-events-none group-hover:border-amber-400/90 transition-colors z-30" />

        {/* Top Luminous Laser Hairline Glow */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none shadow-[0_0_12px_#f59e0b]" />

        {/* Dynamic Interactive Cursor Spotlight that tracks mouse coordinates */}
        {mousePos.isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300 z-20"
            style={{
              background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.14), transparent 75%)`
            }}
          />
        )}

        <div>
          {/* Suite Image with Cinematic Sunlight Shutter Sweep */}
          <div 
            className="relative h-64 sm:h-72 overflow-hidden cursor-pointer select-none bg-stone-900"
            onClick={(e) => {
              e.stopPropagation();
              if (room.available) onSelectRoom(room);
            }}
            title={room.available ? `Reserve ${room.name}` : room.name}
          >
            {/* Background Placeholder Pulse */}
            <div className="absolute inset-0 bg-stone-950 flex items-center justify-center -z-10">
              <Sparkles className="w-8 h-8 text-amber-500/30 animate-pulse" />
            </div>

            {/* Main Image with Gentle Settling Scale */}
            <motion.img
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              src={room.image}
              alt={room.name}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out select-none relative z-10"
            />

            {/* Atmospheric Contrast Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-transparent opacity-90 z-20 group-hover:opacity-75 transition-opacity duration-500" />

            {/* Cinematic Sunlight Shutter Beam: Sweeps diagonally across image on entrance */}
            <motion.div
              initial={{ x: '-150%', opacity: 0 }}
              whileInView={{ x: '260%', opacity: [0, 0.85, 0.85, 0] }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1.35, 
                delay: Math.min((index % 3) * 0.15, 0.45) + 0.2, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="absolute inset-0 w-3/5 h-full -skew-x-[26deg] bg-gradient-to-r from-transparent via-amber-300/40 via-amber-400/50 to-transparent pointer-events-none z-25 blur-[2px]"
            />

            {/* Top Left: Editorial Suite Index Badge with Glowing Dot */}
            <div className="absolute top-3.5 left-3.5 z-30 pointer-events-none flex items-center gap-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-xl flex items-center gap-1.5 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24]" />
                <span className="font-mono text-[10px] text-amber-400/80">№ {suiteNumber}</span>
                <span className="text-stone-600">·</span>
                <span>{room.type}</span>
              </span>
            </div>

            {/* Top Right: Nightly Price Badge */}
            <div className="absolute top-3.5 right-3.5 bg-stone-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400 border border-amber-500/40 shadow-xl z-30 pointer-events-none">
              ${room.price} <span className="text-[10px] text-stone-300 font-normal">/ night</span>
            </div>
          </div>

          {/* Room Info Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-amber-400" /> Up to {room.capacity} Guests
              </span>
              <span className={`flex items-center gap-1.5 font-semibold ${room.available ? 'text-emerald-400' : 'text-stone-400'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> {room.available ? 'Available' : 'Booked'}
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
              {room.name}
            </h3>

            {/* Key Hotel Specifications Bar */}
            <div className="grid grid-cols-2 gap-1.5 py-2 px-2.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
              <div className="flex items-center gap-1.5 truncate">
                <BedDouble className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{room.bedType || '1 King Bed'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{room.roomSize || '480 sq.ft.'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate col-span-2">
                <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{room.view || 'Scenic Horizon View'}</span>
              </div>
            </div>

            <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed font-light">
              {room.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {room.amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="bg-stone-900 text-stone-200 text-[10px] px-2.5 py-1 rounded-lg border border-stone-800 font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Room Reservation Action Footer Button */}
        <div className="p-6 pt-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (room.available) onSelectRoom(room);
            }}
            disabled={!room.available}
            className={`w-full min-h-[50px] py-3.5 px-5 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-lg active:scale-[0.98] ${
              room.available
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-600/30 hover:shadow-amber-500/40 hover:-translate-y-0.5 font-extrabold'
                : 'bg-stone-900 text-stone-500 cursor-not-allowed border border-stone-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{room.available ? 'Reserve Suite' : 'Currently Occupied'}</span>
              {room.available && (
                <span className="text-[10px] font-bold text-stone-950 bg-white/30 px-2 py-0.5 rounded-full lowercase">
                  pay at hotel
                </span>
              )}
            </span>
            {room.available && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

RoomCard.displayName = 'RoomCard';

export const RoomsSection: React.FC<RoomsSectionProps> = React.memo(({ rooms, onSelectRoom }) => {
  const [filterType, setFilterType] = useState<string>('All');

  const categories = useMemo(() => {
    return ['All', 'Single', 'Double', 'Twin', 'Suite'];
  }, []);

  const { minPrice, maxPrice } = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return { minPrice: 0, maxPrice: 1000 };
    }
    const prices = rooms.map((r) => Number(r.price) || 0);
    const min = Math.max(0, Math.floor(Math.min(...prices) / 50) * 50);
    const max = Math.ceil(Math.max(...prices) / 50) * 50;
    return {
      minPrice: min,
      maxPrice: Math.max(min + 100, max),
    };
  }, [rooms]);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesCategory =
        filterType === 'All' || (room.type && room.type.toLowerCase() === filterType.toLowerCase());
      const roomPrice = Number(room.price) || 0;
      const matchesPrice = roomPrice >= priceRange[0] && roomPrice <= priceRange[1];
      return matchesCategory && matchesPrice;
    });
  }, [rooms, filterType, priceRange]);

  const handleResetAllFilters = () => {
    setFilterType('All');
    setPriceRange([minPrice, maxPrice]);
  };

  return (
    <section id="rooms" className="py-24 sm:py-32 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-950 border border-amber-500/40 text-amber-400 text-xs font-bold tracking-widest uppercase shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Accommodations</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight"
          >
            Suites & Sanctuary Rooms
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-300 text-base font-light"
          >
            Meticulously crafted in rich coffee and noir tones, offering sublime comfort and absolute privacy.
          </motion.p>

          {/* Filter Pills - Smooth slide from left */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-2.5 pt-6"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterType(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition cursor-pointer shadow-md ${
                  filterType === cat
                    ? 'bg-amber-500 text-stone-950 shadow-amber-500/30 font-bold scale-105'
                    : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Dynamic Price Filter Bar - Smooth slide from left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 mx-auto max-w-xl bg-stone-950/90 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-stone-800">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Price & Availability</span>
              </div>
              <div className="text-xs font-medium text-stone-300 tracking-wide">
                Showing <span className="font-bold text-amber-400 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">{filteredRooms.length}</span> of {rooms.length} suites
              </div>
            </div>

            <Slider06
              min={minPrice}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              label="Select Desired Nightly Rate"
            />
          </motion.div>
        </div>

        {/* Room Suites Grid - Luxury 3D Spatial Stagger & Cinematic Sunbeam Reveal */}
        {filteredRooms.length > 0 ? (
          <motion.div 
            layout 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.14,
                  delayChildren: 0.06,
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pt-4 [perspective:1400px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  index={index}
                  onSelectRoom={onSelectRoom}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-stone-950/80 border border-stone-800 rounded-3xl max-w-xl mx-auto my-8 space-y-4 shadow-2xl"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-stone-900 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">No Suites Found in This Price Range</h3>
            <p className="text-stone-300 text-sm max-w-md mx-auto">
              There are currently no {filterType !== 'All' ? filterType : ''} rooms between ${priceRange[0]} and ${priceRange[1]} per night. Try expanding the price slider.
            </p>
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
});

RoomsSection.displayName = 'RoomsSection';
