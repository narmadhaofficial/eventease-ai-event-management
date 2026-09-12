import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventType } from '../types';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Utensils,
  Palette,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onStartPlanning?: (formDetails: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlanning }) => {
  const { userLocation, setActiveTab, activeEvent, updateEvent, setActiveAIPlan } = useApp();

  const [eventType, setEventType] = useState<EventType>('Marriage / Wedding');
  const [customEventName, setCustomEventName] = useState('');
  const [location, setLocation] = useState(userLocation);
  const [eventDate, setEventDate] = useState('2026-12-20');
  const [days, setDays] = useState(2);
  const [guests, setGuests] = useState(500);
  const [budget, setBudget] = useState(800000);
  const [theme, setTheme] = useState('Traditional Royal Temple');
  const [foodPreference, setFoodPreference] = useState<'Pure Vegetarian' | 'Non-Vegetarian' | 'Both Veg & Non-Veg' | 'Jain Food Available'>('Both Veg & Non-Veg');
  const [otherReqs, setOtherReqs] = useState('Need 4K drone videography, live nadaswaram, and live chaat counter for evening.');

  const eventTypes: EventType[] = [
    'Marriage / Wedding',
    'Reception',
    'Engagement',
    'Birthday',
    'Baby Shower',
    'Naming Ceremony',
    'Anniversary',
    'Puberty / Age Attending',
    'Housewarming',
    'Corporate Event',
    'College Event',
    'Party',
    'Religious / Cultural',
    'Farewell',
    'Custom Event',
  ];

  const themes = [
    'Traditional Royal Temple',
    'Pastel Garden Dream',
    'Luxury Midnight & Gold',
    'Bohemian Sunset Bloom',
    'Minimalist Modern Chic',
    'Bollywood Sangeet Glitz',
    'Vibrant Marigold Heritage',
    'Custom AI Concept',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = eventType === 'Custom Event' && customEventName.trim() ? customEventName : eventType;
    const planDetails = {
      eventType: finalType,
      location,
      date: eventDate,
      days: Number(days),
      guests: Number(guests),
      budget: Number(budget),
      theme,
      foodPreference,
      otherRequirements: otherReqs,
    };

    if (typeof onStartPlanning === 'function') {
      onStartPlanning(planDetails);
    } else {
      updateEvent({
        ...activeEvent,
        ...planDetails,
      });
      setActiveAIPlan(null);
      setActiveTab('ai-planner');
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-amber-50/40 via-stone-50 to-[#faf9f6]">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-amber-200/30 via-orange-100/20 to-rose-100/20 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-bold tracking-wide uppercase mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            AI-Powered Event Planning & Vendor Ecosystem
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Your Event. Your Vision. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600">
              Everything in One Place.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            Discover verified nearby function halls, royal decorators, master caterers, cinematic photographers, and bridal artists. Enter your event details below to let our AI assemble your complete master plan.
          </p>
        </div>

        {/* The "Plan Your Event" Wizard Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200/90 p-6 sm:p-8 relative">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Plan Your Event</h2>
              <p className="text-xs text-stone-500">Provide 8 key details to receive an instant, itemized AI execution plan.</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Free Master Quotation
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. What is your event? */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  1. What is your event?
                </label>
                <select
                  id="hero-event-type-select"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full text-sm font-medium border border-stone-300 rounded-xl px-3.5 py-2.5 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                >
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                {eventType === 'Custom Event' && (
                  <input
                    type="text"
                    id="hero-custom-event-input"
                    value={customEventName}
                    onChange={(e) => setCustomEventName(e.target.value)}
                    placeholder="Describe your custom event (e.g. Silver Jubilee, Alumni Reunion)"
                    className="mt-2 w-full text-sm border border-amber-300 rounded-xl px-3 py-2 bg-amber-50/30 focus:outline-none focus:border-amber-500"
                    required
                  />
                )}
              </div>

              {/* 2. Where is your event? */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  2. Where is your event?
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    id="hero-location-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or Area (e.g. Anna Nagar, Chennai)"
                    className="w-full text-sm pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* 3. What date? */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  3. What date?
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="date"
                    id="hero-date-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* 4. How many days? */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  4. How many days?
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="number"
                    id="hero-days-input"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full text-sm pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* 5. Number of guests? */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  5. Number of guests?
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="number"
                    id="hero-guests-input"
                    step="50"
                    min="10"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* 6. Budget? */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  6. Approx Budget (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="number"
                    id="hero-budget-input"
                    step="25000"
                    min="50000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-sm pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 7. Preferred theme? */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  7. Preferred theme?
                </label>
                <select
                  id="hero-theme-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full text-sm border border-stone-300 rounded-xl px-3.5 py-2.5 bg-stone-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  {themes.map((th) => (
                    <option key={th} value={th}>
                      {th}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Food preference? */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  8. Food preference?
                </label>
                <select
                  id="hero-food-select"
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value as any)}
                  className="w-full text-sm border border-stone-300 rounded-xl px-3.5 py-2.5 bg-stone-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="Both Veg & Non-Veg">Both Veg & Non-Veg (Recommended)</option>
                  <option value="Pure Vegetarian">Pure Vegetarian (Traditional)</option>
                  <option value="Non-Vegetarian">Non-Vegetarian Special Feast</option>
                  <option value="Jain Food Available">Jain Food Options Available</option>
                </select>
              </div>
            </div>

            {/* Other requirements text */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Other Requirements / Special Notes
              </label>
              <textarea
                id="hero-notes-input"
                rows={2}
                value={otherReqs}
                onChange={(e) => setOtherReqs(e.target.value)}
                placeholder="E.g. Need priority valet parking, wheelchair accessibility, live coffee counter, drone video coverage..."
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl p-3 bg-stone-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
              />
            </div>

            {/* Prominent CTA button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Generates Venue, Decor, Catering, Photography, Makeup & Checklist in ~3 seconds.</span>
              </div>
              <button
                type="submit"
                id="hero-create-plan-btn"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-stone-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-stone-950" />
                <span>Create My Event Plan</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </button>
            </div>
          </form>
        </div>

        {/* Feature quick badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">AI Event Architect</div>
              <div className="text-[11px] text-stone-500">Custom tailored plan</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Location-Aware</div>
              <div className="text-[11px] text-stone-500">Real km & travel time</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Curated Vendors</div>
              <div className="text-[11px] text-stone-500">Verified reviews & ₹ rates</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Zero Commission</div>
              <div className="text-[11px] text-stone-500">Direct WhatsApp & quotes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
