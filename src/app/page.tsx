'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClipboardList, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ClipboardList className="h-10 w-10 text-primary" />
            <span className="text-4xl font-bold">HealthSight</span>
          </Link>
        </div>
        <p className="text-muted-foreground text-lg">Your Comprehensive Healthcare Platform</p>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <Stethoscope className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4">For Doctors</CardTitle>
            <CardDescription>
              Access your dashboard, manage patients, and provide consultations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col justify-end gap-4">
            <Button asChild size="lg">
              <Link href="/doctor/login">Doctor Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/doctor/signup">Doctor Signup</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4">For Patients</CardTitle>
            <CardDescription>
              Manage your health records, book appointments, and get AI insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col justify-end gap-4">
            <Button asChild size="lg">
              <Link href="/patient/login">Patient Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/patient/signup">Patient Signup</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
