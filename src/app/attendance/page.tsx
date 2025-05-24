
'use client';

import PageHeader from '@/components/shared/PageHeader';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { mockAttendanceLogs } from '@/lib/mockData'; 
import { useUser, useAuth } from '@clerk/nextjs';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { AttendanceLog } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Added missing import

export default function AttendancePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [userAttendance, setUserAttendance] = useState<AttendanceLog[]>([]);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (userLoaded && isSignedIn) {
      if (!isAdmin && user?.primaryEmailAddress?.emailAddress) {
        // Non-admin users see their own attendance
        const filteredLogs = mockAttendanceLogs.filter(log => log.studentEmail === user.primaryEmailAddress?.emailAddress);
        setUserAttendance(filteredLogs);
      } else if (isAdmin && user?.primaryEmailAddress?.emailAddress) {
        // Admins on this page (intended for "My Attendance") see their own logs if any exist,
        // or an empty table. They should use /attendance-management for all logs.
        const adminOwnLogs = mockAttendanceLogs.filter(log => log.studentEmail === user.primaryEmailAddress?.emailAddress);
        setUserAttendance(adminOwnLogs);
      }
    }
  }, [user, userLoaded, isSignedIn, isAdmin]);

  if (!authLoaded || !userLoaded) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!isSignedIn) {
    // This case should ideally be handled by Clerk middleware redirecting to login
    // Or by the <SignedOut> component in the layout.
    // Showing a clear message here is a good fallback.
    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
            <p className="text-lg font-medium">Access Denied</p>
            <p className="text-muted-foreground">Please log in to view your attendance.</p>
            {/* Optionally, add a SignInButton here if desired for direct action */}
        </div>
    );
  }
  
  if (isAdmin) {
     return (
        <div className="space-y-6">
        <PageHeader
            title="My Attendance (Admin View)"
            description="As an admin, you typically manage all attendance via 'Manage Attendance'. This view shows data as if you were a student."
        />
        <AttendanceTable 
            data={userAttendance} // Shows admin's "own" logs if any
            isStudentView={true} 
        />
        <p className="text-sm text-muted-foreground text-center">
            To manage all student records, please go to the <Link href="/attendance-management" className="text-primary hover:underline">Manage Attendance</Link> page.
        </p>
        </div>
    );
  }

  // Non-admin, signed-in user view
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance History"
        description="Review your attendance records for all meetings."
      />
      <AttendanceTable 
        data={userAttendance} 
        isStudentView={true} 
      />
    </div>
  );
}
