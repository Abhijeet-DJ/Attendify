
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import type { UserProfile } from '@/types';
import type { ObjectId } from 'mongodb';

export async function getUsers(): Promise<UserProfile[]> {
  try {
    const { db } = await connectToDatabase();
    const users = await db
      .collection('users')
      .find({})
      .sort({ name: 1 }) // Example sort by name
      .toArray();
    
    // Convert ObjectId to string for client-side compatibility and ensure role is present
    return users.map(user => ({
      ...user,
      _id: (user._id as ObjectId)?.toString(),
      role: user.role || 'student', // Default to student if role is missing
    })) as UserProfile[];
  } catch (error) {
    console.error('Error fetching users from DB:', error);
    return []; 
  }
}
