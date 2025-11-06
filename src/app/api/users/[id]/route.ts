//src/app/api/users/[id]/route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        // Require authentication for viewing user profiles
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }

        const user = await User.findById(params.id).select(
            "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
        );

        if (!user) {
            return errorResponse("User not found", 404);
        }

        return successResponse({ user });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch user");
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }

        // Users can only update their own profile
        if (authResult.user.id !== params.id) {
            return errorResponse("Unauthorized to update this profile", 403);
        }

        const data = await req.json();
        
        // Prevent updating sensitive fields
        const { password, forgotPasswordToken, forgotPasswordTokenExpiry, 
                verifyToken, verifyTokenExpiry, ...safeData } = data;

        const updatedUser = await User.findByIdAndUpdate(
            params.id, 
            { ...safeData, updatedAt: new Date() }, 
            { new: true }
        ).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry");

        if (!updatedUser) {
            return errorResponse("User not found", 404);
        }

        return successResponse({ user: updatedUser }, "Profile updated");
    } catch (error: unknown) {
        return handleApiError(error, "Failed to update profile");
    }
}