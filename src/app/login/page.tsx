'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This file is now deprecated and will redirect to the new patient login.
// In a real scenario, you might have a server-side redirect here.
export default function DeprecatedLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/patient/login');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting to patient login...</p>
    </div>
  );
}
