import SignupForm from '@/components/auth/SignupForm';
import Logo from '@/components/shared/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md shadow-xl bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
         <Logo size="lg" />
        </div>
        <CardTitle className="text-2xl text-card-foreground">Create an Account</CardTitle>
        <CardDescription>Join Attendify to streamline attendance tracking.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
