// src / app / api / users / signup / route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        console.log("Received data:", { name, email, password });

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
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
        console.log(savedUser);

        return NextResponse.json(
            { message: "User created successfully", success: true, user: { id: savedUser._id, email, name } },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}