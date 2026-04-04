import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { AuthStack } from '../navigation/stacks/AuthStack';
import { AppNavigation } from '../navigation/AppNavigator';

export function RootGate() {
    const { isSignedIn, isLoaded } = useAuth();

    // Clerk is still initialising — show a splash-style loader
    if (!isLoaded) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#F5A623" />
            </View>
        );
    }

    if (!isSignedIn) {
        return <AuthStack />;
    }

    return <AppNavigation />;
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
});
