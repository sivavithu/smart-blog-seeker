import { GoogleGenerativeAI } from "@google/generative-ai";

export interface BlogResult {
  id: string;
  title: string;
  domain: string;
  description: string;
  keyInsight: string;
  url: string;
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please configure it in your environment.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateBlogRecommendations = async (query: string): Promise<BlogResult[]> => {
  if (!query.trim()) return [];

  try {
    const prompt = `
      You are a blog recommendation expert. For this query: "${query}",
      suggest 4 real blog posts with:
      1. Exact match to the user's need
      2. Authoritative sources
      3. Practical insights
      
      Format as JSON array with:
      {
        "title": string,
        "domain": string (like "example.com/category"),
        "description": string (why it fits),
        "keyInsight": string,
        "url": string (hypothetical format)
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Raw API response:", text);

    const jsonString = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonString) as { title: string; domain: string; description: string; keyInsight: string; url?: string }[];

    return parsed.map((item, index) => ({
      id: `gemini-${Date.now()}-${index}`,
      title: item.title,
      domain: item.domain,
      description: item.description,
      keyInsight: item.keyInsight,
      url: item.url || `https://${item.domain}`
    }));

  } catch (error: any) {
    console.error("Gemini API error:", error.message || error);
    const errorMessage = error.message?.includes("API_KEY_INVALID")
      ? "Invalid API key. Check VITE_GEMINI_API_KEY."
      : error.message?.includes("rate limit")
      ? "API rate limit exceeded. Try again later."
      : "Couldn't fetch results. Please refine your query.";
    return [{
      id: 'error',
      title: "Search Failed",
      domain: "try-again.com",
      description: errorMessage,
      keyInsight: "Check API key, query, or server status",
      url: "#"
    }];
  }
};
