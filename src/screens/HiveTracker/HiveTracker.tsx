import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/AppHeader';
import { styles } from './HiveTracker.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

type LogBookTab = 'My Apiaries' | 'Journal Feed';
type HiveStatus = 'Healthy' | 'Needs Attention' | 'Critical';

interface Hive {
    id: string;
    name: string;
    status: HiveStatus;
    queen: string;
    lastCheck: string;
}

interface Apiary {
    id: string;
    name: string;
    location: string;
    hives: Hive[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

//We need to hook this in to the correct api data, but for now we'll use some hardcoded examples to build out the UI and data flow

const PAGE_TITLE = 'Apiary Manager';
const PAGE_SUBTITLE = 'Manage hives and track your beekeeping journey.';
const TAB_MY_APIARIES: LogBookTab = 'My Apiaries';
const TAB_JOURNAL_FEED: LogBookTab = 'Journal Feed';
const JOURNAL_FEED_PLACEHOLDER = 'Journal entries will appear here.';
const LABEL_QUEEN = 'Queen';
const LABEL_LAST_CHECK = 'Last Check';

const LOG_BOOK_TABS: LogBookTab[] = [TAB_MY_APIARIES, TAB_JOURNAL_FEED];

const APIARIES: Apiary[] = [
    {
        id: '1',
        name: 'North Apiary',
        location: 'Backyard - North Corner',
        hives: [
            { id: '1', name: 'Hive #1', status: 'Healthy', queen: 'Blue (2024)', lastCheck: 'Jun 12' },
            { id: '2', name: 'Hive #2', status: 'Healthy', queen: 'Yellow (2023)', lastCheck: 'Jun 12' },
        ],
    },
    {
        id: '2',
        name: 'South Garden',
        location: 'Community Garden Plot #8',
        hives: [
            { id: '3', name: 'Hive #1', status: 'Healthy', queen: 'White (2023)', lastCheck: 'Jun 20' },
        ],
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HiveCard({ hive }: { hive: Hive }) {
    return (
        <View style={styles.hiveCard}>
            <View style={styles.hiveCardHeader}>
                <Text style={styles.hiveName}>{hive.name}</Text>
                <View style={styles.hiveCheckbox} />
            </View>

            <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{hive.status}</Text>
            </View>

            <View style={styles.hiveInfoRow}>
                <Text style={styles.hiveInfoLabel}>{LABEL_QUEEN}</Text>
                <Text style={styles.hiveInfoValue}>{hive.queen}</Text>
            </View>
            <View style={styles.hiveInfoRow}>
                <Text style={styles.hiveInfoLabel}>{LABEL_LAST_CHECK}</Text>
                <Text style={styles.hiveInfoValue}>{hive.lastCheck}</Text>
            </View>

            <View style={styles.hiveDivider} />

            <View style={styles.hiveActionRow}>
                <TouchableOpacity style={styles.logButton}>
                    <Ionicons name="add" size={14} color="#F5A623" />
                    <Text style={styles.logButtonText}>Log</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.historyButton}>
                    <Ionicons name="analytics-outline" size={14} color="#1A1A1A" />
                    <Text style={styles.historyButtonText}>History</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function ApiarySection({ apiary }: { apiary: Apiary }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <View style={styles.apiarySection}>
            <TouchableOpacity style={styles.apiaryHeader} onPress={() => setExpanded(!expanded)}>
                <View style={styles.apiaryHeaderLeft}>
                    <Ionicons
                        name={expanded ? 'chevron-down' : 'chevron-forward'}
                        size={16}
                        color="#6B7280"
                    />
                    <View>
                        <Text style={styles.apiaryName}>{apiary.name}</Text>
                        <Text style={styles.apiaryMeta}>{apiary.location}</Text>
                    </View>
                </View>
                <View style={styles.hiveBadge}>
                    <Text style={styles.hiveBadgeText}>{apiary.hives.length} Hives</Text>
                </View>
            </TouchableOpacity>

            {expanded && (
                <>
                    {apiary.hives.map((hive) => (
                        <HiveCard key={hive.id} hive={hive} />
                    ))}
                    <TouchableOpacity style={styles.addHiveCard}>
                        <Ionicons name="add" size={24} color="#9CA3AF" />
                        <Text style={styles.addHiveText}>Add Hive</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function HiveTracker() {
    const [activeTab, setActiveTab] = useState<LogBookTab>(TAB_MY_APIARIES);

    return (
        <View style={styles.screen}>
            <AppHeader />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>{PAGE_TITLE}</Text>
                    <Text style={styles.pageSubtitle}>{PAGE_SUBTITLE}</Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.settingsButton}>
                            <Ionicons name="settings-outline" size={18} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickEntryButton}>
                            <Ionicons name="add" size={16} color="#1A1A1A" />
                            <Text style={styles.quickEntryText}>Quick Entry</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.tabRow}>
                    {LOG_BOOK_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === TAB_MY_APIARIES && (
                    <>
                        {APIARIES.map((apiary) => (
                            <ApiarySection key={apiary.id} apiary={apiary} />
                        ))}
                        <TouchableOpacity style={styles.createApiaryButton}>
                            <Ionicons name="add" size={16} color="#6B7280" />
                            <Text style={styles.createApiaryText}>Create New Apiary</Text>
                        </TouchableOpacity>
                    </>
                )}

                {activeTab === TAB_JOURNAL_FEED && (
                    <View style={styles.apiarySection}>
                        <Text style={styles.apiaryMeta}>{JOURNAL_FEED_PLACEHOLDER}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
