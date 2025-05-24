'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { AttendanceLog } from '@/types';
import { Edit3, Eye, AlertTriangle as AnomalyIcon } from 'lucide-react';
import AttendanceStatusBadge from './AttendanceStatusBadge';
import OverrideAttendanceDialog from './OverrideAttendanceDialog';
import ViewAttendanceDetailsDialog from './ViewAttendanceDetailsDialog';
import { useUser } from '@clerk/nextjs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface AttendanceTableProps {
  data: AttendanceLog[];
  isStudentView?: boolean;
  onAttendanceUpdate?: (updatedLog: AttendanceLog) => void;
}

export default function AttendanceTable({ data, isStudentView = false, onAttendanceUpdate }: AttendanceTableProps) {
  const { user } = useUser(); 
  const [selectedLogForEdit, setSelectedLogForEdit] = useState<AttendanceLog | null>(null);
  const [selectedLogForView, setSelectedLogForView] = useState<AttendanceLog | null>(null);
  
  const [internalData, setInternalData] = useState<AttendanceLog[]>(data);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  const handleUpdateLog = (updatedLog: AttendanceLog) => {
    if (onAttendanceUpdate) {
      onAttendanceUpdate(updatedLog);
    } else {
      setInternalData(prevData => 
        prevData.map(log => log.id === updatedLog.id ? updatedLog : log)
      );
    }
    setSelectedLogForEdit(null);
  };
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const displayData = onAttendanceUpdate ? data : internalData;


  return (
    <>
      <ScrollArea className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {!isStudentView && <TableHead className="whitespace-nowrap">Student Name</TableHead>}
              <TableHead className="whitespace-nowrap">Meeting Name</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Duration</TableHead>
              <TableHead className="text-center whitespace-nowrap">Anomaly</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length > 0 ? displayData.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                {!isStudentView && <TableCell className="font-medium">{log.studentName}</TableCell>}
                <TableCell>{log.meetingName}</TableCell>
                <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <AttendanceStatusBadge status={log.status} />
                </TableCell>
                <TableCell>{log.durationMinutes ? `${log.durationMinutes} min` : 'N/A'}</TableCell>
                <TableCell className="text-center">
                  {log.isAnomaly && (
                    <AnomalyIcon className="h-5 w-5 text-destructive inline-block cursor-help" title={log.anomalyExplanation || 'Anomaly Detected'}/>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedLogForView(log)} title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {!isStudentView && isAdmin && ( // Only show edit if user is admin (derived from Clerk user)
                    <Button variant="ghost" size="icon" onClick={() => setSelectedLogForEdit(log)} title="Edit Status">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={isStudentView ? 6 : 7} className="h-24 text-center text-muted-foreground">
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {selectedLogForEdit && (
        <OverrideAttendanceDialog
          log={selectedLogForEdit}
          isOpen={!!selectedLogForEdit}
          onClose={() => setSelectedLogForEdit(null)}
          onUpdate={handleUpdateLog}
        />
      )}
       {selectedLogForView && (
        <ViewAttendanceDetailsDialog
          log={selectedLogForView}
          isOpen={!!selectedLogForView}
          onClose={() => setSelectedLogForView(null)}
        />
      )}
    </>
  );
}
