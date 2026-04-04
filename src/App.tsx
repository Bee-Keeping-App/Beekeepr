import { Assets as NavigationAssets } from '@react-navigation/elements';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { RootGate } from './components/RootGate';
import newspaper from './assets/newspaper.png';
import bell from './assets/bell.png';

// ─── Constants ────────────────────────────────────────────────────────────────

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

// ─── Clerk token cache (uses expo-secure-store for persistence) ───────────────

const tokenCache = {
    async getToken(key: string) {
        try {
            return await SecureStore.getItemAsync(key);
        } catch {
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch {
            // silently fail — user will re-auth on next launch
        }
    },
};

// ─── Asset preload ────────────────────────────────────────────────────────────

Asset.loadAsync([
    ...NavigationAssets,
    newspaper,
    bell,
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

// ─── App ──────────────────────────────────────────────────────────────────────

export function App() {
    return (
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
            <ClerkLoaded>
                <SafeAreaProvider>
                    <RootGate />
                </SafeAreaProvider>
            </ClerkLoaded>
        </ClerkProvider>
    );
}
