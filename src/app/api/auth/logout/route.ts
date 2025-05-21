// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ message: "Logout successful", success: true });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
}