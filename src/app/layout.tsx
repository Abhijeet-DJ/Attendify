import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
// import { ClerkProvider } from '@clerk/nextjs'; // Clerk removed
import AppShell from '@/components/layout/AppShell';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Attendify - Zoom Attendance Tracker',
  description: 'Track and manage Zoom meeting attendance with AI-powered insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider> // Clerk removed
      <html lang="en" suppressHydrationWarning>
        <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
          <AppShell>{children}</AppShell>
          <Toaster />
        </body>
      </html>
    // </ClerkProvider> // Clerk removed
  );
}
