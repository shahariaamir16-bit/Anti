import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (targetId: string) => void;
  onScrollToTop?: () => void;
}

export const Footer: React.FC<FooterProps> = React.memo(({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(targetId);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-stone-900 text-stone-400 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-stone-950 font-serif font-bold text-xl shadow-lg shadow-amber-600/20">
                A
              </div>
              <div>
                <span className="text-xl font-serif font-bold tracking-widest text-white">AURELIA</span>
                <span className="block text-[10px] tracking-[0.3em] uppercase text-amber-500 font-medium">Coffee & Noir Resort</span>
              </div>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              An award-winning luxury sanctuary offering peerless coastal hospitality, exquisite suites, and unforgettable dining experiences.
            </p>
            <div className="space-y-2 pt-2 text-xs text-stone-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>One Aurelia Boulevard, Coastal Paradise, CA 90210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (800) 555-AURELIA (2873)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>reservations@aureliahotel.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><button onClick={(e) => handleLinkClick(e, 'rooms')} className="hover:text-amber-400 transition cursor-pointer">Suites & Rooms</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'amenities')} className="hover:text-amber-400 transition cursor-pointer">Resort Amenities</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'dining')} className="hover:text-amber-400 transition cursor-pointer">Fine Dining</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'gallery')} className="hover:text-amber-400 transition cursor-pointer">Photo Gallery</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'location')} className="hover:text-amber-400 transition cursor-pointer">Location & Arrival</button></li>
              <li><button onClick={(e) => handleLinkClick(e, 'testimonials')} className="hover:text-amber-400 transition cursor-pointer">Guest Chronicles</button></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Guest Info</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><span className="text-amber-500 font-semibold">Pay at Hotel</span> (No Prepayment)</li>
              <li><span className="text-stone-300">Check-in:</span> 3:00 PM onwards</li>
              <li><span className="text-stone-300">Check-out:</span> Until 12:00 PM</li>
              <li><span className="text-stone-300">Cancellation:</span> Free up to 24h prior</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Aurelia Hotel & Resort. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-stone-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300 transition">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

