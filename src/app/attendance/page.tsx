'use client';

import PageHeader from '@/components/shared/PageHeader';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { mockAttendanceLogs } from '@/lib/mockData'; 
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { AttendanceLog } from '@/types';
import { useEffect, useState } from 'react';

export default function AttendancePage() {
  const { user, loading } = useAuth();
  const [userAttendance, setUserAttendance] = useState<AttendanceLog[]>([]);

  useEffect(() => {
    if (user && !loading) {
      // Non-admin users see their own attendance
      if (!user.isAdmin) {
        const filteredLogs = mockAttendanceLogs.filter(log => log.studentEmail === user.email);
        setUserAttendance(filteredLogs);
      } else {
        // Admins redirected to attendance-management, this page is student-focused
        // But if an admin lands here, show all for safety, though NavMenu shouldn't lead them here with "My Attendance"
         setUserAttendance(mockAttendanceLogs);
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by AppShell redirecting to login
    return <p className="p-6 text-center">Please log in to view your attendance.</p>;
  }
  
  // If user is admin and somehow lands here, they should be using /attendance-management
  // This page is intended for "My Attendance"
  if (user.isAdmin) {
     return (
        <div className="space-y-6">
        <PageHeader
            title="My Attendance (Admin View)"
            description="As an admin, you typically manage attendance via 'Manage Attendance'. This view shows data as a student would see it if they were also an admin."
        />
        <AttendanceTable 
            data={mockAttendanceLogs.filter(log => log.studentEmail === user.email)} // Show admin's "own" logs if any
            isStudentView={true} 
        />
        </div>
    );
  }


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
