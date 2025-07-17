'use client';
import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Users,
  Stethoscope,
  DollarSign,
  PlusCircle,
  Loader2,
  AlertTriangle,
  User,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { getAllPatients } from '@/lib/patient-data-service';
import { addDoctor, getAllDoctors } from '@/lib/doctor-service';
import type { HealthData } from '@/lib/types';
import type { Doctor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminDashboardPage() {
  const [patients, setPatients] = useState<HealthData[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialization, setNewDoctorSpecialization] = useState('');
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [patientList, doctorList] = await Promise.all([
        getAllPatients(),
        getAllDoctors(),
      ]);
      setPatients(patientList);
      setDoctors(doctorList);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorName || !newDoctorSpecialization) {
      toast({
        title: 'Validation Error',
        description: 'Please fill out all doctor fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingDoctor(true);
    try {
      await addDoctor({
        name: newDoctorName,
        specialization: newDoctorSpecialization,
      });
      toast({
        title: 'Doctor Added',
        description: `${newDoctorName} has been successfully added.`,
      });
      setNewDoctorName('');
      setNewDoctorSpecialization('');
      await fetchData(); // Refresh the doctors list
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add doctor.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingDoctor(false);
    }
  };
  
  const handleLogout = () => {
    router.push('/');
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
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

      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Loader2 className="animate-spin h-6"/> : patients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Loader2 className="animate-spin h-6"/> : doctors.length}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{patients.length * 500}</div>
               <p className="text-xs text-muted-foreground">Based on ₹500 per patient consultation</p>
            </CardContent>
          </Card>
        </div>

        {error && (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle/> Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
            </Card>
        )}

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Doctors List and Add Form */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Manage Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-name">Doctor Name</Label>
                    <Input id="doctor-name" value={newDoctorName} onChange={(e) => setNewDoctorName(e.target.value)} placeholder="Dr. Evelyn Reed" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" value={newDoctorSpecialization} onChange={(e) => setNewDoctorSpecialization(e.target.value)} placeholder="Cardiologist" />
                  </div>
                  <Button type="submit" className="w-full" disabled={isAddingDoctor}>
                    {isAddingDoctor ? <Loader2 className="animate-spin mr-2"/> : <PlusCircle className="mr-2" />}
                    Add Doctor
                  </Button>
                </form>
              </CardContent>
               <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Specialization</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.map(doctor => (
                            <TableRow key={doctor.id}>
                                <TableCell className="font-medium">{doctor.name}</TableCell>
                                <TableCell>{doctor.specialization}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
               </CardContent>
            </Card>
          </div>

          {/* Patients List */}
          <div className="xl:col-span-2">
             <Card>
                <CardHeader>
                    <CardTitle>Patient List</CardTitle>
                    <CardDescription>A list of all registered patients.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Unique ID</TableHead>
                                <TableHead>Date of Visit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.map(patient => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">{patient.patientInfo.name}</TableCell>
                                    <TableCell>{patient.patientInfo.uniqueId}</TableCell>
                                    <TableCell>{patient.patientInfo.dateOfVisit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
