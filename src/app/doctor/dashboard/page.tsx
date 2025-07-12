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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const patients = [
  {
    id: '1',
    name: 'Jane Smith',
    uniqueId: 'HC-JAN6543-832941',
    lastVisit: '2024-07-29',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Robert Brown',
    uniqueId: 'HC-ROB1234-918273',
    lastVisit: '2024-07-28',
    status: 'Stable',
  },
  {
    id: '3',
    name: 'Emily Davis',
    uniqueId: 'HC-EMI5678-192837',
    lastVisit: '2024-07-25',
    status: 'Monitoring',
  },
   {
    id: '4',
    name: 'Michael Wilson',
    uniqueId: 'HC-MIC9012-483726',
    lastVisit: '2024-07-22',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    uniqueId: 'HC-SAR3456-564738',
    lastVisit: '2024-07-20',
    status: 'Discharged',
  },
];

export default function DoctorDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };
  
  const handleReturn = () => {
    router.push('/');
  }

  const handleViewPatient = () => {
    // In a real app, this would use the patient's ID to fetch their data.
    // For this prototype, we'll just navigate to the existing patient dashboard.
    router.push('/dashboard');
  }
  
  const handleMessagePatient = (patientId: string) => {
    router.push(`/doctor/chat/${patientId}`);
  }

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
            <DropdownMenuItem onSelect={handleLogout} className="text-destructive">
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
            <CardContent>
                 <Button onClick={() => router.push('/doctor/chat-history')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Chat History
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Unique ID</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Visit
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
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="font-mono">{patient.uniqueId}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {patient.lastVisit}
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={handleViewPatient}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleMessagePatient(patient.id)}>Message Patient</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
