
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
  throw new Error("VITE_GEMINI_API_KEY is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const geminiModel = "gemini-1.5-flash"; // Using a valid model name

export async function generateBlogRecommendations(query: string): Promise<BlogResult[]> {
  if (!query.trim()) return [];

  try {
    const model = genAI.getGenerativeModel({ model: geminiModel });

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
