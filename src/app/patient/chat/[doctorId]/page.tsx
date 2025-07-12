'use client';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/chat-interface';
import { Stethoscope } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const doctors: { [key: string]: { name: string, specialization: string, avatar: string } } = {
  '1': { name: 'Dr. Evelyn Reed', specialization: 'Cardiologist', avatar: 'https://placehold.co/100x100.png' },
};

export default function PatientChatPage({ params }: { params: { doctorId: string } }) {
  const router = useRouter();
  const doctor = doctors[params.doctorId] || { name: 'Unknown Doctor', specialization: 'N/A', avatar: '' };

  const initialMessages = [
    { id: '1', text: `Hello, this is your doctor. How are you feeling today?`, sender: 'doctor' as const },
    { id: '2', text: 'Hi Doctor, I\'m feeling a bit better, thank you for asking.', sender: 'patient' as const },
  ];

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
            initialMessages={initialMessages}
            currentUser="patient"
            recipientUser="doctor"
        />
    </div>
  );
}
