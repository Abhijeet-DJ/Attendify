import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
  type AuthError,
} from 'firebase/auth';
import { auth } from './config';
import type { LoginFormData } from '@/components/auth/LoginForm';
import type { SignupFormData } from '@/components/auth/SignupForm';


export const signInWithEmail = async ({ email, password }: LoginFormData): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    // console.error('Error signing in with email and password', error);
    throw error as AuthError;
  }
};

export const signUpWithEmail = async ({ email, password }: SignupFormData): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // You might want to set displayName here if collecting it during signup
    // await updateProfile(userCredential.user, { displayName: fullName });
    return userCredential;
  } catch (error) {
    // console.error('Error signing up with email and password', error);
    throw error as AuthError;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error as AuthError;
  }
};
