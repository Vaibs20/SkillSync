//src/app/api/users/onboarding/route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiResponse";

connect();

export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { onboardingDetails } = await req.json();

        if (!onboardingDetails || !Array.isArray(onboardingDetails)) {
            return errorResponse("Invalid onboarding details", 400);
        }

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

        const updatedUser = await User.findByIdAndUpdate(authResult.user.id, updateData, { new: true });

        if (!updatedUser) {
            return errorResponse("User not found", 404);
        }

        return successResponse(undefined, "Profile updated");
    } catch (error: unknown) {
        return handleApiError(error, "Failed to update profile");
    }
}