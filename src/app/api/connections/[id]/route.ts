// src/app/api/connections/[id]/route.ts
import { connect } from "@/dbConfig/dbConfig";
import Connection from "@/models/Connection";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

// PATCH - Accept or reject a connection request
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const userId = decoded.id;

        const { action } = await req.json(); // action: "accept" or "reject"

        if (!action || !["accept", "reject"].includes(action)) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const connection = await Connection.findById(params.id);

        if (!connection) {
            return NextResponse.json({ error: "Connection not found" }, { status: 404 });
        }

        // Only the receiver can accept/reject
        if (connection.receiver.toString() !== userId) {
            return NextResponse.json({ error: "Unauthorized to modify this connection" }, { status: 403 });
        }

        // Update status
        connection.status = action === "accept" ? "accepted" : "rejected";
        connection.updatedAt = new Date();
        await connection.save();

        return NextResponse.json({ 
            success: true, 
            message: `Connection ${action}ed successfully`,
            connection 
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE - Remove a connection
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const userId = decoded.id;

        const connection = await Connection.findById(params.id);

        if (!connection) {
            return NextResponse.json({ error: "Connection not found" }, { status: 404 });
        }

        // Either party can delete the connection
        if (connection.sender.toString() !== userId && connection.receiver.toString() !== userId) {
            return NextResponse.json({ error: "Unauthorized to delete this connection" }, { status: 403 });
        }

        await Connection.findByIdAndDelete(params.id);

        return NextResponse.json({ 
            success: true, 
            message: "Connection removed successfully"
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
