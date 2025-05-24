// UserProfile might still be useful for mock data or app-specific user representations,
// but primary user data will come from Clerk.
export interface UserProfile {
  id: string; // Corresponds to Clerk User ID
  email: string;
  name?: string | null; // Corresponds to Clerk user.fullName
  role: 'student' | 'admin'; // This will need to be managed via Clerk metadata or app logic
  avatarUrl?: string | null; // Corresponds to Clerk user.imageUrl
  photoURL?: string | null; // Alias for avatarUrl if needed for consistency
}

export interface Meeting {
  id: string;
  name: string;
  date: string; // ISO string format
  startTime: string; // e.g., "10:00 AM"
  endTime: string; // e.g., "11:30 AM"
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'Partial';

export interface AttendanceLog {
  id: string;
  studentId: string; // Could be Clerk User ID
  studentName: string;
  studentEmail?: string;
  meetingId: string;
  meetingName: string;
  date: string; // ISO string format of meeting date
  joinTime?: string | null; // ISO string format
  leaveTime?: string | null; // ISO string format
  durationMinutes?: number | null; // Duration in minutes
  status: AttendanceStatus;
  isAnomaly: boolean;
  anomalyExplanation?: string | null;
  manualOverrideReason?: string | null;
  events?: JoinLeaveEvent[]; // For detailed anomaly analysis
}

export interface JoinLeaveEvent {
  timestamp: string; // ISO string format
  type: 'join' | 'leave';
}

// For Anomaly Detection AI Flow (matches provided schema)
export interface AttendanceAnomalyInput {
  studentId: string;
  meetingId: string;
  joinLeaveEvents: JoinLeaveEvent[];
}

export interface AttendanceAnomalyOutput {
  isAnomaly: boolean;
  explanation: string;
}

// No longer need AuthUser from custom AuthContext.
// Import Clerk types directly if needed, e.g. import type { UserResource } from '@clerk/types';
