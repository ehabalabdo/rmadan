
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from './Icons';

const challenges = [
  "تصدق بدينار اليوم",
  "اتصل بصديق لم تحادثه منذ زمن",
  "أطعم مسكيناً أو قطة في الطريق",
  "صلِّ ركعتي الضحى",
  "اقرأ سورة الملك قبل النوم",
  "ساعد والديك في تحضير الإفطار",
  "ابتعد عن هاتفك ساعة قبل المغرب"
];

const ChallengeCard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const dailyChallenge = useMemo(() => challenges[Math.floor(Math.random() * challenges.length)], []);

  return (
    <div className="mt-8 perspective-1000 w-full h-48 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div 
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] flex flex-col items-center justify-center p-6 shadow-2xl text-slate-950">
          <SparklesIcon size={40} className="mb-2 opacity-80" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">تحدي اليوم</h2>
          <p className="text-[10px] font-bold opacity-60 mt-2">اضغط للكشف عن التحدي</p>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2.5rem] border-2 border-amber-400 flex flex-col items-center justify-center p-8 shadow-2xl text-white"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="text-xl font-black text-center leading-relaxed">
            "{dailyChallenge}"
          </p>
          <div className="mt-4 bg-amber-400 text-slate-950 px-4 py-1 rounded-full text-[10px] font-black">
            تم بنجاح؟
          </div>
        </div>
      </motion.div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default ChallengeCard;
