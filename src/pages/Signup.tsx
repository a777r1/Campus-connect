import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, CalendarDays, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    setIsLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password, 'student');
      showToast("Account created successfully!", "success");
      navigate('/');
    } catch (err: any) {
      showToast(err.message || "Signup failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-8 bg-surface relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#1a1a2e] rounded-[2.5rem] overflow-hidden premium-shadow border border-slate-100 dark:border-[#2a2a3e] relative z-10"
      >
        {/* Left: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://picsum.photos/seed/campus-day/800/1200" 
              alt="Campus" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-primary/20" />
          </div>
          
          <div className="relative">
            <Link to="/" className="flex items-center space-x-2 mb-12">
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white">
                <CalendarDays size={24} />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight">
                Campus<span className="text-white/80">Connect</span>
              </span>
            </Link>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Start your <span className="text-white/80 italic">Campus Journey</span> today.
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-lg">
              Join thousands of students and faculty members in the ultimate campus event ecosystem.
            </p>
          </div>

          <div className="relative space-y-6">
            {[
              { icon: GraduationCap, text: 'Exclusive student events' },
              { icon: CalendarDays, text: 'Real-time event tracking' },
              { icon: Lock, text: 'Secure RSVP system' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <item.icon size={18} className="text-white/80" />
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8 sm:p-16">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400">Join the community and start exploring</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:bg-[#16213e] dark:border-[#2a2a3e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@college.edu"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:bg-[#16213e] dark:border-[#2a2a3e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:bg-[#16213e] dark:border-[#2a2a3e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:bg-[#16213e] dark:border-[#2a2a3e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="text-xs text-slate-500 dark:text-slate-400">I agree to the <button type="button" className="text-slate-900 dark:text-white font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-slate-900 dark:text-white font-bold hover:underline">Privacy Policy</button></span>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={20} className="ml-2" />}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="text-slate-900 dark:text-white font-bold hover:underline">Login now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
