import type { AttendanceLog, Meeting, UserProfile, AttendanceStatus, JoinLeaveEvent } from '@/types';

export const mockUsers: UserProfile[] = [
  { id: 'student1', email: 'alice@example.com', name: 'Alice Wonderland', role: 'student', photoURL: 'https://placehold.co/100x100.png?text=AW', registrationNumber: 'S1001' },
  { id: 'student2', email: 'bob@example.com', name: 'Bob The Builder', role: 'student', photoURL: 'https://placehold.co/100x100.png?text=BB', registrationNumber: 'S1002' },
  { id: 'student3', email: 'charlie@example.com', name: 'Charlie Brown', role: 'student', photoURL: 'https://placehold.co/100x100.png?text=CB', registrationNumber: 'S1003' },
  { id: 'student4', email: 'diana@example.com', name: 'Diana Prince', role: 'student', photoURL: 'https://placehold.co/100x100.png?text=DP' }, // No registration number for variety
  { id: 'admin1', email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com', name: 'Admin User', role: 'admin', photoURL: 'https://placehold.co/100x100.png?text=AU', teacherId: 'T001' },
];

export const mockMeetings: Meeting[] = [
  { id: 'meeting1', name: 'Mathematics 101', date: '2024-07-20T00:00:00.000Z', startTime: '10:00 AM', endTime: '11:30 AM' },
  { id: 'meeting2', name: 'History of Art', date: '2024-07-21T00:00:00.000Z', startTime: '02:00 PM', endTime: '03:00 PM' },
  { id: 'meeting3', name: 'Physics Fundamentals', date: '2024-07-22T00:00:00.000Z', startTime: '09:00 AM', endTime: '10:00 AM' },
  { id: 'meeting4', name: 'Advanced Calculus', date: '2024-07-23T00:00:00.000Z', startTime: '11:00 AM', endTime: '12:30 PM' },
  { id: 'meeting5', name: 'Literary Analysis', date: '2024-07-24T00:00:00.000Z', startTime: '01:00 PM', endTime: '02:00 PM' },
];

const generateJoinLeaveEvents = (baseTime: Date, status: AttendanceStatus): {events: JoinLeaveEvent[], joinTime: string | null, leaveTime: string | null, duration: number | null} => {
  const events: JoinLeaveEvent[] = [];
  let joinTime: string | null = null;
  let leaveTime: string | null = null;
  let duration: number | null = null;

  if (status === 'Absent') return { events, joinTime, leaveTime, duration };

  const meetingStartTime = new Date(baseTime);
  // Randomize meeting start hour for variety
  const startHour = 9 + Math.floor(Math.random() * 5); // Meetings between 9 AM and 1 PM
  meetingStartTime.setHours(startHour, 0, 0, 0); 

  const firstJoin = new Date(meetingStartTime);
  if (status === 'Late') firstJoin.setMinutes(meetingStartTime.getMinutes() + (10 + Math.floor(Math.random() * 10))); // 10-20 mins late
  else firstJoin.setMinutes(meetingStartTime.getMinutes() + Math.floor(Math.random() * 5)); // Join within 5 mins

  events.push({ timestamp: firstJoin.toISOString(), type: 'join' });
  joinTime = firstJoin.toISOString();

  const meetingDuration = 60 + Math.floor(Math.random() * 31); // Meeting duration 60-90 minutes
  let timeInMeeting = meetingDuration - Math.floor(Math.random() * (status === 'Partial' ? meetingDuration / 2 : 10)); 
  if (status === 'Partial') timeInMeeting = Math.floor(meetingDuration / 3) + Math.floor(Math.random() * (meetingDuration/3));

  const lastLeave = new Date(firstJoin);
  lastLeave.setMinutes(firstJoin.getMinutes() + timeInMeeting);
  events.push({ timestamp: lastLeave.toISOString(), type: 'leave' });
  leaveTime = lastLeave.toISOString();
  
  duration = Math.max(0, Math.round((lastLeave.getTime() - firstJoin.getTime()) / (1000 * 60)));

  // Simulate anomaly: multiple joins/leaves
  if (Math.random() < 0.3 && status !== 'Absent' && timeInMeeting > 20) { 
    const midLeaveTime = new Date(firstJoin);
    midLeaveTime.setMinutes(firstJoin.getMinutes() + Math.floor(timeInMeeting / 3));
    events.push({ timestamp: midLeaveTime.toISOString(), type: 'leave' });

    const reJoinTime = new Date(midLeaveTime);
    reJoinTime.setMinutes(midLeaveTime.getMinutes() + 5 + Math.floor(Math.random() * 5)); 
    if (reJoinTime < lastLeave) { // Ensure rejoin is before final leave
        events.push({ timestamp: reJoinTime.toISOString(), type: 'join' });
        duration = Math.max(0, Math.round((midLeaveTime.getTime() - firstJoin.getTime()) / (1000 * 60)) + Math.round((lastLeave.getTime() - reJoinTime.getTime()) / (1000 * 60)));
    }
  }
  
  events.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return { events, joinTime, leaveTime, duration };
};


export const mockAttendanceLogs: AttendanceLog[] = mockUsers.filter(u => u.role === 'student').flatMap((student) =>
  mockMeetings.map((meeting, meetingIndex) => {
    const attendanceStatuses: AttendanceStatus[] = ['Present', 'Present', 'Late', 'Absent', 'Partial', 'Present'];
    // Make status more random per student-meeting pair
    const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
    
    const baseDate = new Date(meeting.date);
    const { events, joinTime, leaveTime, duration } = generateJoinLeaveEvents(baseDate, status);
    
    let isAnomaly = false;
    let anomalyExplanation: string | undefined = undefined;

    const joinEventsCount = events.filter(e => e.type === 'join').length;

    if (joinEventsCount > 1 && status !== 'Absent') {
      isAnomaly = true;
      anomalyExplanation = `Student joined the meeting ${joinEventsCount} times.`;
    } else if (status === 'Partial' && duration !== null && duration < 30) { 
        isAnomaly = true;
        anomalyExplanation = `Student was present for only ${duration} minutes.`;
    } else if (status === 'Late' && joinTime) {
        const meetingStart = new Date(joinTime); // Base this on actual meeting start time if available
        meetingStart.setMinutes(0); // Assuming meeting started at HH:00 for simplicity
        if (new Date(joinTime).getMinutes() > 20) { // More than 20 mins late
             // isAnomaly = true; // Let's not flag all lates as anomalies, AI can do better
             // anomalyExplanation = 'Student joined significantly late.';
        }
    }


    return {
      id: `attlog-${student.id}-${meeting.id}-${meetingIndex}`,
      studentId: student.id,
      studentName: student.name || student.email,
      studentEmail: student.email,
      meetingId: meeting.id,
      meetingName: meeting.name,
      date: meeting.date,
      joinTime: joinTime,
      leaveTime: leaveTime,
      durationMinutes: duration,
      status: status,
      isAnomaly: isAnomaly,
      anomalyExplanation: anomalyExplanation,
      events: events,
    };
  })
);
