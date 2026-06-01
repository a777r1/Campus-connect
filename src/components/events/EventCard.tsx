import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { Event } from '../../types';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'horizontal';
}

const EventCard: React.FC<EventCardProps> = ({ event, variant = 'default' }) => {
  const { user } = useAuth();
  const isFull = event.attendees.length >= event.capacity;
  const isRSVPed = user && event.attendees.includes(user.id);

  if (variant === 'horizontal') {
    return (
      <motion.div 
        whileHover={{ x: 5 }}
        className="flex bg-white dark:bg-[#1a1a2e] rounded-2xl border border-slate-100 dark:border-[#2a2a3e] premium-shadow overflow-hidden group"
      >
        <div className="w-32 sm:w-48 h-full relative overflow-hidden">
          <img 
            src={event.bannerImage} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 left-2 bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            {event.category}
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                <Calendar size={14} className="mr-2 text-slate-500 dark:text-slate-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                <MapPin size={14} className="mr-2 text-slate-500 dark:text-slate-400" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {event.capacity - event.attendees.length} seats left
            </span>
            <Link 
              to={`/events/${event.id}`}
              className="text-slate-900 dark:text-white font-bold text-sm flex items-center group/link"
            >
              Details <ArrowRight size={16} className="ml-1 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img 
          src={event.bannerImage} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white shadow-sm">
          {event.category}
        </div>
        {isFull && !isRSVPed && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
            Housefull
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-900 dark:text-white mb-2">
            <Clock size={14} />
            <span>{event.date} • {event.time}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mb-3 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-[#2a2a3e]">
          <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
            <MapPin size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
              <Users size={16} className="mr-2 text-slate-500 dark:text-slate-400" />
              <span>{event.attendees.length} / {event.capacity}</span>
            </div>
            <Link 
              to={`/events/${event.id}`}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                isRSVPed 
                  ? "bg-green-50 text-green-600 border border-green-100" 
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/10"
              )}
            >
              {isRSVPed ? 'RSVPed' : 'View Details'}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
