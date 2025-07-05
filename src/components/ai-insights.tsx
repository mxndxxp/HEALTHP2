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
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { healthInsights } from '@/ai/flows/health-insights';
import type { HealthInsightsOutput } from '@/ai/flows/health-insights';
import { Loader2, Lightbulb, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AiInsights() {
  const [patientData, setPatientData] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [lifestyleFactors, setLifestyleFactors] = useState('');
  const [senseOrganData, setSenseOrganData] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!patientData || !medicalHistory || !lifestyleFactors || !senseOrganData) {
        toast({
            title: "Missing Information",
            description: "Please fill out all fields to generate insights.",
            variant: "destructive"
        })
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const insights = await healthInsights({
        patientData,
        medicalHistory,
        lifestyleFactors,
        senseOrganData,
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
            Input patient data to generate AI-powered health insights, risk
            assessments, and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patientData">Patient Data</Label>
            <Textarea
              id="patientData"
              placeholder="e.g., John Doe, 35, Male, BMI 23.1..."
              value={patientData}
              onChange={(e) => setPatientData(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              placeholder="e.g., Family history of hypertension. Past appendectomy..."
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lifestyleFactors">Lifestyle Factors</Label>
            <Textarea
              id="lifestyleFactors"
              placeholder="e.g., Moderately active, sleeps 7 hours/night, occasional alcohol..."
              value={lifestyleFactors}
              onChange={(e) => setLifestyleFactors(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senseOrganData">Sense Organ Data</Label>
            <Textarea
              id="senseOrganData"
              placeholder="e.g., Reports myopia. Dental sensitivity in teeth 14, 24..."
              value={senseOrganData}
              onChange={(e) => setSenseOrganData(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
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
                    <p className="text-muted-foreground mt-1">{result.diagnosticSummary}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Potential Conditions</h3>
                    <p className="text-muted-foreground mt-1">{result.potentialConditions}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Lifestyle Recommendations</h3>
                    <p className="text-muted-foreground mt-1">{result.lifestyleRecommendations}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
