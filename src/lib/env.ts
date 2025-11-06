// src/lib/env.ts
/**
 * Environment variable validation
 * This ensures all required environment variables are set at startup
 */

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
}

/**
 * Get validated environment variables
 * Validation happens once when the module is loaded
 */
function initEnv() {
    validateEnv();
    return {
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
        MONGO_URI: process.env.MONGO_URI as string,
    };
}

// Environment variables are validated once when this module is first imported
export const env = initEnv();
