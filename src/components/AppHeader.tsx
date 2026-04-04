import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AppHeader.styles';

const APP_NAME = 'beekeepr';
const WEATHER_TEMP = '72°F';
const WEATHER_ICON_SIZE = 16;

export function AppHeader() {
    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.logo}>{APP_NAME}</Text>
                <View style={styles.weatherRow}>
                    <Ionicons name="sunny-outline" size={WEATHER_ICON_SIZE} color="#1A1A1A" />
                    <Text style={styles.weatherText}>{WEATHER_TEMP}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
