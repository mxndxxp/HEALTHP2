'use client';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/chat-interface';
import { User, MessageSquare, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const patients: {[key: string]: { name: string, uniqueId: string, avatar: string }} = {
  '1': { name: 'Jane Smith', uniqueId: 'HC-JAN6543-832941', avatar: 'https://placehold.co/100x100.png' },
  '2': { name: 'Robert Brown', uniqueId: 'HC-ROB1234-918273', avatar: 'https://placehold.co/100x100.png' },
  '3': { name: 'Emily Davis', uniqueId: 'HC-EMI5678-192837', avatar: 'https://placehold.co/100x100.png' },
  '4': { name: 'Michael Wilson', uniqueId: 'HC-MIC9012-483726', avatar: 'https://placehold.co/100x100.png' },
  '5': { name: 'Sarah Johnson', uniqueId: 'HC-SAR3456-564738', avatar: 'https://placehold.co/100x100.png' },
};


export default function DoctorChatPage({ params }: { params: { patientId: string } }) {
  const router = useRouter();
  const patient = patients[params.patientId] || { name: 'Unknown Patient', uniqueId: 'N/A', avatar: '' };

  const initialMessages = [
    { id: '1', text: `Hello ${patient.name}, this is your doctor. How are you feeling today?`, sender: 'doctor' as const },
    { id: '2', text: 'Hi Doctor, I\'m feeling a bit better, thank you for asking.', sender: 'patient' as const },
  ];

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={patient.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-lg font-semibold">{patient.name}</h1>
                        <p className="text-sm text-muted-foreground font-mono">{patient.uniqueId}</p>
                    </div>
                </div>
            </div>
        </header>
        <ChatInterface
            initialMessages={initialMessages}
            currentUser="doctor"
            recipientUser="patient"
        />
    </div>
  );
}
