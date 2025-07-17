
'use client';
import { useRouter, useParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat-interface';
import { User, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getChatId } from '@/lib/chat-service';
import { useEffect, useState } from 'react';
import { getPatientData } from '@/lib/patient-data-service';
import type { HealthData } from '@/lib/types';


export default function DoctorChatPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Array.isArray(params.patientId) ? params.patientId[0] : params.patientId;
  const [patient, setPatient] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    
    const fetchPatientInfo = async () => {
      try {
        setIsLoading(true);
        const { data } = await getPatientData(patientId, true);
        setPatient(data);
      } catch (error) {
        console.error("Failed to fetch patient info for chat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatientInfo();
  }, [patientId]);

  // For this prototype, we'll assume the doctor's ID is '1'.
  // In a real app, this would come from the authenticated session.
  const doctorId = '1'; 
  const chatId = getChatId(doctorId, patientId);

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <div className="flex items-center gap-3">
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin"/>
                    ) : patient ? (
                        <>
                           <Avatar>
                                <AvatarImage src={patient.patientInfo.avatar} data-ai-hint="person avatar" />
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-lg font-semibold">{patient.patientInfo.name}</h1>
                                <p className="text-sm text-muted-foreground font-mono">{patient.patientInfo.uniqueId}</p>
                            </div>
                        </>
                    ) : (
                        <p>Patient not found.</p>
                    )}
                </div>
            </div>
        </header>
        <ChatInterface
            chatId={chatId}
            currentUser="doctor"
        />
    </div>
  );
}
