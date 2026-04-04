import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
    },

    // --- Logo ---
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#F5A623',
        letterSpacing: -0.5,
    },
    logoTagline: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },

    // --- Card ---
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },

    // --- Fields ---
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    fieldWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 16,
        height: 48,
    },
    fieldWrapperError: {
        borderColor: '#EF4444',
    },
    fieldInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
    },
    fieldIcon: {
        marginRight: 10,
    },
    showHideButton: {
        padding: 4,
    },

    // --- Error ---
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: -10,
        marginBottom: 12,
    },

    // --- Submit ---
    submitButton: {
        backgroundColor: '#F5A623',
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    // --- Footer link ---
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 4,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '700',
        color: '#F5A623',
    },
});
