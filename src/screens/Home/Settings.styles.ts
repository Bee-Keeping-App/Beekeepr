import { Platform, StyleSheet } from 'react-native';

const card = {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
        },
        android: {
            elevation: 3,
        },
    }),
};

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },

    // --- Page Header ---
    pageHeader: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },

    // --- Section ---
    section: {
        marginHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    sectionDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
    },
    sectionCard: {
        ...card,
        overflow: 'hidden',
    },

    // --- Toggle Row ---
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    toggleInfo: {
        flex: 1,
        marginRight: 12,
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    toggleDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 17,
    },

    // --- Field Rows ---
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    fieldRowLast: {
        borderBottomWidth: 0,
    },
    fieldLabel: {
        fontSize: 15,
        color: '#1A1A1A',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#22C55E',
    },
    checkboxUnchecked: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
    },

    // --- Account Section ---
    accountCard: {
        ...card,
        padding: 16,
    },
    accountTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    accountSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
    },
});
