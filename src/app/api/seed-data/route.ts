import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { mockUsers, mockMeetings, mockAttendanceLogs } from '@/lib/mockData';
import type { UserProfile, Meeting, AttendanceLog } from '@/types';

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Clear existing collections (optional, be careful in production)
    // You might want to comment these out after the first successful seed
    await db.collection('users').deleteMany({});
    await db.collection('meetings').deleteMany({});
    await db.collection('attendanceLogs').deleteMany({});

    // Insert mock data
    // Ensure mockData IDs are strings if UserProfile.id is string
    const usersToInsert: Omit<UserProfile, '_id'>[] = mockUsers.map(({ _id, ...user }) => user);
    if (usersToInsert.length > 0) {
      await db.collection('users').insertMany(usersToInsert as any[]); // `any` to bypass strict _id typing during insert
    }

    const meetingsToInsert: Omit<Meeting, '_id'>[] = mockMeetings.map(({ _id, ...meeting }) => meeting);
    if (meetingsToInsert.length > 0) {
      await db.collection('meetings').insertMany(meetingsToInsert as any[]);
    }
    
    const attendanceLogsToInsert: Omit<AttendanceLog, '_id'>[] = mockAttendanceLogs.map(({ _id, ...log }) => log);
    if (attendanceLogsToInsert.length > 0) {
      await db.collection('attendanceLogs').insertMany(attendanceLogsToInsert as any[]);
    }

    return NextResponse.json({ message: 'Data seeded successfully. Collections populated: users, meetings, attendanceLogs.' }, { status: 200 });
  } catch (error) {
    console.error('Failed to seed data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Failed to seed data', error: errorMessage }, { status: 500 });
  }
}
