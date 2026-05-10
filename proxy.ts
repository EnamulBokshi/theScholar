import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const { pathname } = request.nextUrl;

    // 1. If not logged in
    if (!session) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const user = session.user;
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

    // 2. Only admin can access /admin/dashboard and /dashboard
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
        if (!isAdmin) {
            return NextResponse.redirect(new URL("/chat", request.url));
        }
        // If admin, allow access (don't redirect to /dashboard again to avoid loops)
        return NextResponse.next();
    }

    // 3. Only logged in users can access /chat
    if (pathname.startsWith("/chat")) {
        // Check for email verification for regular users
        if (!user.emailVerified && user.role === "USER") {
            return NextResponse.redirect(new URL("/auth/verify-email", request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/chat/:path*"],
};