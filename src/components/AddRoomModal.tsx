import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Room } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  X, PlusCircle, Sparkles, Building2, BedDouble, 
  Maximize2, Eye, Bath, Cigarette, ShieldAlert, Image as ImageIcon,
  DollarSign, Users, Check
} from 'lucide-react';

interface AddRoomModalProps {
  onClose: () => void;
  onRoomAdded: (room: Room) => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({ onClose, onRoomAdded }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Single');
  const [price, setPrice] = useState(320);
  const [capacity, setCapacity] = useState(2);
  const [available, setAvailable] = useState(true);
  
  // Essential hotel specifications
  const [roomSize, setRoomSize] = useState('520 sq.ft. (48 m²)');
  const [bedType, setBedType] = useState('1 King Size Plush Bed');
  const [view, setView] = useState('Oceanfront Panoramic Horizon');
  const [bathroom, setBathroom] = useState('Italian Marble Bath with Rainfall Shower');
  const [floor, setFloor] = useState('Floors 10 - 22');
  const [smokingPolicy, setSmokingPolicy] = useState('100% Non-Smoking Room');
  const [cancellationPolicy, setCancellationPolicy] = useState('Free cancellation up to 24h prior to check-in');
  
  const [image, setImage] = useState('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('Luxuriously appointed suite with bespoke furnishings, expansive views, and plush bedding.');
  const [amenities, setAmenities] = useState('Ocean View, King Bed, Free High-Speed WiFi, Minibar, Private Balcony, Air Conditioning');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const presetPhotos = [
    { name: 'Oceanfront Executive', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Presidential Penthouse', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Garden Villa', url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Royal Honeymoon', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a suite name.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const newId = `room-${Date.now()}`;
    const allImages = [image];

    const roomPayload: Room = {
      id: newId,
      name: name.trim(),
      type,
      price: Number(price) || 200,
      capacity: Number(capacity) || 2,
      available,
      image,
      images: allImages,
      roomSize: roomSize.trim(),
      bedType: bedType.trim(),
      view: view.trim(),
      bathroom: bathroom.trim(),
      floor: floor.trim(),
      smokingPolicy: smokingPolicy.trim(),
      cancellationPolicy: cancellationPolicy.trim(),
      description: description.trim(),
      amenities: amenities.split(',').map(s => s.trim()).filter(Boolean)
    };

    // 1. Write to Firestore
    try {
      await setDoc(doc(db, 'rooms', newId), roomPayload, { merge: true });
    } catch (fsErr) {
      console.warn('Firestore room create note:', fsErr);
    }

    // 2. Post to API
    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomPayload)
      });
    } catch (apiErr) {
      console.warn('API room create note:', apiErr);
    }

    // 3. Broadcast sync
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('aurelia_realtime_sync');
          bc.postMessage({ type: 'ROOM_CHANGED', room: roomPayload });
          setTimeout(() => bc.close(), 2000);
        }
        localStorage.setItem('aurelia_rooms_sync_trigger', Date.now().toString());
        window.dispatchEvent(new CustomEvent('aurelia_room_changed', { detail: roomPayload }));
      } catch {}
    }

    setIsSubmitting(false);
    onRoomAdded(roomPayload);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-2xl shadow-2xl p-5 sm:p-8 relative text-stone-100 my-auto max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">Add New Hotel Suite</h3>
              <p className="text-xs text-stone-400">Publish a new room with complete hotel specifications to live website</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl bg-stone-800/60 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Suite Name & Type */}
          <div>
            <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">Suite Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Oceanfront Penthouse Suite"
              className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">Suite Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Twin">Twin</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">Nightly Rate ($ USD)</label>
              <input 
                type="number" 
                required
                min={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">Max Capacity</label>
              <input 
                type="number" 
                required
                min={1}
                max={12}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* ESSENTIAL HOTEL SPECIFICATIONS SECTION */}
          <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Essential Hotel Specifications (Guest Inclusions)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Room Size / Floor Area</label>
                <input 
                  type="text" 
                  value={roomSize}
                  onChange={(e) => setRoomSize(e.target.value)}
                  placeholder="e.g. 520 sq.ft. (48 m²)"
                  className="w-full min-h-[40px] bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Bed Type & Configuration</label>
                <input 
                  type="text" 
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                  placeholder="e.g. 1 King Size Plush Bed"
                  className="w-full min-h-[40px] bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Room & Window View</label>
                <input 
                  type="text" 
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  placeholder="e.g. Panoramic Oceanfront Horizon"
                  className="w-full min-h-[40px] bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Bathroom Features</label>
                <input 
                  type="text" 
                  value={bathroom}
                  onChange={(e) => setBathroom(e.target.value)}
                  placeholder="e.g. Italian Marble Bath with Rainfall Shower"
                  className="w-full min-h-[40px] bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Floor / Level</label>
                <input 
                  type="text" 
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g. Floors 10 - 22"
                  className="w-full min-h-[40px] bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Smoking Policy</label>
                <select
                  value={smokingPolicy}
                  onChange={(e) => setSmokingPolicy(e.target.value)}
                  className="w-full min-h-[40px] bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="100% Non-Smoking Room">100% Non-Smoking</option>
                  <option value="Smoking Permitted on Private Balcony">Smoking on Balcony Only</option>
                  <option value="Designated Smoking Room">Smoking Allowed</option>
                </select>
              </div>
              <div>
                <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Cancellation Policy</label>
                <input 
                  type="text" 
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  placeholder="e.g. Free cancellation until 24h prior"
                  className="w-full min-h-[40px] bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Photo URL & Quick Presets */}
          <div>
            <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">Primary Suite Photograph (URL)</label>
            <input 
              type="url" 
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full min-h-[40px] bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            />
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {presetPhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-[10px] text-stone-300 transition cursor-pointer active:scale-95"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">Suite Description</label>
            <textarea 
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the suite ambiance, bedding, balcony, view..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">Amenities (Comma-separated)</label>
            <input 
              type="text" 
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="Ocean View, King Bed, Free WiFi, Jacuzzi, Balcony"
              className="w-full min-h-[44px] bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Suite to Live Website'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
