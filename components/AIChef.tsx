
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChefRecommendation } from '../services/geminiService';
import { SparklesIcon, BeakerIcon } from './Icons';
import { SUGGESTED_SHAMI_DISHES } from '../constants';
import { Utensils, ChevronLeft, ChevronRight } from 'lucide-react';

const AIChef: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleAsk = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setRecommendation('');
    const result = await getChefRecommendation(ingredients);
    setRecommendation(result);
    setLoading(false);
  };

  const selectSuggestion = (dish: string) => {
    setIngredients(`كيف أعمل ${dish}؟`);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-amber-400 uppercase tracking-tighter">الشيف الشامي</h1>
        <p className="text-slate-500 text-sm font-bold">مساعدك الذكي لإفطار رمضاني مميز</p>
      </div>

      {/* Suggested Dishes Carousel with Arrows */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
            <Utensils size={12} /> مقترحات شامية
          </p>
          <div className="flex gap-1">
            <button 
              onClick={() => scroll('right')} 
              className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => scroll('left')} 
              className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 scroll-smooth"
          >
            {SUGGESTED_SHAMI_DISHES.map((dish, i) => (
              <button
                key={i}
                onClick={() => selectSuggestion(dish)}
                className="whitespace-nowrap bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-amber-400 hover:border-amber-400/50 transition-all shrink-0"
              >
                {dish}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-slate-800 space-y-4">
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="ماذا يتوفر في ثلاجتك؟ (مثال: لحم، لبن، بصل...)"
          className="w-full h-40 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all resize-none text-right font-bold leading-relaxed shadow-inner"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAsk}
          disabled={loading || !ingredients.trim()}
          className="w-full bg-amber-400 text-slate-950 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-amber-300 active:scale-95 transition-all disabled:opacity-50 shadow-xl"
        >
          {loading ? (
             <div className="flex gap-2 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className="w-2.5 h-2.5 bg-slate-950 rounded-full"
                  />
                ))}
             </div>
          ) : (
            <>
              <SparklesIcon size={22} />
              <span>اقترح لي طبخة</span>
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center py-10 gap-6"
          >
            <motion.div 
              animate={{ 
                rotate: [0, 360],
                y: [0, -10, 0]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 4, ease: "linear" },
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-amber-400/20 blur-2xl rounded-full" />
              <BeakerIcon size={64} className="text-amber-400 relative z-10" />
            </motion.div>
            <p className="text-amber-200/50 text-xs font-black animate-pulse uppercase tracking-[0.4em]">يتم الآن طهي الفكرة...</p>
          </motion.div>
        )}

        {recommendation && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-amber-400/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <BeakerIcon size={120} />
             </div>
            <div className="prose prose-invert max-w-none text-slate-100 leading-[1.8] text-sm text-right font-bold whitespace-pre-wrap">
              {recommendation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChef;
