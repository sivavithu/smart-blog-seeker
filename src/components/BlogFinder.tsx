
import React, { useState } from 'react';
import SearchForm from './SearchForm';
import ResultCard from './ResultCard';
import { generateBlogRecommendations } from '../services/blogService';
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

export interface BlogResult {
  id: string;
  title: string;
  domain: string;
  description: string;
  keyInsight: string;
  url: string;
}

const BlogFinder: React.FC = () => {
  const [results, setResults] = useState<BlogResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setQuery(searchQuery);
    setIsLoading(true);
    setHasError(false);
    
    try {
      const blogResults = await generateBlogRecommendations(searchQuery);
      setResults(blogResults);
      
      if (blogResults.length === 0) {
        setHasError(true);
      }
    } catch (error) {
      console.error('Error searching blogs:', error);
      toast.error("Something went wrong. Please try again.");
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineSearch = () => {
    // Scroll back to the search box
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Append to the query to encourage refinement
    setQuery(prevQuery => `${prevQuery} `);
    
    // Focus the textarea after a short delay to allow scrolling
    setTimeout(() => {
      const textarea = document.getElementById('search-textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 500);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 min-h-screen">
      <header className="text-center mb-8 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-forest mb-2">
          Context Crafter – Find Perfect Blog Posts
        </h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Describe exactly what you need (e.g., 'composting guides for apartment dwellers with cats')
        </p>
      </header>

      <SearchForm 
        onSearch={handleSearch} 
        initialQuery={query}
        isLoading={isLoading} 
      />

      <div className="mt-10">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Finding your perfect blog matches...</p>
          </div>
        ) : (
          <>
            {hasError ? (
              <div className="text-center py-10 bg-muted/50 rounded-lg">
                <p className="text-xl mb-4">🔍 No perfect matches - try adding more details!</p>
                <Button onClick={handleRefineSearch} className="mt-2 bg-forest hover:bg-forest-light">
                  Refine Your Search
                </Button>
              </div>
            ) : (
              results.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Found {results.length} blog posts for you:</h2>
                  
                  {results.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))}
                  
                  <div className="text-center mt-8">
                    <Button onClick={handleRefineSearch} className="bg-forest hover:bg-forest-light">
                      Refine Your Search
                    </Button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogFinder;
