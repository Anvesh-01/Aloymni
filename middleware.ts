import { NextResponse, NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  // "/dashboard(.*)",
  // '/adminDashboard(.*)',
  "/alumini(.*)",
  // "/register(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Your custom middleware logic can go here
  // console.log(`Middleware triggered for: ${req.nextUrl}`);

  // If you need to protect certain routes, you can do it here
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Your existing custom logic (currently commented out)
  // const host = req.headers.get('host') || '';
  // const sub = host.split('.')[0];
  // ... rest of your custom logic

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (well-known files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|\\.well-known).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
