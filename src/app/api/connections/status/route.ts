// src/app/api/connections/status/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Connection from "@/models/Connection";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

// GET - Check connection status with a specific user
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

        // Find connection between the two users
        const connection = await Connection.findOne({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        });

        if (!connection) {
            return NextResponse.json({ 
                success: true, 
                status: "none",
                connection: null 
            });
        }

        return NextResponse.json({ 
            success: true, 
            status: connection.status,
            connection: {
                _id: connection._id,
                isSender: connection.sender.toString() === userId,
                status: connection.status
            }
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
