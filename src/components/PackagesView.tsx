import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Building2,
  Flower2,
  Utensils,
  Camera,
  Heart,
  Music,
  Mail,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PackagesView: React.FC = () => {
  const { activeEvent, createBooking, vendors, setActiveTab } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'build' | 'premade'>('build');

  // Custom Bundle Selections
  const halls = vendors.filter((v) => v.category === 'Function Hall');
  const decorators = vendors.filter((v) => v.category === 'Decorator');
  const caterers = vendors.filter((v) => v.category === 'Caterer');
  const photographers = vendors.filter((v) => v.category === 'Photographer');
  const makeupArtists = vendors.filter((v) => v.category === 'Makeup Artist');

  const [selectedHallId, setSelectedHallId] = useState(halls[0]?.id || '');
  const [selectedDecoratorId, setSelectedDecoratorId] = useState(decorators[0]?.id || '');
  const [selectedCatererId, setSelectedCatererId] = useState(caterers[0]?.id || '');
  const [selectedPhotoId, setSelectedPhotoId] = useState(photographers[0]?.id || '');
  const [selectedMakeupId, setSelectedMakeupId] = useState(makeupArtists[0]?.id || '');
  const [includeDJ, setIncludeDJ] = useState(true);
  const [includeInvites, setIncludeInvites] = useState(true);

  // Prices
  const hall = vendors.find((v) => v.id === selectedHallId);
  const decorator = vendors.find((v) => v.id === selectedDecoratorId);
  const caterer = vendors.find((v) => v.id === selectedCatererId);
  const photo = vendors.find((v) => v.id === selectedPhotoId);
  const makeup = vendors.find((v) => v.id === selectedMakeupId);

  const hallPrice = hall ? hall.startingPrice : 150000;
  const decorPrice = decorator ? decorator.startingPrice : 45000;
  const foodPrice = caterer ? caterer.startingPrice * activeEvent.guests : 550 * activeEvent.guests;
  const photoPrice = photo ? photo.startingPrice : 45000;
  const makeupPrice = makeup ? makeup.startingPrice : 18000;
  const djPrice = includeDJ ? 25000 : 0;
  const invitesPrice = includeInvites ? 15000 : 0;

  const rawTotal = hallPrice + decorPrice + foodPrice + photoPrice + makeupPrice + djPrice + invitesPrice;
  const bundleDiscount = Math.round(rawTotal * 0.08); // 8% Multi-Service Bundle Savings
  const finalTotal = rawTotal - bundleDiscount;
  const advanceRequired = Math.round(finalTotal * 0.25);

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderedSuccess, setOrderedSuccess] = useState(false);

  const handleOrderBundle = async () => {
    setIsOrdering(true);
    // Create multiple booking requests for the chosen vendors
    const vendorSelections = [
      { v: hall, price: hallPrice, service: 'Hall Booking' },
      { v: decorator, price: decorPrice, service: 'Stage & Venue Decor' },
      { v: caterer, price: foodPrice, service: `Catering for ${activeEvent.guests} Guests` },
      { v: photo, price: photoPrice, service: 'Photography & Cinema' },
      { v: makeup, price: makeupPrice, service: 'Bridal & Styling' },
    ];

    for (const item of vendorSelections) {
      if (item.v) {
        await createBooking({
          vendorId: item.v.id,
          vendorName: item.v.name,
          vendorCategory: item.v.category,
          date: activeEvent.date,
          quoteAmount: item.price,
          packageName: `Custom Bundle: ${item.service}`,
          notes: `Part of EventEase Custom Multi-Service Bundle for ${activeEvent.title}. Total bundle discount applied: 8%.`,
        });
      }
    }

    setIsOrdering(false);
    setOrderedSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const premadePackages = [
    {
      id: 'pkg-silver',
      name: 'Silver Classic Celebration',
      tag: 'Ideal for 150–250 Guests',
      price: 349000,
      originalPrice: 399000,
      features: [
        'Central AC Hall for 1 Day',
        'Traditional Floral Stage Backdrop (20ft)',
        'Buffet Catering (2 Drinks, 3 Starters, 4 Mains, 2 Sweets)',
        'Traditional & Candid Photography (1 Lead, 1 Video)',
        'Bridal Hair Styling & Express Makeover',
        'Standard Sound System & Music Setup',
        'Digital WhatsApp Invitation Video',
      ],
      recommendedFor: 'Anniversaries, Engagements, Naming Ceremonies & Intimate Weddings',
    },
    {
      id: 'pkg-gold',
      name: 'Gold Grand Celebration',
      tag: 'Most Popular • 300–600 Guests',
      popular: true,
      price: 699000,
      originalPrice: 799000,
      features: [
        'Premium Centralized AC Convention Hall (2 Days)',
        'Grand 32ft Floral Stage, Entrance Arch & Mandapam Dome',
        'Deluxe Banquet Feast (Live Dosa & Chaat Counters included)',
        'Lead Candid Photographer + Traditional 4K Video + Drone Aerials',
        'HD Airbrush Bridal Makeup + Saree Draping + Groom Styling',
        'DJ with Professional Sound & Lighting Wash',
        '300 Gold Foil Hardcover Invitation Cards + Video Invite',
        'Dedicated Day-of-Event Coordinator Shadow',
      ],
      recommendedFor: 'Grand Weddings & High-Profile Receptions',
    },
    {
      id: 'pkg-platinum',
      name: 'Platinum Royal Imperial',
      tag: 'Ultra Luxury • 600–1200 Guests',
      price: 1399000,
      originalPrice: 1599000,
      features: [
        '5-Star Luxury Banquet / Palace Resort (3 Days)',
        'Couture Themed Scenography & Hanging Floral Chandeliers',
        'Gourmet Multi-Cuisine Feast with 6 Live Stations & Paan Bar',
        'Celebrity Candid Team (2 Leads, 2 Cinematographers, Drone, Teaser)',
        'International Luxury Bridal Makeup by Celebrity Stylist',
        'High-Energy DJ Concert Rig + LED Wall & SFX Cold Pyros',
        'Handcrafted Suede Box Invitations with Gold Monogram',
        'Full 4-Person EventEase Concierge Team & Valet Management',
      ],
      recommendedFor: 'Destination Weddings & High-Profile Celebrations',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase mb-3">
          <Layers className="w-3.5 h-3.5" />
          Event Bundles & Custom Builder
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Curated Packages & Custom Builder</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Save up to 10% by bundling hall, decor, catering, and photography together under one seamless coordination plan.
        </p>

        {/* Switcher */}
        <div className="mt-6 inline-flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveTabMode('build')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabMode === 'build' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            🛠️ Build My Own Package (Interactive)
          </button>
          <button
            onClick={() => setActiveTabMode('premade')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabMode === 'premade' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            ✨ Pre-Designed All-in-One Packages
          </button>
        </div>
      </div>

      {/* MODE 1: Build My Own Package */}
      {activeTabMode === 'build' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Selection Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Hall */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">1. Select Function Hall</h3>
                    <p className="text-xs text-stone-500">Includes centralized AC & guest rooms</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900">₹{hallPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {halls.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHallId(h.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedHallId === h.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">{h.name}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{h.location}</div>
                    <div className="text-xs font-bold text-amber-700 mt-2">
                      ₹{h.startingPrice.toLocaleString('en-IN')} / {h.priceUnit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Decorator */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
                    <Flower2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">2. Select Stage & Floral Decorator</h3>
                    <p className="text-xs text-stone-500">Stage, entrance arch, mandapam & LED wash lights</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900">₹{decorPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {decorators.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDecoratorId(d.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedDecoratorId === d.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">{d.name}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{d.location}</div>
                    <div className="text-xs font-bold text-amber-700 mt-2">
                      ₹{d.startingPrice.toLocaleString('en-IN')} starting
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Caterer */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">3. Select Catering & Feast</h3>
                    <p className="text-xs text-stone-500">Calculated for {activeEvent.guests} guests</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900">₹{foodPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {caterers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCatererId(c.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedCatererId === c.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">{c.name}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{c.location}</div>
                    <div className="text-xs font-bold text-amber-700 mt-2">
                      ₹{c.startingPrice} / plate • (₹{(c.startingPrice * activeEvent.guests).toLocaleString('en-IN')})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Photographer */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">4. Select Photographer & Cinema</h3>
                    <p className="text-xs text-stone-500">Candid, traditional video & album</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900">₹{photoPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {photographers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPhotoId(p.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedPhotoId === p.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">{p.name}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{p.location}</div>
                    <div className="text-xs font-bold text-amber-700 mt-2">
                      ₹{p.startingPrice.toLocaleString('en-IN')} / {p.priceUnit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addon Toggles */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-wrap gap-4 items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDJ}
                  onChange={(e) => setIncludeDJ(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Include DJ & High-Power Sound Rig (+₹25,000)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInvites}
                  onChange={(e) => setIncludeInvites(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Include Foil Invitations & Digital WhatsApp Video (+₹15,000)</span>
              </label>
            </div>
          </div>

          {/* Right Live Estimator Card */}
          <div className="lg:col-span-4 sticky top-24 bg-white rounded-3xl p-6 border border-stone-200 shadow-lg space-y-6">
            <div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Live Bundle Estimator
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mt-2">{activeEvent.title}</h3>
              <p className="text-xs text-stone-500">
                {activeEvent.date} • {activeEvent.guests} Guests
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs text-stone-600 border-t border-b border-stone-100 py-4">
              <div className="flex justify-between">
                <span>Function Hall</span>
                <span className="font-semibold text-stone-900">₹{hallPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Stage & Floral Decor</span>
                <span className="font-semibold text-stone-900">₹{decorPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Catering ({activeEvent.guests} guests)</span>
                <span className="font-semibold text-stone-900">₹{foodPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Photography & Film</span>
                <span className="font-semibold text-stone-900">₹{photoPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Bridal Styling</span>
                <span className="font-semibold text-stone-900">₹{makeupPrice.toLocaleString('en-IN')}</span>
              </div>
              {includeDJ && (
                <div className="flex justify-between">
                  <span>DJ & Sound</span>
                  <span className="font-semibold text-stone-900">₹25,000</span>
                </div>
              )}
              {includeInvites && (
                <div className="flex justify-between">
                  <span>Stationery & Video</span>
                  <span className="font-semibold text-stone-900">₹15,000</span>
                </div>
              )}

              <div className="pt-2 flex justify-between text-stone-400">
                <span>Gross Total</span>
                <span>₹{rawTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Multi-service bundle discount */}
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Bundle Savings (8%)
                </span>
                <span>- ₹{bundleDiscount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Net Total */}
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-stone-700">Net Estimated Total</span>
                <div className="text-2xl font-bold text-stone-900">₹{finalTotal.toLocaleString('en-IN')}</div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                <span>Advance Required (25%)</span>
                <span className="font-medium text-stone-700">₹{advanceRequired.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action */}
            {!orderedSuccess ? (
              <button
                onClick={handleOrderBundle}
                disabled={isOrdering}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>{isOrdering ? 'Dispatching Enquiries...' : 'Confirm Bundle & Request Quotes'}</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <div className="text-xs font-bold text-emerald-800">🎉 Bundle Requests Dispatched!</div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  Enquiries have been sent to all chosen vendors with your 8% bundled rate applied. Check My Bookings!
                </p>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="mt-1 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  View Bookings Tracker
                </button>
              </div>
            )}

            <div className="text-[11px] text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free quote lock for 7 days. You pay only upon vendor confirmation.</span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Pre-Made Packages */}
      {activeTabMode === 'premade' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {premadePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                  : 'border-stone-200 hover:border-stone-300 shadow-xs'
              }`}
            >
              <div>
                {pkg.popular && (
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-stone-950 mb-3 shadow-2xs">
                    EventEase Choice • Most Popular
                  </span>
                )}
                <h3 className="font-serif text-2xl font-bold text-stone-900">{pkg.name}</h3>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">{pkg.tag}</p>

                <div className="mt-5 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-stone-900">₹{pkg.price.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-stone-400 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">All-Inclusive Vendor Package</span>
                </div>

                <div className="space-y-2.5 border-t border-stone-100 pt-5">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                    What's Included:
                  </span>
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-100">
                <button
                  onClick={() => {
                    createBooking({
                      vendorId: 'ven-bundle',
                      vendorName: `EventEase Curated: ${pkg.name}`,
                      vendorCategory: 'Wedding Planner',
                      date: activeEvent.date,
                      quoteAmount: pkg.price,
                      packageName: pkg.name,
                      notes: `Selected pre-made ${pkg.name} package for ${activeEvent.title}.`,
                    });
                    setActiveTab('bookings');
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    pkg.popular
                      ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-sm'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <span>Select & Book Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
