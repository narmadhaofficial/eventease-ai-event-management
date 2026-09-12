import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  Sparkles,
  X,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

export const VendorCompareView: React.FC = () => {
  const { compareVendors, removeFromCompare, clearCompare, setActiveTab, setSelectedVendor } = useApp();

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const fetchAIAnalysis = async () => {
    if (compareVendors.length < 2) return;
    setIsLoadingAnalysis(true);
    try {
      const res = await fetch('/api/ai/compare-vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorIds: compareVendors.map((v) => v.id) }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.comparison);
      }
    } catch (err) {
      console.error('Failed to get comparison analysis', err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    if (compareVendors.length >= 2) {
      fetchAIAnalysis();
    } else {
      setAiAnalysis(null);
    }
  }, [compareVendors]);

  if (compareVendors.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Scale className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">No Vendors in Comparison Tray</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6">
          Add up to 3 vendors from the marketplace to compare pricing, distance, services, and receive an instant AI recommendation.
        </p>
        <button
          onClick={() => setActiveTab('vendors')}
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold uppercase mb-2">
            <Scale className="w-3.5 h-3.5" />
            Comparative Matrix & AI Recommendation
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Side-by-Side Vendor Comparison</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Evaluating {compareVendors.length} service partner{compareVendors.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            + Add Another Vendor
          </button>
        </div>
      </div>

      {/* AI Comparative Evaluation Banner */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Gemini AI Comparative Verdict
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-sans whitespace-pre-line">
            {aiAnalysis}
          </p>
        </div>
      )}

      {/* Comparison Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {compareVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between relative"
          >
            <button
              onClick={() => removeFromCompare(vendor.id)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full cursor-pointer"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="h-40 rounded-2xl overflow-hidden mb-4 bg-stone-100">
                <img
                  src={vendor.images[0]}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                {vendor.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{vendor.name}</h3>

              {/* Price & Rating */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 mb-4 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Starting Rate</span>
                <div className="text-xl font-bold text-stone-900">
                  ₹{vendor.startingPrice.toLocaleString('en-IN')}
                  <span className="text-xs text-stone-500 font-normal"> / {vendor.priceUnit}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-600 pt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-bold">{vendor.rating}</span>
                  <span className="text-stone-400">({vendor.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2.5 text-xs text-stone-700 border-t border-b border-stone-100 py-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-stone-500">Distance:</span>
                  <span className="font-semibold text-amber-800">{vendor.distanceKm} km ({vendor.travelTimeMins} mins)</span>
                </div>
                {vendor.capacity && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Capacity:</span>
                    <span className="font-semibold">{vendor.capacity} Guests</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-semibold truncate max-w-[150px]">{vendor.location}</span>
                </div>
              </div>

              {/* Services List */}
              <div className="space-y-1.5 mb-6">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                  Top Services:
                </span>
                {vendor.services.slice(0, 4).map((svc, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-stone-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedVendor(vendor)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                View Full Profile & Packages
              </button>
              <a
                href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${vendor.name}, I am comparing vendors on EventEase and would like to request your availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
