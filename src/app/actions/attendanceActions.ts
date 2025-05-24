
'use server';
import { connectToDatabase } from '@/lib/mongodb';
import type { AttendanceLog } from '@/types';
import type { ObjectId } from 'mongodb';

export async function getAttendanceLogs(): Promise<AttendanceLog[]> {
  try {
    const { db } = await connectToDatabase();
    const logs = await db
      .collection('attendanceLogs')
      .find({})
      .sort({ date: -1, studentName: 1 }) 
      .toArray();
    
    return logs.map(log => ({
      ...log,
      _id: (log._id as ObjectId)?.toString(),
    })) as AttendanceLog[];
  } catch (error) {
    console.error('Error fetching all attendance logs:', error);
    return []; 
  }
}

export async function getAttendanceLogsForUser(userEmail: string): Promise<AttendanceLog[]> {
  if (!userEmail) {
    console.warn('Attempted to fetch logs for an undefined user email.');
    return [];
  }
  try {
    const { db } = await connectToDatabase();
    const logs = await db
      .collection('attendanceLogs')
      .find({ studentEmail: userEmail })
      .sort({ date: -1 })
      .toArray();
    
    return logs.map(log => ({
      ...log,
      _id: (log._id as ObjectId)?.toString(),
    })) as AttendanceLog[];
  } catch (error) {
    console.error(`Error fetching attendance logs for user ${userEmail}:`, error);
    return [];
  }
}


export async function updateAttendanceLogInDb(logToUpdate: AttendanceLog): Promise<AttendanceLog | null> {
  try {
    const { db } = await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...dataToUpdate } = logToUpdate; 

    if (!logToUpdate.id) { // Using custom 'id' field for matching
      throw new Error("Cannot update log without a custom 'id'.");
    }
    
    const result = await db.collection('attendanceLogs').updateOne(
      { id: logToUpdate.id }, 
      { $set: dataToUpdate }
    );

    if (result.matchedCount === 0) {
      console.warn(`No document found with id: ${logToUpdate.id} to update.`);
      return null;
    }
    if (result.modifiedCount === 0) {
      console.warn(`Document with id: ${logToUpdate.id} was found but not modified (data might be the same).`);
    }
    
    // Return the log as it was passed, assuming the update was successful if matched/modified
    return logToUpdate;

  } catch (error) {
    console.error('Error updating attendance log in DB:', error);
    throw error; 
  }
}
