import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const apiKey = process.env.GEMINI_API_KEY;

export const getChatSession = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};
