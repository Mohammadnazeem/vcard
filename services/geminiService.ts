
import { GoogleGenAI, Type } from "@google/genai";
import { CardData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProfessionalSlogan = async (role: string, company: string): Promise<string> => {
  if (!role && !company) return "Elevating Excellence Together";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a single, short, impactful professional slogan (max 8 words) for a ${role} working at ${company}. Return ONLY the slogan text.`,
    });
    return response.text || "Excellence in every detail.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Professional Service at its Best";
  }
};

export const enhanceCardData = async (data: Partial<CardData>): Promise<Partial<CardData>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following business card info, provide a more professional version or fill in missing professional slogans.
      Name: ${data.fullName}
      Job: ${data.jobTitle}
      Company: ${data.companyName}
      
      Respond in JSON format with fields: slogan, jobTitle (refined), companyName (refined).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            companyName: { type: Type.STRING },
          },
          required: ["slogan", "jobTitle", "companyName"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Enhancement Error:", error);
    return data;
  }
};
