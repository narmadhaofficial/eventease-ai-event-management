import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodMenu } from '../types';
import {
  Utensils,
  Sparkles,
  Users,
  IndianRupee,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  RefreshCw,
  Share2,
  ArrowRight,
  Flame,
  Coffee,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FoodPlannerView: React.FC = () => {
  const { activeEvent, setActiveTab } = useApp();

  const [guests, setGuests] = useState(activeEvent.guests || 300);
  const [diet, setDiet] = useState(activeEvent.foodPreference || 'Both Veg & Non-Veg');
  const [cuisine, setCuisine] = useState('South Indian Traditional & North Indian Fusion');
  const [targetCostPerPlate, setTargetCostPerPlate] = useState(600);
  const [isLoading, setIsLoading] = useState(false);

  const [menu, setMenu] = useState<FoodMenu | null>(null);

  const generateMenu = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/food-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guests,
          dietPreference: diet,
          eventType: activeEvent.eventType,
          budgetPerPerson: targetCostPerPlate,
          cuisine,
        }),
      });
      const data = await res.json();
      if (data.success && data.menu) {
        setMenu(data.menu);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Failed to generate food menu', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!menu && !isLoading) {
      generateMenu();
    }
  }, []);

  const totalCalculatedCost = (menu?.costPerPerson || targetCostPerPlate) * guests;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase mb-3">
          <Utensils className="w-3.5 h-3.5" />
          AI Culinary Master & Menu Architect
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Banquet & Catering Food Planner</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Design festive menus with live stations, dietary balancing, and exact per-plate calculations for {guests} guests.
        </p>
      </div>

      {/* Control Panel Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              Guest Count
            </label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              min="20"
              step="50"
              className="w-full text-sm font-semibold border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Dietary Preference
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value as any)}
              className="w-full text-sm font-medium border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="Both Veg & Non-Veg">Both Veg & Non-Veg</option>
              <option value="Pure Vegetarian">Pure Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian Feast</option>
              <option value="Jain Food Available">Jain Food Options</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Cuisine Style
            </label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full text-sm font-medium border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 bg-white"
            >
              <option value="South Indian Traditional & North Indian Fusion">South & North Indian Fusion</option>
              <option value="Authentic South Indian Kalyana Virundhu">Authentic Kalyana Virundhu</option>
              <option value="Chettinad & Malabar Royal Feast">Chettinad & Malabar Feast</option>
              <option value="Royal Mughal & Awadhi Banquet">Royal Mughal Banquet</option>
              <option value="Pan-Asian & Continental Stations">Global & Continental</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-stone-400" />
              Target / Plate (₹)
            </label>
            <input
              type="number"
              value={targetCostPerPlate}
              onChange={(e) => setTargetCostPerPlate(Number(e.target.value))}
              step="50"
              min="300"
              className="w-full text-sm font-semibold border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Current Estimate: <strong className="text-stone-900">₹{(menu?.costPerPerson || targetCostPerPlate)} / plate</strong> • Total Catering: <strong className="text-emerald-800">₹{totalCalculatedCost.toLocaleString('en-IN')}</strong>
          </div>
          <button
            onClick={generateMenu}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Assembling Menu...' : 'Generate Custom Menu'}</span>
          </button>
        </div>
      </div>

      {/* Menu Board */}
      {menu && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Custom Banquet Menu</h2>
                <p className="text-xs text-stone-500">
                  {menu.cuisine} • {menu.dietPreference} • For {menu.guests} Guests
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Menu</span>
                </button>
                <button
                  onClick={() => setActiveTab('vendors')}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Find Caterers for this Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.courses.map((course, idx) => (
                <div key={idx} className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
                      <span className="font-serif font-bold text-sm text-stone-900">{course.category}</span>
                      <span className="text-[10px] font-bold text-stone-400 uppercase">{course.dishes.length} Items</span>
                    </div>

                    <div className="space-y-3">
                      {course.dishes.map((dish) => (
                        <div key={dish.id} className="text-xs space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-bold text-stone-900">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  dish.type === 'Non-Veg' ? 'bg-rose-600' : 'bg-emerald-600'
                                }`}
                              />
                              <span>{dish.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-stone-400">~₹{dish.costImpact}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 pl-3.5 leading-relaxed">{dish.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions & Catering Guidelines */}
            {menu.suggestions && menu.suggestions.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Catering Coordinator Advice for {guests} Guests
                </span>
                <ul className="space-y-1 text-xs text-emerald-800">
                  {menu.suggestions.map((sug, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
