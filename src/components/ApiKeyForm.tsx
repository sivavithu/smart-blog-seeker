
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { hasApiKey, setApiKey } from '../services/blogService';
import { toast } from "sonner";

interface ApiKeyFormProps {
  onApiKeySet: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKeyValue] = useState('');
  const [isKeySet, setIsKeySet] = useState(hasApiKey());

  useEffect(() => {
    // Check if key is already set (from localStorage)
    setIsKeySet(hasApiKey());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    const success = setApiKey(apiKey);
    if (success) {
      setIsKeySet(true);
      toast.success("API key has been set successfully");
      onApiKeySet();
    } else {
      toast.error("Failed to set API key");
    }
  };

  const handleReset = () => {
    localStorage.removeItem('gemini_api_key');
    setIsKeySet(false);
    setApiKeyValue('');
    toast.info("API key has been reset");
  };

  if (isKeySet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>API Key Configured</CardTitle>
          <CardDescription>You can reset your API key if needed</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="destructive" onClick={handleReset}>Reset API Key</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Gemini API Key Required</CardTitle>
        <CardDescription>
          Enter your Gemini API key to enable blog recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKeyValue(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get your key from <a href="https://ai.google.dev/" className="text-forest hover:underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
            </p>
          </div>
          <Button type="submit" className="w-full bg-forest hover:bg-forest-light">
            Save API Key
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
