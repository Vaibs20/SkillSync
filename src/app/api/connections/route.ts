// src/app/api/connections/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Connection from "@/models/Connection";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

// GET - Get all connections for the logged-in user
export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }
        const userId = authResult.user.id;

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "accepted";

        // Get connections where user is either sender or receiver
        const connections = await Connection.find({
            $or: [{ sender: userId }, { receiver: userId }],
            status: status
        })
        .populate("sender", "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry")
        .populate("receiver", "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry");

        // Map to return the other user in the connection
        const formattedConnections = connections.map((conn: { sender: { _id: { toString: () => string } }; receiver: unknown; _id: unknown; status: unknown; createdAt: unknown }) => {
            const otherUser = conn.sender._id.toString() === userId ? conn.receiver : conn.sender;
            return {
                _id: conn._id,
                user: otherUser,
                status: conn.status,
                createdAt: conn.createdAt,
                isSender: conn.sender._id.toString() === userId
            };
        });

        return NextResponse.json({ success: true, connections: formattedConnections });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch connections");
    }
}

// POST - Send a connection request
export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }
        const senderId = authResult.user.id;

        const { receiverId } = await req.json();

        if (!receiverId) {
            return errorResponse("Receiver ID is required", 400);
        }

        if (senderId === receiverId) {
            return errorResponse("Cannot send connection request to yourself", 400);
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return errorResponse("User not found", 404);
        }

        // Check if connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if (existingConnection) {
            return errorResponse("Connection request already exists", 400);
        }

        // Create new connection request
        const connection = new Connection({
            sender: senderId,
            receiver: receiverId,
            status: "pending"
        });

        await connection.save();

        return NextResponse.json(
            { 
                success: true, 
                message: "Connection request sent successfully",
                connection 
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        return handleApiError(error, "Failed to send connection request");
    }
}
