import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface HealthResponse {
  category: string;
  reliefSteps: string[];
  dietTips?: { foods: string[]; recipes: string[] };
  exerciseTips?: { exercises: string[] };
}

interface HealthResultsProps {
  results: HealthResponse;
  onNewConsultation: () => void;
  onBack: () => void;
}

export const HealthResults = ({ results, onNewConsultation, onBack }: HealthResultsProps) => {
  const getCategoryIcon = () => {
    switch (results.category.toLowerCase()) {
      case 'dangerous':
        return <AlertTriangle className="h-5 w-5" />;
      case 'mild':
        return <AlertCircle className="h-5 w-5" />;
      case 'normal':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getCategoryColor = () => {
    switch (results.category.toLowerCase()) {
      case 'dangerous':
        return 'destructive';
      case 'mild':
        return 'warning';
      case 'normal':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-primary">Your Health Report</h1>
        </div>

        <div className="space-y-6">
          {/* Category Card */}
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Health Assessment
                {getCategoryIcon()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={getCategoryColor() as any} 
                className="text-lg px-4 py-2"
              >
                {results.category}
              </Badge>
            </CardContent>
          </Card>

          {/* Relief Steps */}
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Recommended Relief Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.reliefSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Diet Tips */}
          {results.dietTips && (
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle>Diet Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Recommended Foods:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {results.dietTips.foods.map((food, index) => (
                      <li key={index}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recipes:</h4>
                  <div className="space-y-3">
                    {results.dietTips.recipes.map((recipe, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{recipe}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exercise Tips */}
          {results.exerciseTips && (
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle>Exercise Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.exerciseTips.exercises.map((exercise, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{exercise}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card className="shadow-xl border-0 bg-warning/10 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-warning-foreground">Important Disclaimer</h4>
                  <p className="text-sm text-warning-foreground/80">
                    Curo.ai is for educational purposes only and does not provide medical advice, 
                    diagnosis, or treatment. Please consult a healthcare professional for serious 
                    or persistent symptoms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pb-8">
            <Button
              onClick={onNewConsultation}
              size="lg"
              className="flex-1 text-lg py-6 rounded-xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              New Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};