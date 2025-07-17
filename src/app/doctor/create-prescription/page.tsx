
'use client';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  FileDown,
  PlusCircle,
  Send,
  Stethoscope,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getChatId, addMessageToHistory } from '@/lib/chat-service';
import { useToast } from '@/hooks/use-toast';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
};

// Component for the printable prescription
const PrescriptionComponent = ({
  patientUID,
  patientName,
  doctorName,
  date,
  medications,
  advice,
}: any) => {
  return (
    <div className="p-8 border rounded-lg bg-white text-black">
      <header className="flex items-start justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Stethoscope /> HealthSight Clinic
          </h2>
          <p className="text-sm text-muted-foreground">
            123 Health St, Wellness City, 12345
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">Prescription (Rx)</p>
          <p className="text-sm text-gray-600">Date: {date}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 py-4 border-b">
        <div>
          <p className="text-sm font-semibold">Patient Name:</p>
          <p>{patientName}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Patient UID:</p>
          <p className="font-mono">{patientUID}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Prescribing Doctor:</p>
          <p>{doctorName}</p>
        </div>
      </section>

      <main className="py-6">
        <h3 className="text-lg font-bold mb-4">Medications</h3>
        <div className="space-y-4">
          {medications.map((med: Medication, index: number) => (
            <div key={med.id} className="p-3 rounded-md bg-muted/50">
              <p className="font-semibold">
                {index + 1}. {med.name}
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground pl-4">
                <p>
                  <strong>Dosage:</strong> {med.dosage}
                </p>
                <p>
                  <strong>Frequency:</strong> {med.frequency}
                </p>
                <p>
                  <strong>Duration:</strong> {med.duration}
                </p>
              </div>
            </div>
          ))}
        </div>

        {advice && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Advice</h3>
            <p className="text-sm whitespace-pre-wrap">{advice}</p>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>This is a digitally generated prescription.</p>
      </footer>
    </div>
  );
};

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [patientUID, setPatientUID] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Evelyn Reed'); // Should come from auth
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [advice, setAdvice] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const prescriptionRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => prescriptionRef.current,
    documentTitle: `prescription-${patientUID}`,
  });

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const handleRemoveMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleMedicationChange = (
    id: number,
    field: keyof Omit<Medication, 'id'>,
    value: string
  ) => {
    setMedications(
      medications.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const formatPrescriptionForChat = () => {
    let message = `**--- PRESCRIPTION from ${doctorName} ---**\n`;
    message += `*Date: ${date}*\n\n`;
    message += `**Patient:** ${patientName} (ID: ${patientUID})\n\n`;
    message += `**Medications:**\n`;
    medications.forEach((med, index) => {
      if (med.name) {
        message += `${index + 1}. **${med.name}**\n`;
        message += `   - Dosage: ${med.dosage}\n`;
        message += `   - Frequency: ${med.frequency}\n`;
        message += `   - Duration: ${med.duration}\n`;
      }
    });
    if (advice) {
      message += `\n**Advice:**\n${advice}\n`;
    }
    message += `\n*This is a digital prescription. Please follow up if you have questions.*`;
    return message;
  };

  const handleSendPrescription = async () => {
    if (!patientUID) {
      toast({
        title: 'Patient UID is required',
        description: 'Please enter the patient\'s unique ID to send the prescription.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      // For this prototype, the doctor's ID is hardcoded as '1'
      const doctorId = '1';
      const patientId = patientUID; // Assuming UID is the patient's ID in the system
      const chatId = getChatId(doctorId, patientId);

      const prescriptionMessage = formatPrescriptionForChat();
      
      await addMessageToHistory(chatId, {
        text: prescriptionMessage,
        sender: doctorName,
      });

      toast({
        title: 'Prescription Sent',
        description: `The prescription has been sent to ${patientName}.`,
      });
      router.push(`/doctor/chat/${patientId}`);
    } catch (error) {
        console.error("Failed to send prescription:", error);
        toast({
            title: 'Failed to Send',
            description: 'There was an error sending the prescription. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/doctor/dashboard')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Create Prescription</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handleSendPrescription} disabled={isSending}>
            {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            ) : (
                <Send className="mr-2 h-4 w-4" />
            )}
            Send to Patient
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Side */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
            <CardDescription>
              Fill in the patient and medication details below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-uid">Patient UID</Label>
                <Input
                  id="patient-uid"
                  value={patientUID}
                  onChange={(e) => setPatientUID(e.target.value)}
                  placeholder="HC-JAN5432-123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Medications</Label>
              {medications.map((med, index) => (
                <div key={med.id} className="space-y-2 rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">
                      Medication #{index + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMedication(med.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Drug Name (e.g., Paracetamol)"
                    value={med.name}
                    onChange={(e) =>
                      handleMedicationChange(med.id, 'name', e.target.value)
                    }
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedicationChange(med.id, 'dosage', e.target.value)
                      }
                    />
                    <Input
                      placeholder="Frequency (e.g., 1-1-1)"
                      value={med.frequency}
                      onChange={(e) =>
                        handleMedicationChange(
                          med.id,
                          'frequency',
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="Duration (e.g., 5 days)"
                      value={med.duration}
                      onChange={(e) =>
                        handleMedicationChange(
                          med.id,
                          'duration',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddMedication}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="advice">Advice</Label>
              <Textarea
                id="advice"
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="e.g., Take with food, drink plenty of water, follow up in 1 week."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview Side */}
        <div className="hidden lg:block">
          <div ref={prescriptionRef}>
            <PrescriptionComponent
              patientUID={patientUID}
              patientName={patientName}
              doctorName={doctorName}
              date={date}
              medications={medications}
              advice={advice}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
