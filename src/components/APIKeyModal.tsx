import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface APIKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const APIKeyModal = ({ open, onClose, onSubmit }: APIKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "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",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved securely in your browser.",
    });
    onClose();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Key Required</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>To provide personalized health advice, we need your OpenAI API key.</p>
            <p className="text-sm text-muted-foreground">
              Your API key will be stored securely in your browser and never shared.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveKey} className="flex-1">
              Save & Continue
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Get your API key from: platform.openai.com</p>
            <p>• Your key is stored locally and never transmitted to our servers</p>
            <p>• Standard OpenAI usage rates apply</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
