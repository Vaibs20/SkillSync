// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { successResponse } from "@/lib/apiResponse";

export async function POST() {
    const response = successResponse(undefined, "Logout successful");
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
}