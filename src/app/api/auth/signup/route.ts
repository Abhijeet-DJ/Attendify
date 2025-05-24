// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { parseNameAndIdFromString } from '@/lib/utils';
import type { UserProfile } from '@/types';

export async function POST(req: Request) {
  try {
    const { fullNameWithId, email, password, role } = await req.json();

    if (!fullNameWithId || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    if (!['student', 'teacher'].includes(role)) {
        return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
    }
    
    const { parsedName, extractedId } = parseNameAndIdFromString(fullNameWithId);

    if (!parsedName || !extractedId) {
        return NextResponse.json({ message: 'Full Name & ID field must follow the "FullName_ID" format (e.g., John Doe_S12345).' }, { status: 400 });
    }


    const { db } = await connectToDatabase();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: Omit<UserProfile, '_id' | 'avatarUrl'> = {
      name: parsedName,
      email,
      hashedPassword,
      role,
      registrationNumber: role === 'student' ? extractedId : null,
      teacherId: role === 'teacher' ? extractedId : null,
    };

    const result = await db.collection('users').insertOne(newUser);

    if (!result.insertedId) {
        return NextResponse.json({ message: 'Failed to create user account' }, { status: 500 });
    }
    
    // Don't send back the hashedPassword or full user object
    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId.toString() }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message: 'An unexpected error occurred', error: errorMessage }, { status: 500 });
  }
}
