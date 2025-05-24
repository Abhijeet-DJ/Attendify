import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { mockUsers, mockMeetings, mockAttendanceLogs } from '@/lib/mockData';
import type { UserProfile, Meeting, AttendanceLog } from '@/types';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    await db.collection('users').deleteMany({});
    await db.collection('meetings').deleteMany({});
    await db.collection('attendanceLogs').deleteMany({});

    const usersToInsert = await Promise.all(
      mockUsers.map(async ({ id, password, ...user }) => {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        // For mock data, we can use the provided `id` as `_id` if it's unique and string
        // Or let MongoDB generate it. Let's use the mock `id` as `_id` for simplicity in mock data.
        return {
          ...user,
          _id: id, // Using mock id as _id for seeded data
          ...(hashedPassword && { hashedPassword }), // Add hashedPassword only if password was provided
        };
      })
    );
    if (usersToInsert.length > 0) {
      await db.collection('users').insertMany(usersToInsert as any[]);
    }

    const meetingsToInsert = mockMeetings.map(({ _id, ...meeting }) => ({...meeting, _id: meeting.id}));
    if (meetingsToInsert.length > 0) {
      await db.collection('meetings').insertMany(meetingsToInsert as any[]);
    }
    
    const attendanceLogsToInsert = mockAttendanceLogs.map(({ _id, ...log }) => ({...log, _id: log.id}));
    if (attendanceLogsToInsert.length > 0) {
      await db.collection('attendanceLogs').insertMany(attendanceLogsToInsert as any[]);
    }

    return NextResponse.json({ message: 'Data seeded successfully. Collections populated: users, meetings, attendanceLogs. Passwords for mock users are hashed.' }, { status: 200 });
  } catch (error) {
    console.error('Failed to seed data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Failed to seed data', error: errorMessage }, { status: 500 });
  }
}
