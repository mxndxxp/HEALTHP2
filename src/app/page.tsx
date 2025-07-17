'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClipboardList, Stethoscope, User, ShieldAlert } from 'lucide-react';
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

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Who are you?</CardTitle>
          <CardDescription className="text-center">Please select your role to continue.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
            <Button asChild size="lg" className="h-16 text-lg">
              <Link href="/patient/login" className="flex items-center gap-3">
                <User className="h-6 w-6" />
                I am a Patient
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 text-lg">
              <Link href="/doctor/login" className="flex items-center gap-3">
                <Stethoscope className="h-6 w-6" />
                I am a Doctor
              </Link>
            </Button>
        </CardContent>
         <div className="text-center p-4">
          <Button asChild variant="link" size="sm">
            <Link href="/admin/login" className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldAlert className="h-4 w-4" />
              Admin
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
