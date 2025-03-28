
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SearchIcon } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="mb-4">
        <Textarea
          id="search-textarea"
          placeholder="Type your ideal blog post description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-32 p-4 border-gray-300 focus:border-forest focus:ring-forest"
          aria-label="Blog search query"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground max-w-xs">
          We'll match based on your exact needs, not just keywords
        </p>
        
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-forest hover:bg-forest-light text-white px-4 py-2 rounded flex items-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Searching...
            </span>
          ) : (
            <span className="flex items-center">
              <SearchIcon className="mr-2 h-4 w-4" />
              Find My Blogs
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
