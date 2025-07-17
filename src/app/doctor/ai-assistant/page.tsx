'use client';
import { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { doctorAiAssistant } from '@/ai/flows/doctor-ai-assistant';
import type { DoctorAiAssistantOutput } from '@/ai/flows/doctor-ai-assistant';
import {
  Loader2,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  TestTube,
  HeartPulse,
  Stethoscope,
  ChevronLeft,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getPatientData } from '@/lib/patient-data-service';
import type { HealthData } from '@/lib/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const patients = [
  { id: '1', name: 'Jane Smith' },
  { id: '2', name: 'Robert Brown' },
  { id: '3', name: 'Emily Davis' },
  { id: '4', name: 'Michael Wilson' },
  { id: '5', name: 'Sarah Johnson' },
];

export default function DoctorAIAssistantPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<HealthData | null>(null);
  const [result, setResult] = useState<DoctorAiAssistantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePatientSelect = async (selectedPatientId: string) => {
    setPatientId(selectedPatientId);
    setResult(null);
    setError(null);
    setIsLoading(true);
    try {
      const { data } = await getPatientData(selectedPatientId, true);
      setPatientData(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load patient data');
      setPatientData(null);
      toast({
        title: "Error loading patient data",
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!patientData) {
        toast({ title: 'Please select a patient first.', variant: 'destructive' });
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Clone the data and remove file contents for the JSON part
      const patientDataForJson = JSON.parse(JSON.stringify(patientData));
      delete patientDataForJson.medicalHistory.documents;

      const insights = await doctorAiAssistant({
        patientData: JSON.stringify(patientDataForJson, null, 2),
        reportDocument: patientData.medicalHistory.documents.reports || undefined,
        prescriptionDocument: patientData.medicalHistory.documents.prescriptions || undefined,
        problemPhoto: patientData.medicalHistory.documents.photos || undefined,
      });
      setResult(insights);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: "Error Generating Analysis",
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/doctor/dashboard')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
          <h1 className="text-xl font-semibold">AI Medical Assistant</h1>
        </div>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Patient Report</CardTitle>
            <CardDescription>
              Select a patient to load their data, then generate an expert AI analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
                <Select onValueChange={handlePatientSelect} disabled={isLoading}>
                    <SelectTrigger className="w-full sm:w-[280px]">
                        <SelectValue placeholder="Select a patient..." />
                    </SelectTrigger>
                    <SelectContent>
                        {patients.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    {p.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button onClick={handleSubmit} disabled={isLoading || !patientData} size="lg">
                    {isLoading && !result ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Consulting AI Assistant...
                    </>
                    ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Expert Analysis
                    </>
                    )}
                </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Analysis Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb /> AI Assistant's Report
              </CardTitle>
              <CardDescription>
                This analysis is generated by an expert AI model and is for
                informational purposes only. It is not a substitute for
                professional medical advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Stethoscope /> Diagnostic Summary
                </h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                  {result.diagnosticSummary}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <AlertTriangle /> Potential Conditions & Risks
                </h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                  {result.potentialConditions}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TestTube /> Suggested Treatments & Management
                </h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                  {result.suggestedTreatments}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <HeartPulse /> Follow-up Questions for Patient
                </h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                  {result.followUpQuestions}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
