//src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface AuthUser {
    id: string;
    email: string;
    name: string;
    isOnboarded: boolean;
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    // Allow public routes without a token
    const publicRoutes = ["/login", "/signup"];
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Redirect to /login if no token for protected routes
    const protectedRoutes = ["/dashboard", "/onboarding", "/profile", "/search", "/connections", "/messages"];
    if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If token exists, verify it directly
    if (token) {
        try {
            const jwtSecret = process.env.JWT_SECRET_KEY;
            if (!jwtSecret) {
                console.error("JWT_SECRET_KEY not found in environment");
                return NextResponse.redirect(new URL("/login", req.url));
            }

            // Verify the JWT token directly in middleware
            const decoded = jwt.verify(token, jwtSecret) as AuthUser;
            const { isOnboarded } = decoded;

            // Redirect to /onboarding if not onboarded (except on /onboarding)
            if (!isOnboarded && pathname !== "/onboarding") {
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }

            // Redirect to /dashboard if onboarded and trying to access /onboarding
            if (isOnboarded && pathname === "/onboarding") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // Allow access to the requested route
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware error:", error);
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Allow non-protected routes (e.g., /api routes, static assets)
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};