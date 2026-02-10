
import { GoogleGenAI, Type } from "@google/genai";

/**
 * خدمة Gemini API:
 * - يتم الحصول على المفتاح من import.meta.env.VITE_GOOGLE_API_KEY
 * - هذا الأسلوب يتوافق مع Vite وينجح على Vercel
 * - تأكد من تسمية المتغير في Vercel بـ "VITE_GOOGLE_API_KEY"
 */

const getApiKey = () => {
  const key = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!key || key === 'undefined' || key.trim() === '') {
    return null;
  }
  return key;
};

const getAIInstance = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_PROMPT = `أنت طباخ شامي خبير. اقترح طبخة من المطبخ الشامي حصراً (سوري/أردني/لبناني/فلسطيني) بناءً على المكونات المدخلة. الطعام يجب أن يكون حلالاً 100%. اقترح معها مشروباً رمضانياً تقليدياً (مثل التمر الهندي، الجلاب). المخرجات يجب أن تكون قصيرة ومقادير دقيقة، وبلغة عربية ودودة.`;

export const getChefRecommendation = async (ingredients: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: ingredients,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });
    return response.text || "عذراً، لم أستطع العثور على وصفة مناسبة حالياً.";
  } catch (error: any) {
    console.error("Gemini Chef Error:", error);
    if (error.message === "API_KEY_MISSING") {
      return "⚠️ مفتاح API غير موجود. يرجى التأكد من وجود متغير باسم VITE_GOOGLE_API_KEY في إعدادات Vercel.";
    }
    return "عذراً، حدث خطأ أثناء التواصل مع الشيف. يرجى المحاولة لاحقاً.";
  }
};

export const generateQuizQuestion = async (previousQuestions: string[]): Promise<any> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `ولد لي سؤالاً ثقافياً عاماً جديداً لم يسبق طرحه (لا تكرر: ${previousQuestions.join(', ')}). السؤال يجب أن يكون ممتعاً ومناسباً لجو رمضان الثقافي.`,
      config: {
        systemInstruction: "أنت مسؤول عن مسابقة ثقافية رمضانية ممتعة. ولد أسئلة في العلوم، التاريخ، الأدب، أو الثقافة العامة. يجب أن يكون الرد بتنسيق JSON حصراً.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "أربعة خيارات منطقية"
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING, description: "توضيح قصير ومفيد عن المعلومة" }
          },
          required: ["question", "options", "correctIndex", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Quiz Gen Error:", error);
    return null;
  }
};

export const analyzeIntelligence = async (score: number): Promise<string> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `حلل ذكاء المستخدم الذي حصل على ${score} نقاط في مسابقة ثقافية.`,
      config: {
        systemInstruction: "أنت محلل ذكاء خفيف الظل بلكنة شامية محببة. قدم تحليلاً فكاهياً وملهماً لأداء المستخدم بعد خسارته في المسابقة. اجعل الرد قصيراً وجذاباً.",
        temperature: 0.9,
      }
    });
    return response.text || "أداء جيد، حاول مرة أخرى!";
  } catch (error) {
    return "ما شاء الله على نباهتك، حاول مرة تانية لتبهرنا أكتر!";
  }
};

export const generateGreetingImage = async (name: string, occasion: string): Promise<string | null> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 1080;
  canvas.height = 1080;

  // Background gradient
  const bgGrad = ctx.createRadialGradient(540, 540, 100, 540, 540, 700);
  bgGrad.addColorStop(0, '#1a1a3e');
  bgGrad.addColorStop(0.5, '#0f0f2d');
  bgGrad.addColorStop(1, '#050515');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1080);

  // Decorative circles
  const drawGlowCircle = (x: number, y: number, r: number, alpha: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(251, 191, 36, ${alpha})`);
    g.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  drawGlowCircle(540, 200, 300, 0.08);
  drawGlowCircle(200, 800, 200, 0.05);
  drawGlowCircle(900, 700, 250, 0.06);

  // Decorative border
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(40, 40, 1000, 1000, 30);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(55, 55, 970, 970, 25);
  ctx.stroke();

  // Islamic star pattern at top
  const drawStar = (cx: number, cy: number, size: number, alpha: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.2, -size * 0.2);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.2, size * 0.2);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.2, size * 0.2);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size * 0.2, -size * 0.2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };

  drawStar(540, 220, 60, 0.15);
  drawStar(150, 150, 20, 0.1);
  drawStar(930, 150, 20, 0.1);
  drawStar(150, 930, 20, 0.1);
  drawStar(930, 930, 20, 0.1);

  // Crescent moon
  ctx.save();
  ctx.translate(540, 320);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
  ctx.beginPath();
  ctx.arc(0, 0, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f0f2d';
  ctx.beginPath();
  ctx.arc(18, -10, 45, 0, Math.PI * 2);
  ctx.fill();
  // Star next to crescent
  ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
  ctx.beginPath();
  ctx.arc(-35, -40, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // "رمضان كريم" text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
  ctx.shadowBlur = 30;
  ctx.font = 'bold 90px "Segoe UI", "Arial", sans-serif';
  ctx.fillText('رمضان كريم', 540, 500);
  ctx.shadowBlur = 0;

  // Decorative line
  const lineGrad = ctx.createLinearGradient(240, 530, 840, 530);
  lineGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
  lineGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.6)');
  lineGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(240, 535);
  ctx.lineTo(840, 535);
  ctx.stroke();

  // Diamond shape
  ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
  ctx.beginPath();
  ctx.moveTo(540, 550);
  ctx.lineTo(548, 560);
  ctx.lineTo(540, 570);
  ctx.lineTo(532, 560);
  ctx.closePath();
  ctx.fill();

  // Person name
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
  ctx.shadowBlur = 20;
  ctx.font = 'bold 65px "Segoe UI", "Arial", sans-serif';
  ctx.fillText(name, 540, 660);
  ctx.shadowBlur = 0;

  // Occasion/subtitle
  ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.font = '32px "Segoe UI", "Arial", sans-serif';
  ctx.fillText('مبارك عليكم الشهر الفضيل', 540, 730);

  // Dua at bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '26px "Segoe UI", "Arial", sans-serif';
  ctx.fillText('تقبّل الله منّا ومنكم صالح الأعمال', 540, 870);

  // Small decorative dots
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 1080;
    const y = Math.random() * 1080;
    const r = Math.random() * 2;
    ctx.fillStyle = `rgba(251, 191, 36, ${Math.random() * 0.15})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
};
