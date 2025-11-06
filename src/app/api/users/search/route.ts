import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/apiResponse";
import type { UserSearchFilter } from "@/lib/types";

connect();

export async function GET(req: NextRequest) {
    try {
        // Require authentication for user search
        const authResult = await requireAuth(req);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name") || "";
        const email = searchParams.get("email") || "";
        const branch = searchParams.get("branch") || "";
        const passing_year = searchParams.get("passing_year") || "";
        const known_skills = searchParams.getAll("known_skills");
        const career_path = searchParams.getAll("career_path");
        const experience = searchParams.get("experience") || "";
        const learning_goal = searchParams.get("learning_goal") || "";
        const availability = searchParams.get("availability") || "";
        const isOnboarded = searchParams.get("isOnboarded") || "";
        const isVerified = searchParams.get("isVerified") || "";

        // Build MongoDB query
        const query: UserSearchFilter = {};
        if (name) query.name = { $regex: name, $options: "i" };
        if (email) query.email = { $regex: email, $options: "i" };
        if (branch) query.branch = branch;
        if (passing_year) query.passing_year = parseInt(passing_year);
        if (known_skills.length) query.known_skills = { $in: known_skills };
        if (career_path.length) query.career_path = { $in: career_path };
        if (experience) query.experience = experience === "true";
        if (learning_goal) query.learning_goal = { $regex: learning_goal, $options: "i" };
        if (availability) query.availability = availability;
        if (isOnboarded) query.isOnboarded = isOnboarded === "true";
        if (isVerified) query.isVerified = isVerified === "true";

        // Fetch users, excluding sensitive fields
        const users = await User.find(query).select(
            "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
        );

        return successResponse({ users });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to search users");
    }
}