'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AttendanceAnomalyInput, JoinLeaveEvent } from '@/types';
import { LoadingSpinner } from '../shared/LoadingSpinner';

const joinLeaveEventSchema = z.object({
  timestamp: z.string().datetime({ message: "Invalid ISO 8601 timestamp (e.g., YYYY-MM-DDTHH:mm:ss.sssZ)" }),
  type: z.enum(['join', 'leave'], { errorMap: () => ({ message: 'Type must be "join" or "leave"' }) }),
});

const formSchema = z.object({
  studentId: z.string().min(1, { message: 'Student ID is required.' }),
  meetingId: z.string().min(1, { message: 'Meeting ID is required.' }),
  joinLeaveEventsJson: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return z.array(joinLeaveEventSchema).min(1, {message: "At least one event is required."}).safeParse(parsed).success;
      } catch (e) {
        return false;
      }
    },
    { message: 'Must be a valid JSON array of JoinLeaveEvent objects. Each object needs a `timestamp` (ISO string like "2023-10-26T10:00:00.000Z") and `type` ("join" or "leave"). Requires at least one event.' }
  ),
});

type AnomalyFormValues = z.infer<typeof formSchema>;

interface AnomalyDetectionFormProps {
  onSubmit: (data: AttendanceAnomalyInput) => Promise<void>;
  isLoading: boolean;
}

const exampleJson = JSON.stringify([
  { timestamp: "2024-07-22T10:01:00.000Z", type: "join" },
  { timestamp: "2024-07-22T10:30:00.000Z", type: "leave" },
  { timestamp: "2024-07-22T10:35:00.000Z", type: "join" },
  { timestamp: "2024-07-22T11:25:00.000Z", type: "leave" }
], null, 2);

export default function AnomalyDetectionForm({ onSubmit, isLoading }: AnomalyDetectionFormProps) {
  const form = useForm<AnomalyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      meetingId: '',
      joinLeaveEventsJson: '',
    },
  });

  const handleSubmit = (values: AnomalyFormValues) => {
    try {
      // Zod refinement already validates the JSON structure and content.
      const joinLeaveEvents: JoinLeaveEvent[] = JSON.parse(values.joinLeaveEventsJson);
      onSubmit({
        studentId: values.studentId,
        meetingId: values.meetingId,
        joinLeaveEvents,
      });
    } catch (error) {
      // This path should ideally not be reached if Zod validation is working correctly.
      console.error("Error parsing JSON after Zod validation (should not happen):", error);
      form.setError('joinLeaveEventsJson', { type: 'manual', message: 'Unexpected error parsing JSON. Please check format.' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., student123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meetingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., meetingXYZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="joinLeaveEventsJson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join/Leave Events (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={exampleJson}
                  className="min-h-[150px] font-mono text-xs leading-relaxed"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Paste a JSON array of event objects. Each object needs a `timestamp` (ISO string like "YYYY-MM-DDTHH:mm:ss.sssZ") and `type` ("join" or "leave").
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          Detect Anomaly
        </Button>
      </form>
    </Form>
  );
}
