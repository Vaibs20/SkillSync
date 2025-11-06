// src/app/api/messages/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Message from "@/models/Message";
import Connection from "@/models/Connection";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

// GET - Get messages between current user and another user
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

        // Check if users are connected
        const connection = await Connection.findOne({
            $or: [
                { sender: userId, receiver: otherUserId, status: "accepted" },
                { sender: otherUserId, receiver: userId, status: "accepted" }
            ]
        });

        if (!connection) {
            return errorResponse(
                "You can only message users you are connected with",
                403
            );
        }

        // Fetch messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "name email")
        .populate("receiver", "name email");

        // Mark messages from other user as read
        await Message.updateMany(
            { sender: otherUserId, receiver: userId, read: false },
            { read: true }
        );

        return NextResponse.json({ success: true, messages });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch messages");
    }
}

// POST - Send a message
export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }
        const senderId = authResult.user.id;

        const { receiverId, content } = await req.json();

        if (!receiverId || !content) {
            return errorResponse(
                "Receiver ID and message content are required",
                400
            );
        }

        if (!content.trim()) {
            return errorResponse(
                "Message content cannot be empty",
                400
            );
        }

        // Check if users are connected
        const connection = await Connection.findOne({
            $or: [
                { sender: senderId, receiver: receiverId, status: "accepted" },
                { sender: receiverId, receiver: senderId, status: "accepted" }
            ]
        });

        if (!connection) {
            return errorResponse(
                "You can only message users you are connected with",
                403
            );
        }

        // Create new message
        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content: content.trim()
        });

        await message.save();
        await message.populate("sender", "name email");
        await message.populate("receiver", "name email");

        return NextResponse.json(
            { 
                success: true, 
                message: "Message sent successfully",
                data: message
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        return handleApiError(error, "Failed to send message");
    }
}
