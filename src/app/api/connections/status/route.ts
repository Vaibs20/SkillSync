// src/app/api/connections/status/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Connection from "@/models/Connection";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

// GET - Check connection status with a specific user
export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }
        const userId = authResult.user.id;

        const { searchParams } = new URL(req.url);
        const otherUserId = searchParams.get("userId");

        if (!otherUserId) {
            return errorResponse("User ID is required", 400);
        }

        // Find connection between the two users
        const connection = await Connection.findOne({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        });

        if (!connection) {
            return successResponse({ 
                status: "none",
                connection: null 
            });
        }

        return successResponse({ 
            status: connection.status,
            connection: {
                _id: connection._id,
                isSender: connection.sender.toString() === userId,
                status: connection.status
            }
        });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to check connection status");
    }
}
