
'use client';

import PageHeader from '@/components/shared/PageHeader';
import AttendanceTable from '@/components/attendance/AttendanceTable';
// import { mockAttendanceLogs } from '@/lib/mockData'; // Will fetch from DB
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import type { AttendanceLog } from '@/types';
import { getAttendanceLogs, updateAttendanceLogInDb } from '@/app/actions/attendanceActions';
import { useToast } from '@/hooks/use-toast';


export default function AttendanceManagementPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentLogs, setCurrentLogs] = useState<AttendanceLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (authLoaded && userLoaded) {
      if (isSignedIn && !isAdmin) {
        router.replace('/attendance'); 
      } else if (isSignedIn && isAdmin) {
        fetchLogs();
      } else if (!isSignedIn) {
        // Middleware should handle redirect, but this is a fallback.
        // No action needed here as render block handles it.
      }
    }
  }, [isSignedIn, isAdmin, authLoaded, userLoaded, router]);

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await getAttendanceLogs();
      setCurrentLogs(logs);
    } catch (error) {
      console.error("Failed to fetch attendance logs:", error);
      toast({
        title: "Error Fetching Logs",
        description: "Could not retrieve attendance records from the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleAttendanceUpdate = async (updatedLog: AttendanceLog) => {
    try {
      const result = await updateAttendanceLogInDb(updatedLog);
      if (result) {
        setCurrentLogs(prevLogs => 
          prevLogs.map(log => log.id === result.id ? result : log)
        );
        toast({
          title: "Attendance Updated",
          description: `Log for ${result.studentName} successfully updated in the database.`,
        });
      } else {
         toast({
          title: "Update Not Applied",
          description: "The log was not found or not modified in the database.",
          variant: "destructive",
        });
      }
    } catch (error) {
       console.error("Failed to update attendance log:", error);
       toast({
        title: "Update Failed",
        description: "Could not update the attendance record in the database.",
        variant: "destructive",
      });
    }
  };

  if (!authLoaded || !userLoaded || (isSignedIn && isAdmin && isLoadingLogs)) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  if (isSignedIn && !isAdmin) {
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <p>Access Denied. Redirecting...</p>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
     <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <p>Access Denied. Please sign in.</p>
       <LoadingSpinner size="xl" />
     </div>
   );
 }


  const handleExportCSV = () => {
    if (currentLogs.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no attendance logs to export.",
        variant: "default"
      });
      return;
    }
    const headers = ["Student Name", "Meeting Name", "Date", "Status", "Duration (min)", "Anomaly", "Anomaly Explanation"];
    const rows = currentLogs.map(log => [
      `"${log.studentName.replace(/"/g, '""')}"`,
      `"${log.meetingName.replace(/"/g, '""')}"`,
      new Date(log.date).toLocaleDateString(),
      log.status,
      log.durationMinutes ?? 'N/A',
      log.isAnomaly ? 'Yes' : 'No',
      `"${(log.anomalyExplanation || '').replace(/"/g, '""')}"`
    ]);
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Attendance Records"
        description="View, edit, and manage all student attendance records from the database."
        actions={
          <Button onClick={handleExportCSV} className="shadow-sm hover:shadow-md transition-shadow">
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />
      <AttendanceTable 
        data={currentLogs} 
        isStudentView={false} 
        onAttendanceUpdate={handleAttendanceUpdate}
      />
    </div>
  );
}
