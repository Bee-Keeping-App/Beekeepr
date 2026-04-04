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
        paddingBottom: 24,
    },

    // --- Page Header ---
    pageHeader: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    pageSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 14,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickEntryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5A623',
    },
    quickEntryText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    // --- Tabs ---
    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tabItem: {
        paddingVertical: 10,
        paddingHorizontal: 4,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabItemActive: {
        borderBottomColor: '#F5A623',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    tabLabelActive: {
        fontWeight: '700',
        color: '#1A1A1A',
    },

    // --- Apiary Section ---
    apiarySection: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    apiaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    apiaryHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    apiaryName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    apiaryMeta: {
        fontSize: 12,
        color: '#6B7280',
    },
    hiveBadge: {
        backgroundColor: '#F5A623',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    hiveBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    // --- Hive Card ---
    hiveCard: {
        ...card,
        padding: 14,
        marginBottom: 10,
    },
    hiveCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    hiveName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    hiveCheckbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        backgroundColor: '#D1FAE5',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginBottom: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#065F46',
    },
    hiveInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    hiveInfoLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    hiveInfoValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    hiveDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 10,
    },
    hiveActionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    logButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#F5A623',
    },
    logButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#F5A623',
    },
    historyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    historyButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
    },

    // --- Add Hive / Create Apiary ---
    addHiveCard: {
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingVertical: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        gap: 8,
    },
    addHiveText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    createApiaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginTop: 4,
    },
    createApiaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
});
