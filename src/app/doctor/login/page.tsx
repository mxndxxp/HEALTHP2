
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendConfirmationEmail } from '@/lib/email-service';
import { useToast } from '@/hooks/use-toast';

export default function DoctorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await sendConfirmationEmail({ email, name: 'Doctor User', role: 'Doctor' }, 'login');
        toast({
            title: 'Login Successful',
            description: 'A confirmation email has been sent (check console).',
        });
        router.push('/doctor/dashboard');
    } catch (error) {
        toast({
            title: 'Login Failed',
            description: 'Could not send confirmation.',
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="text-2xl">HealthSight - Doctors</span>
            </Link>
          </div>
          <CardTitle>Doctor Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the doctor portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/doctor/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
