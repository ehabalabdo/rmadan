
import React from 'react';
import { motion } from 'framer-motion';
import { RAMADAN_SERIES_2026 } from '../constants';
import { Clock, TvIcon } from './Icons';

const SeriesSection: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-amber-400">دراما 2026</h1>
        <p className="text-slate-500 text-sm">لمحة حصرية عن مسلسلات رمضان القادم</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {RAMADAN_SERIES_2026.map(series => (
          <motion.div 
            key={series.id} 
            variants={item}
            className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl transition-all"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <img 
                src={series.image} 
                alt={series.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
              <div className="absolute top-6 left-6">
                <span className="bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black shadow-2xl flex items-center gap-1.5">
                  <Clock size={12} />
                  قريباً
                </span>
              </div>
            </div>
            
            <div className="p-8 -mt-10 relative">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black text-white">{series.title}</h3>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <TvIcon size={16} className="text-amber-400" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[10px] font-black text-amber-400/80 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-lg">
                  {series.genre}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  {series.channel}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="p-8 rounded-[2rem] bg-slate-900/40 border border-dashed border-slate-800 text-center"
      >
        <p className="text-slate-600 text-xs font-bold leading-relaxed italic">
          * سيتم ربط هذه القسم بمحرك البحث لجلب التفاصيل فور توفرها رسمياً
        </p>
      </motion.div>
    </div>
  );
};

export default SeriesSection;
