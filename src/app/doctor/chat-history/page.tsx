
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllPatients } from '@/lib/patient-data-service';
import type { HealthData } from '@/lib/types';


export default function DoctorChatHistoryPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<HealthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const patientList = await getAllPatients();
        setPatients(patientList);
      } catch (err) {
        setError('Failed to load patient list.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

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
             {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : error ? (
                <p className="text-center text-destructive">{error}</p>
            ) : (
                 <div className="space-y-2">
                  {patients.map((patient) => (
                    <Link
                      key={patient.id}
                      href={`/doctor/chat/${patient.id}`}
                      className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={patient.patientInfo.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{patient.patientInfo.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {/* Placeholder for last message time */}
                            {new Date().toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm text-muted-foreground">
                            {/* Placeholder for last message */}
                            Click to view chat...
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
