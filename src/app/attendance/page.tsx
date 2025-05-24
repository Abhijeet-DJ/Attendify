
'use client';

import PageHeader from '@/components/shared/PageHeader';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { useUser, useAuth } from '@clerk/nextjs';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { AttendanceLog } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAttendanceLogsForUser } from '@/app/actions/attendanceActions'; // Updated import
import { useToast } from '@/hooks/use-toast';

export default function AttendancePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  
  const [userAttendance, setUserAttendance] = useState<AttendanceLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const fetchUserLogs = async () => {
      if (userLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        setIsLoadingLogs(true);
        try {
          // Admins on this page see their own logs, like a student.
          // They use /attendance-management for all logs.
          const logs = await getAttendanceLogsForUser(user.primaryEmailAddress.emailAddress);
          setUserAttendance(logs);
        } catch (error) {
          console.error("Failed to fetch user's attendance logs:", error);
          toast({
            title: "Error Fetching Attendance",
            description: "Could not retrieve your attendance records.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingLogs(false);
        }
      } else if (userLoaded && !isSignedIn) {
        setIsLoadingLogs(false); // Not signed in, no logs to load
      }
    };

    fetchUserLogs();
  }, [user, userLoaded, isSignedIn, toast]);

  if (!authLoaded || !userLoaded || isLoadingLogs) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
            <p className="text-lg font-medium">Access Denied</p>
            <p className="text-muted-foreground">Please log in to view your attendance.</p>
        </div>
    );
  }
  
  if (isAdmin) {
     return (
        <div className="space-y-6">
        <PageHeader
            title="My Attendance (Admin View)"
            description="As an admin, you typically manage all attendance via 'Manage Attendance'. This view shows data as if you were a student (i.e., your own attendance if any)."
        />
        <AttendanceTable 
            data={userAttendance} 
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
