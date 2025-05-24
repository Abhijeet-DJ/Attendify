
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { subDays } from 'date-fns';

export interface DashboardSummaryData {
  totalStudents: number;
  upcomingMeetings: number;
  recentAnomalies: number;
  averageAttendanceRate: string; // Represent as string like "N/A" or "75%"
  // For more detailed stats, could add:
  // totalMeetings: number;
  // totalAttendanceLogs: number;
}

export async function getDashboardSummaryData(): Promise<DashboardSummaryData> {
  try {
    const { db } = await connectToDatabase();

    const totalStudents = await db.collection('users').countDocuments({ role: 'student' });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const upcomingMeetings = await db.collection('meetings').countDocuments({
      date: { $gte: today.toISOString() },
    });

    const sevenDaysAgo = subDays(today, 7);
    const recentAnomalies = await db.collection('attendanceLogs').countDocuments({
      isAnomaly: true,
      date: { $gte: sevenDaysAgo.toISOString() },
    });
    
    // Placeholder for average attendance rate - calculation can be complex
    const averageAttendanceRate = "N/A"; 

    // Example for a simple attendance rate calculation (can be added if needed):
    // const presentLogs = await db.collection('attendanceLogs').countDocuments({ status: 'Present' });
    // const absentLogs = await db.collection('attendanceLogs').countDocuments({ status: 'Absent' });
    // const totalRelevantLogs = presentLogs + absentLogs;
    // const calculatedRate = totalRelevantLogs > 0 ? ((presentLogs / totalRelevantLogs) * 100).toFixed(1) + '%' : "N/A";


    return {
      totalStudents,
      upcomingMeetings,
      recentAnomalies,
      averageAttendanceRate, // Or use 'calculatedRate' if implementing the above
    };
  } catch (error) {
    console.error('Error fetching dashboard summary data:', error);
    // Return default/error values
    return {
      totalStudents: 0,
      upcomingMeetings: 0,
      recentAnomalies: 0,
      averageAttendanceRate: "Error",
    };
  }
}
