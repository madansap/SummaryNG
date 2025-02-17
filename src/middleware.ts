import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Export the middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/summarize"
  ],
  ignoredRoutes: [
    "/api/webhook",
    "/_next",
    "/favicon.ico",
  ],
  afterAuth(auth, req) {
    // Handle auth state
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
});

// Export config
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};