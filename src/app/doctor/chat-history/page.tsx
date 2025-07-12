'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  List,
  ListItem
} from '@/components/ui/list';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MessageSquare, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

// Mock patient data
const patients = [
  { id: '1', name: 'Jane Smith', lastMessage: 'Thank you, doctor!', timestamp: '10:45 AM', avatar: 'https://placehold.co/100x100.png' },
  { id: '2', name: 'Robert Brown', lastMessage: 'I\'ll schedule the test for tomorrow.', timestamp: 'Yesterday', avatar: 'https://placehold.co/100x100.png' },
  { id: '3', name: 'Emily Davis', lastMessage: 'Feeling much better now.', timestamp: '2 days ago', avatar: 'https://placehold.co/100x100.png' },
];

export default function DoctorChatHistoryPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Button>
            <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Chat History</h1>
            </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>All Conversations</CardTitle>
            <CardDescription>
              Select a patient to view the full chat history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <List>
              {patients.map(patient => (
                <Link key={patient.id} href={`/doctor/chat/${patient.id}`} passHref>
                    <ListItem as="a" className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                        <AvatarImage src={patient.avatar} data-ai-hint="person avatar"/>
                        <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{patient.lastMessage}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">{patient.timestamp}</p>
                    </div>
                    </ListItem>
                </Link>
              ))}
            </List>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
