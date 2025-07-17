'use client';
import { ChatInterface } from '@/components/chat-interface';
import { Stethoscope } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getChatId } from '@/lib/chat-service';

const doctors: { [key: string]: { name: string, specialization: string, avatar: string } } = {
  '1': { name: 'Dr. Evelyn Reed', specialization: 'Cardiologist', avatar: 'https://placehold.co/100x100.png' },
  '2': { name: 'Dr. Ben Carter', specialization: 'Neurologist', avatar: 'https://placehold.co/100x100.png' },
};

export default function PatientChatPage({ params }: { params: { doctorId: string } }) {
  const doctor = doctors[params.doctorId] || { name: 'Unknown Doctor', specialization: 'N/A', avatar: '' };

  // For this prototype, we'll assume the patient's ID is '1'.
  // In a real app, this would come from the authenticated session.
  const patientId = '1';
  const chatId = getChatId(params.doctorId, patientId);

  return (
    <div className="flex h-full flex-col">
       <header className="flex h-16 items-center border-b bg-background px-4 md:px-6">
           <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={doctor.avatar} data-ai-hint="doctor avatar" />
                    <AvatarFallback><Stethoscope /></AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-lg font-semibold">{doctor.name}</h1>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                </div>
            </div>
       </header>
        <ChatInterface
            chatId={chatId}
            currentUser="patient"
        />
    </div>
  );
}
