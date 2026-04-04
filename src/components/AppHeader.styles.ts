import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#F5A623',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F5A623',
    },
    logo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    weatherText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
});
