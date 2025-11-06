// src/lib/types.ts
/**
 * Shared type definitions for the application
 */

/**
 * MongoDB query filter for user search
 */
export interface UserSearchFilter {
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    branch?: string;
    passing_year?: number;
    known_skills?: { $in: string[] };
    career_path?: { $in: string[] };
    experience?: boolean;
    learning_goal?: { $regex: string; $options: string };
    availability?: string;
    isOnboarded?: boolean;
    isVerified?: boolean;
}
