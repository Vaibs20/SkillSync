// src/lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "./env";
import { errorResponse } from "./apiResponse";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    isOnboarded: boolean;
}

/**
 * Extract and verify JWT token from request
 * Returns the decoded user or throws an error
 */
export async function verifyAuth(req: NextRequest): Promise<AuthUser> {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
        throw new Error("Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as AuthUser;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Unauthorized: Invalid token");
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Unauthorized: Token expired");
        }
        throw new Error("Unauthorized: Token verification failed");
    }
}

/**
 * Middleware-style auth handler that returns an error response if auth fails
 * Returns null if authentication succeeds
 */
export async function requireAuth(req: NextRequest): Promise<{ user: AuthUser } | { error: ReturnType<typeof errorResponse> }> {
    try {
        const user = await verifyAuth(req);
        return { user };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unauthorized";
        return { error: errorResponse(message, 401) };
    }
}

/**
 * Generate JWT token for a user
 */
export function generateToken(user: {
    _id: string | { toString: () => string };
    email: string;
    name: string;
    isOnboarded: boolean;
}): string {
    const tokenData = {
        id: typeof user._id === 'string' ? user._id : user._id.toString(),
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
    };

    return jwt.sign(tokenData, env.JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
}
