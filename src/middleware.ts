import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Export the middleware
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  afterAuth(auth, req) {
    // If the user is signed in and trying to access auth pages
    if (auth.userId && ["/sign-in", "/sign-up"].includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If the user is not signed in and trying to access protected routes
    if (!auth.userId && req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
  },
});

// Export config
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};