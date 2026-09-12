import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  PieChart,
  Edit2,
  Save,
  Printer,
  Sparkles,
} from 'lucide-react';

export const BudgetPlannerView: React.FC = () => {
  const { activeEvent, updateEvent, bookings } = useApp();

  const [totalBudget, setTotalBudget] = useState(activeEvent.budget || 800000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Derived actual bookings spend
  const actualBookingsTotal = bookings.reduce((acc, b) => acc + (b.quoteAmount || 0), 0);

  // Category splits (industry calibrated)
  const [categories, setCategories] = useState([
    {
      name: 'Function Hall / Venue',
      percent: 30,
      allocated: Math.round(totalBudget * 0.3),
      spent: bookings.find((b) => b.vendorCategory === 'Wedding Hall' || b.vendorCategory === 'Function Hall')?.quoteAmount || 280000,
    },
    {
      name: 'Food & Catering Feast',
      percent: 35,
      allocated: Math.round(totalBudget * 0.35),
      spent: bookings.find((b) => b.vendorCategory === 'Caterer')?.quoteAmount || 220000,
    },
    {
      name: 'Stage, Floral & Lighting Decor',
      percent: 15,
      allocated: Math.round(totalBudget * 0.15),
      spent: bookings.find((b) => b.vendorCategory === 'Decorator')?.quoteAmount || 55000,
    },
    {
      name: 'Photography & Cinema',
      percent: 10,
      allocated: Math.round(totalBudget * 0.1),
      spent: bookings.find((b) => b.vendorCategory === 'Photographer')?.quoteAmount || 65000,
    },
    {
      name: 'Bridal Makeover & Styling',
      percent: 5,
      allocated: Math.round(totalBudget * 0.05),
      spent: bookings.find((b) => b.vendorCategory === 'Makeup Artist')?.quoteAmount || 25000,
    },
    {
      name: 'Stationery & Invitations',
      percent: 2,
      allocated: Math.round(totalBudget * 0.02),
      spent: 12000,
    },
    {
      name: 'Emergency Buffer & Miscellaneous',
      percent: 3,
      allocated: Math.round(totalBudget * 0.03),
      spent: 8000,
    },
  ]);

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  const handleUpdateCategorySpend = (idx: number, newSpent: number) => {
    setCategories((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], spent: newSpent };
      return next;
    });
  };

  const handleSaveBudget = async () => {
    await updateEvent({
      ...activeEvent,
      budget: totalBudget,
    });
    // Re-proportion
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        allocated: Math.round(totalBudget * (c.percent / 100)),
      }))
    );
    setIsEditingBudget(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase mb-3">
          <DollarSign className="w-3.5 h-3.5" />
          Smart Financial Engine
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Event Budget Architect</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Track allocations vs real vendor quotes. Never face unexpected surprises on the wedding day.
        </p>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Target Budget</span>
            <button
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {isEditingBudget ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                step="50000"
                className="w-full text-lg font-bold border border-amber-300 rounded-xl px-2 py-1"
              />
              <button
                onClick={handleSaveBudget}
                className="px-3 py-1 bg-stone-900 text-white rounded-xl text-xs font-semibold"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-2xl font-bold text-stone-900">₹{totalBudget.toLocaleString('en-IN')}</div>
          )}
          <span className="text-xs text-stone-400 mt-1 block">For {activeEvent.title}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Committed & Quoted
          </span>
          <div className="text-2xl font-bold text-stone-900">₹{totalSpent.toLocaleString('en-IN')}</div>
          <span className="text-xs text-stone-400 mt-1 block">
            {Math.round((totalSpent / totalBudget) * 100)}% of budget utilized
          </span>
        </div>

        <div
          className={`rounded-3xl p-6 border shadow-xs ${
            isOverBudget ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isOverBudget ? 'text-rose-700' : 'text-emerald-700'}`}>
              {isOverBudget ? 'Budget Exceeded By' : 'Remaining Free Buffer'}
            </span>
            {isOverBudget ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className={`text-2xl font-bold ${isOverBudget ? 'text-rose-900' : 'text-emerald-900'}`}>
            ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
          </div>
          <span className={`text-xs mt-1 block ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isOverBudget ? 'Consider negotiating hall or decor quote' : 'Safe to proceed with bookings'}
          </span>
        </div>
      </div>

      {/* Categories Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Category Allocations & Spent Quotes</h3>
            <p className="text-xs text-stone-500">Edit spent figures as you receive final dealer invoices</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Sheet</span>
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((cat, idx) => {
            const spentPercent = Math.min(100, Math.round((cat.spent / cat.allocated) * 100));
            const isCatOver = cat.spent > cat.allocated;

            return (
              <div key={idx} className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{cat.name}</span>
                    <span className="text-[11px] text-stone-400">({cat.percent}% allocation)</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase block">Allocated</span>
                      <span className="font-semibold text-stone-700">₹{cat.allocated.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-stone-400 text-[10px] uppercase block">Actual Spent: ₹</span>
                      <input
                        type="number"
                        value={cat.spent}
                        onChange={(e) => handleUpdateCategorySpend(idx, Number(e.target.value))}
                        step="5000"
                        className="w-28 text-xs font-bold border border-stone-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCatOver ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${spentPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
