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
    // Loose prompt: no format enforcement
    const prompt = `
      You are a blog recommendation expert. For the query "${query}",
      suggest 4 real blog posts that match the user's need, come from authoritative sources,
      and offer practical insights. Provide the title, domain, description, key insight, and URL for each.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Raw API response:", text); // For debugging

    // Parse the raw text into BlogResult objects
    const blogResults = parseBlogRecommendations(text);

    if (blogResults.length === 0) {
      throw new Error("No valid blog recommendations found in response");
    }

    return blogResults.map((item, index) => ({
      id: `gemini-${Date.now()}-${index}`,
      ...item,
      url: item.url || `https://${item.domain}`
    }));

  } catch (error: any) {
    console.error("Gemini API error:", error.message || error);
    const errorMessage = error.message?.includes("API_KEY_INVALID")
      ? "Invalid API key. Check VITE_GEMINI_API_KEY."
      : error.message?.includes("rate limit")
      ? "API rate limit exceeded. Try again later."
      : "Couldn't fetch results or parse response. Check raw output.";
    return [{
      id: 'error',
      title: "Search Failed",
      domain: "try-again.com",
      description: errorMessage,
      keyInsight: "Refine query or check API response",
      url: "#"
    }];
  }
};

// Helper function to parse unstructured text into BlogResult objects
function parseBlogRecommendations(text: string): Partial<BlogResult>[] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const results: Partial<BlogResult>[] = [];
  let currentBlog: Partial<BlogResult> = {};

  for (const line of lines) {
    // Heuristic parsing based on common patterns
    if (line.match(/^\d+\.|^-|^Title:/i)) {
      // Start of a new blog entry
      if (Object.keys(currentBlog).length > 0) {
        results.push(currentBlog);
      }
      currentBlog = { title: line.replace(/^\d+\.|^-|^Title:/i, '').trim() };
    } else if (line.toLowerCase().includes("domain")) {
      currentBlog.domain = line.split(/domain:?/i)[1]?.trim() || "unknown.com";
    } else if (line.toLowerCase().includes("description") || line.toLowerCase().includes("why")) {
      currentBlog.description = line.split(/description:?|why:?/i)[1]?.trim() || line;
    } else if (line.toLowerCase().includes("insight") || line.toLowerCase().includes("key")) {
      currentBlog.keyInsight = line.split(/insight:?|key:?/i)[1]?.trim() || line;
    } else if (line.toLowerCase().includes("url") || line.startsWith("http")) {
      currentBlog.url = line.split(/url:?/i)[1]?.trim() || line;
    } else if (Object.keys(currentBlog).length > 0) {
      // Append to description if no clear field match
      currentBlog.description = `${currentBlog.description || ''} ${line}`.trim();
    }

    // Limit to 4 results
    if (results.length >= 4) break;
  }

  // Push the last blog if it has data
  if (Object.keys(currentBlog).length > 0) {
    results.push(currentBlog);
  }

  // Fill in missing fields with defaults
  return results.map(blog => ({
    title: blog.title || "Untitled Blog Post",
    domain: blog.domain || "unknown.com",
    description: blog.description || "No description provided",
    keyInsight: blog.keyInsight || "No key insight provided",
    url: blog.url || undefined,
  })).slice(0, 4);
}
