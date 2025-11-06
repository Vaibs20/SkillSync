// src/lib/apiResponse.ts
import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data?: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    message?: string;
}

/**
 * Create a standardized success response
 */
export function successResponse<T = unknown>(
    data?: T,
    message?: string,
    status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            ...(data !== undefined && { data }),
            ...(message && { message }),
        },
        { status }
    );
}

/**
 * Create a standardized error response
 */
export function errorResponse(
    error: string,
    status: number = 500,
    message?: string
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            error,
            ...(message && { message }),
        },
        { status }
    );
}

/**
 * Handle API errors in a standardized way
 */
export function handleApiError(error: unknown, fallbackMessage: string = "Internal server error"): NextResponse {
    console.error("API Error:", error);
    
    if (error instanceof Error) {
        // Don't expose detailed error messages in production
        const isDevelopment = process.env.NODE_ENV === 'development';
        return errorResponse(
            isDevelopment ? error.message : fallbackMessage,
            500
        );
    }
    
    return errorResponse(fallbackMessage, 500);
}
