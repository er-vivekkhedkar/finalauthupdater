import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export class GeminiService {
  private chat;

  constructor() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
  }

  async sendMessage(message: string) {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get response from Gemini');
    }
  }

  resetChat() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export const getGeminiService = () => {
  if (!geminiService) {
    geminiService = new GeminiService();
  }
  return geminiService;
}; 