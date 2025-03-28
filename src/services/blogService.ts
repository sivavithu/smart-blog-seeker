
import { BlogResult } from "../components/BlogFinder";

// This is a mock implementation for demo purposes
// In a real app, you would call your actual API endpoint
export const generateBlogRecommendations = async (query: string): Promise<BlogResult[]> => {
  console.log(`Searching for blogs matching: "${query}"`);
  
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, generate results based on the query
      // In production, this would be replaced with a real API call to /generate-blogs
      if (query.toLowerCase().includes("ergonomic") && query.toLowerCase().includes("keyboard")) {
        resolve(ergonomicKeyboardResults);
      } else if (query.toLowerCase().includes("compost") || query.toLowerCase().includes("apartment")) {
        resolve(compostingResults);
      } else if (query.trim() === "") {
        resolve([]);
      } else {
        // Generate some generic results based on the query
        resolve(generateGenericResults(query));
      }
    }, 1500);
  });
};

// Sample results for ergonomic keyboards query
const ergonomicKeyboardResults: BlogResult[] = [
  {
    id: "1",
    title: "The 2024 Guide to Pain-Free Coding",
    domain: "ergonomickeyboards.org/arthritis-friendly",
    description: "Compares 5 keyboards tested by physical therapists for joint relief.",
    keyInsight: "Split keyboards reduce wrist extension by 30% vs traditional models",
    url: "https://example.com/keyboard-guide"
  },
  {
    id: "2",
    title: "Mechanical vs Membrane: The Arthritis Test",
    domain: "codehealthy.com/keyboard-comparison",
    description: "A programmer with arthritis tests 12 keyboard types over 6 months.",
    keyInsight: "Cherry MX Brown switches required 45% less force than membrane keys",
    url: "https://example.com/mechanical-membrane"
  },
  {
    id: "3",
    title: "Ergonomic Setups for Long-Term Coding Health",
    domain: "devhealth.io/ergonomic-workspace",
    description: "Comprehensive guide to setting up an ergonomic programming workspace.",
    keyInsight: "Tenting angle of 15° significantly reduced pronation strain in 89% of testers",
    url: "https://example.com/ergonomic-setups"
  }
];

// Sample results for composting query
const compostingResults: BlogResult[] = [
  {
    id: "4",
    title: "Apartment Composting With Pets: The Complete Guide",
    domain: "sustainableapartment.com/composting-with-cats",
    description: "Step-by-step guide for indoor composting that's safe for cats and small spaces.",
    keyInsight: "Bokashi systems process food scraps 2x faster than traditional compost bins",
    url: "https://example.com/apartment-composting"
  },
  {
    id: "5",
    title: "Small-Space Vermicomposting: Keeping Cats Out",
    domain: "urbanworms.net/pet-safe-solutions",
    description: "How to maintain a worm bin in an apartment with curious cats.",
    keyInsight: "Securing bin lids with 3lb weights prevents cat access while allowing airflow",
    url: "https://example.com/vermicomposting"
  },
  {
    id: "6",
    title: "Odorless Indoor Composting for Pet Owners",
    domain: "zerowastecity.org/indoor-composting",
    description: "Methods to eliminate odors that might attract pets to your compost.",
    keyInsight: "Activated charcoal filters block 98% of compost odors that attract pets",
    url: "https://example.com/odorless-composting"
  }
];

// Generate generic results based on query
const generateGenericResults = (query: string): BlogResult[] => {
  const words = query.split(' ').filter(word => word.length > 3);
  const topics = words.length > 1 ? words.slice(0, 2) : words.length === 1 ? [words[0], "guide"] : ["interesting", "topic"];
  
  return [
    {
      id: `gen1-${Date.now()}`,
      title: `Ultimate Guide to ${capitalizeWords(topics[0])} ${capitalizeWords(topics[1] || "")}`,
      domain: `${topics[0].toLowerCase()}expert.com/${topics[1] || "guides"}`,
      description: `Comprehensive coverage of ${topics[0]} with practical tips and expert advice.`,
      keyInsight: `Most ${topics[0]} enthusiasts overlook the importance of regular ${topics[1] || "practice"}`,
      url: "https://example.com/generic-1"
    },
    {
      id: `gen2-${Date.now()}`,
      title: `${capitalizeWords(topics[0])} for Beginners: What You Need to Know`,
      domain: `learn${topics[0].toLowerCase()}.org/getting-started`,
      description: `Beginner-friendly introduction to ${topics[0]} with step-by-step instructions.`,
      keyInsight: `Starting with just 15 minutes of daily ${topics[0]} practice yields 80% of expert results`,
      url: "https://example.com/generic-2"
    },
    {
      id: `gen3-${Date.now()}`,
      title: `The Science Behind Effective ${capitalizeWords(topics[0])}`,
      domain: `${topics[0].toLowerCase()}science.edu/research`,
      description: `Research-backed methods to improve your ${topics[0]} skills and knowledge.`,
      keyInsight: `Recent studies show that combining ${topics[0]} with ${topics[1] || "regular practice"} improves results by 40%`,
      url: "https://example.com/generic-3"
    }
  ];
};

const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// In a real implementation, you would make an actual API call like this:
/*
export const generateBlogRecommendations = async (query: string): Promise<BlogResult[]> => {
  try {
    const response = await fetch('/generate-blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blog recommendations:', error);
    throw error;
  }
};
*/
