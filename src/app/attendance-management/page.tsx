'use client';

import PageHeader from '@/components/shared/PageHeader';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { mockAttendanceLogs } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import type { AttendanceLog } from '@/types';

export default function AttendanceManagementPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentLogs, setCurrentLogs] = useState<AttendanceLog[]>(mockAttendanceLogs);

  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      router.replace('/attendance'); 
    }
  }, [user, loading, router]);


  const handleAttendanceUpdate = (updatedLog: AttendanceLog) => {
    setCurrentLogs(prevLogs => 
      prevLogs.map(log => log.id === updatedLog.id ? updatedLog : log)
    );
  };

  if (loading || !user) { // Added !user check
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  if (!user.isAdmin) { // Explicit check after loading and user exist
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <p>Access Denied. Redirecting...</p>
        <LoadingSpinner size="xl" />
      </div>
    );
  }


  const handleExportCSV = () => {
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
        description="View, edit, and manage all student attendance records."
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
