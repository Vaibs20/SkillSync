//src/app/api/users/onboarding/route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const { onboardingDetails } = await req.json();

        // Map formResponses to schema fields
        const updateData = {
            branch: onboardingDetails[0]?.selectedOption || "", // Department
            passing_year: parseInt(onboardingDetails[1]?.selectedOption) || null, // Graduation year
            known_skills: [
                ...(onboardingDetails[2]?.selectedOptions || []),
                ...(onboardingDetails[2]?.otherText ? [onboardingDetails[2].otherText] : []),
            ], // Skills
            career_path: [
                ...(onboardingDetails[3]?.selectedOptions || []),
                ...(onboardingDetails[3]?.otherText ? [onboardingDetails[3].otherText] : []),
            ], // Career path
            experience: onboardingDetails[4]?.selectedOption === "Yes", // Projects
            learning_goal: onboardingDetails[5]?.text || "", // 3-month goals
            availability: onboardingDetails[6]?.selectedOption || "", // Time per week
            isOnboarded: true,
            updatedAt: new Date(),
        };

        const updatedUser = await User.findByIdAndUpdate(decoded.id, updateData, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated", success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}