import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import EventCard from '../components/events/EventCard';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const featuredEvents = MOCK_EVENTS.slice(0, 3);
  const upcomingHighlights = MOCK_EVENTS.slice(1, 4);

  const stats = [
    { label: 'Active Events', value: '24', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total RSVPs', value: '1.2k', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Societies', value: '12', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Memories', value: '450+', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] bg-slate-900 dark:bg-black overflow-hidden mb-16">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/campus/1920/1080" 
            alt="Campus" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>
        
        <div className="relative px-8 sm:px-16 py-16 sm:py-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8 border border-white/20 backdrop-blur-sm">
              Discover the Pulse of Your University
            </span>
            <h1 className="text-5xl sm:text-7xl font-display font-bold text-white mb-8 leading-tight tracking-tight">
              Your Campus, <br />
              <span className="text-white/80 italic animate-pulse">Refined.</span>
            </h1>
            <p className="text-slate-300 text-lg mb-12 max-w-xl leading-relaxed font-medium">
              Join thousands of students in discovering exclusive workshops, legendary festivals, and high-stakes sports events. Elevate your university journey today.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/events" 
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center shadow-xl shadow-white/20"
              >
                Explore Events <ArrowRight size={20} className="ml-2" />
              </Link>
              {!user && (
                <Link 
                  to="/signup" 
                  className="bg-white/10 text-white backdrop-blur border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all text-center"
                >
                  Join the Community
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Stats Grid */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl border border-slate-100 dark:border-[#2a2a3e] premium-shadow"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
                    <stat.icon className={stat.color} size={20} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Featured Events */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Events</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Handpicked experiences for you</p>
              </div>
              <Link to="/events" className="text-slate-900 dark:text-white font-bold flex items-center hover:underline">
                View All <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Academic', 'Social', 'Sports', 'Workshop', 'Cultural'].map((cat) => (
                <Link 
                  key={cat}
                  to={`/events?category=${cat}`}
                  className="group relative h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#16213e]"
                >
                  <img 
                    src={`https://picsum.photos/seed/${cat}/400/300`} 
                    alt={cat}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-lg">
                    {cat}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Upcoming Highlights */}
          <section className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
            <div className="flex items-center space-x-2 mb-8">
              <TrendingUp className="text-slate-900 dark:text-white" size={24} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Highlights</h2>
            </div>
            <div className="space-y-6">
              {upcomingHighlights.map((event) => (
                <Link 
                  key={event.id} 
                  to={`/events/${event.id}`}
                  className="flex items-start space-x-4 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={event.bannerImage} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mt-1">
                      <Calendar size={12} className="mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      <MapPin size={12} className="mr-1" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-slate-100 dark:border-[#2a2a3e] text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#16213e] transition-colors">
              View Full Calendar
            </button>
          </section>

          {/* Quick Reminders */}
          {user && (
            <section className="bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Next Event</h2>
              <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl shadow-sm border border-primary/10">
                <div className="flex items-center space-x-3 text-slate-900 dark:text-white mb-3">
                  <Clock size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Starting in 2h</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{MOCK_EVENTS[0].title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{MOCK_EVENTS[0].venue}</p>
              </div>
            </section>
          )}
        </aside>
      </div>
    </motion.div>
  );
}

