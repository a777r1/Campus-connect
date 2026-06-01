import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Download as LucideDownload,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import EventCountdown from '../components/events/EventCountdown';
import ShareModal from '../components/ui/ShareModal';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const event = MOCK_EVENTS.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Event not found</h2>
        <Link to="/events" className="text-slate-900 dark:text-white mt-4 inline-block font-bold">Back to Events</Link>
      </div>
    );
  }

  const isFull = event.attendees.length >= event.capacity;
  const isRSVPed = user && event.attendees.includes(user.id);

  const handleRSVP = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsRSVPing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRSVPing(false);
      // In a real app, we'd update the state/Firestore here
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 font-bold text-sm"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Event Info */}
        <div className="lg:col-span-2 space-y-12">
          {/* Banner */}
          <div className="relative h-[300px] sm:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-black/20">
            <img 
              src={event.bannerImage} 
              alt={event.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-slate-900/20 dark:shadow-white/10">
                {event.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-white leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: 'Date', value: event.date },
              { icon: Clock, label: 'Time', value: event.time },
              { icon: MapPin, label: 'Venue', value: event.venue },
              { icon: Users, label: 'Capacity', value: `${event.attendees.length} / ${event.capacity}` },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
                <item.icon className="text-slate-600 dark:text-slate-400 mb-3" size={20} />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <section className="bg-white dark:bg-[#1a1a2e] p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About the Event</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-lg mt-6 leading-relaxed">
                Organised by <span className="font-bold text-slate-900 dark:text-white">{event.organiser}</span>. 
                This event is open to all students and faculty members. Please ensure you RSVP in advance to secure your spot.
              </p>
            </div>
          </section>

          {/* Gallery Preview */}
          {event.gallery && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Event Gallery</h2>
                <Link to="/gallery" className="text-slate-900 dark:text-white font-bold flex items-center hover:underline">
                  View Full Gallery <ArrowRight size={18} className="ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.gallery.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setPhotoIndex(idx); setLightboxOpen(true); }}
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={img} 
                      alt={`Gallery ${idx}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white" size={24} />
                    </div>
                  </div>
                ))}
              </div>

              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={photoIndex}
                slides={event.gallery.map(src => ({ src }))}
                plugins={[Download, Zoom]}
              />
            </section>
          )}
        </div>

        {/* Right: RSVP & Actions */}
        <aside className="space-y-8">
          <div className="sticky top-24 space-y-8">
            {/* RSVP Card */}
            <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-[2rem] border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Registration Open</span>
                </div>
                <button 
                  onClick={() => setIsShareOpen(true)}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors hover:bg-slate-100 dark:hover:bg-[#16213e] rounded-xl"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <EventCountdown targetDate={event.date} targetTime={event.time} />
              </div>

              <div className="mb-8">
                <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">Free Entry</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Limited seats available</p>
              </div>

              <div className="space-y-4">
                {isRSVPed ? (
                  <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center space-x-3">
                    <CheckCircle2 className="text-green-600" size={24} />
                    <div>
                      <p className="text-sm font-bold text-green-900">You're Registered!</p>
                      <p className="text-xs text-green-700">Check your email for details.</p>
                    </div>
                  </div>
                ) : isFull ? (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center space-x-3">
                    <AlertCircle className="text-red-600" size={24} />
                    <div>
                      <p className="text-sm font-bold text-red-900">Housefull</p>
                      <p className="text-xs text-red-700">Capacity reached for this event.</p>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleRSVP}
                    disabled={isRSVPing || isFull}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10",
                      isRSVPing || isFull ? "bg-slate-400 cursor-not-allowed shadow-none text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                    )}
                  >
                    {isRSVPing ? 'Processing...' : isFull ? 'Housefull' : 'RSVP Now'}
                  </button>
                )}

                {event.registrationLink && (
                  <a 
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-2xl font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2a3e] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#16213e] transition-all"
                  >
                    External Registration <ExternalLink size={18} className="ml-2" />
                  </a>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-[#2a2a3e]">
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Attendees</span>
                  <span className="text-slate-900 dark:text-white font-bold">{event.attendees.length} / {event.capacity}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-[#16213e] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 dark:bg-white transition-all duration-1000" 
                    style={{ width: `${(event.attendees.length / event.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Organiser Card */}
            <div className="bg-slate-900 dark:bg-black p-8 rounded-[2rem] text-white">
              <h3 className="text-lg font-bold mb-6">Organiser</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                  {event.organiser.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{event.organiser}</p>
                  <p className="text-xs text-slate-400">Official Campus Society</p>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold">
                Contact Organiser
              </button>
            </div>
          </div>
        </aside>
      </div>

      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        title={event.title} 
      />
    </motion.div>
  );
}
