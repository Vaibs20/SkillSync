// src/lib/env.ts
/**
 * Environment variable validation
 * This ensures all required environment variables are set at startup
 */

let isValidated = false;

export function validateEnv() {
    const requiredEnvVars = [
        'JWT_SECRET_KEY',
        'MONGO_URI'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.'
        );
    }

    isValidated = true;
}

/**
 * Get validated environment variables
 * These are guaranteed to be defined after validateEnv() is called
 */
function getEnv() {
    if (!isValidated) {
        validateEnv();
    }
    return {
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
        MONGO_URI: process.env.MONGO_URI as string,
    };
}

export const env = getEnv();
