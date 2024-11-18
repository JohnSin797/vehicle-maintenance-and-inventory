'use server'

import { createDecoder } from "fast-jwt"

export async function decodeCookie(token: string) {
    try {
        const decode = createDecoder()
        return await decode(token)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('JWT verification failed:', error.message);
        } else {
            console.error('Unexpected error during JWT verification');
        }
        return null;
    }
}