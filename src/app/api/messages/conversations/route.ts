// src/app/api/messages/conversations/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/apiResponse";

connect();

// GET - Get all conversations for the current user
export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }
        const userId = authResult.user.id;

        // Get all unique users the current user has messaged or received messages from
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .sort({ createdAt: -1 })
        .populate("sender", "name email")
        .populate("receiver", "name email");

        // Create a map of conversations with the other user and the last message
        const conversationsMap = new Map();

        messages.forEach((message: {
            sender: { _id: { toString: () => string }; name: string; email: string };
            receiver: { _id: { toString: () => string }; name: string; email: string };
            content: string;
            createdAt: Date;
            read: boolean;
        }) => {
            const otherUserId = message.sender._id.toString() === userId 
                ? message.receiver._id.toString()
                : message.sender._id.toString();

            if (!conversationsMap.has(otherUserId)) {
                const otherUser = message.sender._id.toString() === userId 
                    ? message.receiver 
                    : message.sender;

                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: message.content,
                    lastMessageDate: message.createdAt,
                    unread: message.receiver._id.toString() === userId && !message.read
                });
            } else {
                // Update unread count
                const conv = conversationsMap.get(otherUserId);
                if (message.receiver._id.toString() === userId && !message.read) {
                    conv.unread = true;
                }
            }
        });

        const conversations = Array.from(conversationsMap.values());

        return NextResponse.json({ success: true, conversations });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch conversations");
    }
}
