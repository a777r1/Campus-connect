import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ImageIcon, 
  Upload, 
  Calendar, 
  MapPin, 
  Users, 
  Type, 
  Tag, 
  Link as LinkIcon,
  CheckCircle2,
  X,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreateEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    category: 'Academic',
    organiser: '',
    capacity: '',
    description: '',
    registrationLink: '',
    bannerImage: null as File | null,
  });

  const categories = ['Academic', 'Social', 'Sports', 'Workshop', 'Cultural'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-[#1a1a2e] p-12 rounded-[2.5rem] border border-slate-100 dark:border-[#2a2a3e] premium-shadow"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Event Created Successfully!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10">Your event has been published and is now visible to all students on the platform.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button 
              onClick={() => setIsSuccess(false)}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
            >
              Create Another
            </button>
            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
              View Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Create New Event</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Fill in the details to host a new campus experience</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-[#1a1a2e] p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-[#2a2a3e] premium-shadow space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                  <Type size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> Event Title
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Annual Tech Symposium 2026"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] dark:bg-[#16213e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                    <Calendar size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> Date
                  </label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] dark:bg-[#16213e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                    <Clock size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> Time
                  </label>
                  <input 
                    type="time" 
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] dark:bg-[#16213e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                  <MapPin size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> Venue
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Main Auditorium, Block C"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] dark:bg-[#16213e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                  <ImageIcon size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> Description
                </label>
                <div className="bg-white dark:bg-[#16213e] rounded-2xl border border-slate-200 dark:border-[#2a2a3e] overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <ReactQuill 
                    theme="snow"
                    value={formData.description}
                    onChange={value => setFormData({...formData, description: value})}
                    placeholder="Tell students what this event is about..."
                    className="h-64 border-none"
                  />
                </div>
                <style>{`
                  .quill { border: none !important; }
                  .ql-toolbar { border: none !important; border-bottom: 1px solid #f1f5f9 !important; padding: 12px !important; }
                  .ql-container { border: none !important; font-family: inherit !important; font-size: 1rem !important; }
                  .ql-editor { min-height: 200px; color: #1e293b !important; }
                  .ql-editor.ql-blank::before { color: #94a3b8 !important; font-style: normal !important; }
                  .dark .ql-toolbar { border-bottom-color: #2a2a3e !important; }
                  .dark .ql-toolbar .ql-stroke { stroke: #94a3b8 !important; }
                  .dark .ql-toolbar .ql-fill { fill: #94a3b8 !important; }
                  .dark .ql-toolbar .ql-picker-label { color: #94a3b8 !important; }
                  .dark .ql-editor { color: #ffffff !important; }
                  .dark .ql-editor.ql-blank::before { color: #64748b !important; }
                `}</style>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a1a2e] p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Additional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                  <Tag size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> Category
                </label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white dark:bg-[#16213e] dark:text-white"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                  <Users size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> Capacity
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 100"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] dark:bg-[#16213e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                  <LinkIcon size={16} className="mr-2 text-slate-600 dark:text-slate-400" /> External Registration Link (Optional)
                </label>
                <input 
                  type="url" 
                  placeholder="https://forms.gle/..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-[#2a2a3e] dark:bg-[#16213e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.registrationLink}
                  onChange={e => setFormData({...formData, registrationLink: e.target.value})}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Media & Submit */}
        <aside className="space-y-8">
          <div className="sticky top-24 space-y-8">
            {/* Banner Upload */}
            <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-[2rem] border border-slate-100 dark:border-[#2a2a3e] premium-shadow">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Event Banner</label>
              <div className={cn(
                "relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#2a2a3e] flex flex-col items-center justify-center transition-all overflow-hidden",
                formData.bannerImage ? "border-primary/50" : "hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-[#16213e]"
              )}>
                {formData.bannerImage ? (
                  <>
                    <img 
                      src={URL.createObjectURL(formData.bannerImage)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, bannerImage: null})}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-100 dark:bg-[#16213e] text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center mb-4">
                      <Upload size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Click to upload banner</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Recommended: 1200x600px</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={e => setFormData({...formData, bannerImage: e.target.files?.[0] || null})}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Organiser Info */}
            <div className="bg-slate-900 dark:bg-black p-8 rounded-[2rem] text-white">
              <label className="block text-sm font-bold text-slate-400 mb-4">Organising Body</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Student Union"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-primary transition-all text-white placeholder:text-slate-500"
                value={formData.organiser}
                onChange={e => setFormData({...formData, organiser: e.target.value})}
              />
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                By creating this event, you agree to follow the campus event guidelines and safety protocols.
              </p>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-5 rounded-[2rem] font-bold text-lg transition-all shadow-2xl shadow-slate-900/30 dark:shadow-white/10",
                isSubmitting ? "bg-slate-400 cursor-not-allowed text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-1"
              )}
            >
              {isSubmitting ? 'Creating Event...' : 'Publish Event'}
            </button>
          </div>
        </aside>
      </form>
    </motion.div>
  );
}
