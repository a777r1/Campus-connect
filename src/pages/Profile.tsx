import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  LogOut, 
  Mail, 
  Shield, 
  Settings, 
  Edit3,
  ArrowRight,
  Clock,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_EVENTS } from '../constants';
import EventCard from '../components/events/EventCard';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Please log in</h2>
        <Link to="/login" className="text-slate-900 dark:text-white font-bold hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  // Mock RSVP'd events (events where user is an attendee)
  const rsvpEvents = MOCK_EVENTS.filter(e => e.attendees.includes(user.id));
  const totalRSVPs = rsvpEvents.length;
  const upcomingEvents = MOCK_EVENTS.slice(0, 2);

  const stats = [
    { label: 'Events RSVPed', value: totalRSVPs.toString(), icon: Calendar },
    { label: 'Photos Shared', value: '12', icon: Camera },
    { label: 'Days Active', value: '45', icon: Clock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Profile Header */}
      <section className="relative bg-slate-900 dark:bg-black rounded-[2.5rem] overflow-hidden mb-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
        </div>
        
        <div className="relative px-8 sm:px-16 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-800">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-200 text-slate-900 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Edit3 size={16} />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                  {user.name}
                </h1>
                {isAdmin && (
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/80 uppercase tracking-wider flex items-center space-x-1">
                    <Shield size={12} />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-4 text-slate-400 text-sm">
                <span className="flex items-center space-x-1">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </span>
                <span className="capitalize flex items-center space-x-1">
                  <Settings size={14} />
                  <span>{user.role}</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all border border-white/10">
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/10"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-center"
              >
                <stat.icon className="mx-auto mb-2 text-white/60" size={20} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* RSVP'd Events */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Events</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Events you've RSVPed to</p>
              </div>
              <Link to="/events" className="text-slate-900 dark:text-white font-bold flex items-center hover:underline text-sm">
                Browse All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            {rsvpEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {rsvpEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-dashed border-slate-300 dark:border-[#2a2a3e]">
                <Calendar className="mx-auto mb-4 text-slate-300 dark:text-slate-600" size={48} />
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">No RSVPs yet</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Discover exciting events happening on campus</p>
                <Link
                  to="/events"
                  className="inline-flex items-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                >
                  Explore Events <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            )}
          </section>

          {/* Recommended Events */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/gallery"
                className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#16213e] transition-all group"
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-[#16213e] rounded-xl flex items-center justify-center">
                  <ImageIcon size={18} className="text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">View Gallery</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Browse campus memories</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
              </Link>
              <Link
                to="/events"
                className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#16213e] transition-all group"
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-[#16213e] rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Explore Events</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Find what's next</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/events/create"
                  className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#16213e] transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-[#16213e] rounded-xl flex items-center justify-center">
                    <Edit3 size={18} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Create Event</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Host a new event</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                </Link>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Account</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Email</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Member Since</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Jan 2026</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-[#2a2a3e] text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#16213e] transition-colors">
              Account Settings
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
