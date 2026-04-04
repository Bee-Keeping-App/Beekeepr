import { Platform, StyleSheet } from 'react-native';

const card = {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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

    // --- Greeting ---
    greetingSection: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    greetingSubtext: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 14,
    },
    addReminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bellButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addReminderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#F5A623',
        backgroundColor: '#FFFFFF',
    },
    addReminderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F5A623',
    },

    // --- Weather Card ---
    weatherCard: {
        ...card,
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#5BC4D4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    weatherLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.85,
        marginBottom: 4,
    },
    weatherTemp: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    weatherCondition: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    weatherIcon: {
        opacity: 0.9,
    },

    // --- Weather Stats (humidity / wind) ---
    weatherStatsSection: {
        marginHorizontal: 16,
        marginBottom: 16,
        gap: 12,
    },
    weatherStatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    weatherStatDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 2,
    },
    weatherStatLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.6,
    },
    weatherStatValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    // --- Calendar / Tasks ---
    calendarSection: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    calendarDate: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    calendarNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    calendarNavButton: {
        padding: 4,
    },
    todayButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    todayButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
    },
    calendarTabRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 4,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    calendarTab: {
        flex: 1,
        paddingVertical: 7,
        alignItems: 'center',
        borderRadius: 7,
    },
    calendarTabActive: {
        backgroundColor: '#F5A623',
    },
    calendarTabText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    calendarTabTextActive: {
        color: '#1A1A1A',
        fontWeight: '700',
    },

    // --- Task Items ---
    taskItem: {
        ...card,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    taskIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 4,
    },
    taskIndicatorPending: {
        backgroundColor: '#F5A623',
    },
    taskIndicatorCompleted: {
        backgroundColor: '#22C55E',
    },
    taskContent: {
        flex: 1,
    },
    taskTime: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    taskDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 6,
    },
    taskBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    taskBadgePending: {
        backgroundColor: '#FEF3C7',
    },
    taskBadgeCompleted: {
        backgroundColor: '#D1FAE5',
    },
    taskBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    taskBadgeTextPending: {
        color: '#D97706',
    },
    taskBadgeTextCompleted: {
        color: '#065F46',
    },

    // --- Reminders ---
    remindersSection: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    remindersHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    remindersTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    reminderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#F5A623',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    reminderTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    reminderDue: {
        fontSize: 12,
        color: '#6B7280',
    },

    // --- Did You Know ---
    didYouKnowCard: {
        marginHorizontal: 16,
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    didYouKnowTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#92400E',
        marginBottom: 6,
    },
    didYouKnowText: {
        fontSize: 13,
        color: '#78350F',
        lineHeight: 19,
    },
});
