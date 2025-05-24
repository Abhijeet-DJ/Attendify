'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AttendanceLog } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import AttendanceStatusBadge from './AttendanceStatusBadge';

interface ViewAttendanceDetailsDialogProps {
  log: AttendanceLog;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewAttendanceDetailsDialog({ log, isOpen, onClose }: ViewAttendanceDetailsDialogProps) {
  const formatTimestamp = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>Attendance Details</DialogTitle>
          <DialogDescription>
            Detailed log for {log.studentName} in "{log.meetingName}" on {new Date(log.date).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div><strong>Student:</strong> {log.studentName}</div>
              <div><strong>Meeting:</strong> {log.meetingName}</div>
              <div><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</div>
              <div><strong>Status:</strong> <AttendanceStatusBadge status={log.status} /></div>
              <div><strong>Duration:</strong> {log.durationMinutes ? `${log.durationMinutes} min` : 'N/A'}</div>
              <div><strong>First Join:</strong> {formatTimestamp(log.joinTime)}</div>
              <div className="sm:col-span-2"><strong>Last Leave:</strong> {formatTimestamp(log.leaveTime)}</div>
            </div>

            {log.isAnomaly && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <div className="flex items-start">
                  <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Anomaly Detected</p>
                    <p>{log.anomalyExplanation || 'Unusual attendance pattern.'}</p>
                  </div>
                </div>
              </div>
            )}

            {log.manualOverrideReason && (
              <div className="rounded-md border border-accent/50 bg-accent/10 p-3 text-sm text-accent-foreground/80">
                 <div className="flex items-start">
                  <Info className="mr-2 h-5 w-5 flex-shrink-0 text-accent" />
                  <div>
                    <p className="font-semibold text-accent">Manual Override</p>
                    <p>Reason: {log.manualOverrideReason}</p>
                  </div>
                </div>
              </div>
            )}

            {log.events && log.events.length > 0 && (
              <div>
                <h4 className="mb-2 font-semibold text-sm">Join/Leave Events:</h4>
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {log.events.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="flex items-center">
                          {event.type === 'join' ? (
                            <ArrowRight className="mr-1 h-3 w-3 text-green-500" />
                          ) : (
                            <ArrowLeft className="mr-1 h-3 w-3 text-red-500" />
                          )}
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </TableCell>
                        <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
             {(!log.events || log.events.length === 0) && (
                <p className="text-sm text-muted-foreground py-4 text-center">No detailed join/leave events recorded for this log.</p>
             )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

