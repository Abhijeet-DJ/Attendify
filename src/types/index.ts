import type { ObjectId } from 'mongodb';

export interface UserProfile {
  _id?: string | ObjectId; // MongoDB ObjectId, stringified
  email: string;
  name: string; // Full name
  hashedPassword?: string; // Will not be sent to client
  role: 'student' | 'teacher' | 'admin';
  registrationNumber?: string | null; // For students
  teacherId?: string | null; // For teachers
  avatarUrl?: string | null; // Optional placeholder
}

// For API responses, sensitive fields like hashedPassword should be omitted.
export type SafeUserProfile = Omit<UserProfile, 'hashedPassword'>;


export interface Meeting {
  _id?: string | ObjectId;
  id: string; // Custom ID, could be zoom meeting ID
  name: string;
  date: string; // ISO string format
  startTime: string; // e.g., "10:00 AM"
  endTime: string; // e.g., "11:30 AM"
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'Partial';

export interface AttendanceLog {
  _id?: string | ObjectId;
  id: string; // Custom unique ID for the log entry
  studentId: string; // Corresponds to UserProfile._id.toString()
  studentName: string;
  studentEmail?: string;
  meetingId: string; // Relates to Meeting.id
  meetingName: string;
  date: string; // ISO string format of meeting date
  joinTime?: string | null; // ISO string format
  leaveTime?: string | null; // ISO string format
  durationMinutes?: number | null; // Duration in minutes
  status: AttendanceStatus;
  isAnomaly: boolean;
  anomalyExplanation?: string | null;
  manualOverrideReason?: string |null;
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
