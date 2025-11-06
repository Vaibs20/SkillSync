// src/app/api/auth/verify/route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        
        if ('error' in authResult) {
            return authResult.error;
        }

        const user = await User.findById(authResult.user.id);
        if (!user) {
            return errorResponse("User not found", 404);
        }

        // Return user data at top level for backwards compatibility
        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                isOnboarded: user.isOnboarded,
            },
        });
    } catch (error: unknown) {
        return handleApiError(error, "Verification failed");
    }
}