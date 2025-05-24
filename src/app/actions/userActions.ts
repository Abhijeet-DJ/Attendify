
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import type { UserProfile, SafeUserProfile } from '@/types'; // Use SafeUserProfile for client
import type { ObjectId } from 'mongodb';

export async function getUsers(): Promise<SafeUserProfile[]> {
  try {
    const { db } = await connectToDatabase();
    const users = await db
      .collection('users')
      .find({})
      .sort({ name: 1 })
      .toArray();
    
    // Convert ObjectId to string for client-side compatibility and omit hashed_password
    return users.map(user => {
      const { hashedPassword, ...safeUser } = user; // Exclude hashedPassword
      return {
        ...safeUser,
        _id: (user._id as ObjectId)?.toString(),
        role: user.role || 'student', // Default to student if role is missing
      } as SafeUserProfile;
    });
  } catch (error) {
    console.error('Error fetching users from DB:', error);
    return []; 
  }
}

// Example of fetching a user by email (might be needed for login)
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });
    if (!user) return null;
    
    return {
      ...user,
      _id: (user._id as ObjectId)?.toString(),
    } as UserProfile; // Return full UserProfile including hashedPassword for server-side comparison
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    return null;
  }
}
