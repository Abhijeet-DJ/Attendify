import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/shared/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-xl bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <Logo size="lg" />
        </div>
        <CardTitle className="text-2xl text-card-foreground">Welcome Back</CardTitle>
        <CardDescription>Sign in to access your Attendify dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
