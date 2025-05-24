'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AttendanceLog, AttendanceStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '../shared/LoadingSpinner';

// This would typically be a server action
async function updateAttendanceStatusOnServer(log: AttendanceLog, newStatus: AttendanceStatus, reason: string): Promise<AttendanceLog> {
  // Simulate API call
  console.log(`Simulating update for log ${log.id} to ${newStatus} with reason: ${reason}`);
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return a modified version of the input log for simulation
  return { 
    ...log, 
    status: newStatus, 
    manualOverrideReason: reason || null, // Ensure null if empty string
    // Potentially re-evaluate anomaly status based on new status
    isAnomaly: newStatus === 'Absent' ? false : log.isAnomaly, 
    anomalyExplanation: newStatus === 'Absent' ? null : log.anomalyExplanation,
  };
}


export default function OverrideAttendanceDialog({ log, isOpen, onClose, onUpdate }: OverrideAttendanceDialogProps) {
  const [newStatus, setNewStatus] = useState<AttendanceStatus>(log.status);
  const [reason, setReason] = useState(log.manualOverrideReason || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setNewStatus(log.status);
      setReason(log.manualOverrideReason || '');
    }
  }, [isOpen, log]);

  const attendanceStatuses: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused', 'Partial'];

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updatedLog = await updateAttendanceStatusOnServer(log, newStatus, reason);
      
      onUpdate(updatedLog); 
      toast({
        title: 'Attendance Updated',
        description: `${log.studentName}'s status for ${log.meetingName} changed to ${newStatus}.`,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update attendance:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update attendance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Override Attendance</DialogTitle>
          <DialogDescription>
            Manually change the attendance status for {log.studentName} in {log.meetingName} on {new Date(log.date).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as AttendanceStatus)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {attendanceStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3"
              placeholder="Reason for override (optional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
