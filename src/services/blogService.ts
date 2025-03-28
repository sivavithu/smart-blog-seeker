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

// Initialize the API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please configure it in your environment.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateBlogRecommendations = async (query: string): Promise<BlogResult[]> => {
  if (!query.trim()) return [];

  try {
    // Prompt with a request for plausible URLs
    const prompt = `
      You are a blog recommendation expert. For the query "${query}",
      suggest 4 real blog posts that match the user's need, come from authoritative sources,
      and offer practical insights. Provide the title, domain, description, key insight, and a plausible URL for each.
      
      Format the response as a JSON array like this:
      [
        {
          "title": "Blog Post Title",
          "domain": "example.com",
          "description": "Why this blog post fits the query",
          "keyInsight": "A key insight from the blog post",
          "url": "https://example.com/blog-post-title"
        }
      ]
      Note: The URLs should be plausible but can be hypothetical.
    `;

    // Get the API response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Raw API response:", text); // Log for debugging

    // Extract the JSON array from the response
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No valid JSON array found in response");
    }
    const jsonString = text.slice(jsonStart, jsonEnd).trim();

    // Parse the extracted JSON
    let parsed;
    try {
      parsed = JSON.parse(jsonString) as { title: string; domain: string; description: string; keyInsight: string; url?: string }[];
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      throw new Error("Invalid JSON format in API response");
    }

    // Map the results and ensure plausible URLs
    return parsed.map((item, index) => {
      // Generate a URL if none is provided
      const plausibleUrl = item.url || `https://${item.domain}/${item.title.toLowerCase().replace(/\s+/g, '-')}`;
      return {
        id: `gemini-${Date.now()}-${index}`,
        title: item.title,
        domain: item.domain,
        description: item.description,
        keyInsight: item.keyInsight,
        url: plausibleUrl
      };
    });

  } catch (error: any) {
    console.error("Gemini API error:", error.message || error);
    const errorMessage = error.message?.includes("APIktir_KEY_INVALID")
      ? "Invalid API key. Check VITE_GEMINI_API_KEY."
      : error.message?.includes("rate limit")
      ? "API rate limit exceeded. Try again later."
      : error.message?.includes("JSON")
      ? "Invalid JSON format in API response. Check raw output."
      : "Couldn't fetch results. Please refine your query.";
    return [{
      id: 'error',
      title: "Search Failed",
      domain: "try-again.com",
      description: errorMessage,
      keyInsight: "Check API key, query, or response format",
      url: "#"
    }];
  }
};
