// src/app/api/connections/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Connection from "@/models/Connection";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

// GET - Get all connections for the logged-in user
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const userId = decoded.id;

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
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST - Send a connection request
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const senderId = decoded.id;

        const { receiverId } = await req.json();

        if (!receiverId) {
            return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
        }

        if (senderId === receiverId) {
            return NextResponse.json({ error: "Cannot send connection request to yourself" }, { status: 400 });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if (existingConnection) {
            return NextResponse.json({ 
                error: "Connection request already exists", 
                connection: existingConnection 
            }, { status: 400 });
        }

        // Create new connection request
        const connection = new Connection({
            sender: senderId,
            receiver: receiverId,
            status: "pending"
        });

        await connection.save();

        return NextResponse.json({ 
            success: true, 
            message: "Connection request sent successfully",
            connection 
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
