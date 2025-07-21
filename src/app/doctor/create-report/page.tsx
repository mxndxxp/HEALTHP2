
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft,
  Download,
  Eraser,
  Send,
  User,
  FilePenLine,
  Loader2,
} from 'lucide-react';
import { getAllPatients } from '@/lib/patient-data-service';
import { createReport } from '@/lib/report-service';
import type { HealthData } from '@/lib/types';

const PrintableReport = React.forwardRef(({ reportData }: any, ref: any) => {
    return (
        <div ref={ref} className="p-8 bg-white text-black font-sans">
            <header className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold text-primary">HealthSight Medical Report</h1>
                    <p className="text-sm">Generated on: {new Date().toLocaleDateString()}</p>
                </div>
                <div>
                    <p><span className="font-semibold">Doctor:</span> {reportData.doctorName}</p>
                </div>
            </header>
            <section className="py-4 border-b">
                <h2 className="text-lg font-semibold">Patient Details</h2>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <p><span className="font-semibold">Name:</span> {reportData.patientName}</p>
                    <p><span className="font-semibold">Patient ID:</span> {reportData.patientId}</p>
                </div>
            </section>
            <main className="py-6">
                <h2 className="text-lg font-semibold mb-2">Report</h2>
                <div className="p-4 border rounded-md bg-gray-50 min-h-[400px]">
                    <p className="whitespace-pre-wrap">{reportData.content}</p>
                </div>
            </main>
            <footer className="pt-8 mt-16">
                 <h3 className="font-semibold">Doctor's Signature:</h3>
                 <div className="mt-4 border-t pt-2">
                    {reportData.signatureDataUrl && <img src={reportData.signatureDataUrl} alt="Doctor's Signature" className="h-20 w-auto" />}
                 </div>
            </footer>
        </div>
    );
});
PrintableReport.displayName = 'PrintableReport';


export default function CreateReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [patients, setPatients] = useState<HealthData[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // For prototype purposes, assume doctor is logged in
  const doctorId = '1'; 
  const doctorName = 'Dr. Evelyn Reed';

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const patientList = await getAllPatients();
        setPatients(patientList);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch patients.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [toast]);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };
  
  const handlePrint = useReactToPrint({
      content: () => reportRef.current,
      documentTitle: `report-${selectedPatientId}-${Date.now()}`
  });

  const handleSubmit = async () => {
    if (!selectedPatientId || !reportContent || sigCanvas.current?.isEmpty()) {
      toast({
        title: 'Missing Information',
        description: 'Please select a patient, write a report, and provide your signature.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const signatureDataUrl = sigCanvas.current.toDataURL('image/png');
      
      await createReport({
          patientId: selectedPatientId,
          doctorId,
          doctorName,
          content: reportContent,
          signatureDataUrl,
          status: 'pending',
      });

      toast({
          title: 'Report Submitted',
          description: 'Your report has been sent for admin approval.'
      });
      router.push('/doctor/dashboard');

    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/doctor/dashboard')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FilePenLine className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Create Doctor's Report</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                Submit for Approval
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>Select a patient, write your report, and sign below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="patient-select">Select Patient</Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId} disabled={isLoading}>
                    <SelectTrigger id="patient-select">
                        <SelectValue placeholder={isLoading ? 'Loading patients...' : 'Select a patient...'} />
                    </SelectTrigger>
                    <SelectContent>
                        {patients.map(p => (
                            <SelectItem key={p.id} value={p.id!}>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" /> {p.patientInfo.name} ({p.id})
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="report-content">Report Content</Label>
                <Textarea
                    id="report-content"
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder="Write your detailed medical report here..."
                    rows={15}
                />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="signature-pad">Doctor's Signature</Label>
                    <Button variant="ghost" size="sm" onClick={clearSignature}>
                        <Eraser className="mr-2 h-4 w-4"/> Clear
                    </Button>
                </div>
                <div className="rounded-md border bg-white">
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{ className: 'w-full h-32' }}
                    />
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="hidden lg:block">
            <div className="border rounded-lg shadow-sm">
                 <PrintableReport ref={reportRef} reportData={{
                     patientId: selectedPatientId,
                     patientName: selectedPatient?.patientInfo.name || 'N/A',
                     doctorName,
                     content: reportContent,
                     signatureDataUrl: !sigCanvas.current?.isEmpty() ? sigCanvas.current?.toDataURL() : null
                 }} />
            </div>
        </div>
      </main>
    </div>
  );
}
