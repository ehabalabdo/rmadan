import { GoogleGenAI, Type } from "@google/genai";

/**
 * خدمة Gemini API:
 * - يتم الحصول على المفتاح من import.meta.env.VITE_GOOGLE_API_KEY
 * - هذا الأسلوب يتوافق مع Vite وينجح على Vercel
 * - تأكد من تسمية المتغير في Vercel بـ "VITE_GOOGLE_API_KEY"
 */

const getApiKey = () => {
  const key = import.meta.env.VITE_GOOGLE_API_KEY;
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
