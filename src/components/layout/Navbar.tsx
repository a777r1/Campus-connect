import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Image as ImageIcon, 
  PlusCircle, 
  Bell, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleThemeToggle = () => {
    document.documentElement.classList.add('transitioning');
    toggleTheme();
    setTimeout(() => {
      document.documentElement.classList.remove('transitioning');
    }, 350);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200/50 dark:border-[#2a2a3e]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10 group-hover:scale-110 transition-transform">
              <CalendarDays size={24} />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
              Campus<span className="text-slate-500 dark:text-slate-400">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                  isActive(link.path) 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#16213e] hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-[#16213e]"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {isAdmin && (
              <Link
                to="/admin/events/create"
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center space-x-2 shadow-lg shadow-slate-900/20 dark:shadow-white/10"
              >
                <PlusCircle size={18} />
                <span>Create Event</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-[#2a2a3e]">
                <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1a2e]"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="text-right hover:opacity-80 transition-opacity">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Login</Link>
                <Link to="/signup" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={handleThemeToggle}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#1a1a2e] border-t border-slate-100 dark:border-[#2a2a3e] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-medium",
                    isActive(link.path) 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <link.icon size={20} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-[#2a2a3e] mt-4 space-y-2">
                {isAdmin && (
                  <Link
                    to="/admin/events/create"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl text-center font-semibold block"
                  >
                    Create Event
                  </Link>
                )}
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full border border-slate-200 dark:border-[#2a2a3e] text-slate-900 dark:text-white px-4 py-3 rounded-xl text-center font-semibold block">Login</Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl text-center font-semibold block">Sign Up</Link>
                  </>
                ) : (
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full text-red-500 px-4 py-3 rounded-xl text-center font-semibold block border border-red-100 dark:border-red-900"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
