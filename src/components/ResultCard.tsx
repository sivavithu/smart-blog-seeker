
import React from 'react';
import { ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { BlogResult } from '../services/blogService';
import { copyToClipboard } from '../utils/clipboard';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
  result: BlogResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyInsight = () => {
    copyToClipboard(`Key Insight from ${result.title}: ${result.keyInsight}`);
    setCopied(true);
    toast.success("Copied insight to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-1">
          <a 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-forest hover:underline flex items-center"
            aria-label={`Read ${result.title} - opens in a new tab`}
          >
            {result.title}
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="w-3 h-3 bg-gray-200 rounded-full mr-2" aria-hidden="true"></div>
          <span>{result.domain}</span>
        </div>
        
        <div className="mb-4">
          <p className="font-medium mb-1">Why It Fits:</p>
          <p className="text-gray-700">{result.description}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center text-forest-dark font-medium mb-1">
                <span className="mr-1">💡</span> Key Insight
              </span>
              <p className="text-gray-800">{result.keyInsight}</p>
            </div>
            
            <Button
              onClick={handleCopyInsight}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 hover:bg-gray-200"
              aria-label="Copy key insight to clipboard"
            >
              {copied ? (
                <span className="flex items-center">
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Copied
                </span>
              ) : (
                <span className="flex items-center">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Tip
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
