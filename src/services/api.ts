import { Platform } from 'react-native';

// ─── Base URL ─────────────────────────────────────────────────────────────────
// Android emulator routes localhost through 10.0.2.2
// iOS simulator and web use localhost directly
// Physical devices need the host machine's local network IP

const API_BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function authorizedPost(path: string, token: string, body: object) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message ?? `Request failed: ${response.status}`);
    }

    return data;
}

// ─── Account ──────────────────────────────────────────────────────────────────

export interface CreateProfileParams {
    token: string;
    email: string;
    phone?: string;
}

/**
 * Creates the MongoDB account profile for the currently signed-in Clerk user.
 * Should be called once after the user successfully registers.
 */
export async function createAccountProfile({ token, email, phone }: CreateProfileParams) {
    const body = phone ? { email, phone } : { email };
    return authorizedPost('/api/accounts/', token, body);
}
