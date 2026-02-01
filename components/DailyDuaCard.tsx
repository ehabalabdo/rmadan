
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RAMADAN_DAILY_DUAS } from '../constants';
import { Quote, ChevronLeft, SparklesIcon } from './Icons';
import { ChevronRight } from 'lucide-react';

const DailyDuaCard: React.FC = () => {
  // Logic to determine current Ramadan Day (Simulation)
  // For a real app, this would be calculated from the current Hijri date.
  const [currentDay, setCurrentDay] = useState(1);

  const nextDay = () => setCurrentDay(prev => prev < 30 ? prev + 1 : 1);
  const prevDay = () => setCurrentDay(prev => prev > 1 ? prev - 1 : 30);

  const selectedDua = RAMADAN_DAILY_DUAS[currentDay - 1];

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-amber-400 font-black text-xs uppercase tracking-[0.3em]">دعاء أيام الشهر الفضيل</h3>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          <button onClick={prevDay} className="p-1.5 hover:text-amber-400 transition-colors">
            <ChevronRight size={16} />
          </button>
          <span className="text-xs font-black min-w-[50px] text-center">اليوم {currentDay}</span>
          <button onClick={nextDay} className="p-1.5 hover:text-amber-400 transition-colors">
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDay}
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote size={80} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400">
               <SparklesIcon size={20} />
            </div>
            <p className="text-xl font-bold leading-relaxed text-white">
              {selectedDua.text}
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentDay / 30) * 100}%` }}
              className="h-full bg-amber-400 shadow-[0_0_10px_#fbbf24]"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DailyDuaCard;
