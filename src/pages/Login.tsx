import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, CalendarDays, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent, role: 'student' | 'admin' = 'student') => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
      login(role, name, email);
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-8 bg-surface relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
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
              src="https://picsum.photos/seed/campus-night/800/1200" 
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
              Welcome back to your <span className="text-white/80 italic">Campus Hub.</span>
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-lg">
              Stay updated with events, manage your RSVPs, and connect with your college community.
            </p>
          </div>

          <div className="relative pt-12 border-t border-white/10">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm text-slate-400">Join 2,000+ students active today.</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8 sm:p-16">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Login</h1>
            <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@college.edu"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:bg-[#16213e] dark:border-[#2a2a3e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Password</label>
                <button type="button" className="text-xs font-bold text-slate-900 dark:text-white hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:bg-[#16213e] dark:border-[#2a2a3e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center"
            >
              {isLoading ? 'Authenticating...' : 'Login as Student'}
              {!isLoading && <ArrowRight size={20} className="ml-2" />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-[#2a2a3e]"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#1a1a2e] px-2 text-slate-400 dark:text-slate-500 font-bold">Or Admin Access</span></div>
            </div>

            <button 
              type="button"
              onClick={(e) => handleSubmit(e as any, 'admin')}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center"
            >
              <ShieldCheck size={20} className="mr-2" /> Login as Faculty
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account? <Link to="/signup" className="text-slate-900 dark:text-white font-bold hover:underline">Sign up now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
