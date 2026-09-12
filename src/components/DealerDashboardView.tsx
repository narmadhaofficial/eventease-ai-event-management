import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Vendor, VendorPackage } from '../types';
import {
  Store,
  DollarSign,
  Users,
  Calendar,
  Star,
  CheckCircle2,
  XCircle,
  Plus,
  MessageCircle,
  Phone,
  Clock,
  Edit2,
  Save,
  ShieldCheck,
  TrendingUp,
  Inbox,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DealerDashboardView: React.FC = () => {
  const { user, vendors, bookings, updateBookingStatus, refreshVendors, activeTab: globalTab } = useApp();

  // Find vendor profile associated with dealer
  const vendorProfile = vendors.find((v) => v.id === user?.vendorId) || vendors[0];

  const [activeTab, setActiveTab] = useState<'leads' | 'packages' | 'calendar' | 'profile'>('leads');

  useEffect(() => {
    if (globalTab === 'dealer-packages') setActiveTab('packages');
    else if (globalTab === 'dealer-calendar') setActiveTab('calendar');
    else if (globalTab === 'dealer-profile') setActiveTab('profile');
    else if (globalTab === 'dealer-leads' || globalTab === 'dealer') setActiveTab('leads');
  }, [globalTab]);

  // New package modal state
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState(50000);
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgFeatures, setNewPkgFeatures] = useState('Centralized AC, Stage lighting, 2 Green rooms');

  // Quote editing modal
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [customQuoteAmount, setCustomQuoteAmount] = useState<number>(0);

  // Availability calendar state
  const [blockedDates, setBlockedDates] = useState<string[]>(vendorProfile?.unavailableDates || ['2026-11-14', '2026-12-25']);
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Leads for this vendor
  const vendorBookings = bookings.filter(
    (b) => b.vendorId === vendorProfile?.id || b.vendorName.includes('Venkateswara')
  );

  const totalEarnings = vendorBookings
    .filter((b) => b.status === 'Accepted' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.quoteAmount || 0), 0);

  const handleAccept = async (id: string) => {
    await updateBookingStatus(id, 'Accepted');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleReject = async (id: string) => {
    await updateBookingStatus(id, 'Rejected');
  };

  const handleSaveQuote = async (id: string) => {
    await updateBookingStatus(id, 'Accepted', customQuoteAmount, 'Custom official quote provided by vendor manager.');
    setEditingBookingId(null);
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim()) return;

    const newPkg: VendorPackage = {
      id: `pkg-${Date.now()}`,
      name: newPkgName,
      price: Number(newPkgPrice),
      description: newPkgDesc,
      features: newPkgFeatures.split(',').map((s) => s.trim()),
    };

    const updatedPackages = [...(vendorProfile?.packages || []), newPkg];

    await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...vendorProfile,
        packages: updatedPackages,
      }),
    });

    refreshVendors();
    setShowAddPackage(false);
    setNewPkgName('');
    setNewPkgDesc('');
  };

  const handleToggleBlockDate = async (dateStr: string) => {
    let nextBlocked = [...blockedDates];
    if (nextBlocked.includes(dateStr)) {
      nextBlocked = nextBlocked.filter((d) => d !== dateStr);
    } else {
      nextBlocked.push(dateStr);
    }
    setBlockedDates(nextBlocked);

    await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...vendorProfile,
        unavailableDates: nextBlocked,
      }),
    });
    refreshVendors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-2xl shadow-md">
              {vendorProfile?.name ? vendorProfile.name.charAt(0) : 'V'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase">
                  Verified Partner Portal
                </span>
                <span className="text-xs text-stone-400">{vendorProfile?.category}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">{vendorProfile?.name}</h1>
              <p className="text-xs text-stone-300 mt-1">{vendorProfile?.location} • Contact: {vendorProfile?.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-xs text-amber-200/80 block">Partner Rating</span>
              <div className="flex items-center gap-1 text-xl font-bold text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{vendorProfile?.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400 font-normal">({vendorProfile?.reviewCount} reviews)</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-amber-200/80 block">Active Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Accepting Dates
              </span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Bookings Revenue</span>
            <div className="text-xl font-bold text-amber-300">₹{totalEarnings.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Total Inquiries</span>
            <div className="text-xl font-bold text-white">{vendorBookings.length} Leads</div>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Active Packages</span>
            <div className="text-xl font-bold text-white">{vendorProfile?.packages.length || 0} Listed</div>
          </div>
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Commission Saved</span>
            <div className="text-xl font-bold text-emerald-400">100% (₹0 Fee)</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'leads', label: `Booking Inquiries & Quotes (${vendorBookings.length})`, icon: Inbox },
          { id: 'packages', label: `My Packages (${vendorProfile?.packages.length || 0})`, icon: Layers },
          { id: 'calendar', label: 'Availability & Blocked Dates', icon: Calendar },
          { id: 'profile', label: 'Business Profile & Services', icon: Store },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Leads & Enquiries */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {vendorBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 text-xs">
              No new inquiries at this moment. You will be notified as soon as a customer matches your service!
            </div>
          ) : (
            vendorBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      ● {b.status}
                    </span>
                    <span className="text-xs text-stone-400">Lead ID: {b.id}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {b.customerName} • {b.eventTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                    <span className="flex items-center gap-1 font-semibold text-stone-900">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      Date: {b.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {b.customerPhone}
                    </span>
                    {b.packageName && (
                      <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                        Package: {b.packageName}
                      </span>
                    )}
                  </div>

                  {b.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 max-w-xl">
                      <strong>Client Note:</strong> "{b.notes}"
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                  <div className="md:text-right">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Estimated Quote</span>
                    <div className="text-2xl font-bold text-stone-900">
                      ₹{b.quoteAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${b.customerName}, this is ${vendorProfile?.name} regarding your enquiry for ${b.date}. We would love to discuss further.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        setEditingBookingId(b.id);
                        setCustomQuoteAmount(b.quoteAmount);
                      }}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Update Quote
                    </button>

                    {b.status !== 'Accepted' && (
                      <button
                        onClick={() => handleAccept(b.id)}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Accept Lead</span>
                      </button>
                    )}

                    {b.status !== 'Rejected' && (
                      <button
                        onClick={() => handleReject(b.id)}
                        className="px-3 py-2 text-stone-400 hover:text-rose-600 text-xs font-semibold cursor-pointer"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Update Quote Modal */}
          {editingBookingId && (
            <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Provide Official Quotation</h3>
                <p className="text-xs text-stone-500 mb-4">
                  Enter your final tailored quote in ₹ for this client request.
                </p>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Quote Amount (₹)</label>
                  <input
                    type="number"
                    value={customQuoteAmount}
                    onChange={(e) => setCustomQuoteAmount(Number(e.target.value))}
                    step="5000"
                    className="w-full text-lg font-bold border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBookingId(null)}
                    className="flex-1 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveQuote(editingBookingId)}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs"
                  >
                    Send Quote
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manage Packages */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Your Listed Packages</h3>
              <p className="text-xs text-stone-500">Customers can select and order these packages directly.</p>
            </div>
            <button
              onClick={() => setShowAddPackage(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendorProfile?.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif font-bold text-lg text-stone-900">{pkg.name}</h4>
                    {pkg.popular && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mb-4">{pkg.description}</p>
                  <div className="text-2xl font-bold text-stone-900 mb-4">₹{pkg.price.toLocaleString('en-IN')}</div>

                  <div className="space-y-1.5 border-t border-stone-100 pt-3">
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 text-right">
                  <span className="text-[11px] text-emerald-600 font-bold">Active in Search & Marketplace</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Package Modal */}
          {showAddPackage && (
            <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">Add New Service Package</h3>
                <form onSubmit={handleAddPackage} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Package Name</label>
                    <input
                      type="text"
                      value={newPkgName}
                      onChange={(e) => setNewPkgName(e.target.value)}
                      placeholder="e.g. 2-Day Royal Muhurtham Package"
                      className="w-full text-xs border border-stone-300 rounded-xl p-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Base Price in ₹</label>
                    <input
                      type="number"
                      value={newPkgPrice}
                      onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                      step="5000"
                      className="w-full text-xs border border-stone-300 rounded-xl p-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={newPkgDesc}
                      onChange={(e) => setNewPkgDesc(e.target.value)}
                      placeholder="e.g. Complete 2-day booking with complimentary dining hall access"
                      className="w-full text-xs border border-stone-300 rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Inclusions (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={newPkgFeatures}
                      onChange={(e) => setNewPkgFeatures(e.target.value)}
                      placeholder="Pillarless AC Hall, Generator Backup, 6 Green Rooms, Valet Parking"
                      className="w-full text-xs border border-stone-300 rounded-xl p-2.5 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPackage(false)}
                      className="flex-1 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                    >
                      Save Package
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Availability Calendar */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Manage Unavailable / Blocked Dates</h3>
              <p className="text-xs text-stone-500">
                Prevent customers from submitting inquiries for already occupied auspicious dates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="text-xs border border-stone-300 rounded-xl px-3 py-2"
              />
              <button
                onClick={() => {
                  if (newBlockedDate) {
                    handleToggleBlockDate(newBlockedDate);
                    setNewBlockedDate('');
                  }
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + Block Date
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Currently Blocked Dates</h4>
            <div className="flex flex-wrap gap-2">
              {blockedDates.map((d) => (
                <div
                  key={d}
                  className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{d}</span>
                  <button
                    onClick={() => handleToggleBlockDate(d)}
                    className="text-rose-500 hover:text-rose-700 font-bold p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Business Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            Vendor Business Profile & Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Business Name</label>
              <input
                type="text"
                defaultValue={vendorProfile?.name}
                className="w-full border border-stone-300 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Category</label>
              <input
                type="text"
                disabled
                defaultValue={vendorProfile?.category}
                className="w-full border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-stone-500"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                defaultValue={vendorProfile?.phone}
                className="w-full border border-stone-300 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Starting Rate (₹)</label>
              <input
                type="number"
                defaultValue={vendorProfile?.startingPrice}
                className="w-full border border-stone-300 rounded-xl p-2.5"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">About & Description</label>
              <textarea
                rows={3}
                defaultValue={vendorProfile?.description}
                className="w-full border border-stone-300 rounded-xl p-2.5 resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => alert('Profile details updated successfully!')}
              className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-800"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
