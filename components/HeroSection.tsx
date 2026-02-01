
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAmmanPrayerTimes } from '../services/prayerService';
import { PrayerTimes } from '../types';
import { SunIcon, MoonIcon, MapPinIcon } from './Icons';

const HeroSection: React.FC = () => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [countdown, setCountdown] = useState<string>('00:00:00');
  const [status, setStatus] = useState<'iftar' | 'imsak'>('iftar');
  const [loading, setLoading] = useState(true);

  const skyPhase = useMemo(() => {
    if (!times) return 'night';
    const now = new Date();
    const currentHour = now.getHours();
    
    const [fajrHour] = times.Fajr.split(':').map(Number);
    const [maghribHour] = times.Maghrib.split(':').map(Number);

    if (currentHour >= fajrHour - 1 && currentHour < fajrHour + 1) return 'dawn';
    if (currentHour >= fajrHour + 1 && currentHour < maghribHour - 1) return 'day';
    if (currentHour >= maghribHour - 1 && currentHour <= maghribHour + 1) return 'sunset';
    return 'night';
  }, [times]);

  const gradients = {
    dawn: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    day: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    night: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  };

  useEffect(() => {
    fetchAmmanPrayerTimes().then(data => {
      setTimes(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!times) return;

    const timer = setInterval(() => {
      const now = new Date();
      const [fajrHour, fajrMin] = times.Fajr.split(':').map(Number);
      const [maghribHour, maghribMin] = times.Maghrib.split(':').map(Number);

      const fajrDate = new Date(now);
      fajrDate.setHours(fajrHour, fajrMin, 0);

      const maghribDate = new Date(now);
      maghribDate.setHours(maghribHour, maghribMin, 0);

      let targetDate: Date;
      let currentStatus: 'iftar' | 'imsak';

      if (now > fajrDate && now < maghribDate) {
        targetDate = maghribDate;
        currentStatus = 'iftar';
      } else {
        currentStatus = 'imsak';
        if (now > maghribDate) {
          targetDate = new Date(now);
          targetDate.setDate(now.getDate() + 1);
          targetDate.setHours(fajrHour, fajrMin, 0);
        } else {
          targetDate = fajrDate;
        }
      }

      setStatus(currentStatus);
      const diff = targetDate.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [times]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-amber-400 rounded-full blur-xl"
        />
        <p className="text-amber-200/60 font-black mt-4 text-xs tracking-widest animate-pulse">جاري تحديث السماء...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={false}
      animate={{ background: gradients[skyPhase as keyof typeof gradients] }}
      transition={{ duration: 3, ease: "easeInOut" }}
      className="relative overflow-hidden rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10"
    >
      {/* Stars for night mode */}
      {skyPhase === 'night' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 5 }}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mb-10 bg-black/20 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/10 relative z-10">
        <MapPinIcon size={14} className="text-amber-300" />
        <span className="text-[10px] font-black text-white uppercase tracking-tighter">عمان، الأردن</span>
      </div>

      <div className="flex flex-col items-center text-center space-y-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={status}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="p-8 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 shadow-inner"
          >
            {status === 'iftar' ? (
              <SunIcon size={64} className="text-amber-100 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
            ) : (
              <MoonIcon size={64} className="text-blue-50 drop-shadow-[0_0_20px_rgba(186,230,253,0.5)]" />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="space-y-3">
          <h2 className="text-sm font-black text-white/80 uppercase tracking-[0.4em] drop-shadow-md">
            {status === 'iftar' ? 'متبقي للإفطار' : 'متبقي للإمساك'}
          </h2>
          <motion.div 
            key={countdown}
            className="text-7xl font-black tracking-tighter text-white drop-shadow-2xl tabular-nums"
          >
            {countdown}
          </motion.div>
        </div>

        {times && (
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            <div className="p-4 bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/5">
              <span className="block text-[10px] font-black text-white/50 uppercase mb-1">الفجر</span>
              <span className="text-xl font-black text-white">{times.Fajr}</span>
            </div>
            <div className="p-4 bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/5">
              <span className="block text-[10px] font-black text-white/50 uppercase mb-1">المغرب</span>
              <span className="text-xl font-black text-white">{times.Maghrib}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HeroSection;
