import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AIPlannerView } from './components/AIPlannerView';
import { VendorMarketplaceView } from './components/VendorMarketplaceView';
import { PackagesView } from './components/PackagesView';
import { ThemesView } from './components/ThemesView';
import { FoodPlannerView } from './components/FoodPlannerView';
import { InvitationsView } from './components/InvitationsView';
import { ChecklistView } from './components/ChecklistView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { BookingsView } from './components/BookingsView';
import { VendorCompareView } from './components/VendorCompareView';
import { DealerDashboardView } from './components/DealerDashboardView';
import { LoginPageView } from './components/LoginPageView';
import { VendorDetailModal } from './components/VendorDetailModal';
import { BookingRequestModal } from './components/BookingRequestModal';
import { AIChatAssistant } from './components/AIChatAssistant';
import { Vendor, VendorPackage } from './types';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Utensils,
  CheckCircle2,
  Building2,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedVendor,
    setSelectedVendor,
    activeEvent,
    updateEvent,
    setActiveAIPlan,
    role,
    setRole,
  } = useApp();

  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<VendorPackage | null>(null);

  const handleStartPlanning = (formDetails: any) => {
    updateEvent({
      ...activeEvent,
      ...formDetails,
    });
    setActiveAIPlan(null);
    setActiveTab('ai-planner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 font-sans">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Body Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection onStartPlanning={handleStartPlanning} />

            {/* Value Proposition Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-200">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  Why Families Choose EventEase
                </span>
                <h2 className="font-serif text-3xl font-bold text-stone-900 mt-2">
                  Everything for your grand day in one place
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-2">
                  Say goodbye to juggling 15 different WhatsApp vendors, lost diary notes, and unexpected wedding-day surprises.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">1. Instant AI Event Blueprint</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Provide your dates, guest count, and budget. Our Gemini AI engine instantly crafts a complete hour-by-hour itinerary, budget breakdown, and recommended services.
                  </p>
                  <button
                    onClick={() => setActiveTab('ai-planner')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 cursor-pointer pt-1"
                  >
                    Try AI Planner →
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">2. 100% Verified Local Vendors</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Function halls, caterers, decorators, candid photographers, and makeup artists thoroughly verified for capacity, credentials, and transparent pricing.
                  </p>
                  <button
                    onClick={() => setActiveTab('vendors')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer pt-1"
                  >
                    Explore Marketplace →
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">3. Build My Own Package</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Combine your favourite hall, catering plate count, decoration theme, and photographer to unlock automatic multi-service bundle discounts.
                  </p>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 inline-flex items-center gap-1 cursor-pointer pt-1"
                  >
                    Custom Package Builder →
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Feature Shortcut Banner */}
            <section className="bg-stone-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs text-amber-400 uppercase font-bold tracking-widest block mb-1">
                      Event Management Suite
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold">Plan in 7 Intelligent Dimensions</h3>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                      Switch effortlessly between Scenography Themes, Banquet Menus, Bilingual Invitations, Milestones, and Budget tracking.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('themes')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer transition-colors"
                    >
                      🎨 AI Themes
                    </button>
                    <button
                      onClick={() => setActiveTab('food')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer transition-colors"
                    >
                      🍲 Food Planner
                    </button>
                    <button
                      onClick={() => setActiveTab('invitations')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer transition-colors"
                    >
                      💌 AI Invitations
                    </button>
                    <button
                      onClick={() => setActiveTab('budget')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer transition-colors"
                    >
                      💰 Budget Tracker
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'ai-planner' && <AIPlannerView />}
        {activeTab === 'vendors' && <VendorMarketplaceView />}
        {activeTab === 'packages' && <PackagesView />}
        {activeTab === 'themes' && <ThemesView />}
        {activeTab === 'food' && <FoodPlannerView />}
        {activeTab === 'invitations' && <InvitationsView />}
        {activeTab === 'checklist' && <ChecklistView />}
        {activeTab === 'budget' && <BudgetPlannerView />}
        {activeTab === 'bookings' && <BookingsView />}
        {activeTab === 'compare' && <VendorCompareView />}
        {(activeTab === 'dealer' || activeTab.startsWith('dealer-')) && <DealerDashboardView />}
        {activeTab === 'login' && <LoginPageView />}
      </main>

      {/* Global Modals for Compare or Direct Vendor views */}
      {selectedVendor && activeTab !== 'vendors' && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onBook={(v, pkg) => {
            setSelectedVendor(null);
            setBookingVendor(v);
            setSelectedPkg(pkg || null);
          }}
        />
      )}
      {bookingVendor && activeTab !== 'vendors' && (
        <BookingRequestModal
          vendor={bookingVendor}
          selectedPackage={selectedPkg}
          onClose={() => setBookingVendor(null)}
        />
      )}

      {/* Floating AI Chat Assistant */}
      <AIChatAssistant />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-sm">
                  EE
                </div>
                <span className="font-serif font-bold text-xl text-white">EventEase</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                India's premier AI-powered event planning platform and verified service partner marketplace. Plan everything. Celebrate more.
              </p>
              <div className="text-[11px] text-amber-300/90 font-medium">
                Covering Chennai, Bangalore, Hyderabad, Coimbatore, Madurai & South India.
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Event Categories</h4>
              <ul className="space-y-2 text-stone-400">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white cursor-pointer">Marriage & Kalyanam</button></li>
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white cursor-pointer">Grand Receptions</button></li>
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white cursor-pointer">Engagements & Nichayathartham</button></li>
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white cursor-pointer">Baby Shower (Valaikappu)</button></li>
                <li><button onClick={() => setActiveTab('home')} className="hover:text-white cursor-pointer">Birthdays & Anniversaries</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">AI Smart Tools</h4>
              <ul className="space-y-2 text-stone-400">
                <li><button onClick={() => setActiveTab('ai-planner')} className="hover:text-white cursor-pointer">AI Full Itinerary Generator</button></li>
                <li><button onClick={() => setActiveTab('themes')} className="hover:text-white cursor-pointer">AI Scenography & Themes</button></li>
                <li><button onClick={() => setActiveTab('food')} className="hover:text-white cursor-pointer">Banquet Feast Calculator</button></li>
                <li><button onClick={() => setActiveTab('invitations')} className="hover:text-white cursor-pointer">Bilingual Invitation Studio</button></li>
                <li><button onClick={() => setActiveTab('budget')} className="hover:text-white cursor-pointer">Budget Allocation Tracker</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">Partner With Us</h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-3">
                Are you a function hall owner, caterer, decorator, or photographer? List your services for free with zero listing fees.
              </p>
              <button
                onClick={() => {
                  setRole('dealer');
                  setActiveTab('dealer');
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                {role === 'dealer' ? 'Open Partner Dashboard' : 'Switch to Partner / Dealer Portal'}
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <div>© {new Date().getFullYear()} EventEase Technologies Pvt Ltd. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Safety & Verification</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
