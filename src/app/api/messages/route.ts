// src/app/api/messages/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Message from "@/models/Message";
import Connection from "@/models/Connection";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

// GET - Get messages between current user and another user
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const userId = decoded.id;

        const { searchParams } = new URL(req.url);
        const otherUserId = searchParams.get("userId");

        if (!otherUserId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Check if users are connected
        const connection = await Connection.findOne({
            $or: [
                { sender: userId, receiver: otherUserId, status: "accepted" },
                { sender: otherUserId, receiver: userId, status: "accepted" }
            ]
        });

        if (!connection) {
            return NextResponse.json({ 
                error: "You can only message users you are connected with" 
            }, { status: 403 });
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
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST - Send a message
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const senderId = decoded.id;

        const { receiverId, content } = await req.json();

        if (!receiverId || !content) {
            return NextResponse.json({ 
                error: "Receiver ID and message content are required" 
            }, { status: 400 });
        }

        if (!content.trim()) {
            return NextResponse.json({ 
                error: "Message content cannot be empty" 
            }, { status: 400 });
        }

        // Check if users are connected
        const connection = await Connection.findOne({
            $or: [
                { sender: senderId, receiver: receiverId, status: "accepted" },
                { sender: receiverId, receiver: senderId, status: "accepted" }
            ]
        });

        if (!connection) {
            return NextResponse.json({ 
                error: "You can only message users you are connected with" 
            }, { status: 403 });
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

        return NextResponse.json({ 
            success: true, 
            message: "Message sent successfully",
            data: message
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
