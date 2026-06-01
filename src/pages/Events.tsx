import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  LayoutList, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../constants';
import EventCard from '../components/events/EventCard';
import EventCalendar from '../components/events/EventCalendar';
import SearchAutocomplete from '../components/events/SearchAutocomplete';
import { cn } from '../lib/utils';

export default function Events() {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Academic', 'Social', 'Sports', 'Workshop', 'Cultural'];

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Explore Events</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Discover what's happening around campus</p>
        </div>

        <div className="flex items-center bg-white dark:bg-[#1a1a2e] p-1.5 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] shadow-sm">
          <button 
            onClick={() => setViewMode('timeline')}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              viewMode === 'timeline' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <LayoutList size={18} />
            <span>Timeline</span>
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              viewMode === 'calendar' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <CalendarIcon size={18} />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="md:col-span-2">
          <SearchAutocomplete 
            events={MOCK_EVENTS} 
            value={searchQuery} 
            onChange={setSearchQuery} 
          />
        </div>
        <div className="md:col-span-2 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                selectedCategory === cat 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10" 
                  : "bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e] text-slate-600 dark:text-slate-400 hover:border-slate-500 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'timeline' ? (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12 relative before:absolute before:left-4 sm:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-[#2a2a3e]"
          >
            {filteredEvents.map((event, idx) => (
              <div key={event.id} className={cn(
                "relative flex flex-col sm:flex-row items-center",
                idx % 2 === 0 ? "sm:flex-row-reverse" : ""
              )}>
                {/* Timeline Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 dark:bg-white border-4 border-white dark:border-[#1a1a2e] shadow-sm z-10" />
                
                {/* Content Area */}
                <div className="w-full sm:w-[45%] pl-12 sm:pl-0">
                  <EventCard event={event} />
                </div>
                
                {/* Date Label (Desktop) */}
                <div className={cn(
                  "hidden sm:block w-[45%] px-8",
                  idx % 2 === 0 ? "text-right" : "text-left"
                )}>
                  <div className="inline-block">
                    <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-xs">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-dashed border-slate-300 dark:border-[#2a2a3e]">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No events found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white dark:bg-[#1a1a2e] rounded-[2.5rem] border border-slate-200 dark:border-[#2a2a3e] premium-shadow overflow-hidden"
          >
            <EventCalendar events={filteredEvents} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
