import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  User,
  Bot,
  Minimize2,
  Maximize2,
  CornerDownLeft,
} from 'lucide-react';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatAssistant: React.FC = () => {
  const { activeEvent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'assistant',
      content: `Namaste! I am your **EventEase AI Event Planner** ✨\n\nI can help you coordinate vendors, optimize your budget, create meal schedules, and pick auspicious timings for your **${activeEvent.eventType}**. How can I help you today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          eventContext: activeEvent,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'For an event with ' +
              activeEvent.guests +
              ' guests, we recommend booking your venue at least 6 months in advance and reserving 35% of your total budget for catering.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I had trouble connecting to the planning server. In general, allocate 30% for venue, 35% for catering, and 15% for decor.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How should I divide my budget?',
    'What are typical caterer rates?',
    'Sample 1-day wedding schedule',
    'Tips to save 15% on hall & decor',
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-stone-950 text-white rounded-full shadow-2xl border border-amber-400/40 hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <span className="text-xs font-bold font-sans tracking-wide">Ask EventEase AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm">EventEase AI Concierge</h3>
                <p className="text-[10px] text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online • Powered by Gemini
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Strip */}
          <div className="bg-stone-50 border-b border-stone-100 p-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-medium text-stone-700 whitespace-nowrap cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#faf8f5]/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 text-[10px] font-bold mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-800 flex items-center justify-center shrink-0 text-[10px] font-bold mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-200" />
                <span>Formulating recommendation...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-stone-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about caterers, budget split, timeline..."
                className="flex-1 text-xs border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold rounded-xl cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
