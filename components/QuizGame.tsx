
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuizQuestion, analyzeIntelligence } from '../services/geminiService';
import { SparklesIcon } from './Icons';
import { Heart, HelpCircle, Zap, ShieldCheck, RefreshCw, BrainCircuit, Eye, Info } from 'lucide-react';

const QuizGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'loading' | 'playing' | 'feedback' | 'gameOver'>('start');
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5); // Updated to 5 lives
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [helpers, setHelpers] = useState({
    fiftyFifty: 1,
    skip: 1,
    reveal: 1, // New Reveal helper
  });
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);

  const loadQuestion = async () => {
    setGameState('loading');
    setDisabledOptions([]);
    setSelectedOption(null);
    const q = await generateQuizQuestion(history);
    if (q) {
      setCurrentQuestion(q);
      setHistory(prev => [...prev, q.question]);
      setGameState('playing');
    } else {
      setGameState('start'); // Error fallback
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 10);
    } else {
      setLives(prev => prev - 1);
    }
    setGameState('feedback');
  };

  const nextAction = () => {
    if (lives <= 0) {
      handleGameOver();
    } else {
      loadQuestion();
    }
  };

  const handleGameOver = async () => {
    setGameState('loading');
    const result = await analyzeIntelligence(score);
    setAnalysis(result);
    setGameState('gameOver');
  };

  const useFiftyFifty = () => {
    if (helpers.fiftyFifty > 0 && selectedOption === null && gameState === 'playing') {
      const correct = currentQuestion.correctIndex;
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
      const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
      setDisabledOptions([shuffled[0], shuffled[1]]);
      setHelpers(prev => ({ ...prev, fiftyFifty: 0 }));
    }
  };

  const useSkip = () => {
    if (helpers.skip > 0 && selectedOption === null && gameState === 'playing') {
      setHelpers(prev => ({ ...prev, skip: 0 }));
      loadQuestion();
    }
  };

  const useReveal = () => {
    if (helpers.reveal > 0 && selectedOption === null && gameState === 'playing') {
      setHelpers(prev => ({ ...prev, reveal: 0 }));
      handleAnswer(currentQuestion.correctIndex);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(5); // Reset to 5 lives
    setHistory([]);
    setHelpers({ fiftyFifty: 1, skip: 1, reveal: 1 });
    loadQuestion();
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-800 shadow-xl mt-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
          <Zap size={14} /> سلي صيامك
        </h3>
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: i < lives ? 1 : 0.8,
                opacity: i < lives ? 1 : 0.3
              }}
            >
              <Heart size={14} className={i < lives ? "text-rose-500 fill-rose-500" : "text-slate-600"} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-10 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <HelpCircle size={40} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black">مسابقة المعلومات العامة</h4>
              <p className="text-slate-500 text-sm">اختبر ثقافتك بـ ٥ محاولات!</p>
            </div>
            <button 
              onClick={loadQuestion}
              className="w-full py-4 bg-amber-400 text-slate-950 rounded-2xl font-black shadow-lg"
            >
              ابدأ اللعب
            </button>
          </motion.div>
        )}

        {gameState === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center gap-4"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="text-amber-400"
            >
              <RefreshCw size={40} />
            </motion.div>
            <p className="text-amber-200/40 text-[10px] font-black uppercase tracking-[0.3em]">جاري تحضير السؤال...</p>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'feedback') && currentQuestion && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-slate-950/40 p-5 rounded-3xl border border-slate-800">
              <p className="text-lg font-bold text-center leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            <div className="grid gap-3">
              {currentQuestion.options.map((opt: string, i: number) => {
                const isCorrect = i === currentQuestion.correctIndex;
                const isSelected = i === selectedOption;
                const isDisabled = disabledOptions.includes(i);
                
                let bgColor = "bg-slate-800/50 border-slate-700";
                if (gameState === 'feedback') {
                  if (isCorrect) bgColor = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                  else if (isSelected) bgColor = "bg-rose-500/20 border-rose-500 text-rose-400";
                  else bgColor = "opacity-30 border-slate-800";
                } else if (isDisabled) {
                  bgColor = "opacity-10 pointer-events-none";
                }

                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    disabled={gameState === 'feedback' || isDisabled}
                    className={`w-full p-4 rounded-2xl border text-right font-bold transition-all text-sm ${bgColor}`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {gameState === 'playing' && (
              <div className="flex justify-center gap-6 pt-2">
                <HelperBtn 
                  icon={<ShieldCheck size={18} />} 
                  count={helpers.fiftyFifty} 
                  onClick={useFiftyFifty}
                  label="50:50"
                />
                <HelperBtn 
                  icon={<Eye size={18} />} 
                  count={helpers.reveal} 
                  onClick={useReveal}
                  label="كشف"
                />
                <HelperBtn 
                  icon={<BrainCircuit size={18} />} 
                  count={helpers.skip} 
                  onClick={useSkip}
                  label="تخطي"
                />
              </div>
            )}

            {gameState === 'feedback' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-amber-400/5 p-4 rounded-2xl border border-amber-400/10 flex gap-3 items-start">
                  <div className="mt-1 text-amber-400"><Info size={16} /></div>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    <span className="font-black block mb-1">توضيح:</span>
                    {currentQuestion.explanation}
                  </p>
                </div>
                <button 
                  onClick={nextAction}
                  className="w-full py-4 bg-slate-100 text-slate-950 rounded-2xl font-black shadow-lg"
                >
                  السؤال التالي
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div 
            key="gameOver"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center space-y-6"
          >
            <div className="space-y-2">
              <h4 className="text-3xl font-black text-rose-500">انتهت المحاولات!</h4>
              <p className="text-slate-400 font-bold">مجموع النقاط: {score}</p>
            </div>
            
            <div className="bg-amber-400/10 p-6 rounded-[2rem] border border-amber-400/20 relative">
              <SparklesIcon size={24} className="absolute -top-3 -right-3 text-amber-400" />
              <p className="text-sm font-bold text-amber-100 leading-relaxed italic">
                "{analysis}"
              </p>
            </div>

            <button 
              onClick={resetGame}
              className="w-full py-4 bg-amber-400 text-slate-950 rounded-2xl font-black flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} /> العب مرة أخرى
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HelperBtn: React.FC<{ icon: any, count: number, onClick: () => void, label: string }> = ({ icon, count, onClick, label }) => (
  <button 
    onClick={onClick}
    disabled={count === 0}
    className={`flex flex-col items-center gap-1 group ${count === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
  >
    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-amber-400 transition-colors">
      {icon}
    </div>
    <span className="text-[10px] font-black text-slate-500">{label}</span>
  </button>
);

export default QuizGame;
