import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

interface EventCountdownProps {
  targetDate: string; // ISO date string like "2026-04-15"
  targetTime: string; // Time string like "10:00 AM"
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseEventDate(dateStr: string, timeStr: string): Date {
  // Parse "10:00 AM" format
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let h = hours;
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  
  const date = new Date(dateStr);
  date.setHours(h, minutes, 0, 0);
  return date;
}

export default function EventCountdown({ targetDate, targetTime }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = parseEventDate(targetDate, targetTime);

    const update = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (isExpired) {
    return (
      <div className="bg-slate-100 dark:bg-[#16213e] p-6 rounded-2xl">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-2">
          <Clock size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Event Status</span>
        </div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">Event has started or ended</p>
      </div>
    );
  }

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#16213e] p-6 rounded-2xl border border-slate-100 dark:border-[#2a2a3e]">
      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-4">
        <Clock size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">Starts In</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {blocks.map((block) => (
          <div key={block.label} className="text-center">
            <motion.div
              key={block.value}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-[#1a1a2e] rounded-xl p-3 border border-slate-100 dark:border-[#2a2a3e] shadow-sm"
            >
              <span className="text-2xl font-display font-bold text-slate-900 dark:text-white tabular-nums">
                {String(block.value).padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 block">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
