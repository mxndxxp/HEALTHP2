
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChatInterface } from '@/components/chat-interface';
import {
  Users,
  ChevronLeft,
  MessageSquare,
  Phone,
  Video,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DiscussionRoomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [doctorName, setDoctorName] = useState('');
  const [patientUID, setPatientUID] = useState('');
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnterRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !patientUID) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name and the patient UID.',
        variant: 'destructive',
      });
      return;
    }
    setHasEntered(true);
  };

  if (!hasEntered) {
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
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Doctors' Discussion Room</h1>
            </div>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Enter Discussion Room</CardTitle>
              <CardDescription>
                Please provide your name and the Patient UID to discuss.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEnterRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-name">Your Name</Label>
                  <Input
                    id="doctor-name"
                    placeholder="e.g., Dr. Reed"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-uid">Patient UID</Label>
                  <Input
                    id="patient-uid"
                    placeholder="e.g., HC-JAN5432-123456"
                    value={patientUID}
                    onChange={(e) => setPatientUID(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enter Room
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setHasEntered(false)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Exit Room</span>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Discussion Room</h1>
            <p className="text-sm text-muted-foreground">
              Discussing Patient: {patientUID}
            </p>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Tabs defaultValue="chat" className="flex flex-1 flex-col">
          <div className="border-b p-2">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
              <TabsTrigger value="chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Text Chat
              </TabsTrigger>
              <TabsTrigger value="call" disabled>
                <Phone className="mr-2 h-4 w-4" />
                Voice Call
              </TabsTrigger>
              <TabsTrigger value="video" disabled>
                <Video className="mr-2 h-4 w-4" />
                Video Conference
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="chat" className="flex-1 overflow-auto">
            <ChatInterface
              chatId="doctors_discussion_room"
              currentUser={doctorName}
            />
          </TabsContent>
          <TabsContent value="call" className="flex-1 overflow-auto p-4">
            <div className="text-center text-muted-foreground p-10 border rounded-lg h-full flex flex-col justify-center items-center">
                <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Voice Call</h3>
                <p className="text-muted-foreground mt-2">This feature is not yet available in the prototype.</p>
            </div>
          </TabsContent>
          <TabsContent value="video" className="flex-1 overflow-auto p-4">
             <div className="text-center text-muted-foreground p-10 border rounded-lg h-full flex flex-col justify-center items-center">
                <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Video Conference</h3>
                <p className="text-muted-foreground mt-2">This feature is not yet available in the prototype.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
