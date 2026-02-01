
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VALIDATED_DUAS } from '../constants';
import { Dua } from '../types';
import { Quote, BookOpenIcon } from './Icons';

const DuaSection: React.FC = () => {
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const categories = Array.from(new Set(VALIDATED_DUAS.map(d => d.category)));

  const getRandomDua = (cat: string) => {
    const filtered = VALIDATED_DUAS.filter(d => d.category === cat);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setSelectedDua(filtered[randomIndex]);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-amber-400">حصن المسلم</h1>
        <p className="text-slate-500 text-sm">أذكار مأثورة من الكتاب والسنة</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => getRandomDua(cat)}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-400/50 hover:text-amber-400 transition-colors font-bold text-sm shadow-xl flex items-center justify-center text-center"
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedDua ? (
          <motion.div 
            key={selectedDua.id}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
          >
            <Quote size={64} className="absolute -top-4 -right-4 opacity-10 rotate-12" />
            <p className="text-2xl font-black leading-relaxed mb-8 text-center drop-shadow-sm">
              {selectedDua.text}
            </p>
            <div className="flex flex-col items-center gap-2 border-t border-slate-900/10 pt-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">رواه {selectedDua.source}</span>
              <span className="bg-slate-950/10 px-4 py-1 rounded-full text-[10px] font-bold">{selectedDua.category}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/50 p-12 rounded-[2.5rem] border border-dashed border-slate-800 text-center text-slate-600 flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
              <BookOpenIcon size={20} />
            </div>
            <p className="text-sm font-medium">اختر تصنيفاً للبدء</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DuaSection;
