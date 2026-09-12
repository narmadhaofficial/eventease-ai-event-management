import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeConcept } from '../types';
import { POPULAR_THEMES } from '../data/sampleVendors';
import {
  Sparkles,
  Palette,
  CheckCircle2,
  Copy,
  Check,
  Flower2,
  Camera,
  Heart,
  Store,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ThemesView: React.FC = () => {
  const { activeEvent, updateEvent, setActiveTab } = useApp();

  const [prompt, setPrompt] = useState('Pink floral garden baby shower with fairy lights');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemeConcept>(POPULAR_THEMES[0]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const handleGenerateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, eventType: activeEvent.eventType }),
      });
      const data = await res.json();
      if (data.success && data.theme) {
        setActiveTheme(data.theme);
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Failed to generate theme', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const applyThemeToEvent = async () => {
    await updateEvent({
      ...activeEvent,
      theme: activeTheme.name,
    });
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase mb-3">
          <Palette className="w-3.5 h-3.5" />
          AI Scenography & Visual Identity
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">AI Event Theme Generator</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Describe any dream mood or aesthetic. EventEase AI will assemble harmonized color palettes, stage backdrops, attire guidance, and photography lighting.
        </p>
      </div>

      {/* Prompt Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-sm mb-10">
        <form onSubmit={handleGenerateTheme} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Sparkles className="w-4 h-4 text-amber-600 absolute left-3.5 top-3.5" />
            <input
              type="text"
              id="theme-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Royal South Indian temple wedding with brass lamps and lotus blooms"
              className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            id="theme-generate-btn"
            disabled={isGenerating}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Designing Aesthetic...' : 'Generate Theme'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
          <span className="font-bold text-stone-700">Try popular prompts:</span>
          {[
            'Emerald & Gold Rajputana Wedding',
            'Lavender Sunset Rooftop Reception',
            'Vibrant Sunflowers & Marigold Haldi',
            'Pastel Peach Baby Shower',
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPrompt(item)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Theme Selection Carousel / Grid */}
      <div className="mb-10">
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">Or Choose from Curated Collections</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {POPULAR_THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => setActiveTheme(th)}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                activeTheme.id === th.id
                  ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-1 mb-2">
                {th.colorPalette.map((c, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <div className="font-serif font-bold text-xs sm:text-sm text-stone-900">{th.name}</div>
              <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{th.tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Theme Detailed Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Theme Spotlight
            </div>
            <h2 className="font-serif text-3xl font-bold text-stone-900">{activeTheme.name}</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">{activeTheme.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={applyThemeToEvent}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Apply to Current Event</span>
            </button>
          </div>
        </div>

        {appliedNotification && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Theme successfully saved as your primary event aesthetic! AI Planner is updated.</span>
          </div>
        )}

        {/* Color Palette Swatches */}
        <div>
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Harmonized Color Palette</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeTheme.colorPalette.map((col, i) => (
              <div
                key={i}
                onClick={() => copyHex(col.hex)}
                className="group p-3 rounded-2xl border border-stone-200 hover:border-stone-400 cursor-pointer transition-all bg-white flex flex-col justify-between"
              >
                <div
                  className="h-16 rounded-xl w-full mb-2.5 border border-black/5 shadow-inner"
                  style={{ backgroundColor: col.hex }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900">{col.name}</div>
                    <div className="text-[11px] font-mono text-stone-500">{col.hex}</div>
                  </div>
                  <span className="p-1.5 text-stone-400 group-hover:text-stone-700">
                    {copiedHex === col.hex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenic Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
              <Flower2 className="w-4 h-4" />
              <span>Stage & Entrance Decor</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">{activeTheme.stageDesign}</p>
            <p className="text-xs text-stone-500 leading-relaxed pt-1">{activeTheme.entranceDesign}</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              <span>Attire & Styling Direction</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">{activeTheme.dressSuggestions}</p>
            <p className="text-xs text-stone-500 leading-relaxed pt-1">
              <strong>Makeup:</strong> {activeTheme.makeupSuggestions}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Photography & Lighting Mood</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">{activeTheme.photoStyle}</p>
            <p className="text-xs text-stone-500 leading-relaxed pt-1">
              <strong>Lighting Kelvin:</strong> {activeTheme.lightingStyle}
            </p>
          </div>
        </div>

        {/* Footer Next Step */}
        <div className="flex items-center justify-between bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
          <span className="text-xs text-amber-950 font-medium">
            Ready to find decorators in {activeEvent.location} who specialize in {activeTheme.name}?
          </span>
          <button
            onClick={() => setActiveTab('vendors')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Find Matching Decorators →
          </button>
        </div>
      </div>
    </div>
  );
};
