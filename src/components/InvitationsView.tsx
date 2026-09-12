import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  Printer,
  Share2,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InvitationsView: React.FC = () => {
  const { activeEvent } = useApp();

  const [hostNames, setHostNames] = useState('Priya & Karthik');
  const [date, setDate] = useState('Sunday, 20 December 2026');
  const [time, setTime] = useState('Muhurtham: 09:15 AM - 10:30 AM • Reception: 06:30 PM');
  const [venue, setVenue] = useState('Sri Venkateswara Grand Palace, Anna Nagar, Chennai');
  const [language, setLanguage] = useState<'English' | 'Tamil' | 'Hindi' | 'Telugu'>('English');
  const [style, setStyle] = useState<'Royal' | 'Floral' | 'Modern' | 'Traditional'>('Royal');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [invitation, setInvitation] = useState<any>({
    title: '|| Om Sri Ganeshaya Namaha ||',
    subtitle: 'Together with their families',
    wording:
      'We cordially invite you to celebrate the joyous union and auspicious wedding ceremony of Priya & Karthik. Your presence, love, and heartfelt blessings will make this sacred occasion truly memorable.',
    scheduleLines: [
      'Auspicious Muhurtham: 09:15 AM – 10:30 AM',
      'Traditional Kalyana Virundhu (Feast): 11:30 AM onwards',
      'Grand Reception & Evening Music: 06:30 PM onwards',
    ],
    dressCode: 'Festive Ethnic / Silk Saree & Traditional Attire',
    rsvp: 'RSVP: With Best Compliments From Ramanathan & Sundaram Families • Contact: +91 98400 11223',
    blessingQuote: 'Two lives, two hearts, joined together in friendship and united forever in love.',
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/invitation-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: activeEvent.eventType,
          hostNames,
          date,
          time,
          venue,
          theme: activeEvent.theme,
          language,
          style,
        }),
      });
      const data = await res.json();
      if (data.success && data.invitation) {
        setInvitation(data.invitation);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Failed to generate invitation', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyWhatsAppText = () => {
    const text = `✨ *${invitation.title}* ✨\n\n${invitation.subtitle}\n*${hostNames}*\n\n${invitation.wording}\n\n📅 *Date:* ${date}\n⏰ *Time:* ${time}\n📍 *Venue:* ${venue}\n\n👗 *Dress Code:* ${invitation.dressCode}\n\n${invitation.rsvp}\n\n"${invitation.blessingQuote}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase mb-3">
          <Mail className="w-3.5 h-3.5" />
          AI Bilingual Stationery & Invitation Studio
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">AI Event Invitation Generator</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Generate poetic invitation cards in English, Tamil, Hindi, or Telugu with auspicious invocations, ceremony schedules, and WhatsApp shareable text.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
            Invitation Details
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Couple / Host Names
              </label>
              <input
                type="text"
                value={hostNames}
                onChange={(e) => setHostNames(e.target.value)}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl px-3 py-2.5"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl px-3 py-2.5 bg-white"
                >
                  <option value="English">English</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Design Motif
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl px-3 py-2.5 bg-white"
                >
                  <option value="Royal">Royal Gold & Crimson</option>
                  <option value="Floral">Pastel Floral Garden</option>
                  <option value="Modern">Minimalist Charcoal & Gold</option>
                  <option value="Traditional">Temple Heritage Brass</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Date & Auspicious Timings
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Program Time Details
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Venue Address
              </label>
              <textarea
                rows={2}
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl p-2.5 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Writing Poetic Copy...' : 'Generate Invitation Copy'}</span>
            </button>
          </form>

          {/* Quick actions */}
          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={copyWhatsAppText}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
              <span>{copied ? 'Copied WhatsApp Message!' : 'Copy Formatted WhatsApp Message'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 px-3 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Card Preview</span>
            </button>
          </div>
        </div>

        {/* Right Digital Card Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            className={`w-full max-w-lg rounded-3xl p-8 sm:p-12 shadow-2xl relative border-8 text-center transition-all ${
              style === 'Royal'
                ? 'bg-[#fdfaf5] border-[#c5a059] text-stone-900 shadow-amber-900/10'
                : style === 'Floral'
                ? 'bg-[#fcf8f9] border-[#e89da2] text-stone-900'
                : style === 'Modern'
                ? 'bg-[#202020] border-[#c5a059] text-white'
                : 'bg-[#fffdfa] border-[#b45309] text-stone-900'
            }`}
          >
            {/* Corner Filigree simulation */}
            <div className="absolute top-3 left-3 text-xs opacity-60">❖</div>
            <div className="absolute top-3 right-3 text-xs opacity-60">❖</div>
            <div className="absolute bottom-3 left-3 text-xs opacity-60">❖</div>
            <div className="absolute bottom-3 right-3 text-xs opacity-60">❖</div>

            {/* Inner Border */}
            <div className="border border-stone-300/80 p-6 sm:p-8 rounded-2xl relative">
              <div className="font-serif text-xs uppercase tracking-widest font-bold text-amber-700 mb-3">
                {invitation.title}
              </div>

              <div className="text-xs opacity-75 font-sans mb-1">{invitation.subtitle}</div>

              <h2 className="font-royal text-2xl sm:text-3xl font-bold tracking-wide my-4 text-amber-900">
                {hostNames}
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed my-6 font-serif italic max-w-md mx-auto">
                "{invitation.wording}"
              </p>

              <div className="my-6 py-4 border-t border-b border-stone-200/80 space-y-2 text-xs">
                {invitation.scheduleLines.map((line: string, i: number) => (
                  <div key={i} className="font-semibold tracking-wide">
                    {line}
                  </div>
                ))}
              </div>

              <div className="text-xs font-semibold mb-2">
                Venue: <span className="font-normal">{venue}</span>
              </div>

              <div className="text-[11px] opacity-80 mb-4">{invitation.dressCode}</div>

              <div className="text-[10px] opacity-70 tracking-wide border-t border-stone-200/60 pt-3">
                {invitation.rsvp}
              </div>

              <div className="mt-4 text-[10px] italic opacity-60">"{invitation.blessingQuote}"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
