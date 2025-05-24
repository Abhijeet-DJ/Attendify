export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  role: 'student' | 'admin';
  avatarUrl?: string | null;
  photoURL?: string | null; // From Firebase User
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
  studentId: string;
  studentName: string;
  studentEmail?: string; // Added for easier filtering if studentId not primary key from auth
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

// User type from AuthContext
export type { UserContextType as AuthUser } from '@/context/AuthContext';
