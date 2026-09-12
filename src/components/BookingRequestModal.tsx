import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vendor, VendorPackage } from '../types';
import {
  X,
  Calendar,
  Users,
  MapPin,
  IndianRupee,
  Sparkles,
  ShieldCheck,
  Send,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingRequestModalProps {
  vendor: Vendor;
  selectedPackage?: VendorPackage | null;
  onClose: () => void;
}

export const BookingRequestModal: React.FC<BookingRequestModalProps> = ({ vendor, selectedPackage, onClose }) => {
  const { activeEvent, createBooking, user } = useApp();

  const [date, setDate] = useState(activeEvent.date);
  const [guests, setGuests] = useState(activeEvent.guests);
  const [notes, setNotes] = useState(
    selectedPackage
      ? `Interested in ${selectedPackage.name}. Please confirm availability for ${date} and share your advance deposit guidelines.`
      : `Would like to request a custom quote for ${activeEvent.eventType} on ${date} for ${activeEvent.guests} guests.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const estimatedAmount = selectedPackage
    ? selectedPackage.price
    : vendor.priceUnit.includes('plate')
    ? vendor.startingPrice * guests
    : vendor.startingPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await createBooking({
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCategory: vendor.category,
      date,
      quoteAmount: estimatedAmount,
      packageName: selectedPackage?.name,
      notes,
    });
    setIsSubmitting(false);
    if (ok) {
      setIsSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-stone-400 hover:text-stone-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Direct Booking Enquiry
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">{vendor.name}</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Category: {vendor.category} • {vendor.location}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                    {selectedPackage ? 'Selected Package' : 'Estimated Base Rate'}
                  </span>
                  <div className="text-sm font-bold text-stone-900">
                    {selectedPackage ? selectedPackage.name : `${vendor.priceUnit} rate`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-stone-900">₹{estimatedAmount.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] text-stone-500">Approx. total</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs pl-8 pr-2 py-2 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Guest Count
                  </label>
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-xs pl-8 pr-2 py-2 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Special Instructions / Questions for Vendor
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs border border-stone-300 rounded-xl p-2.5 resize-none focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Submit Booking Request to Vendor'}</span>
                </button>
              </div>

              <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero commission. Vendor will review and respond with official quote.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">Request Sent Successfully!</h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Your booking request has been dispatched to <strong>{vendor.name}</strong>. You will receive an update in your <strong>My Bookings</strong> tracker once the vendor accepts or updates the quote.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${vendor.name}, I just submitted a booking enquiry on EventEase for ${date}. Looking forward to connecting!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Notify via WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
