// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest, NextResponse } from 'next/server';

// Define routes that should be public (not require authentication)
// const isPublicRoute = createRouteMatcher([
//   '/', // Make the homepage public
//   '/signup',
//   '/login',
//   '/api/auth/signup',
//   '/api/auth/login',
// ]);

export function middleware(req: NextRequest): NextResponse | void {
  // console.log('Middleware running for:', req.nextUrl.pathname);
  // For now, this middleware does not protect any routes.
  // Route protection logic will be added in a subsequent phase.
  // if (!isPublicRoute(req)) {
  //   // auth().protect(); // This was Clerk's way
  //   // Custom protection logic will go here
  // }
  return;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
