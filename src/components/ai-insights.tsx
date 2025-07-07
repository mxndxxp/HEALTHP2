'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { healthInsights } from '@/ai/flows/health-insights';
import type { HealthInsightsOutput } from '@/ai/flows/health-insights';
import { Loader2, Lightbulb, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { HealthData } from '@/lib/types';

type AiInsightsProps = {
  data: HealthData;
};

export function AiInsights({ data }: AiInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Sanitize data by removing file objects before stringifying
    const sanitizedData = JSON.parse(JSON.stringify(data, (key, value) => {
        if (value instanceof File) {
            return {
                name: value.name,
                size: value.size,
                type: value.type,
            };
        }
        return value;
    }));

    const fullReportData = JSON.stringify(sanitizedData, null, 2);

    try {
      const insights = await healthInsights({
        fullReportData,
      });
      setResult(insights);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: "Error Generating Insights",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Health Analysis Engine</CardTitle>
          <CardDescription>
            Click the button below to generate AI-powered health insights based on the complete patient report. Ensure all sections have been filled out for the most accurate analysis.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Full Report...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights from Full Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
         <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb /> AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg">Diagnostic Summary</h3>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{result.diagnosticSummary}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Potential Conditions</h3>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{result.potentialConditions}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Lifestyle Recommendations</h3>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{result.lifestyleRecommendations}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
