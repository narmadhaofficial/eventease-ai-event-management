import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getGeminiClient } from './server/gemini';
import { SAMPLE_VENDORS, INITIAL_CHECKLIST_TEMPLATES, POPULAR_THEMES, DEMO_CUSTOMER_EVENT } from './src/data/sampleVendors';
import { Booking, CustomerEvent, ChecklistTask, Vendor, VendorReview, User } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data state
let vendors: Vendor[] = [...SAMPLE_VENDORS];
let events: CustomerEvent[] = [{ ...DEMO_CUSTOMER_EVENT }];
let bookings: Booking[] = [
  {
    id: 'bk-101',
    eventId: DEMO_CUSTOMER_EVENT.id,
    eventTitle: DEMO_CUSTOMER_EVENT.title,
    customerId: 'cust-demo-1',
    customerName: 'Priya & Karthik',
    customerPhone: '+91 98400 11223',
    customerEmail: 'priya.karthik@gmail.com',
    vendorId: 'ven-1',
    vendorName: 'Sri Venkateswara Grand Palace & Convention',
    vendorCategory: 'Wedding Hall',
    date: '2026-12-20',
    status: 'Accepted',
    quoteAmount: 280000,
    packageName: 'Royal 2-Day Grand Celebration',
    notes: 'Requested early morning access on 20th Dec for stage setup.',
    createdAt: '2026-09-11T12:00:00.000Z',
    lastUpdated: '2026-09-11T16:30:00.000Z',
  },
  {
    id: 'bk-102',
    eventId: DEMO_CUSTOMER_EVENT.id,
    eventTitle: DEMO_CUSTOMER_EVENT.title,
    customerId: 'cust-demo-1',
    customerName: 'Priya & Karthik',
    customerPhone: '+91 98400 11223',
    customerEmail: 'priya.karthik@gmail.com',
    vendorId: 'ven-2',
    vendorName: 'Mayura Floral & Stage Decorators',
    vendorCategory: 'Decorator',
    date: '2026-12-20',
    status: 'Dealer Reviewing',
    quoteAmount: 55000,
    packageName: 'Classic Floral Elegance',
    notes: 'Pastel flowers with jasmine theme requested.',
    createdAt: '2026-09-11T14:20:00.000Z',
    lastUpdated: '2026-09-11T14:20:00.000Z',
  },
  {
    id: 'bk-103',
    eventId: DEMO_CUSTOMER_EVENT.id,
    eventTitle: DEMO_CUSTOMER_EVENT.title,
    customerId: 'cust-demo-1',
    customerName: 'Priya & Karthik',
    customerPhone: '+91 98400 11223',
    customerEmail: 'priya.karthik@gmail.com',
    vendorId: 'ven-4',
    vendorName: 'Lumiere Stories Candid & Cinema',
    vendorCategory: 'Photographer',
    date: '2026-12-20',
    status: 'Confirmed',
    quoteAmount: 65000,
    packageName: 'Classic Moments Package',
    notes: 'Advance ₹25,000 paid. Pre-wedding shoot scheduled in November.',
    createdAt: '2026-09-10T11:00:00.000Z',
    lastUpdated: '2026-09-11T09:00:00.000Z',
  },
];

let checklists: Record<string, ChecklistTask[]> = {
  [DEMO_CUSTOMER_EVENT.id]: [...INITIAL_CHECKLIST_TEMPLATES.default],
};

// Known coordinates for distance calculation
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  mysore: { lat: 12.2958, lng: 76.6394 },
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function resolveCoordinates(locationStr: string): { lat: number; lng: number } {
  const normalized = locationStr.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(city)) {
      return coords;
    }
  }
  // Default to Chennai coordinates
  return { lat: 13.0827, lng: 80.2707 };
}

// ---------------------- API ROUTES ----------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'EventEase', timestamp: new Date().toISOString() });
});

// Vendors listing with distance, search, filter and sort
app.get('/api/vendors', (req, res) => {
  const { category, search, location, sort, date, minPrice, maxPrice, capacity } = req.query;

  let userCoords = { lat: 13.0827, lng: 80.2707 };
  if (location && typeof location === 'string') {
    userCoords = resolveCoordinates(location);
  }

  let result = vendors.map((v) => {
    const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, v.coordinates.lat, v.coordinates.lng);
    // Rough estimation: 2.5 mins per km in city traffic + 5 min base
    const travelTime = Math.max(10, Math.round(dist * 2.5 + 5));
    return {
      ...v,
      distanceKm: dist,
      travelTimeMins: travelTime,
    };
  });

  // Filter category
  if (category && typeof category === 'string' && category !== 'All') {
    result = result.filter((v) => v.category.toLowerCase() === category.toLowerCase());
  }

  // Filter search text
  if (search && typeof search === 'string') {
    const query = search.toLowerCase();
    result = result.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.services.some((s) => s.toLowerCase().includes(query))
    );
  }

  // Filter location string
  if (location && typeof location === 'string' && location.trim()) {
    const locLower = location.toLowerCase();
    // Prioritize proximity or exact city match
    result = result.map((v) => {
      const matchScore = v.location.toLowerCase().includes(locLower) || v.city.toLowerCase().includes(locLower) ? 1 : 0;
      return { ...v, matchScore };
    });
  }

  // Date availability filter
  if (date && typeof date === 'string') {
    result = result.filter((v) => !v.unavailableDates.includes(date));
  }

  // Price range
  if (minPrice) {
    result = result.filter((v) => v.startingPrice >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter((v) => v.startingPrice <= Number(maxPrice));
  }

  // Capacity filter
  if (capacity) {
    result = result.filter((v) => (v.capacity || 0) >= Number(capacity));
  }

  // Sorting
  const sortType = (sort as string) || 'best_match';
  if (sortType === 'nearest') {
    result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  } else if (sortType === 'lowest_price') {
    result.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (sortType === 'highest_rated') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortType === 'best_value') {
    result.sort((a, b) => b.rating / (b.startingPrice / 10000 + 1) - a.rating / (a.startingPrice / 10000 + 1));
  } else {
    // Best Match: high rating, high reviews, reasonable distance
    result.sort((a, b) => {
      const scoreA = a.rating * 20 + a.reviewCount * 0.1 - (a.distanceKm || 0) * 0.5;
      const scoreB = b.rating * 20 + b.reviewCount * 0.1 - (b.distanceKm || 0) * 0.5;
      return scoreB - scoreA;
    });
  }

  res.json({ success: true, vendors: result, total: result.length });
});

// Single Vendor detail
app.get('/api/vendors/:id', (req, res) => {
  const vendor = vendors.find((v) => v.id === req.params.id);
  if (!vendor) {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }
  res.json({ success: true, vendor });
});

// Update or add Vendor (for Dealer Portal)
app.post('/api/vendors', (req, res) => {
  const vendorData = req.body;
  if (!vendorData.name || !vendorData.category) {
    return res.status(400).json({ success: false, message: 'Name and category are required' });
  }

  const newVendor: Vendor = {
    ...vendorData,
    id: vendorData.id || `ven-${Date.now()}`,
    rating: vendorData.rating || 5.0,
    reviewCount: vendorData.reviewCount || 1,
    coordinates: vendorData.coordinates || resolveCoordinates(vendorData.location || 'Chennai'),
    images: vendorData.images && vendorData.images.length ? vendorData.images : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'],
    packages: vendorData.packages || [],
    services: vendorData.services || [],
    reviews: vendorData.reviews || [],
    availableDates: vendorData.availableDates || [],
    unavailableDates: vendorData.unavailableDates || [],
  };

  const existingIndex = vendors.findIndex((v) => v.id === newVendor.id);
  if (existingIndex >= 0) {
    vendors[existingIndex] = { ...vendors[existingIndex], ...newVendor };
  } else {
    vendors.unshift(newVendor);
  }

  res.json({ success: true, vendor: newVendor });
});

// Add Review for vendor
app.post('/api/vendors/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { customerName, rating, comment, eventType } = req.body;
  const vendor = vendors.find((v) => v.id === id);
  if (!vendor) {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }

  const newReview: VendorReview = {
    id: `rev-${Date.now()}`,
    customerName: customerName || 'Verified Guest',
    rating: rating || { overall: 5, service: 5, quality: 5, price: 5, professionalism: 5, punctuality: 5 },
    comment: comment || 'Wonderful service and coordination!',
    date: 'Just now',
    eventType: eventType || 'Event',
  };

  vendor.reviews.unshift(newReview);
  vendor.reviewCount += 1;
  const avg = vendor.reviews.reduce((acc, r) => acc + r.rating.overall, 0) / vendor.reviews.length;
  vendor.rating = Math.round(avg * 10) / 10;

  res.json({ success: true, vendor });
});

// Events: Get current customer events
app.get('/api/events', (req, res) => {
  res.json({ success: true, events });
});

// Events: Create or update an event
app.post('/api/events', (req, res) => {
  const eventData = req.body;
  const newEvent: CustomerEvent = {
    ...eventData,
    id: eventData.id || `evt-${Date.now()}`,
    status: eventData.status || 'planning',
    createdAt: eventData.createdAt || new Date().toISOString(),
  };

  const existingIndex = events.findIndex((e) => e.id === newEvent.id);
  if (existingIndex >= 0) {
    events[existingIndex] = { ...events[existingIndex], ...newEvent };
  } else {
    events.unshift(newEvent);
    // Initialize checklist for new event
    checklists[newEvent.id] = INITIAL_CHECKLIST_TEMPLATES.default.map((item, idx) => ({
      ...item,
      id: `chk-${newEvent.id}-${idx}`,
      eventId: newEvent.id,
    }));
  }

  res.json({ success: true, event: newEvent });
});

// Bookings: List
app.get('/api/bookings', (req, res) => {
  const { role, vendorId, customerId } = req.query;
  let filtered = [...bookings];

  if (vendorId && typeof vendorId === 'string') {
    filtered = filtered.filter((b) => b.vendorId === vendorId);
  }
  if (customerId && typeof customerId === 'string') {
    filtered = filtered.filter((b) => b.customerId === customerId);
  }

  res.json({ success: true, bookings: filtered });
});

// Bookings: Create new request
app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  const newBooking: Booking = {
    ...bookingData,
    id: `bk-${Date.now()}`,
    status: 'Request Sent',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };

  bookings.unshift(newBooking);
  res.json({ success: true, booking: newBooking });
});

// Bookings: Update status (Accept, Reject, Quote, etc.)
app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status, quoteAmount, notes } = req.body;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  if (status) booking.status = status;
  if (quoteAmount !== undefined) booking.quoteAmount = quoteAmount;
  if (notes) booking.notes = notes;
  booking.lastUpdated = new Date().toISOString();

  res.json({ success: true, booking });
});

// Checklists: Get for event
app.get('/api/checklists/:eventId', (req, res) => {
  const { eventId } = req.params;
  const list = checklists[eventId] || checklists[DEMO_CUSTOMER_EVENT.id] || [];
  res.json({ success: true, checklist: list });
});

// Checklists: Update task status or add task
app.post('/api/checklists/:eventId', (req, res) => {
  const { eventId } = req.params;
  const task = req.body;
  if (!checklists[eventId]) {
    checklists[eventId] = [];
  }

  const existingIndex = checklists[eventId].findIndex((t) => t.id === task.id);
  if (existingIndex >= 0) {
    checklists[eventId][existingIndex] = { ...checklists[eventId][existingIndex], ...task };
  } else {
    checklists[eventId].push({
      ...task,
      id: task.id || `chk-${Date.now()}`,
      eventId,
    });
  }

  res.json({ success: true, checklist: checklists[eventId] });
});

// Themes: Get preset themes
app.get('/api/themes', (req, res) => {
  res.json({ success: true, themes: POPULAR_THEMES });
});

// ---------------------- AI ROUTES (GEMINI POWERED) ----------------------

// 1. AI Event Planner Endpoint
app.post('/api/ai/plan-event', async (req, res) => {
  const {
    eventType,
    location,
    date,
    days = 1,
    guests = 300,
    budget = 500000,
    theme = 'Traditional Royal',
    foodPreference = 'Both Veg & Non-Veg',
    otherRequirements = '',
  } = req.body;

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `You are the chief event planner for "EventEase", an ultra-innovative event management platform in India.
Generate a complete, comprehensive, and tailored event plan in strict JSON format based on the following client details:

Event Type: ${eventType}
Location: ${location}
Event Date: ${date}
Number of Days: ${days}
Expected Guests: ${guests}
Approximate Budget: ₹${budget.toLocaleString('en-IN')}
Preferred Theme: ${theme}
Food Preference: ${foodPreference}
Special Client Requirements: ${otherRequirements}

Output JSON strictly matching this structure (no markdown fences, just pure JSON):
{
  "summary": "2-3 sentences overview of the tailored strategy and theme alignment",
  "totalEstimatedCost": number (realistic estimate aligned with budget),
  "venue": {
    "recommendation": "specific hall/venue type description for ${location}",
    "idealCapacity": "e.g. 500 seated + 300 floating",
    "suggestedFeatures": ["Pillarless AC hall", "Dining hall for 300", "Ample valet parking"],
    "tips": ["Tip 1", "Tip 2"]
  },
  "decoration": {
    "stageDesign": "detailed description of the main stage",
    "entrance": "detailed entrance gateway arch description",
    "flowerDecoration": "specific flower species and floral motifs",
    "lighting": "lighting setup (PAR cans, warm fairy canopies, spotlighting)",
    "tableDecoration": "centerpieces and linen styling",
    "mandapamDecoration": "mandapam/focal canopy design",
    "photoBooth": "creative photo booth and prop suggestions",
    "welcomeBoard": "welcome easel/signage idea",
    "seatingDecoration": "chair tie-backs and VIP sofa arrangement"
  },
  "food": {
    "welcomeDrinks": ["Drink 1", "Drink 2"],
    "starters": ["Starter 1", "Starter 2", "Starter 3"],
    "mainCourse": ["Curry 1", "Dal/Gravy 2", "Paneer/Meat Special"],
    "riceVarieties": ["Biryani/Pulao", "Curd Rice/Ghee Rice"],
    "breads": ["Naan/Roti", "Poori/Parotta"],
    "dessertsAndIceCream": ["Sweet 1", "Payasam/Kheer", "Artisan Ice cream"],
    "liveCounters": ["Live counter 1 (e.g. Dosa/Pasta)", "Live Chaat Counter"],
    "traditionalSpecial": "Signature festive delicacy",
    "vegetarianOptions": ["Item 1", "Item 2"],
    "nonVegetarianOptions": ["Item 1", "Item 2"],
    "estimatedCostPerPerson": number (in INR)
  },
  "photography": {
    "recommendations": ["Candid Specialist", "Traditional HD Video", "4K Drone Aerials"],
    "candidPhotography": "specific candid vision and moments to capture",
    "droneCoverage": "aerial drone strategy for outdoor/arrival shots",
    "preShootIdea": "creative pre-event shoot location/concept in ${location}",
    "albumAndVideo": "specs for photobooks and 3-min cinematic teaser"
  },
  "makeup": {
    "bridalMakeup": "makeup style recommendation (Airbrush / HD / Water-resistant)",
    "groomStyling": "groom styling, hair and beard grooming",
    "hairAndDraping": "traditional hair styling (e.g. poola jada/curls) and saree pre-pleating",
    "mehendiConcept": "mehendi style and stains",
    "familyPackages": "family touchup recommendations"
  },
  "invitations": {
    "themeConcept": "wording tone and aesthetic",
    "invitationIdeas": ["Idea 1", "Idea 2"],
    "layoutSuggestion": "layout and foil style",
    "colorAccents": ["#Hex1", "#Hex2", "#Hex3"]
  },
  "entertainment": {
    "djAndMusic": "DJ/Sound specs or live traditional nadaswaram/shehnai",
    "performances": "dance or cultural entertainment",
    "guestEngagement": "interactive games and fun elements"
  },
  "overlookedEssentials": [
    "5-7 critical overlooked items clients often forget (e.g., green room AC remotes, emergency sewing kit, extra generator fuel buffer, return gifts packaging, VIP parking reserved cones)"
  ]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.json({ success: true, plan: parsed, source: 'gemini' });
    } catch (err: any) {
      console.warn('Gemini planning error, fallback used:', err.message);
    }
  }

  // High quality algorithmic fallback plan
  const plan = generateAlgorithmicPlan(eventType, location, guests, budget, theme, foodPreference, otherRequirements);
  return res.json({ success: true, plan, source: 'engine' });
});

// 2. AI Theme Generator
app.post('/api/ai/generate-theme', async (req, res) => {
  const { prompt = 'Pink floral baby shower', eventType = 'Baby Shower' } = req.body;
  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const aiPrompt = `You are a world-class event scenographer and theme designer for "EventEase".
Design a customized event theme for prompt: "${prompt}" (Event Type: ${eventType}).
Return strict JSON:
{
  "id": "custom-${Date.now()}",
  "name": "Creative Theme Name",
  "tag": "Sub-tagline",
  "description": "Inspiring 2-sentence description of the visual atmosphere",
  "colorPalette": [
    { "name": "Primary Shade", "hex": "#hexcode" },
    { "name": "Secondary Shade", "hex": "#hexcode" },
    { "name": "Accent Metal/Gold", "hex": "#hexcode" },
    { "name": "Neutral Ground", "hex": "#hexcode" }
  ],
  "decorConcept": "Specific scenic props, drapery, and textures",
  "stageDesign": "Stage backdrop dimensions, floral framing, and lighting details",
  "entranceDesign": "Entrance pathway, welcome arch, and signage",
  "tableDecor": "Linens, napkins, centerpieces, and cutlery details",
  "invitationStyle": "Card stock, typography, and envelope treatment",
  "cakeDesign": "Cake tiers, frosting technique, and edible decor",
  "dressSuggestions": "Attire advice for hosts/couples",
  "makeupSuggestions": "Makeup palette and hair styling",
  "photoStyle": "Lighting, mood, and photo grading direction",
  "lightingStyle": "Temperature (Kelvin), spotlights, and ambient fixtures"
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: aiPrompt,
        config: { responseMimeType: 'application/json' },
      });

      const text = response.text || '';
      return res.json({ success: true, theme: JSON.parse(text), source: 'gemini' });
    } catch (err: any) {
      console.warn('Gemini theme error, fallback used:', err.message);
    }
  }

  // Fallback custom theme
  const fallbackTheme = {
    id: `custom-${Date.now()}`,
    name: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Concept`,
    tag: 'Bespoke AI Curated Aesthetics',
    description: `A custom designed scenic celebration concept centering ${prompt} with harmonized colors and elegant decor fixtures.`,
    colorPalette: [
      { name: 'Rose Petal', hex: '#e89da2' },
      { name: 'Champagne Shimmer', hex: '#d4af37' },
      { name: 'Ivory Cloud', hex: '#fbf8f2' },
      { name: 'Forest Moss', hex: '#2d4739' },
    ],
    decorConcept: `Layered textures with hanging floral clouds, soft velvet draperies, and customized monograms tailored for ${prompt}.`,
    stageDesign: 'Curved wooden backdrop with integrated LED perimeter channels and asymmetric floral arrangements.',
    entranceDesign: 'Mirrored acrylic entryway flanked by fresh rose pillars and warm hurricane candle lamps.',
    tableDecor: 'Satin table runners with crystal tea light holders and personalized place card tags.',
    invitationStyle: 'Foil-stamped handmade deckle edge stationery with botanical gold wax monogram.',
    cakeDesign: '3-tier marbled confection topped with fresh blooms and edible gold leaf.',
    dressSuggestions: 'Coordinated pastel or royal ensembles with complimentary jewelry accents.',
    makeupSuggestions: 'Soft glow skin finish, winged eyes, and natural berry lips.',
    photoStyle: 'Cinematic portraiture with warm rim lighting and soft background bokeh.',
    lightingStyle: '2700K warm incandescent ambient lighting with pin spot highlights.',
  };

  res.json({ success: true, theme: fallbackTheme, source: 'engine' });
});

// 3. AI Food Planner
app.post('/api/ai/food-planner', async (req, res) => {
  const {
    guests = 300,
    dietPreference = 'Both Veg & Non-Veg',
    eventType = 'Marriage / Wedding',
    budgetPerPerson = 600,
    cuisine = 'South Indian & North Indian Fusion',
  } = req.body;

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `Create an event food menu for "EventEase".
Guests: ${guests}
Diet: ${dietPreference}
Event: ${eventType}
Target Budget Per Plate: ₹${budgetPerPerson}
Cuisine: ${cuisine}

Output strict JSON:
{
  "guests": ${guests},
  "cuisine": "${cuisine}",
  "dietPreference": "${dietPreference}",
  "costPerPerson": number,
  "totalFoodCost": number,
  "courses": [
    {
      "category": "Welcome Drinks",
      "dishes": [
        { "id": "d1", "name": "Drink Name", "description": "Short appetizing description", "type": "Veg", "costImpact": 35 }
      ]
    },
    {
      "category": "Starters & Appetizers",
      "dishes": [
        { "id": "d2", "name": "Starter Name", "description": "Description", "type": "Veg" | "Non-Veg", "costImpact": 60 }
      ]
    },
    {
      "category": "Main Course Gravies",
      "dishes": [...]
    },
    {
      "category": "Rice & Breads",
      "dishes": [...]
    },
    {
      "category": "Live Counters",
      "dishes": [...]
    },
    {
      "category": "Desserts & Delights",
      "dishes": [...]
    }
  ],
  "suggestions": [
    "Catering management tips for ${guests} guests"
  ]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '');
      return res.json({ success: true, menu: parsed, source: 'gemini' });
    } catch (err: any) {
      console.warn('Gemini food planner error:', err.message);
    }
  }

  // Fallback menu
  const fallbackMenu = {
    guests,
    cuisine,
    dietPreference,
    costPerPerson: Number(budgetPerPerson) || 550,
    totalFoodCost: (Number(budgetPerPerson) || 550) * guests,
    courses: [
      {
        category: 'Welcome Drinks',
        dishes: [
          { id: 'fd-1', name: 'Tender Coconut Elaneer Cooler', description: 'Freshly tapped tender coconut with mint and sabja seeds', type: 'Veg', costImpact: 40 },
          { id: 'fd-2', name: 'Royal Rose Badam Sherbet', description: 'Chilled almond milk infused with Damascus rose petals', type: 'Veg', costImpact: 45 },
        ],
      },
      {
        category: 'Starters & Appetizers',
        dishes: [
          { id: 'fd-3', name: 'Paneer Tikka Angara', description: 'Clay-oven roasted cottage cheese with crushed spices', type: 'Veg', costImpact: 70 },
          { id: 'fd-4', name: 'Crispy Corn & Waterchestnut Pepper Salt', description: 'Wok tossed sweet corn and water chestnuts', type: 'Veg', costImpact: 60 },
          ...(dietPreference !== 'Pure Vegetarian'
            ? [
                { id: 'fd-5', name: 'Chettinad Kozhi Varuval', description: 'Spiced pan-tossed boneless chicken with fresh curry leaves', type: 'Non-Veg', costImpact: 90 },
                { id: 'fd-6', name: 'Amritsari Fish Fry', description: 'Ajwain-spiced carom seeded crisp fish goujons', type: 'Non-Veg', costImpact: 110 },
              ]
            : []),
        ],
      },
      {
        category: 'Main Course & Specialties',
        dishes: [
          { id: 'fd-7', name: 'Hyderabadi Dum Biryani', description: 'Fragrant basmati rice slow-cooked with saffron, caramelized onions, and spices', type: dietPreference === 'Pure Vegetarian' ? 'Veg' : 'Non-Veg', costImpact: 120 },
          { id: 'fd-8', name: 'Paneer Butter Masala & Dal Makhani', description: 'Rich tomato cashew gravy paired with slow-simmered black lentils', type: 'Veg', costImpact: 80 },
          { id: 'fd-9', name: 'Authentic Bisibelebath with Boondi', description: 'Traditional Karnataka spiced lentil rice with homemade ghee', type: 'Veg', costImpact: 50 },
        ],
      },
      {
        category: 'Live Counters',
        dishes: [
          { id: 'fd-10', name: 'Live Podi Dosa & Appam Station', description: 'Mini coin dosas, gun powder dosas, and coconut milk appams made fresh on spot', type: 'Veg', costImpact: 65 },
          { id: 'fd-11', name: 'Delhi Dahi Puri & Chaat Trolley', description: 'Freshly assembled sev puri, dahi bhalla, and pani puri shells', type: 'Veg', costImpact: 50 },
        ],
      },
      {
        category: 'Desserts & Sweets',
        dishes: [
          { id: 'fd-12', name: 'Warm Gajar Ka Halwa with Vanilla Gelato', description: 'Slow-cooked grated carrots with reduced mawa and cold ice cream', type: 'Veg', costImpact: 55 },
          { id: 'fd-13', name: 'Elaneer Payasam & Rasmalai', description: 'Creamy tender coconut milk kheer and saffron soaked rasmalai discs', type: 'Veg', costImpact: 60 },
          { id: 'fd-14', name: 'Filter Coffee & Paan Counter', description: 'Fresh Kumbakonam degree filter coffee and meetha paan foldings', type: 'Veg', costImpact: 30 },
        ],
      },
    ],
    suggestions: [
      `For ${guests} guests, arrange 4 dual-sided buffet lines to prevent queues during peak lunch/dinner.`,
      'Keep a dedicated live counter for kids with mini pizzas and french fries.',
      'Ensure water dispensers and servers with warm hand towels are placed near the dining exit.',
    ],
  };

  res.json({ success: true, menu: fallbackMenu, source: 'engine' });
});

// 4. AI Invitation Generator
app.post('/api/ai/invitation-generator', async (req, res) => {
  const {
    event = 'Marriage / Wedding',
    hostNames = 'Karthik & Priya',
    date = '20 December 2026',
    time = '10:00 AM onwards',
    venue = 'Sri Venkateswara Grand Palace, Chennai',
    theme = 'Traditional Royal Temple',
    language = 'English',
    style = 'Royal',
  } = req.body;

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `Write a beautiful, poetic, and culturally refined event invitation card text for "EventEase".
Event: ${event}
Host/Couple Names: ${hostNames}
Date: ${date}
Time: ${time}
Venue: ${venue}
Theme: ${theme}
Language: ${language}
Design Style: ${style}

Generate strict JSON:
{
  "title": "Header / Invocation line (e.g. Om Sri Ganeshaya Namaha or In Joyous Celebration)",
  "subtitle": "Subtitle or Family greeting line",
  "wording": "Main invitation body text in ${language} (rich, heartfelt, elegant)",
  "scheduleLines": [
    "Muhurtham: 09:00 AM - 10:30 AM",
    "Lunch Feast: 11:30 AM onwards",
    "Grand Reception: 06:30 PM onwards"
  ],
  "dressCode": "Suggested dress code",
  "rsvp": "Warm RSVP line with contact numbers",
  "blessingQuote": "Poetic 1-2 line auspicious quote in ${language}"
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '');
      return res.json({ success: true, invitation: parsed, source: 'gemini' });
    } catch (err: any) {
      console.warn('Gemini invitation error:', err.message);
    }
  }

  // Fallback invitation text
  const fallbackInvitation = {
    title: language === 'Tamil' ? '|| ஸ்ரீ கணேசாய நம: ||' : 'In the Auspicious Presence of Family & Friends',
    subtitle: language === 'Tamil' ? 'திருமண அழைப்பிதழ்' : 'Together with their families',
    wording:
      language === 'Tamil'
        ? `அன்புடையீர், எங்கள் குடும்பத்து ${hostNames} அவர்களின் திருமண நன்னாளுக்கு தங்களை அன்போடு அழைக்கின்றோம். தங்களின் வருகையும் வாழ்த்தும் எங்கள் இல்லத்திற்கு பெருமகிழ்ச்சி தரும்.`
        : `cordially invite you to share in the joy and celebration of the union of their beloved ${hostNames}. Join us as we celebrate love, laughter, and lifelong beginnings.`,
    scheduleLines: [
      `Date: ${date}`,
      `Time: ${time}`,
      `Venue: ${venue}`,
    ],
    dressCode: 'Traditional Indian Elegance / Festive Formal',
    rsvp: 'Warm regards: With Best Compliments from Family & Friends. Contact: +91 98400 11223',
    blessingQuote: 'Two souls, one sacred path. May their journey be showered with boundless love and prosperity.',
  };

  res.json({ success: true, invitation: fallbackInvitation, source: 'engine' });
});

// 5. AI Chat Assistant ("EventEase AI")
app.post('/api/ai/chat', async (req, res) => {
  const { message, activeEvent } = req.body;
  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const eventContext = activeEvent
        ? `Current customer event context: Event Type: ${activeEvent.eventType}, Location: ${activeEvent.location}, Date: ${activeEvent.date}, Guests: ${activeEvent.guests}, Budget: ₹${activeEvent.budget}, Theme: ${activeEvent.theme}, Food: ${activeEvent.foodPreference}.`
        : 'Customer is planning a new event in India.';

      const prompt = `You are "EventEase AI", an expert Indian event & wedding consultant.
${eventContext}
Always give actionable, courteous, warm, and precise advice regarding pricing in ₹ (INR), vendors, menus, decor, logistics, and timelines. Keep responses structured, concise, and helpful.

User asked: "${message}"`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ success: true, reply: response.text });
    } catch (err: any) {
      console.warn('Gemini chat error:', err.message);
    }
  }

  // Fallback smart responses
  let reply = `Here are some recommendations from EventEase AI for your event:
• **Budget Planning**: With your guest count, allocate approximately 40% towards the venue and food, 20% for stage decor and lighting, 15% for candid photography and albums, and 10% for styling and entertainment.
• **Vendor Timelines**: Book your venue and photographer first, as auspicious dates fill up quickly.
• **Guest Comfort**: Ensure plenty of seating, well-staffed welcome drinks, and clear signage to dining areas.`;

  if (message.toLowerCase().includes('food') || message.toLowerCase().includes('cater')) {
    reply = `For catering in India, plan around 350-450 grams of cooked food per adult guest.
• Always prepare a 10% buffer above the RSVP count for unexpected relatives.
• For dinner events, ensure live counters (chaat/dosa) stay active during the first 90 minutes.
• A balanced menu includes 2 welcome drinks, 3 starters, 4 gravies/curries, 2 rice items, hot breads, and 3 desserts.`;
  } else if (message.toLowerCase().includes('decor') || message.toLowerCase().includes('stage')) {
    reply = `For stage decoration:
• Measure your venue stage width (standard halls are 24–36 feet wide).
• Use warm 2700K LED wash lights rather than harsh cool white LEDs so portraits look natural.
• A floral entrance arch with marigold or pastel hydrangeas sets an immediate celebratory mood!`;
  }

  res.json({ success: true, reply });
});

// 6. Compare Vendors AI Evaluation
app.post('/api/ai/compare-vendors', async (req, res) => {
  const { vendorIds = [] } = req.body;
  const selectedVendors = vendors.filter((v) => vendorIds.includes(v.id));

  if (selectedVendors.length === 0) {
    return res.status(400).json({ success: false, message: 'No vendors selected' });
  }

  const gemini = getGeminiClient();
  if (gemini && selectedVendors.length >= 2) {
    try {
      const summary = selectedVendors
        .map(
          (v) =>
            `- ${v.name} (${v.category}): Price ₹${v.startingPrice} ${v.priceUnit}, Rating ${v.rating}/5 (${v.reviewCount} reviews), Location: ${v.location}, Services: ${v.services.join(', ')}`
        )
        .join('\n');

      const prompt = `Compare the following event service vendors for an event in India:
${summary}

Provide a comparative analysis with:
1. "bestFor": 1 sentence identifying which vendor suits what type of customer.
2. "recommendation": Concrete recommendation on the best value choice and why.
3. "prosAndCons": Short key advantage for each vendor.
Keep it strictly under 150 words.`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ success: true, comparison: response.text });
    } catch (err: any) {
      console.warn('Gemini compare error:', err.message);
    }
  }

  const comparison = `**EventEase Analysis**:
• **Best Overall Value**: ${selectedVendors[0]?.name || 'Option 1'} provides the highest verified rating (${selectedVendors[0]?.rating}/5) and proven track record.
• **Price Consideration**: If budget optimization is your primary goal, check the starting package prices against your total allocation.
• **Pro Tip**: Always confirm whether travel/generator costs are included before paying the booking deposit.`;

  res.json({ success: true, comparison });
});

// Helper for algorithmic plan generation
function generateAlgorithmicPlan(
  eventType: string,
  location: string,
  guests: number,
  budget: number,
  theme: string,
  foodPreference: string,
  otherRequirements: string
) {
  const venueBudget = Math.round(budget * 0.3);
  const foodBudget = Math.round(budget * 0.35);
  const decorBudget = Math.round(budget * 0.15);
  const photoBudget = Math.round(budget * 0.1);
  const makeupBudget = Math.round(budget * 0.05);
  const costPerPerson = Math.round(foodBudget / Math.max(1, guests));

  return {
    summary: `Comprehensive master execution plan for a ${guests}-guest ${eventType} in ${location} with an estimated ₹${budget.toLocaleString('en-IN')} budget, styled around the "${theme}" aesthetic.`,
    totalEstimatedCost: budget,
    venue: {
      recommendation: `Spacious centralized AC hall in ${location} with dining hall capacity for at least ${Math.round(guests * 0.5)} seated guests and 4 dedicated green rooms.`,
      idealCapacity: `${guests} Floating / ${Math.round(guests * 0.7)} Seated`,
      suggestedFeatures: ['Central Air Conditioning', 'Pillarless Main Stage Area', 'Dedicated Dining Hall', 'Valet Parking for 100+ vehicles', 'Generator Backup (125+ KVA)'],
      tips: [
        'Confirm generator diesel fuel policy with hall management.',
        'Reserve 2 AC rooms for immediate family dressing at least 4 hours before the event start.',
      ],
    },
    decoration: {
      stageDesign: `Opulent 32-foot stage featuring a ${theme} motif, carved pillars, cascading fresh flowers, and warm LED spot washes.`,
      entrance: 'Grand stepped entrance passage with brass urlis, marigold garlands, and a personalized welcome monogram mirror easel.',
      flowerDecoration: 'Blend of fresh Bangalore roses, Madurai jasmine, imported Dutch orchids, and tuberose strings.',
      lighting: 'Warm white (3000K) wash lights, 12 PAR LED color-fill cans, and crystal ceiling drop chandeliers.',
      tableDecoration: 'Silk runners with low-height brass diya centerpieces and fragrant rose petals.',
      mandapamDecoration: '4-pillar floral dome canopy adorned with hanging lotus buds and brass hanging lamps.',
      photoBooth: 'Interactive themed selfie booth featuring neon event slogan with floral foliage backdrop.',
      welcomeBoard: 'Custom acrylic gold-lettered welcome easel with fairy lights.',
      seatingDecoration: 'Gold Chiavari chairs with satin sashes and cushioned front VIP sofas.',
    },
    food: {
      welcomeDrinks: ['Tender Coconut Elaneer with Mint', 'Royal Rose Badam Milk', 'Fresh Passionfruit Spritzer'],
      starters: ['Paneer Malai Tikka', 'Baby Corn Pepper Crisp', foodPreference.includes('Non') ? 'Chettinad Chicken Roast' : 'Crispy Hara Bhara Kebab'],
      mainCourse: ['Paneer Butter Masala', 'Authentic Chettinad Kulambu', 'Dal Makhani Slow Simmered', foodPreference.includes('Non') ? 'Mutton Chukka' : 'Vegetable Kurma'],
      riceVarieties: ['Hyderabadi Dum Biryani with Mirchi Ka Salan', 'Bisibelebath with Appalam', 'Traditional Curd Rice with Pomegranate'],
      breads: ['Butter Naan', 'Rumali Roti', 'Tandoori Parotta'],
      dessertsAndIceCream: ['Warm Gajar Ka Halwa', 'Elaneer Payasam', 'Artisan Kulfi & Vanilla Ice Cream'],
      liveCounters: ['Live Podi & Ghee Dosa Counter', 'Delhi Chaat & Pani Puri Trolley', 'Kumbakonam Degree Filter Coffee Bar'],
      traditionalSpecial: 'Signature Kalyana Sakkarai Pongal & Crisp Medu Vadai',
      vegetarianOptions: ['Paneer Tikka', 'Mushroom Pepper Fry', 'Kashmiri Pulao'],
      nonVegetarianOptions: foodPreference.includes('Non') ? ['Chicken Dum Biryani', 'Mutton Sukka', 'Fish Amritsari'] : [],
      estimatedCostPerPerson: costPerPerson,
    },
    photography: {
      recommendations: ['Lead Candid Photographer', 'Traditional HD Video Crew', 'Licensed 4K Drone Aerial Pilot'],
      candidPhotography: 'Focus on spontaneous laughter, ritual emotions, family tears of joy, and couple candid moments.',
      droneCoverage: 'Sweeping aerial views of guest arrivals, grand entrance, and external lighting display.',
      preShootIdea: `Early morning sunrise aesthetic portrait shoot at prominent scenic garden or beachfront in ${location}.`,
      albumAndVideo: 'Handcrafted leather flush-mount album (40 sheets / 300 photos) + 3-minute 4K cinematic highlight teaser.',
    },
    makeup: {
      bridalMakeup: 'HD Airbrush finish for 14-hour humidity and tear resistance, matched with high-definition contouring.',
      groomStyling: 'Groom facial touch-up, beard shaping, and royal turban / angavastram placement.',
      hairAndDraping: 'Traditional floral poola jada or loose textured Hollywood waves with Kanchipuram saree pre-pleating.',
      mehendiConcept: 'Intricate Rajasthani / Arabic bridal mehendi up to elbows and calves.',
      familyPackages: 'Express party makeover package for mother and sister of the hosts.',
    },
    invitations: {
      themeConcept: `Bespoke elegance reflecting ${theme} with gold accents and bilingual typography.`,
      invitationIdeas: ['Digital 60-second 4K WhatsApp video invitation', 'Gold foil embossed textured hardcover wedding suite with wax seals'],
      layoutSuggestion: 'Fold-out passport or royal scroll format with Google Map venue QR code.',
      colorAccents: ['#C5A059', '#8B1E22', '#FDFBF7'],
    },
    entertainment: {
      djAndMusic: 'Live classical nadaswaram/shehnai for morning ceremony followed by high-energy DJ set for evening reception.',
      performances: 'Curated family dance performances and entry flashmob.',
      guestEngagement: 'Live caricature artist and interactive 360-degree video spinner booth.',
    },
    overlookedEssentials: [
      'Reserve 2 VIP parking spots and notify the security team before 7 AM.',
      'Prepare an emergency touchup kit (safety pins, fabric tape, pain relief, breath mints, extra bobby pins).',
      'Designate one trusted family member with an envelope of cash for on-the-spot tips to hall cleaning staff.',
      'Assign a shadow coordinator to carry the couple’s mobile phones and water bottles throughout the stage sessions.',
      'Have 3 extra dry battery backups and extension power cords near the live streaming / DJ console.',
    ],
  };
}

// ---------------------- AUTHENTICATION ROUTES ----------------------

interface AuthUserRecord extends User {
  passwordHash: string;
}

let authUsers: AuthUserRecord[] = [
  {
    id: 'cust-demo-1',
    name: 'Priya & Karthik',
    email: 'priya.karthik@gmail.com',
    passwordHash: 'password123',
    role: 'customer',
    phone: '+91 98400 11223',
    location: 'Chennai, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'dealer-demo-1',
    name: 'Venkatesh Ramanathan',
    email: 'manager@grandpalace.com',
    passwordHash: 'vendor123',
    role: 'dealer',
    phone: '+91 98401 22345',
    businessName: 'Sri Venkateswara Grand Palace & Convention',
    vendorId: 'ven-1',
    location: 'Anna Nagar, Chennai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'dealer-demo-2',
    name: 'Ananya Krishnan',
    email: 'lumiere@cinema.com',
    passwordHash: 'photo123',
    role: 'dealer',
    phone: '+91 98840 55667',
    businessName: 'Lumiere Stories Candid & Cinema',
    vendorId: 'ven-4',
    location: 'Besant Nagar, Chennai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
];

const otpStore: Record<string, { code: string; expiresAt: number }> = {};

// Demo accounts endpoint
app.get('/api/auth/demo-accounts', (req, res) => {
  res.json({
    success: true,
    accounts: [
      {
        role: 'customer',
        label: 'Priya & Karthik (Wedding Couple)',
        email: 'priya.karthik@gmail.com',
        password: 'password123',
        description: 'Customer planning grand 2-day wedding & reception',
      },
      {
        role: 'dealer',
        label: 'Sri Venkateswara Grand Palace',
        email: 'manager@grandpalace.com',
        password: 'vendor123',
        description: 'Function Hall & Convention Center Partner',
      },
      {
        role: 'dealer',
        label: 'Lumiere Stories Candid',
        email: 'lumiere@cinema.com',
        password: 'photo123',
        description: 'Professional Wedding Photography Partner',
      },
    ],
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const foundUser = authUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail && (!role || u.role === role)
  );

  if (!foundUser) {
    return res.status(401).json({
      success: false,
      message: `No ${role || ''} account found with email "${email}". Please check your email or create a new account.`,
    });
  }

  if (foundUser.passwordHash !== password) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Try using demo password (e.g. password123 or vendor123) or reset your password.',
    });
  }

  const { passwordHash, ...userProfile } = foundUser;
  const token = `ee_token_${Buffer.from(`${foundUser.id}:${Date.now()}`).toString('base64')}`;

  res.json({
    success: true,
    message: `Welcome back, ${foundUser.name}!`,
    user: userProfile,
    token,
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    role = 'customer',
    location = 'Chennai, Tamil Nadu',
    businessName,
    vendorCategory,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = authUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists. Please sign in instead.',
    });
  }

  const newId = role === 'dealer' ? `dealer-${Date.now()}` : `cust-${Date.now()}`;
  let vendorId: string | undefined = undefined;

  // If partner registered, also create an entry in the vendor marketplace
  if (role === 'dealer' && businessName) {
    vendorId = `ven-${Date.now()}`;
    const newVendor: Vendor = {
      id: vendorId,
      name: businessName,
      category: vendorCategory || 'Function Hall',
      rating: 5.0,
      reviewCount: 1,
      startingPrice: 25000,
      priceUnit: 'per event',
      location: location || 'Chennai, Tamil Nadu',
      city: (location || 'Chennai').split(',')[0].trim(),
      address: location || 'Chennai, Tamil Nadu',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      phone: phone || '+91 98400 00000',
      whatsapp: (phone || '+91 98400 00000').replace(/\D/g, ''),
      description: `${businessName} provides verified event services with transparent packages and dedicated support.`,
      serviceArea: 'Greater Chennai & Suburbs',
      workingHours: '9:00 AM - 9:00 PM',
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      ],
      packages: [
        {
          id: `pkg-${Date.now()}`,
          name: 'Standard Celebration Package',
          price: 45000,
          description: 'Essential professional package for grand celebrations.',
          inclusions: ['Full event setup', 'Coordination lead', 'On-site technical support'],
        },
      ],
      services: ['Event Consultation', 'On-site Coordination'],
      reviews: [],
      availableDates: [],
      unavailableDates: [],
    };
    vendors.unshift(newVendor);
  }

  const newUserRecord: AuthUserRecord = {
    id: newId,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    role,
    phone: phone || '+91 98400 00000',
    location: location || 'Chennai, Tamil Nadu',
    businessName: role === 'dealer' ? businessName : undefined,
    vendorId,
  };

  authUsers.unshift(newUserRecord);

  const userProfile: User = {
    id: newUserRecord.id,
    name: newUserRecord.name,
    email: newUserRecord.email,
    role: newUserRecord.role,
    phone: newUserRecord.phone,
    location: newUserRecord.location,
    businessName: newUserRecord.businessName,
    vendorId: newUserRecord.vendorId,
    avatar: newUserRecord.avatar,
  };
  const token = `ee_token_${Buffer.from(`${newUserRecord.id}:${Date.now()}`).toString('base64')}`;

  res.status(201).json({
    success: true,
    message: `Account created successfully! Welcome to EventEase, ${userProfile.name}.`,
    user: userProfile,
    token,
  });
});

// OTP Send
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || String(phone).replace(/\D/g, '').length < 10) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
  }

  const digits = String(phone).replace(/\D/g, '').slice(-10);
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[digits] = { code, expiresAt: Date.now() + 5 * 60 * 1000 };

  res.json({
    success: true,
    message: `Verification OTP sent to +91 ${digits}.`,
    devOtp: code,
  });
});

// OTP Verify
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp, role = 'customer' } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and 6-digit OTP are required.' });
  }

  const digits = String(phone).replace(/\D/g, '').slice(-10);
  const record = otpStore[digits];

  // Universal test OTP is 123456 or matching stored OTP
  const isValid = otp === '123456' || (record && record.code === otp && record.expiresAt > Date.now());

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP. You can also use universal test OTP: 123456.',
    });
  }

  // Clear OTP
  delete otpStore[digits];

  // Find user by phone, or create quick session user
  let existingUser = authUsers.find((u) => u.phone.includes(digits) && u.role === role);
  if (!existingUser) {
    const newId = role === 'dealer' ? `dealer-phone-${digits}` : `cust-phone-${digits}`;
    existingUser = {
      id: newId,
      name: role === 'dealer' ? 'Verified Event Partner' : 'Guest Member',
      email: `${digits}@mobile.eventease.in`,
      passwordHash: 'otp_login_verified',
      role,
      phone: `+91 ${digits}`,
      location: 'Chennai, Tamil Nadu',
      businessName: role === 'dealer' ? 'Partner Service Hub' : undefined,
    };
    authUsers.push(existingUser);
  }

  const { passwordHash: _, ...userProfile } = existingUser;
  const token = `ee_token_${Buffer.from(`${existingUser.id}:${Date.now()}`).toString('base64')}`;

  res.json({
    success: true,
    message: 'Mobile verification successful!',
    user: userProfile,
    token,
  });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please enter your registered email address.' });
  }

  res.json({
    success: true,
    message: `Password reset instructions have been dispatched to ${email}. Check your inbox or use demo login password.`,
  });
});

// ---------------------- FRONTEND / VITE MIDDLEWARE ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventEase server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
