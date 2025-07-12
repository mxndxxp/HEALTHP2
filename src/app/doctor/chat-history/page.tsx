'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const chatHistory = [
  {
    patientId: '1',
    patientName: 'Jane Smith',
    lastMessage: 'Thank you, doctor!',
    lastMessageTimestamp: '2024-07-30T10:00:00Z',
    unreadCount: 0,
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    patientId: '2',
    patientName: 'Robert Brown',
    lastMessage: "I'll schedule a follow-up for next week.",
    lastMessageTimestamp: '2024-07-29T15:30:00Z',
    unreadCount: 2,
    avatar: 'https://placehold.co/100x100.png',
  },
  {
    patientId: '3',
    patientName: 'Emily Davis',
    lastMessage: 'Okay, I will get the tests done.',
    lastMessageTimestamp: '2024-07-29T11:45:00Z',
    unreadCount: 0,
    avatar: 'https://placehold.co/100x100.png',
  },
];

export default function DoctorChatHistoryPage() {
  const router = useRouter();

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
            <span className="sr-only">Back to Dashboard</span>
          </Button>
          <h1 className="text-xl font-semibold">Chat History</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0">
        <Card>
          <CardHeader>
            <CardTitle>All Conversations</CardTitle>
            <CardDescription>
              Review your past conversations with patients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <Link
                  key={chat.patientId}
                  href={`/doctor/chat/${chat.patientId}`}
                  className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.avatar} data-ai-hint="person avatar" />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{chat.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          chat.lastMessageTimestamp
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm text-muted-foreground">
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge className="h-5 w-5 justify-center p-0">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
