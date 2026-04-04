import { Platform, StyleSheet } from 'react-native';

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
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    pageTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    newButton: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
    },
    newButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.8,
    },
    reportCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    reportCardActive: {
        borderColor: '#F5A623',
    },
    reportMeta: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
    },
    reportType: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    reportMetric: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    reportHives: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    reportTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    proTipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 12,
    },
    proTipText: {
        flex: 1,
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 19,
    },
    proTipBold: {
        fontWeight: '700',
        color: '#1A1A1A',
    },
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
        marginRight: 20,
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
        color: '#1A1A1A',
        fontWeight: '600',
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 16,
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
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    chartSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 16,
    },
    chartArea: {
        height: 160,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    chartPlaceholder: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chartLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendLabel: {
        fontSize: 11,
        color: '#6B7280',
    },
    chartMonthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chartMonthLabel: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    statRow: {
        flexDirection: 'row',
        gap: 24,
    },
    statItem: {
        gap: 2,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.6,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    statTrend: {
        fontSize: 16,
        fontWeight: '700',
        color: '#22C55E',
    },
});
