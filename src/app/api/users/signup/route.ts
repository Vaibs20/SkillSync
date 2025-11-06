// src / app / api / users / signup / route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return errorResponse("Name, email and password are required", 400);
        }

        const user = await User.findOne({ email });
        if (user) {
            return errorResponse("User already exists", 400);
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            branch: "",
            passing_year: null,
            known_skills: [],
            career_path: [],
            experience: false,
            learning_goal: "",
            availability: "",
            isOnboarded: false,
            isVerified: false,
            forgotPasswordToken: null,
            forgotPasswordTokenExpiry: null,
            verifyToken: null,
            verifyTokenExpiry: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedUser = await newUser.save();

        return successResponse(
            { user: { id: savedUser._id, email, name } },
            "User created successfully",
            201
        );
    } catch (error: unknown) {
        return handleApiError(error, "Failed to create user");
    }
}