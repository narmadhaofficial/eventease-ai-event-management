import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vendor, VendorCategory, VendorPackage } from '../types';
import { VendorDetailModal } from './VendorDetailModal';
import { BookingRequestModal } from './BookingRequestModal';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Phone,
  MessageCircle,
  Heart,
  Scale,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Map,
  Grid,
} from 'lucide-react';

export const VendorMarketplaceView: React.FC = () => {
  const {
    vendors,
    refreshVendors,
    selectedVendor,
    setSelectedVendor,
    favorites,
    toggleFavorite,
    addToCompare,
    compareVendors,
    setActiveTab,
    userLocation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('best_match');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filterDate, setFilterDate] = useState('');

  // Booking modal state
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<VendorPackage | null>(null);

  const categories: string[] = [
    'All',
    'Function Hall',
    'Decorator',
    'Caterer',
    'Photographer',
    'Makeup Artist',
    'Invitation Designer',
    'DJ / Music',
    'Florist',
    'Wedding Planner',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refreshVendors({
      search: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : '',
      sort: sortBy,
      date: filterDate,
    });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    refreshVendors({
      search: searchQuery,
      category: cat !== 'All' ? cat : '',
      sort: sortBy,
      date: filterDate,
    });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    refreshVendors({
      search: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : '',
      sort,
      date: filterDate,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Event Service Marketplace</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Discover verified vendors near <span className="font-semibold text-stone-900">{userLocation}</span> with transparent pricing & real travel time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map Explorer</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-xs font-semibold border border-stone-200 rounded-xl px-3 py-2 bg-white text-stone-800 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
            >
              <option value="best_match">Sort: Best Match</option>
              <option value="nearest">Sort: Nearest Distance (km)</option>
              <option value="lowest_price">Sort: Lowest Price</option>
              <option value="highest_rated">Sort: Highest Rated</option>
              <option value="best_value">Sort: Best Value Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vendor name, dish, hall, or photography style..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  refreshVendors({
                    search: searchQuery,
                    category: selectedCategory !== 'All' ? selectedCategory : '',
                    sort: sortBy,
                    date: e.target.value,
                  });
                }}
                className="text-xs pl-8 pr-2 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500"
                title="Filter by available date"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Map Explorer Simulation View */}
      {viewMode === 'map' && (
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-400">Interactive Location Radar</h3>
              <p className="text-xs text-stone-400">
                Visualizing vendors within driving distance of {userLocation}
              </p>
            </div>
            <span className="text-xs bg-stone-800 px-3 py-1 rounded-full text-stone-300 font-mono">
              Center: 13.0827° N, 80.2707° E
            </span>
          </div>

          <div className="h-72 sm:h-96 w-full rounded-2xl bg-stone-950 border border-stone-800 relative p-4 flex flex-col justify-between overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

            {/* Radar Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center animate-ping" />
              <div className="w-4 h-4 rounded-full bg-amber-400 shadow-lg -mt-6" />
              <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-md mt-1 shadow-md">
                Your Event Location
              </span>
            </div>

            {/* Interactive Pins on Map */}
            <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {vendors.slice(0, 6).map((v, i) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVendor(v)}
                  className="bg-stone-900/90 backdrop-blur-xs border border-stone-700 hover:border-amber-400 p-3 rounded-xl cursor-pointer transition-all hover:scale-102 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{v.name}</div>
                    <div className="text-[11px] text-amber-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{v.distanceKm} km away • {v.travelTimeMins} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-20 text-[11px] text-stone-400 flex items-center justify-between pt-4">
              <span>Showing nearest top vendors sorted by road travel time</span>
              <button
                onClick={() => setViewMode('grid')}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Switch back to Grid View →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Vendor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => {
          const isFav = favorites.includes(vendor.id);
          const isComparing = compareVendors.some((cv) => cv.id === vendor.id);

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image & Quick Badges */}
                <div className="h-48 relative overflow-hidden bg-stone-100">
                  <img
                    src={vendor.images[0]}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top floating pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-stone-900 shadow-xs backdrop-blur-xs">
                      {vendor.category}
                    </span>
                    {vendor.verified && (
                      <span className="p-1 rounded-full bg-emerald-500 text-white shadow-xs" title="Verified Vendor">
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Top Right Action Icons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCompare(vendor);
                      }}
                      className={`p-2 rounded-xl backdrop-blur-md cursor-pointer transition-all ${
                        isComparing ? 'bg-indigo-600 text-white' : 'bg-white/90 text-stone-700 hover:text-indigo-600'
                      }`}
                      title={isComparing ? 'Added to compare' : 'Add to compare'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(vendor.id);
                      }}
                      className="p-2 rounded-xl bg-white/90 text-stone-700 hover:text-rose-600 backdrop-blur-md cursor-pointer transition-all"
                      title="Favorite"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Overlay: Distance & Rating */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{vendor.rating.toFixed(1)}</span>
                      <span className="text-stone-300 text-[10px]">({vendor.reviewCount})</span>
                    </div>

                    {vendor.distanceKm !== undefined && (
                      <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-md font-medium text-[11px] text-amber-200">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{vendor.distanceKm} km • {vendor.travelTimeMins} min</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3
                      onClick={() => setSelectedVendor(vendor)}
                      className="font-serif font-bold text-lg text-stone-900 hover:text-amber-700 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span className="truncate">{vendor.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{vendor.description}</p>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {vendor.services.slice(0, 3).map((svc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[10px] font-medium"
                      >
                        {svc}
                      </span>
                    ))}
                    {vendor.services.length > 3 && (
                      <span className="px-1.5 py-0.5 text-stone-400 text-[10px]">
                        +{vendor.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action footer */}
              <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Starting Rate</span>
                    <div className="text-lg font-bold text-stone-900">
                      ₹{vendor.startingPrice.toLocaleString('en-IN')}
                      <span className="text-xs text-stone-500 font-normal"> / {vendor.priceUnit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${vendor.name}, I found you on EventEase and would like to enquire about availability and rates.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setBookingVendor(vendor);
                      setSelectedPackageForBooking(vendor.packages[0] || null);
                    }}
                    className="py-2 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Book / Quote</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Compare Floating Tray */}
      {compareVendors.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-4 max-w-xl w-[90%] sm:w-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold">{compareVendors.length} / 3 Vendors Selected</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            {compareVendors.map((cv) => (
              <span key={cv.id} className="text-[11px] bg-stone-800 px-2 py-0.5 rounded-md text-stone-300 truncate max-w-[120px]">
                {cv.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setActiveTab('compare')}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onBook={(v, pkg) => {
            setSelectedVendor(null);
            setBookingVendor(v);
            setSelectedPackageForBooking(pkg || null);
          }}
        />
      )}

      {/* Booking Enquiry Modal */}
      {bookingVendor && (
        <BookingRequestModal
          vendor={bookingVendor}
          selectedPackage={selectedPackageForBooking}
          onClose={() => setBookingVendor(null)}
        />
      )}
    </div>
  );
};
