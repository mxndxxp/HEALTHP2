
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  ClipboardList,
  User,
  LogOut,
  ChevronLeft,
  MessageSquare,
  Bot,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllPatients } from '@/lib/patient-data-service';
import type { HealthData } from '@/lib/types';


export default function DoctorDashboardPage() {
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

  const handleLogout = () => {
    router.push('/');
  };

  const handleReturn = () => {
    router.push('/');
  };

  const handleViewPatient = (patientId: string) => {
    // In a real app, this would use the patient's ID to fetch their data.
    // For this prototype, we'll just navigate to the existing patient dashboard.
    // For now, it will always show patient '1' as per dashboard logic
    router.push('/dashboard');
  };

  const handleMessagePatient = (patientId: string) => {
    router.push(`/doctor/chat/${patientId}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleReturn}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Return</span>
          </Button>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Doctor Dashboard</h1>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={handleLogout}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0">
        <Card>
          <CardHeader>
            <CardTitle>Doctor Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={() => router.push('/doctor/chat-history')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              View Chat History
            </Button>
             <Button onClick={() => router.push('/doctor/ai-assistant')}>
              <Bot className="mr-2 h-4 w-4" />
              AI Medical Assistant
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              A list of all patients registered on the platform.
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Unique ID</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date of Visit
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          {patient.patientInfo.name}
                        </TableCell>
                        <TableCell className="font-mono">
                          {patient.patientInfo.uniqueId}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {patient.patientInfo.dateOfVisit}
                        </TableCell>
                        <TableCell>
                          {/* Placeholder for status */}
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => handleViewPatient(patient.id!)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleMessagePatient(patient.id!)}
                              >
                                Message Patient
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Schedule Follow-up
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
