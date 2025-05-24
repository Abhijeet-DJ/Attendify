// This page is no longer needed as Clerk handles the sign-up UI.
// Users will be redirected by middleware or can use the <SignUpButton />.
// You can delete this file.

// If you want a custom page that embeds Clerk's <SignUp /> component:
/*
import { SignUp } from "@clerk/nextjs";
import Logo from '@/components/shared/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="mx-auto mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
      <CardTitle className="text-2xl text-card-foreground mb-2">Create Your Attendify Account</CardTitle>
      <CardDescription className="mb-6">Join to streamline attendance tracking.</CardDescription>
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  );
}
*/

// For now, redirecting or relying on middleware/buttons.
import { redirect } from 'next/navigation';

export default function SignupPage() {
  redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/');
  return null;
}
