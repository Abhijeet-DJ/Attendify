'use server';
import { connectToDatabase } from '@/lib/mongodb';
import type { AttendanceLog } from '@/types';

export async function getAttendanceLogs(): Promise<AttendanceLog[]> {
  try {
    const { db } = await connectToDatabase();
    const logs = await db
      .collection<AttendanceLog>('attendanceLogs')
      .find({})
      .sort({ date: -1, studentName: 1 }) // Example sort
      .toArray();
    
    // Convert ObjectId to string for client-side compatibility
    return logs.map(log => ({
      ...log,
      _id: log._id?.toString(),
    })) as AttendanceLog[];
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    // In a real app, you might want to throw a custom error or return an object indicating failure
    return []; 
  }
}

export async function updateAttendanceLogInDb(logToUpdate: AttendanceLog): Promise<AttendanceLog | null> {
  try {
    const { db } = await connectToDatabase();
    const { _id, ...dataToUpdate } = logToUpdate; // Separate _id

    if (!_id) {
      throw new Error("Cannot update log without an _id.");
    }
    
    // Ensure you're querying by MongoDB's _id, not the custom `id` field if they differ.
    // If your `logToUpdate` still has `_id` as a string, you might need to convert it to ObjectId
    // For simplicity, assuming `logToUpdate._id` is the correct MongoDB document ID as a string.
    // If `_id` is an ObjectId, this won't work directly, you'd fetch then update.
    // However, we are converting to string when fetching, so this should be fine if _id is the string version.

    const result = await db.collection('attendanceLogs').updateOne(
      { id: logToUpdate.id }, // Assuming 'id' is the unique custom identifier for your logs
      { $set: dataToUpdate }
    );

    if (result.matchedCount === 0) {
      console.warn(`No document found with id: ${logToUpdate.id} to update.`);
      return null;
    }
    if (result.modifiedCount === 0) {
      console.warn(`Document with id: ${logToUpdate.id} was found but not modified (data might be the same).`);
    }
    
    // Return the updated log (or fetch it again if $set doesn't return the full doc and you need it)
    // For this example, we'll assume the input `logToUpdate` reflects the desired state.
    return logToUpdate;

  } catch (error) {
    console.error('Error updating attendance log:', error);
    throw error; // Re-throw to be caught by the caller
  }
}
