
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the structure of a blog result
export interface BlogResult {
  id: string;
  title: string;
  domain: string;
  description: string;
  keyInsight: string;
  url: string;
}

// Initialize the API with a default or stored key
let apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
let genAI: GoogleGenerativeAI | null = null;
const geminiModel = "gemini-2.0-flash"; // Using a valid model name

// Function to set the API key programmatically
export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('gemini_api_key', key);
  genAI = new GoogleGenerativeAI(apiKey);
  return !!apiKey;
};

// Check if we have a key and initialize
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const hasApiKey = () => !!apiKey && !!genAI;

export async function generateBlogRecommendations(query: string): Promise<BlogResult[]> {
  if (!query.trim()) return [];
  
  if (!hasApiKey()) {
    return [{
      id: "api-key-missing",
      title: "API Key Required",
      domain: "configuration.required",
      description: "Please set your Gemini API key to use this feature",
      keyInsight: "An API key is required to access the Gemini AI model",
      url: "https://ai.google.dev/"
    }];
  }

  try {
    const model = genAI!.getGenerativeModel({ model: geminiModel });

    // Strict JSON-only prompt inspired by your software project
    const prompt = `
      For the query "${query}", provide 4 blog post recommendations that match the user's need, come from authoritative sources, and offer practical insights. Each recommendation must include: title, domain, description, keyInsight, and url.
      
      Return only the following JSON array, with no additional text, explanations, or markers outside the array:
      [
        {
          "title": "Blog Post Title",
          "domain": "example.com",
          "description": "Why this blog post fits the query",
          "keyInsight": "A key insight from the blog post",
          "url": "https://example.com/blog-post-title"
        }
      ]
      Note: URLs should be plausible and relevant to the domain and title, even if hypothetical.
    `;

    // Get the API response
    const result = await model.generateContent(prompt);
    const rawText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Raw blog recommendations response:", rawText); // Debugging

    // Extract JSON array using regex
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No valid JSON array found");

    // Parse the extracted JSON
    const jsonData = JSON.parse(jsonMatch[0]) as BlogResult[];

    // Validate and process the data
    const processedData = jsonData.slice(0, 4).map((item, index) => {
      const plausibleUrl = item.url || `https://${item.domain}/${item.title.toLowerCase().replace(/\s+/g, '-')}`;
      return {
        id: `gemini-${Date.now()}-${index}`,
        title: item.title || "Untitled Blog Post",
        domain: item.domain || "unknown.com",
        description: item.description || "No description provided",
        keyInsight: item.keyInsight || "No key insight provided",
        url: plausibleUrl
      };
    });

    return processedData;

  } catch (error: any) {
    console.error("Error in generateBlogRecommendations:", error.message || error);
    return [{
      id: "error",
      title: "Search Failed",
      domain: "try-again.com",
      description: error.message || "Failed to fetch blog recommendations",
      keyInsight: "Check API key, query, or response format",
      url: "https://try-again.com"
    }];
  }
}
