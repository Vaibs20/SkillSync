// src/app/api/connections/[id]/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Connection from "@/models/Connection";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

// PATCH - Accept or reject a connection request
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }
        const userId = authResult.user.id;

        const { action } = await req.json(); // action: "accept" or "reject"

        if (!action || !["accept", "reject"].includes(action)) {
            return errorResponse("Invalid action", 400);
        }

        const connection = await Connection.findById(params.id);

        if (!connection) {
            return errorResponse("Connection not found", 404);
        }

        // Only the receiver can accept/reject
        if (connection.receiver.toString() !== userId) {
            return errorResponse("Unauthorized to modify this connection", 403);
        }

        // Update status
        connection.status = action === "accept" ? "accepted" : "rejected";
        connection.updatedAt = new Date();
        await connection.save();

        return successResponse(
            { connection },
            `Connection ${action}ed successfully`
        );
    } catch (error: unknown) {
        return handleApiError(error, "Failed to update connection");
    }
}

// DELETE - Remove a connection
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }
        const userId = authResult.user.id;

        const connection = await Connection.findById(params.id);

        if (!connection) {
            return errorResponse("Connection not found", 404);
        }

        // Either party can delete the connection
        if (connection.sender.toString() !== userId && connection.receiver.toString() !== userId) {
            return errorResponse("Unauthorized to delete this connection", 403);
        }

        await Connection.findByIdAndDelete(params.id);

        return successResponse(
            undefined,
            "Connection removed successfully"
        );
    } catch (error: unknown) {
        return handleApiError(error, "Failed to delete connection");
    }
}
