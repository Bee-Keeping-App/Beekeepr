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
    newPostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#F5A623',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
    },
    newPostButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
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
        marginBottom: 10,
    },

    // --- Club Item ---
    clubItem: {
        ...card,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        marginBottom: 8,
        gap: 12,
    },
    clubAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clubAvatarText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    clubInfo: {
        flex: 1,
    },
    clubName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    clubRole: {
        fontSize: 12,
        color: '#6B7280',
    },
    clubChevron: {
        padding: 4,
    },

    // --- Admin Tools Card ---
    adminCard: {
        ...card,
        padding: 14,
        marginBottom: 12,
    },
    adminLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#F5A623',
        letterSpacing: 0.6,
        marginBottom: 10,
    },
    adminTool: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    adminToolLast: {
        borderBottomWidth: 0,
    },
    adminToolText: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
    },

    // --- Feed ---
    feedDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
        marginBottom: 16,
    },

    // --- Post Card ---
    postCard: {
        ...card,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        gap: 10,
    },
    postAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    postAvatarText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
    },
    postMeta: {
        flex: 1,
    },
    postAuthor: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    postAuthorMeta: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    postMoreButton: {
        padding: 4,
    },
    postBody: {
        fontSize: 14,
        color: '#1A1A1A',
        lineHeight: 20,
        marginBottom: 12,
    },
    postImagePlaceholder: {
        height: 160,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    postImageLabel: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    postActionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    postActionText: {
        fontSize: 13,
        color: '#6B7280',
    },
});
