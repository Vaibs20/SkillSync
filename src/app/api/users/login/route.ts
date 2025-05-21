// src / app / api / users / login / route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;
        console.log("Received data:", { email, password });

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        console.log("User found:", user);
        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email,
            isOnboarded: user.isOnboarded,
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d",
        });
        console.log("Token generated:", token);

        const response = NextResponse.json({ message: "Login successful", success: true });
        response.cookies.set("token", token, { httpOnly: true });
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}