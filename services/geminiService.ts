import { GoogleGenAI, Type } from "@google/genai";
import { FortuneResult } from "../types";

// Helper to get a random fallback if API fails or key is missing (mock mode for safety)
const getFallbackFortune = (): FortuneResult => {
  const fallbacks = [
    {
      signLevel: "上上",
      title: "鯉魚化龍",
      poem: ["游魚變作龍", "喜氣滿門庭", "風雲際會時", "一躍過天門"],
      explanation: "此签为大吉之象。您目前的努力即将得到回报，就像鲤鱼跃过龙门一样，事业或学业将有巨大的突破。保持信心，抓住机遇。",
      luckyNumbers: "1, 6, 8"
    },
    {
      signLevel: "中吉",
      title: "孔明借箭",
      poem: ["船行江上霧迷濛", "借箭成功运氣通", "巧計安排能勝敵", "歸來載得滿船空"],
      explanation: "事情虽有迷雾，但只要运用智慧，借力使力，终能达成目标。切勿鲁莽行事，需谋定而后动。",
      luckyNumbers: "3, 9"
    }
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

export const generateFortune = async (): Promise<FortuneResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key found, using fallback data.");
    return new Promise(resolve => setTimeout(() => resolve(getFallbackFortune()), 1500));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using flash model for speed
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a traditional Chinese fortune teller simulation. 
      Generate a realistic Chinese fortune stick (Kau Chim/Ling Qian).
      
      Requirements:
      1. 'signLevel': The luck level (e.g., 上上, 上吉, 中吉, 中平, 下下).
      2. 'title': A classic 3-5 character title in Traditional Chinese (e.g., 姜太公钓鱼).
      3. 'poem': A 4-line poem in Traditional Chinese (7 characters per line preferred).
      4. 'explanation': A warm, wise interpretation in Simplified Chinese (approx 50-80 words).
      5. 'luckyNumbers': 2-3 random lucky numbers.
      
      Output strictly valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signLevel: { type: Type.STRING },
            title: { type: Type.STRING },
            poem: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            explanation: { type: Type.STRING },
            luckyNumbers: { type: Type.STRING }
          },
          required: ["signLevel", "title", "poem", "explanation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FortuneResult;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackFortune();
  }
};
