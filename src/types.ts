export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  image: string;
  images?: string[];
  description: string;
  amenities: string[];
  available: boolean;

  // Essential hotel room specifications:
  roomSize?: string;
  bedType?: string;
  view?: string;
  bathroom?: string;
  floor?: string;
  smokingPolicy?: string;
  cancellationPolicy?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  specialRequests?: string;
  paymentMethod: string;
  status: "Confirmed" | "Checked-in" | "Completed" | "Cancelled";
  createdAt: string;
  roomImage?: string;
  roomType?: string;
  nights?: number;
  arrivalTime?: string;
  bedPreference?: string;
}

export const DEFAULT_ROOMS: Room[] = [
  {
    id: "room-1",
    name: "Deluxe Single Sanctuary",
    type: "Single",
    price: 180,
    capacity: 1,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Breathtaking panoramic ocean views with a private furnished balcony, plush single bedding, and marble rainfall shower.",
    amenities: ["Ocean View", "Single Bed", "Free WiFi", "Minibar", "Balcony", "Air Conditioning"],
    available: true,
    roomSize: "380 sq.ft. (35 m²)",
    bedType: "1 Plush Single Bed",
    view: "Unobstructed Oceanfront Horizon",
    bathroom: "Italian Marble Bath with Rainfall Shower",
    floor: "Floors 8 - 14",
    smokingPolicy: "100% Non-Smoking",
    cancellationPolicy: "Free cancellation until 24 hours before check-in"
  },
  {
    id: "room-2",
    name: "Executive Double Room",
    type: "Double",
    price: 280,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Spacious room featuring a separate luxury living area, executive lounge access, complimentary breakfast, and premium city-skyline views.",
    amenities: ["City View", "Double Bed", "Lounge Access", "Free Breakfast", "Espresso Machine", "Bathtub"],
    available: true,
    roomSize: "550 sq.ft. (51 m²)",
    bedType: "1 King Double Bed",
    view: "Metropolitan City Skyline & Bay",
    bathroom: "Deep Soaking Marble Tub & Twin Vanity",
    floor: "Floors 15 - 24 (Executive Wing)",
    smokingPolicy: "100% Non-Smoking",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in"
  },
  {
    id: "room-3",
    name: "Presidential Royal Suite",
    type: "Suite",
    price: 750,
    capacity: 5,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The epitome of ultra-luxury. Private rooftop terrace, personal 24/7 butler service, private jacuzzi, and expansive designer living spaces.",
    amenities: ["Rooftop Terrace", "Private Jacuzzi", "Butler Service", "2 King Beds", "Champagne Bar", "Private Elevator"],
    available: true,
    roomSize: "1,450 sq.ft. (135 m²)",
    bedType: "2 California King Beds",
    view: "360° Panoramic Ocean & Coastal Skyline",
    bathroom: "Jacuzzi Spa Suite, Steam Room & Rainfall Shower",
    floor: "Top Floor Penthouse Level (30th Floor)",
    smokingPolicy: "Smoking Permitted on Private Rooftop Terrace Only",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in"
  },
  {
    id: "room-4",
    name: "Twin Deluxe Bedroom",
    type: "Twin",
    price: 240,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Tranquil secluded room with two plush twin beds surrounded by lush gardens with private balcony and modern amenities.",
    amenities: ["Garden View", "2 Twin Beds", "Outdoor Patio", "Rainfall Shower", "Smart TV", "Free WiFi"],
    available: true,
    roomSize: "520 sq.ft. (48 m²)",
    bedType: "2 Twin Plush Beds",
    view: "Private Tropical Garden & Pool",
    bathroom: "Open-Air Garden Rainfall Shower & Sunken Tub",
    floor: "Floors 4 - 9",
    smokingPolicy: "100% Non-Smoking",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in"
  },
  {
    id: "room-5",
    name: "Classic Single Comfort",
    type: "Single",
    price: 150,
    capacity: 1,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Cozy and elegantly appointed room with high-speed internet, ergonomic workspace, and calming contemporary neutral decor.",
    amenities: ["Single Bed", "Workspace", "Free WiFi", "Safe", "Coffee Maker", "Room Service"],
    available: true,
    roomSize: "320 sq.ft. (30 m²)",
    bedType: "1 Single Bed",
    view: "Courtyard & Mountain View",
    bathroom: "Glass Walk-In Rainfall Shower",
    floor: "Floors 3 - 7",
    smokingPolicy: "100% Non-Smoking",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in"
  },
  {
    id: "room-6",
    name: "Royal Honeymoon Suite",
    type: "Suite",
    price: 520,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Romantic sanctuary designed for couples with a round king bed, rose petal turndown service, couple's spa bath, and sunset ocean view.",
    amenities: ["Ocean View", "Couples Jacuzzi", "Complimentary Spa", "Champagne", "King Bed", "Balcony"],
    available: true,
    roomSize: "720 sq.ft. (67 m²)",
    bedType: "1 Signature King Bed",
    view: "Sunset Oceanfront Panoramic Horizon",
    bathroom: "Dual Couple's Jacuzzi & Rainfall Shower",
    floor: "Floors 18 - 25",
    smokingPolicy: "100% Non-Smoking",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in"
  }
];
