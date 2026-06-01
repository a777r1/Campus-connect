import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-slate-200/50 dark:bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-slate-300/30 dark:bg-white/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* Animated 404 */}
        <motion.div
          animate={{ 
            rotateY: [0, 360],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
          className="inline-block mb-8"
        >
          <span className="text-[10rem] font-display font-black text-slate-200 dark:text-[#1a1a2e] leading-none select-none">
            404
          </span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">
          Looks like this event was cancelled, or the page never existed. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/"
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center shadow-xl"
          >
            <Home size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 rounded-2xl font-bold border border-slate-200 dark:border-[#2a2a3e] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#16213e] transition-all flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
