
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_PROMPT = `أنت طباخ شامي خبير. اقترح طبخة من المطبخ الشامي حصراً (سوري/أردني/لبناني/فلسطيني) بناءً على المكونات المدخلة. الطعام يجب أن يكون حلالاً 100%. اقترح معها مشروباً رمضانياً تقليدياً (مثل التمر الهندي، الجلاب). المخرجات يجب أن تكون قصيرة ومقادير دقيقة، وبلغة عربية ودودة.`;

export const getChefRecommendation = async (ingredients: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: ingredients,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });
    return response.text || "عذراً، لم أستطع العثور على وصفة مناسبة حالياً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ في الاتصال بالذكاء الاصطناعي. تأكد من صحة مفتاح API_KEY في إعدادات المشروع.";
  }
};

export const generateQuizQuestion = async (previousQuestions: string[]): Promise<any> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return null;
  }
};

export const analyzeIntelligence = async (score: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `A premium, ultra-high-quality Ramadan greeting card. The design features exquisite 3D golden Islamic geometric patterns, glowing ornate lanterns (Fanous), and a beautiful crescent moon. The color palette is a sophisticated deep royal blue and metallic gold. 
    CRITICAL REQUIREMENT: Include prominent, elegant, and perfectly rendered ARABIC CALLIGRAPHY as the centerpiece of the design. The calligraphy must clearly say "رمضان كريم" (Ramadan Kareem) and elegantly include the name "${name}". 
    The text should be integrated into the artwork using a professional Arabic font style (like Thuluth or Diwani). The atmosphere is spiritual, celebratory, and luxurious. 4K resolution, professional digital art.`;
    
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
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
