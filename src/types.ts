export type UserRole = 'customer' | 'dealer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  location: string;
  businessName?: string;
  vendorId?: string;
}

export type EventType =
  | 'Marriage / Wedding'
  | 'Reception'
  | 'Engagement'
  | 'Birthday'
  | 'Baby Shower'
  | 'Naming Ceremony'
  | 'Anniversary'
  | 'Puberty / Age Attending'
  | 'Housewarming'
  | 'Corporate Event'
  | 'College Event'
  | 'Party'
  | 'Religious / Cultural'
  | 'Farewell'
  | 'Custom Event';

export type DealerCategory =
  | 'Function Hall'
  | 'Wedding Hall'
  | 'Hotel'
  | 'Decorator'
  | 'Caterer'
  | 'Photographer'
  | 'Videographer'
  | 'Makeup Artist'
  | 'Mehendi Artist'
  | 'Bridal Wear'
  | 'Groom Wear'
  | 'Invitation Designer'
  | 'Florist'
  | 'DJ'
  | 'Music / Band'
  | 'Event Planner'
  | 'Wedding Planner'
  | 'Cake Designer'
  | 'Return Gift Provider'
  | 'Lighting Provider'
  | 'Stage Designer'
  | 'Furniture / Rental'
  | 'Transportation'
  | 'Priest / Officiant'
  | 'Security'
  | 'Cleaning Service'
  | 'Other Event Services';

export type VendorCategory = DealerCategory;

export interface VendorPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  inclusions?: string[];
  features?: string[];
  duration?: string;
  isPopular?: boolean;
  popular?: boolean;
}

export interface VendorReview {
  id: string;
  customerName: string;
  rating: {
    overall: number;
    service: number;
    quality: number;
    price: number;
    professionalism: number;
    punctuality: number;
  };
  comment: string;
  date: string;
  eventType: string;
}

export interface Vendor {
  id: string;
  dealerId?: string;
  name: string;
  category: DealerCategory;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  priceUnit: string;
  location: string;
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
  travelTimeMins?: number;
  phone: string;
  whatsapp: string;
  description: string;
  images: string[];
  videoTourUrl?: string;
  capacity?: number;
  serviceArea: string;
  workingHours: string;
  availableDates: string[];
  unavailableDates: string[];
  packages: VendorPackage[];
  services: string[];
  featured?: boolean;
  isSample?: boolean;
  reviews: VendorReview[];
}

export interface CustomPackageItem {
  id: string;
  category: DealerCategory;
  vendorId?: string;
  vendorName?: string;
  name: string;
  price: number;
  selected: boolean;
  customNotes?: string;
}

export interface CustomerEvent {
  id: string;
  customerId: string;
  title: string;
  eventType: EventType;
  date: string;
  days: number;
  guests: number;
  budget: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  theme: string;
  foodPreference: 'Pure Vegetarian' | 'Non-Vegetarian' | 'Both Veg & Non-Veg' | 'Jain Food Available';
  otherRequirements?: string;
  status: 'planning' | 'booked' | 'completed';
  createdAt: string;
  customPackageItems?: CustomPackageItem[];
}

export type BookingStatus =
  | 'Request Sent'
  | 'Dealer Reviewing'
  | 'Accepted'
  | 'Payment Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export interface Booking {
  id: string;
  eventId?: string;
  eventTitle: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: DealerCategory;
  date: string;
  status: BookingStatus;
  quoteAmount: number;
  notes?: string;
  packageName?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface ChecklistTask {
  id: string;
  eventId: string;
  timeframe: '6 Months Before' | '3 Months Before' | '1 Month Before' | '1 Week Before' | 'Event Day';
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  category?: string;
}

export interface BudgetItem {
  category: string;
  estimatedPercent: number;
  estimatedAmount: number;
  actualAmount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: 'booking' | 'quote' | 'reminder' | 'system';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface AIEventPlan {
  summary: string;
  totalEstimatedCost: number;
  venue: {
    recommendation: string;
    idealCapacity: string;
    suggestedFeatures: string[];
    tips: string[];
  };
  decoration: {
    stageDesign: string;
    entrance: string;
    flowerDecoration: string;
    lighting: string;
    tableDecoration: string;
    mandapamDecoration: string;
    photoBooth: string;
    welcomeBoard: string;
    seatingDecoration: string;
  };
  food: {
    welcomeDrinks: string[];
    starters: string[];
    mainCourse: string[];
    riceVarieties: string[];
    breads: string[];
    dessertsAndIceCream: string[];
    liveCounters: string[];
    traditionalSpecial: string;
    vegetarianOptions: string[];
    nonVegetarianOptions: string[];
    estimatedCostPerPerson: number;
  };
  photography: {
    recommendations: string[];
    candidPhotography: string;
    droneCoverage: string;
    preShootIdea: string;
    albumAndVideo: string;
  };
  makeup: {
    bridalMakeup: string;
    groomStyling: string;
    hairAndDraping: string;
    mehendiConcept: string;
    familyPackages: string;
  };
  invitations: {
    themeConcept: string;
    invitationIdeas: string[];
    layoutSuggestion: string;
    colorAccents: string[];
  };
  entertainment: {
    djAndMusic: string;
    performances: string;
    guestEngagement: string;
  };
  overlookedEssentials: string[];
}

export interface ThemeConcept {
  id: string;
  name: string;
  tag: string;
  description: string;
  colorPalette: { name: string; hex: string }[];
  decorConcept: string;
  stageDesign: string;
  entranceDesign: string;
  tableDecor: string;
  invitationStyle: string;
  cakeDesign: string;
  dressSuggestions: string;
  makeupSuggestions: string;
  photoStyle: string;
  lightingStyle: string;
  imageUrl?: string;
}

export interface FoodPlannerResult {
  guests: number;
  cuisine: string;
  dietPreference: string;
  costPerPerson: number;
  totalFoodCost: number;
  courses: {
    category: string;
    dishes: { id: string; name: string; description: string; type: 'Veg' | 'Non-Veg'; costImpact: number }[];
  }[];
  suggestions: string[];
}

export type FoodMenu = FoodPlannerResult;

export interface InvitationCardData {
  id: string;
  event: string;
  hostNames: string;
  date: string;
  time: string;
  venue: string;
  theme: string;
  language: 'English' | 'Tamil' | 'Hindi' | 'Telugu';
  style: 'Royal' | 'Traditional' | 'Floral' | 'Minimal' | 'Modern' | 'Luxury';
  wording: string;
  dressCode?: string;
  rsvp: string;
}
