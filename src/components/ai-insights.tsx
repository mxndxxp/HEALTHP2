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
import { Loader2, Lightbulb, Sparkles, AlertTriangle, TestTube, HeartPulse } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { HealthData } from '@/lib/types';

type AiInsightsProps = {
  data: HealthData;
  t: any;
};

export function AiInsights({ data, t }: AiInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Clone the data and remove file contents for the JSON part
      const patientDataForJson = JSON.parse(JSON.stringify(data));
      delete patientDataForJson.medicalHistory.documents;
      
      const insights = await healthInsights({
        patientData: JSON.stringify(patientDataForJson, null, 2),
        reportDocument: data.medicalHistory.documents.reports || undefined,
        prescriptionDocument: data.medicalHistory.documents.prescriptions || undefined,
        problemPhoto: data.medicalHistory.documents.photos || undefined,
      });
      setResult(insights);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: t.errorTitle,
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
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.buttonLoading}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {t.buttonText}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
         <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> {t.errorCardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb /> {t.resultsTitle}</CardTitle>
                <CardDescription>{t.disclaimer}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles /> {t.summary}</h3>
                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{result.diagnosticSummary}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2"><AlertTriangle /> {t.conditions}</h3>
                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{result.potentialConditions}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2"><HeartPulse /> {t.recommendations}</h3>
                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{result.lifestyleRecommendations}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2"><TestTube /> {t.nextSteps}</h3>
                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{result.suggestedNextSteps}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
