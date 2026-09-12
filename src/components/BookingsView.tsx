import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  IndianRupee,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const { bookings, updateBookingStatus, setActiveTab } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Dealer Reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Live Bookings Tracker
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">My Event Bookings & Enquiries</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time status updates from dealers, quoted amounts, and direct WhatsApp contact.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('vendors')}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>Find More Vendors</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">No Bookings Submitted Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Browse our verified vendors or custom bundles to submit quote enquiries for your auspicious dates.
          </p>
          <button
            onClick={() => setActiveTab('vendors')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold cursor-pointer"
          >
            Explore Verified Vendors
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    ● {booking.status}
                  </span>
                  <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                    {booking.vendorCategory}
                  </span>
                  <span className="text-xs text-stone-400">Ref: {booking.id}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900">{booking.vendorName}</h3>

                {booking.packageName && (
                  <p className="text-xs font-semibold text-amber-800">Package: {booking.packageName}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Requested Date: <strong className="text-stone-800">{booking.date}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Last update: {new Date(booking.lastUpdated).toLocaleDateString()}
                  </span>
                </div>

                {booking.notes && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 max-w-xl">
                    "{booking.notes}"
                  </p>
                )}
              </div>

              {/* Right quote and actions */}
              <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div className="md:text-right">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                    {booking.status === 'Accepted' || booking.status === 'Confirmed'
                      ? 'Final Confirmed Quote'
                      : 'Estimated Quote'}
                  </span>
                  <div className="text-2xl font-bold text-stone-900">
                    ₹{booking.quoteAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Hello ${booking.vendorName}, I am following up on booking ${booking.id} on EventEase.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {booking.status === 'Accepted' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Lock & Confirm</span>
                    </button>
                  )}

                  {booking.status !== 'Cancelled' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                      className="px-3 py-2 text-stone-400 hover:text-rose-600 text-xs font-semibold cursor-pointer"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
