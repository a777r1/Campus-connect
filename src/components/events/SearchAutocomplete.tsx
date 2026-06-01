import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SearchAutocompleteProps {
  events: Event[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchAutocomplete({ events, value, onChange, placeholder }: SearchAutocompleteProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = value.trim().length >= 2
    ? events.filter(e =>
        e.title.toLowerCase().includes(value.toLowerCase()) ||
        e.description.toLowerCase().includes(value.toLowerCase()) ||
        e.organiser.toLowerCase().includes(value.toLowerCase()) ||
        e.venue.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
    : [];

  const showDropdown = isFocused && suggestions.length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10" size={20} />
      <input 
        ref={inputRef}
        type="text" 
        placeholder={placeholder || "Search events, topics, or organisers..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:focus:ring-white/10 focus:border-slate-400 dark:focus:border-slate-500 transition-all"
      />
      {value && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a2e] rounded-2xl border border-slate-200 dark:border-[#2a2a3e] shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2 space-y-1">
              {suggestions.map(event => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#16213e] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={event.bannerImage} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-slate-700 dark:group-hover:text-slate-200">
                      {event.title}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                        <Calendar size={10} className="mr-1" />{event.date}
                      </span>
                      <span className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                        <MapPin size={10} className="mr-1" />{event.venue}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
