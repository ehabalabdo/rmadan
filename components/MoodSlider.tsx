
import React, { useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const MoodSlider: React.FC = () => {
  const [energy, setEnergy] = useState(50);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springEnergy = useSpring(50, springConfig);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setEnergy(value);
    springEnergy.set(value);
  };

  const getEmoji = (val: number) => {
    if (val < 20) return '😴';
    if (val < 40) return '🥱';
    if (val < 60) return '😐';
    if (val < 80) return '😊';
    return '⚡';
  };

  const getAdvice = (val: number) => {
    if (val < 30) return "أرح جسدك قليلاً، القيلولة سنة نبوية.";
    if (val < 60) return "وقت مناسب للذكر الهادئ والاستغفار.";
    if (val < 85) return "استغل نشاطك في قراءة وردك من القرآن.";
    return "طاقة ممتازة! بادر بعمل خير أو مساعدة أحدهم الآن.";
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 shadow-xl mt-6">
      <h3 className="text-amber-400 font-black text-sm mb-8 text-center uppercase tracking-widest">كيف هي طاقتك الآن؟</h3>
      
      <div className="relative flex flex-col items-center">
        <motion.div 
          className="text-5xl mb-4"
          style={{ 
            scale: useTransform(springEnergy, [0, 100], [0.8, 1.4]),
            rotate: useTransform(springEnergy, [0, 100], [-10, 10])
          }}
        >
          {getEmoji(energy)}
        </motion.div>

        <div className="w-full px-4 mb-6">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={energy} 
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        <motion.div 
          key={getAdvice(energy)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-400/10 border border-amber-400/20 p-4 rounded-2xl text-center"
        >
          <p className="text-amber-200 text-sm font-bold leading-relaxed">
            {getAdvice(energy)}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodSlider;
