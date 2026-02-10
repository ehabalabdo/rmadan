
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TasbihIcon, KhatmaIcon, GreetingIcon, RotateCcw, Download, SparklesIcon, AlertCircle } from './Icons';
import { generateGreetingImage } from '../services/geminiService';

const ToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'tasbih' | 'khatma' | 'greeting'>('tasbih');

  return (
    <div className="space-y-6 pb-10">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-amber-400 uppercase tracking-tighter">أدوات رمضانية</h1>
        <p className="text-slate-500 text-sm font-bold">مجموعتك المتكاملة للعبادة والتواصل</p>
      </div>

      <div className="flex bg-slate-900/50 p-1.5 rounded-3xl border border-slate-800">
        <ToolTab active={activeTool === 'tasbih'} onClick={() => setActiveTool('tasbih')} icon={<TasbihIcon size={18} />} label="مسبحة" />
        <ToolTab active={activeTool === 'khatma'} onClick={() => setActiveTool('khatma')} icon={<KhatmaIcon size={18} />} label="ختمة" />
        <ToolTab active={activeTool === 'greeting'} onClick={() => setActiveTool('greeting')} icon={<GreetingIcon size={18} />} label="بطاقات" />
      </div>

      <AnimatePresence mode="wait">
        {activeTool === 'tasbih' && <Tasbih key="tasbih" />}
        {activeTool === 'khatma' && <Khatma key="khatma" />}
        {activeTool === 'greeting' && <GreetingGenerator key="greeting" />}
      </AnimatePresence>
    </div>
  );
};

const ToolTab: React.FC<{ active: boolean, onClick: () => void, icon: any, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all gap-1 ${active ? 'bg-amber-400 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
  >
    {icon}
    <span className="text-[10px] font-black">{label}</span>
  </button>
);

const Tasbih: React.FC = () => {
  const [count, setCount] = useState(() => Number(localStorage.getItem('tasbih_count')) || 0);
  const [sessionCount, setSessionCount] = useState(0);
  const [phrase, setPhrase] = useState('سبحان الله');
  const phrases = ['سبحان الله', 'الحمد لله', 'لا إله إلا الله', 'الله أكبر', 'أستغفر الله'];

  useEffect(() => {
    localStorage.setItem('tasbih_count', count.toString());
  }, [count]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setSessionCount(prev => prev + 1);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  const handleReset = () => {
    if (confirm('هل تريد تصفير العدّاد؟')) {
      setCount(0);
      setSessionCount(0);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-4">
      <div className="flex justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {phrases.map(p => (
          <button 
            key={p} 
            onClick={() => {setPhrase(p); setSessionCount(0);}}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${phrase === p ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">إجمالي التسبيحات</span>
          <span className="text-4xl font-black text-amber-400 tabular-nums">{count}</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          className="w-56 h-56 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_50px_rgba(251,191,36,0.2)] flex flex-col items-center justify-center border-8 border-slate-950/20 active:shadow-inner"
        >
          <span className="text-slate-950 text-5xl font-black tabular-nums">{sessionCount}</span>
          <span className="text-slate-950/60 text-[10px] font-black mt-2 uppercase">انقر للتسبيح</span>
        </motion.button>

        <button onClick={handleReset} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
          <RotateCcw size={16} />
          <span className="text-xs font-black">إعادة ضبط</span>
        </button>
      </div>
    </motion.div>
  );
};

const Khatma: React.FC = () => {
  const [completed, setCompleted] = useState<number[]>(() => {
    const saved = localStorage.getItem('khatma_progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('khatma_progress', JSON.stringify(completed));
  }, [completed]);

  const togglePart = (id: number) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const progress = Math.round((completed.length / 30) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-4">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase block">إنجاز الختمة</span>
            <span className="text-3xl font-black text-amber-400">{progress}%</span>
          </div>
          <span className="text-xs font-black text-slate-400">{completed.length} من 30 جزء</span>
        </div>
        <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-amber-400 shadow-[0_0_15px_#fbbf24]" />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[...Array(30)].map((_, i) => {
          const id = i + 1;
          const isDone = completed.includes(id);
          return (
            <button
              key={id}
              onClick={() => togglePart(id)}
              className={`aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all border ${isDone ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-600'}`}
            >
              {id}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

const GreetingGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState('حلول شهر رمضان');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const generatedImage = await generateGreetingImage(name, occasion);
      if (generatedImage) {
        setImageUrl(generatedImage);
      } else {
        setError("فشل توليد الصورة، يرجى المحاولة لاحقاً.");
      }
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError("حدث خطأ أثناء توليد الصورة. تأكد من صلاحية مفتاح API.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Ramadan_Greeting_${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 py-4">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block text-right">اسم الشخص</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: صديقي أبو محمد"
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white focus:ring-2 focus:ring-amber-400 outline-none text-right font-bold text-sm"
          />
        </div>
        <div className="text-[10px] text-amber-200/70 bg-amber-400/5 p-4 rounded-2xl border border-amber-400/10 mb-2 leading-relaxed">
          <SparklesIcon size={12} className="inline ml-1 text-amber-400" /> سيتم تصميم بطاقة إسلامية فاخرة تتضمن <strong>اسم الشخص</strong> تلقائياً داخل الصورة.
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={loading || !name}
          className="w-full bg-amber-400 text-slate-950 py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
        >
          {loading ? (
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
               <RotateCcw size={18} />
             </motion.div>
          ) : <><SparklesIcon size={18} /> تصميم بطاقة بالخط العربي</>}
        </motion.button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose-400 text-xs font-bold justify-center bg-rose-400/10 p-4 rounded-2xl border border-rose-400/20">
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {imageUrl && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="relative group rounded-[2.5rem] overflow-hidden border-2 border-amber-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <img src={imageUrl} alt="Ramadan Greeting" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                 <button 
                  onClick={downloadImage}
                  className="bg-amber-400 text-slate-950 px-8 py-3 rounded-full font-black flex items-center gap-2 shadow-2xl transform hover:scale-105 transition-transform"
                >
                  <Download size={18} /> تنزيل البطاقة
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">البطاقة جاهزة للإرسال!</p>
              <button 
                  onClick={downloadImage}
                  className="md:hidden bg-slate-800 text-amber-400 px-6 py-2 rounded-full text-xs font-black border border-slate-700"
                >
                  حفظ في الاستوديو
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ToolsSection;
