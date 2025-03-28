
import { GoogleGenerativeAI } from "@google/generative-ai";

interface BlogResult {
  id: string;
  title: string;
  domain: string;
  description: string;
  keyInsight: string;
  url: string;
}

// Initialize Gemini - use your free API key from Google AI Studio
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateBlogRecommendations = async (query: string): Promise<BlogResult[]> => {
  if (!query.trim()) return [];

  try {
    const prompt = `
      You are a blog recommendation expert. For this query: "${query}",
      suggest 3 real blog posts with:
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
      
      Example:
      [{
        "title": "Indoor Composting with Pets",
        "domain": "urbangardening.com/pet-compost",
        "description": "Safe methods for apartment composting with cats/dogs",
        "keyInsight": "Bokashi bins prevent pet access better than worm farms",
        "url": "https://example.com/indoor-compost"
      }]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean and parse response
    const jsonString = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    return parsed.map((item: any, index: number) => ({
      id: `gemini-${Date.now()}-${index}`,
      title: item.title,
      domain: item.domain,
      description: item.description,
      keyInsight: item.keyInsight,
      url: item.url || `https://${item.domain}`
    }));

  } catch (error) {
    console.error("Gemini API error:", error);
    return [{
      id: 'error',
      title: "Search Failed",
      domain: "try-again.com",
      description: "Couldn't fetch results. Please refine your query.",
      keyInsight: "The API might be rate-limited or your query too vague",
      url: "#"
    }];
  }
};
