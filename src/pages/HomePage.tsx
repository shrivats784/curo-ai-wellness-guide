import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { HealthResults } from '@/components/HealthResults';

interface HealthResponse {
  category: string;
  reliefSteps: string[];
  dietTips?: { foods: string[]; recipes: string[] };
  exerciseTips?: { exercises: string[] };
}

const HomePage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [showDietTips, setShowDietTips] = useState(false);
  const [showExerciseTips, setShowExerciseTips] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HealthResponse | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();  

  const getThemeClass = useCallback(() => {
    if (showDietTips && showExerciseTips) return 'theme-combined';
    if (showDietTips) return 'theme-diet';
    if (showExerciseTips) return 'theme-exercise';
    return '';
  }, [showDietTips, showExerciseTips]);

  useEffect(() => {
    const themeClass = getThemeClass();
    document.documentElement.className = themeClass;
    return () => {
      document.documentElement.className = '';
    };
  }, [showDietTips, showExerciseTips, getThemeClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      toast({
        title: "Please enter your symptoms",
        description: "Describe how you're feeling to get personalized advice.",
        variant: "destructive",
      });
      return;
    }

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "OpenAI API key is not configured in the environment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await callOpenAI(symptoms, showDietTips, showExerciseTips, apiKey);
      setResults(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get health advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const callOpenAI = async (
    userSymptoms: string,
    includeDiet: boolean,
    includeExercise: boolean,
    apiKey: string
  ): Promise<HealthResponse> => {
    const prompt = `You are a helpful healthcare assistant. The user reports the following symptoms: ${userSymptoms}. 

Please respond in JSON format with the following structure:
{
  "category": "Dangerous|Mild|Normal",
  "reliefSteps": ["step1", "step2", "step3"],
  ${includeDiet ? '"dietTips": {"foods": ["food1", "food2"], "recipes": ["recipe1 with details", "recipe2 with details"]},' : ''}
  ${includeExercise ? '"exerciseTips": {"exercises": ["exercise1 with type, reps/duration, and description", "exercise2 with type, reps/duration, and description"]}' : ''}
}

Categorize the condition as Dangerous, Mild, or Normal. Suggest practical relief steps. 
${includeDiet ? 'Include 2 healthy foods with detailed recipes.' : ''}
${includeExercise ? 'Include 2 home exercises appropriate for the health condition (gentle for dangerous/mild, moderate for normal) with type, reps/duration, and brief description.' : ''}

Keep responses professional and clear.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch {
      return {
        category: 'Normal',
        reliefSteps: [content],
      };
    }
  };

  const handleNewConsultation = () => {
    setSymptoms('');
    setResults(null);
    setShowDietTips(false);
    setShowExerciseTips(false);
  };

  if (results) {
    return (
      <HealthResults 
        results={results}
        onNewConsultation={handleNewConsultation}
        onBack={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-4 transition-all duration-700">
      <div className="max-w-2xl mx-auto pt-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-primary/10 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-primary">Curo.ai</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="hover:bg-primary/10 transition-all duration-200"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur animate-scale-in transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground animate-slide-up">
              How can we help you today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 animate-slide-up delay-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-base font-medium">
                  Describe your symptoms
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Tell us how you're feeling... (e.g., headache, fatigue, stomach pain)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                  <div className="space-y-1">
                    <Label htmlFor="diet-toggle" className="font-medium">
                      Show Diet Tips
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get healthy food recommendations and recipes
                    </p>
                  </div>
                  <Switch
                    id="diet-toggle"
                    checked={showDietTips}
                    onCheckedChange={setShowDietTips}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted/70">
                  <div className="space-y-1">
                    <Label htmlFor="exercise-toggle" className="font-medium">
                      Show Exercise Tips
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get appropriate exercises for your condition
                    </p>
                  </div>
                  <Switch
                    id="exercise-toggle"
                    checked={showExerciseTips}
                    onCheckedChange={setShowExerciseTips}
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-6 rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Getting your health advice...
                  </>
                ) : (
                  'Get Health Advice'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
