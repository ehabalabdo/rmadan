
import { GoogleGenAI, Type } from "@google/genai";

/**
 * خدمة Gemini API:
 * - يتم الحصول على المفتاح حصراً من process.env.API_KEY كما تتطلب تعليمات النظام الأساسي.
 * - ملاحظة: في Vite داخل هذه المنصة، يتم حقن المتغيرات تلقائياً في process.env.
 * - تأكد من تسمية المتغير في Vercel بـ "API_KEY" لضمان التوافق التام.
 */

const getApiKey = () => {
  const key = process.env.API_KEY;
  // فحص ما إذا كان المفتاح موجوداً أو عبارة عن نص غير معرف
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
      model: 'gemini-3-flash-preview',
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
      return "⚠️ مفتاح API غير موجود. يرجى التأكد من وجود متغير باسم API_KEY في إعدادات Vercel.";
    }
    return "عذراً، حدث خطأ أثناء التواصل مع الشيف. يرجى المحاولة لاحقاً.";
  }
};

export const generateQuizQuestion = async (previousQuestions: string[]): Promise<any> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
      model: 'gemini-3-flash-preview',
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
  try {
    // التحقق من وجود مفتاح API للصور (يتطلب مفتاحاً مدفوعاً)
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
    
    // إنشاء نسخة جديدة دائماً لضمان استخدام أحدث مفتاح من الحوار
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `A premium, ultra-high-quality Ramadan greeting card with name "${name}". Professional Arabic calligraphy saying "رمضان كريم ${name}". Luxurious golden Islamic patterns on deep blue background. 4K digital art style.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    // إعادة فتح اختيار المفتاح إذا كان هناك خطأ في صلاحية المفتاح
    if (error.message?.includes("entity was not found") || error.message?.includes("invalid")) {
      await (window as any).aistudio.openSelectKey();
    }
    throw error;
  }
};
