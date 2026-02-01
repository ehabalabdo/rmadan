
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppTab } from './types';
import HeroSection from './components/HeroSection';
import DuaSection from './components/DuaSection';
import AIChef from './components/AIChef';
import SeriesSection from './components/SeriesSection';
import ToolsSection from './components/ToolsSection';
import ChallengeCard from './components/ChallengeCard';
import DailyDuaCard from './components/DailyDuaCard';
import QuizGame from './components/QuizGame';
import { 
  HomeIcon, 
  BookOpenIcon, 
  BeakerIcon, 
  TvIcon,
  ToolsIcon
} from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-24 max-w-md mx-auto shadow-2xl relative overflow-x-hidden border-x border-slate-800/50">
      <AnimatePresence mode="wait">
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="px-5 pt-6"
        >
          {activeTab === AppTab.HOME && (
            <div className="space-y-4">
              <HeroSection />
              <DailyDuaCard />
              <ChallengeCard />
              <QuizGame />
            </div>
          )}
          {activeTab === AppTab.DUAS && <DuaSection />}
          {activeTab === AppTab.CHEF && <AIChef />}
          {activeTab === AppTab.SERIES && <SeriesSection />}
          {activeTab === AppTab.TOOLS && <ToolsSection />}
        </motion.main>
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800 flex justify-around items-center h-20 px-4 z-50">
        <NavButton 
          active={activeTab === AppTab.HOME} 
          onClick={() => setActiveTab(AppTab.HOME)}
          icon={<HomeIcon size={20} />}
          label="الرئيسية"
        />
        <NavButton 
          active={activeTab === AppTab.DUAS} 
          onClick={() => setActiveTab(AppTab.DUAS)}
          icon={<BookOpenIcon size={20} />}
          label="الأدعية"
        />
        <NavButton 
          active={activeTab === AppTab.TOOLS} 
          onClick={() => setActiveTab(AppTab.TOOLS)}
          icon={<ToolsIcon size={20} />}
          label="أدوات"
        />
        <NavButton 
          active={activeTab === AppTab.CHEF} 
          onClick={() => setActiveTab(AppTab.CHEF)}
          icon={<BeakerIcon size={20} />}
          label="الشيف"
        />
        <NavButton 
          active={activeTab === AppTab.SERIES} 
          onClick={() => setActiveTab(AppTab.SERIES)}
          icon={<TvIcon size={20} />}
          label="مسلسلات"
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className="relative flex flex-col items-center justify-center space-y-1 w-full outline-none"
  >
    <motion.div 
      animate={{ 
        y: active ? -4 : 0,
        color: active ? '#fbbf24' : '#94a3b8'
      }}
      className={`p-1.5 rounded-xl transition-all ${active ? 'bg-amber-400/10' : ''}`}
    >
      {icon}
    </motion.div>
    <motion.span 
      animate={{ opacity: active ? 1 : 0.6, scale: active ? 1 : 0.9 }}
      className={`text-[9px] font-black uppercase tracking-wider ${active ? 'text-amber-400' : 'text-slate-400'}`}
    >
      {label}
    </motion.span>
    {active && (
      <motion.div 
        layoutId="activeTabIndicator"
        className="absolute -bottom-1 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24]"
      />
    )}
  </button>
);

export default App;
