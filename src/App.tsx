import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { Room, Booking, DEFAULT_ROOMS } from './types';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoomsSection } from './components/RoomsSection';
import { AmenitiesSection } from './components/AmenitiesSection';
import { DiningSection } from './components/DiningSection';
import { GallerySection } from './components/GallerySection';
import { MapSection } from './components/MapSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { RoomLandingModal } from './components/RoomLandingModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { MyBookingsModal } from './components/MyBookingsModal';

export default function App() {
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize buttery-smooth Lenis inertial scrolling optimized for high-refresh screens (60Hz-144Hz)
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential luxury ease-out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1.1,
        wheelMultiplier: 0.95,
        autoResize: true,
        infinite: false,
      });

      lenisRef.current = lenis;
      if (typeof window !== 'undefined') {
        (window as any).__lenis = lenis;
      }

      function raf(time: number) {
        if (lenis) lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    } catch (err) {
      console.warn("Lenis scroll notice:", err);
    }

    const onModalOpen = () => { try { lenis?.stop(); } catch {} };
    const onModalClose = () => { try { lenis?.start(); } catch {} };
    window.addEventListener('aurelia:modal-open', onModalOpen);
    window.addEventListener('aurelia:modal-close', onModalClose);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('aurelia:modal-open', onModalOpen);
      window.removeEventListener('aurelia:modal-close', onModalClose);
      if (typeof window !== 'undefined') {
        (window as any).__lenis = null;
      }
      try {
        lenis?.destroy();
      } catch {}
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis when modal is open to prevent background scroll interference
  const isAnyModalOpen = Boolean(selectedRoom || confirmedBooking || showMyBookings);
  useEffect(() => {
    if (lenisRef.current) {
      if (isAnyModalOpen) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [isAnyModalOpen]);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms?t=${Date.now()}`);
      if (!res.ok) return;
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setRooms(data);
      }
    } catch {
      // Fallback safely to Firestore snapshot listener
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial fetch from API for instant pre-render
    fetchRooms();

    // 2. Real-time Firestore onSnapshot listener for rooms (Single source of truth)
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      unsubscribeFirestore = onSnapshot(collection(db, 'rooms'), (snapshot) => {
        const liveRooms: Room[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Room;
          liveRooms.push({
            ...data,
            id: data.id || doc.id
          });
        });
        // Unconditionally update state with the live snapshot (Add, Edit, and Delete immediately reflect)
        setRooms(liveRooms);
        setLoading(false);
      }, (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'rooms');
        } catch (err) {
          console.warn("Firestore rooms onSnapshot listener notice:", err);
        }
      });
    } catch (e) {
      console.warn("Firestore rooms listener init:", e);
    }

    // 3. SSE push listener for immediate instant sync from server
    let eventSource: EventSource | null = null;
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        eventSource = new EventSource('/api/events');
        eventSource.addEventListener('ROOM_CREATED', () => fetchRooms());
        eventSource.addEventListener('ROOM_UPDATED', () => fetchRooms());
        eventSource.addEventListener('ROOM_DELETED', () => fetchRooms());
        eventSource.addEventListener('ROOM_TOGGLED', () => fetchRooms());
        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
        };
      }
    } catch {}

    // 4. Cross-tab storage & BroadcastChannel sync (0ms latency between admin tab and user tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'aurelia_rooms_sync_trigger' || e.key === 'aurelia_last_room_change') {
        fetchRooms();
      }
    };
    window.addEventListener('storage', handleStorage);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('aurelia_realtime_sync');
      bc.onmessage = (event) => {
        if (event.data?.type === 'ROOM_CHANGED') {
          fetchRooms();
        }
      };
    }

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      if (eventSource) eventSource.close();
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, [fetchRooms]);

  const scrollToSection = useCallback((targetId: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${targetId}`, {
        offset: -60,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBookingSuccess = useCallback((booking: Booking) => {
    setSelectedRoom(null);
    setConfirmedBooking(booking);
    fetchRooms(); // Refresh room status if needed
  }, [fetchRooms]);

  const handleSelectRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
  }, []);

  const handleOpenMyBookings = useCallback(() => {
    setShowMyBookings(true);
  }, []);

  const handleCloseSelectedRoom = useCallback(() => {
    setSelectedRoom(null);
  }, []);

  const handleCloseConfirmedBooking = useCallback(() => {
    setConfirmedBooking(null);
  }, []);

  const handleCloseMyBookings = useCallback(() => {
    setShowMyBookings(false);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Navigation */}
      <Navbar
        onOpenMyBookings={handleOpenMyBookings}
        onExploreRooms={() => scrollToSection('rooms')}
        onNavigate={scrollToSection}
      />

      {/* Hero Section */}
      <Hero
        onExploreRooms={() => scrollToSection('rooms')}
        onExploreAmenities={() => scrollToSection('amenities')}
      />

      {/* Rooms & Suites Section */}
      <RoomsSection
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
      />

      {/* World-Class Amenities */}
      <AmenitiesSection />

      {/* Fine Dining */}
      <DiningSection />

      {/* Gallery */}
      <GallerySection />

      {/* Map & Location */}
      <MapSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer 
        onNavigate={scrollToSection}
        onScrollToTop={scrollToTop}
      />

      {/* Modals */}
      <AnimatePresence>
        {selectedRoom && (
          <RoomLandingModal
            key={selectedRoom.id}
            room={selectedRoom}
            onClose={handleCloseSelectedRoom}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {confirmedBooking && (
          <BookingConfirmationModal
            key={confirmedBooking.id}
            booking={confirmedBooking}
            onClose={handleCloseConfirmedBooking}
          />
        )}

        {showMyBookings && (
          <MyBookingsModal
            key="my-bookings-modal"
            onClose={handleCloseMyBookings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
