import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIEventPlan, CustomerEvent } from '../types';
import {
  Sparkles,
  Building2,
  Flower2,
  Utensils,
  Camera,
  Heart,
  Mail,
  Music,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Printer,
  Calendar,
  Users,
  MapPin,
  IndianRupee,
  RefreshCw,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIPlannerViewProps {
  initialPlan?: AIEventPlan | null;
  onBrowseVendors?: () => void;
}

export const AIPlannerView: React.FC<AIPlannerViewProps> = ({ onBrowseVendors }) => {
  const { activeEvent, updateEvent, activeAIPlan, setActiveAIPlan, setActiveTab } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'venue' | 'decoration' | 'food' | 'photography' | 'makeup' | 'invitations' | 'entertainment' | 'essentials'>('overview');

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/plan-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: activeEvent.eventType,
          location: activeEvent.location,
          date: activeEvent.date,
          days: activeEvent.days,
          guests: activeEvent.guests,
          budget: activeEvent.budget,
          theme: activeEvent.theme,
          foodPreference: activeEvent.foodPreference,
          otherRequirements: activeEvent.otherRequirements,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setActiveAIPlan(data.plan);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Failed to generate AI plan', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If no active AI plan exists yet, trigger one or show prompt
  React.useEffect(() => {
    if (!activeAIPlan && !isLoading) {
      generatePlan();
    }
  }, [activeEvent.id]);

  const plan = activeAIPlan;

  const planSections = [
    { id: 'overview', label: 'Master Overview', icon: Sparkles },
    { id: 'venue', label: 'Venue & Hall', icon: Building2 },
    { id: 'decoration', label: 'Decoration & Stage', icon: Flower2 },
    { id: 'food', label: 'Food & Catering', icon: Utensils },
    { id: 'photography', label: 'Photography & Cinema', icon: Camera },
    { id: 'makeup', label: 'Bridal & Styling', icon: Heart },
    { id: 'invitations', label: 'Invitations', icon: Mail },
    { id: 'entertainment', label: 'DJ & Music', icon: Music },
    { id: 'essentials', label: 'Overlooked Essentials', icon: AlertTriangle, badge: 'Crucial' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Event Summary & Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                AI Master Strategy
              </span>
              <span className="text-xs text-stone-500 font-medium">Updated for {activeEvent.eventType}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">{activeEvent.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {activeEvent.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {activeEvent.date} ({activeEvent.days} Day{activeEvent.days > 1 ? 's' : ''})
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                {activeEvent.guests} Guests
              </span>
              <span className="flex items-center gap-1 font-semibold text-stone-900">
                <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                ₹{activeEvent.budget.toLocaleString('en-IN')} Budget
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="ai-plan-regenerate-btn"
              onClick={generatePlan}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Architecting Plan...' : 'Regenerate Plan'}</span>
            </button>
            <button
              id="ai-plan-print-btn"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              id="ai-plan-book-vendors-btn"
              onClick={() => {
                if (onBrowseVendors) onBrowseVendors();
                else setActiveTab('vendors');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
            >
              <span>Match & Book Vendors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-12 text-center my-8">
          <Sparkles className="w-10 h-10 text-amber-600 animate-spin mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Analyzing Requirements & Local Vendors...</h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Gemini is tailoring stage dimensions, catering plates for {activeEvent.guests} guests, candid photo packages, and identifying overlooked logistics.
          </p>
        </div>
      )}

      {!isLoading && plan && (
        <div className="space-y-8">
          {/* Sub-navigation tabs for detailed categories */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-stone-200/80">
            {planSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSubTab === sec.id;
              return (
                <button
                  key={sec.id}
                  id={`ai-subtab-${sec.id}`}
                  onClick={() => setActiveSubTab(sec.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span>{sec.label}</span>
                  {sec.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Master Overview */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold mb-4 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Executive Event Summary
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">{plan.summary}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs text-amber-200/80">Estimated Master Budget</div>
                    <div className="text-2xl font-bold text-white">₹{plan.totalEstimatedCost.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-amber-200/80">Estimated Catering / Plate</div>
                    <div className="text-2xl font-bold text-white">₹{plan.food.estimatedCostPerPerson}</div>
                  </div>
                  <div>
                    <div className="text-xs text-amber-200/80">Core Theme Focus</div>
                    <div className="text-2xl font-bold text-white truncate">{activeEvent.theme}</div>
                  </div>
                </div>
              </div>

              {/* 3 Grid pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Venue Recommendation</h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">{plan.venue.recommendation}</p>
                  <div className="text-xs font-semibold text-amber-800 bg-amber-50 p-2 rounded-lg">
                    Capacity: {plan.venue.idealCapacity}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800 mb-4">
                    <Flower2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Stage & Mandapam</h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">{plan.decoration.stageDesign}</p>
                  <div className="text-xs font-semibold text-rose-800 bg-rose-50 p-2 rounded-lg">
                    Florals: {plan.decoration.flowerDecoration}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">Signature Feast</h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">{plan.food.traditionalSpecial}</p>
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                    Live: {plan.food.liveCounters.join(', ')}
                  </div>
                </div>
              </div>

              {/* Overlooked Essentials Alert Banner */}
              <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span className="font-bold text-sm text-stone-900">
                    Crucial Requirements You Might Have Overlooked:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  {plan.overlookedEssentials.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Venue */}
          {activeSubTab === 'venue' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Venue & Function Hall Blueprint</h3>
                  <p className="text-xs text-stone-500">Hall specifications suited for {activeEvent.guests} guests in {activeEvent.location}</p>
                </div>
              </div>

              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Ideal Facility Setup</h4>
                <p className="text-sm text-stone-800 leading-relaxed font-medium">{plan.venue.recommendation}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-stone-200 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">Required Hall Features</h4>
                  <ul className="space-y-2">
                    {plan.venue.suggestedFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-stone-200 rounded-2xl p-5 bg-amber-50/40">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3">Venue Coordinator Tips</h4>
                  <ul className="space-y-2">
                    {plan.venue.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (onBrowseVendors) onBrowseVendors();
                    else setActiveTab('vendors');
                  }}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Function Halls in {activeEvent.location}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Decoration */}
          {activeSubTab === 'decoration' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
                  <Flower2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Decoration, Stage & Lighting Design</h3>
                  <p className="text-xs text-stone-500">Theme: {activeEvent.theme}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Main Stage Design</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.stageDesign}</p>
                </div>
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Entrance Gateway Arch</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.entrance}</p>
                </div>
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Flower & Floral Selection</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.flowerDecoration}</p>
                </div>
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Lighting & PAR Wash Rig</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.lighting}</p>
                </div>
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Mandapam / Focal Canopy</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.mandapamDecoration}</p>
                </div>
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Selfie Photo Booth with Props</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.photoBooth}</p>
                </div>
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Welcome Monogram Easel</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.welcomeBoard}</p>
                </div>
                <div className="p-4 border border-stone-200 rounded-2xl">
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Seating & VIP Sofa Layout</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.decoration.seatingDecoration}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Food */}
          {activeSubTab === 'food' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">Custom Culinary Banquet Menu</h3>
                    <p className="text-xs text-stone-500">{activeEvent.foodPreference} • {activeEvent.guests} Expected Guests</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500">Estimated Cost</span>
                  <div className="text-lg font-bold text-emerald-800">₹{plan.food.estimatedCostPerPerson} / plate</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Welcome Drinks</span>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {plan.food.welcomeDrinks.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Starters</span>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {plan.food.starters.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Live Counters</span>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {plan.food.liveCounters.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Main Course & Gravies</span>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {plan.food.mainCourse.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Rice & Breads</span>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {plan.food.riceVarieties.concat(plan.food.breads).map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Desserts & Sweets</span>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    {plan.food.dessertsAndIceCream.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                <div className="text-xs text-emerald-950 font-medium">
                  Want to customize individual dishes or calculate live plate costs?
                </div>
                <button
                  onClick={() => setActiveTab('food-planner')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Open Interactive Food Planner
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Photography */}
          {activeSubTab === 'photography' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Photography, Drone & Cinema Plan</h3>
                  <p className="text-xs text-stone-500">Visual storytelling specs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Candid Photography Vision</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.photography.candidPhotography}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">4K Drone Aerial Coverage</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.photography.droneCoverage}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Pre-Event Shoot Concept</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.photography.preShootIdea}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Cinematic Teaser & Album Delivery</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.photography.albumAndVideo}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Makeup & Styling */}
          {activeSubTab === 'makeup' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Bridal, Groom & Family Styling</h3>
                  <p className="text-xs text-stone-500">High definition beauty & draping roadmap</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Bride / Host Makeover</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.makeup.bridalMakeup}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Groom Styling & Beard Grooming</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.makeup.groomStyling}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Hair Styling & Saree Draping</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.makeup.hairAndDraping}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Family Touch-up Packages</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.makeup.familyPackages}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Invitations */}
          {activeSubTab === 'invitations' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">Invitation Concept & Layout</h3>
                    <p className="text-xs text-stone-500">Design style: {plan.invitations.themeConcept}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('invitations')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Generate Invitation Card
                </button>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Layout & Format Strategy</div>
                <p className="text-sm text-stone-800 leading-relaxed">{plan.invitations.layoutSuggestion}</p>
              </div>

              <div className="border border-stone-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">Suggested Ideas & Digital Invites</div>
                <ul className="space-y-2">
                  {plan.invitations.invitationIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 8: Entertainment */}
          {activeSubTab === 'entertainment' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-800">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Music, DJ & Entertainment Protocol</h3>
                  <p className="text-xs text-stone-500">Keeping guests energized throughout the celebration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">DJ & Sound System</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.entertainment.djAndMusic}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Performances & Entries</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.entertainment.performances}</p>
                </div>
                <div className="p-5 border border-stone-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Guest Engagement & Games</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{plan.entertainment.guestEngagement}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Overlooked Essentials */}
          {activeSubTab === 'essentials' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">Overlooked Essentials Radar</h3>
                  <p className="text-xs text-stone-500">
                    The AI automatically identified critical elements often forgotten by event organizers.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {plan.overlookedEssentials.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-stone-800 leading-relaxed font-medium mt-0.5">{item}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-stone-500">These items have also been synchronized to your Event Checklist.</span>
                <button
                  onClick={() => setActiveTab('checklist')}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  View Event Checklist
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
