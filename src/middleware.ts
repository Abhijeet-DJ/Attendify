
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that should be public (not require authentication)
const isPublicRoute = createRouteMatcher([
  '/', // Make the homepage public
  // Add any other public routes here if needed, e.g. marketing pages
  // '/contact',
]);

// Define routes that should be protected (require authentication)
// By default, all routes not matched by isPublicRoute will be protected.
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) { // Protects all routes that are not public
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
