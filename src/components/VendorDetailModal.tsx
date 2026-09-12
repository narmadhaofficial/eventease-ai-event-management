import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vendor, VendorPackage } from '../types';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Users,
  ShieldCheck,
  Send,
  Scale,
} from 'lucide-react';

interface VendorDetailModalProps {
  vendor: Vendor;
  onClose: () => void;
  onBook: (vendor: Vendor, pkg?: VendorPackage) => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ vendor, onClose, onBook }) => {
  const { favorites, toggleFavorite, addToCompare, addVendorReview, user } = useApp();
  const isFav = favorites.includes(vendor.id);

  const [activeTab, setActiveTab] = useState<'packages' | 'services' | 'reviews' | 'about'>('packages');
  const [selectedImage, setSelectedImage] = useState(vendor.images[0]);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewEventType, setReviewEventType] = useState('Marriage / Wedding');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    await addVendorReview(vendor.id, {
      customerName: user?.name || 'Verified Customer',
      rating: {
        overall: reviewRating,
        service: reviewRating,
        quality: reviewRating,
        price: reviewRating,
        professionalism: reviewRating,
        punctuality: reviewRating,
      },
      comment: reviewComment,
      eventType: reviewEventType,
    });
    setReviewComment('');
    setShowReviewForm(false);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${vendor.name}, I discovered your profile on EventEase. I am planning an event and would like to enquire about your availability and package quotations.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {vendor.category}
            </span>
            {vendor.verified && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Partner
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCompare(vendor)}
              className="p-2 text-stone-600 hover:text-indigo-600 hover:bg-stone-100 rounded-xl cursor-pointer"
              title="Add to Compare"
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(vendor.id)}
              className="p-2 text-stone-600 hover:text-rose-600 hover:bg-stone-100 rounded-xl cursor-pointer"
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Gallery and basic info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-2">
              <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative">
                <img
                  src={selectedImage}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {vendor.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                      selectedImage === img ? 'border-amber-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 leading-snug">{vendor.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{vendor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-stone-500">({vendor.reviewCount} verified reviews)</span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{vendor.location}</span>
                  </div>
                  {vendor.distanceKm !== undefined && (
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{vendor.distanceKm} km from you • ~{vendor.travelTimeMins} mins travel time</span>
                    </div>
                  )}
                  {vendor.capacity && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Capacity: {vendor.capacity} Guests</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Starting Rate</span>
                  <div className="text-2xl font-bold text-stone-900">
                    ₹{vendor.startingPrice.toLocaleString('en-IN')}
                    <span className="text-xs text-stone-500 font-normal"> / {vendor.priceUnit}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onBook(vendor)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Booking & Custom Quote</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${vendor.phone}`}
                    className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Vendor</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-stone-200">
            {[
              { id: 'packages', label: `Packages (${vendor.packages.length})` },
              { id: 'services', label: 'Services & Inclusions' },
              { id: 'reviews', label: `Reviews (${vendor.reviews.length})` },
              { id: 'about', label: 'About & Policies' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === t.id
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Packages */}
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vendor.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    pkg.popular
                      ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div>
                    {pkg.popular && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-stone-950 rounded-full mb-2">
                        Most Selected
                      </span>
                    )}
                    <h4 className="font-serif font-bold text-base text-stone-900">{pkg.name}</h4>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{pkg.description}</p>

                    <div className="mt-4 mb-4">
                      <span className="text-xs text-stone-400 font-medium">Package Cost</span>
                      <div className="text-xl font-bold text-stone-900">₹{pkg.price.toLocaleString('en-IN')}</div>
                    </div>

                    <div className="border-t border-stone-100 pt-3 space-y-1.5">
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                        Included Features:
                      </span>
                      {pkg.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onBook(vendor, pkg)}
                    className="mt-5 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Select This Package
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Services */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">All Specializations & Services</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.services.map((svc, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-medium border border-stone-200"
                  >
                    ✓ {svc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Customer Feedback & Ratings</h4>
                  <p className="text-xs text-stone-500">Verified clients who celebrated with {vendor.name}</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3.5 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold cursor-pointer hover:bg-amber-200"
                >
                  {showReviewForm ? 'Cancel Review' : '+ Write a Review'}
                </button>
              </div>

              {/* Review Write Box */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Overall Rating (1-5)</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full text-xs border border-stone-300 rounded-lg p-2 bg-white"
                      >
                        <option value="5">5 Stars - Exceptional</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Average</option>
                        <option value="2">2 Stars - Disappointed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Event Celebrated</label>
                      <input
                        type="text"
                        value={reviewEventType}
                        onChange={(e) => setReviewEventType(e.target.value)}
                        className="w-full text-xs border border-stone-300 rounded-lg p-2 bg-white"
                        placeholder="e.g. Wedding Reception"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Honest Review</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share details regarding punctuality, quality, food taste, or stage decor..."
                      className="w-full text-xs border border-stone-300 rounded-lg p-2 bg-white resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {vendor.reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No reviews yet. Be the first to review!</p>
                ) : (
                  vendor.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-stone-900">{rev.customerName}</span>
                          <span className="text-[11px] text-stone-400 ml-2">({rev.eventType})</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating.overall)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                          <span className="text-xs text-stone-400 ml-1">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: About */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-sm text-stone-900 mb-1">About {vendor.name}</h4>
                <p>{vendor.description}</p>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <h4 className="font-bold text-sm text-stone-900 mb-2">Booking & Cancellation Policies</h4>
                <ul className="list-disc pl-4 space-y-1 text-stone-600">
                  <li>25% advance payment required to lock auspicious calendar dates.</li>
                  <li>Balance payment due 24 hours prior to event commencement.</li>
                  <li>Cancellations before 30 days receive 80% refund of deposit.</li>
                  <li>Electricity backup & hall sanitation included in standard quote.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
