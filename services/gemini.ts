import { GoogleGenAI, Type } from "@google/genai";

// Ensure usage of process.env.API_KEY
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
}

export const generateTriviaQuestions = async (topic: string = 'General Knowledge'): Promise<TriviaQuestion[]> => {
  if (!apiKey) {
    // Fallback if no API key is present
    return [
      { question: "API Key Missing. What represents water?", options: ["H2O", "CO2", "O2", "NaCl"], correctAnswerIndex: 0 },
      { question: "What is 2+2?", options: ["3", "4", "5", "6"], correctAnswerIndex: 1 },
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 multiple-choice trivia questions about "${topic}". The questions should be engaging. Return purely JSON. Language: Persian (Farsi).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as TriviaQuestion[];
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { 
        question: "خطا در اتصال به هوش مصنوعی. پایتخت ایران کجاست؟", 
        options: ["شیراز", "اصفهان", "تهران", "تبریز"], 
        correctAnswerIndex: 2 
      }
    ];
  }
};
