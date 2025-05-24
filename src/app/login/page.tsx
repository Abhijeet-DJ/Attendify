// This page is no longer needed as Clerk handles the sign-in UI.
// Users will be redirected by middleware or can use the <SignInButton />.
// You can delete this file.

// If you want a custom page that embeds Clerk's <SignIn /> component:
/*
import { SignIn } from "@clerk/nextjs";
import Logo from '@/components/shared/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
       <div className="mx-auto mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
      <CardTitle className="text-2xl text-card-foreground mb-2">Sign In to Attendify</CardTitle>
      <CardDescription className="mb-6">Access your dashboard and manage attendance.</CardDescription>
      <SignIn path="/login" routing="path" signUpUrl="/signup" />
    </div>
  );
}
*/

// For now, redirecting or relying on middleware/buttons.
import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Redirect to home or Clerk's sign-in if NEXT_PUBLIC_CLERK_SIGN_IN_URL is configured.
  // Or rely on the <SignInButton> in the header.
  // This page might not be directly accessible if middleware protects it and user is not signed in.
  redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/'); 
  return null; 
}
