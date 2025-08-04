
import type { Metadata } from 'next';
import './globals.css';
import { Inter, Dancing_Script } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script', weight: ['400', '700']});

export const metadata: Metadata = {
  title: 'HealthSight - Comprehensive Healthcare Platform',
  description: 'A complete digital health assessment tool for healthcare providers and patients.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${dancingScript.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
