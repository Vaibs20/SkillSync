// src / app / api / users / login / route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;

        if (!email || !password) {
            return errorResponse("Email and password are required", 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse("Invalid credentials", 401);
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return errorResponse("Invalid credentials", 401);
        }

        const token = generateToken(user);

        const response = successResponse(
            undefined,
            "Login successful"
        );
        response.cookies.set("token", token, { httpOnly: true });
        return response;
    } catch (error: unknown) {
        return handleApiError(error, "Login failed");
    }
}