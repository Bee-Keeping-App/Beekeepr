import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/AppHeader';
import { styles } from './Analytics.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnalyticsTab = 'analysis' | 'configuration';

interface SavedReport {
    id: string;
    title: string;
    type: string;
    metric: string;
    hives: number;
}

interface ChartHive {
    id: string;
    name: string;
    color: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

//We need to hook this in to the correct api data, but for now we'll use some hardcoded examples to build out the UI and data flow

const PAGE_TITLE = 'Analytics Studio';
const SECTION_LABEL_REPORTS = 'SAVED REPORTS';
const PRO_TIP_LABEL = 'Pro Tip: ';
const PRO_TIP_BODY = 'PlaceholderText1 PlaceholderText2 PlaceholderText3 PlaceholderText4 PlaceholderText5.';
const TAB_LABEL_ANALYSIS = 'Analysis';
const TAB_LABEL_CONFIG = 'Edit Configuration';
const CHART_SUBTITLE_TEMPLATE = 'Comparing Hive Weight (lbs)';
const STAT_AVERAGE_LABEL = 'AVERAGE';
const STAT_AVERAGE_VALUE = '77.2 lbs';
const STAT_TREND_LABEL = 'TREND';
const STAT_TREND_VALUE = '+12% vs last period';

const CHART_MONTHS = ['Mar 23', 'Jul 17', 'Nov 10', 'Mar 11'];

const SAVED_REPORTS: SavedReport[] = [
    { id: '1', title: 'Hive Weight Trends', type: 'LINE', metric: 'weight', hives: 3 },
    { id: '2', title: 'Mite Levels Warning', type: 'BAR', metric: 'miteCount', hives: 3 },
];

const CHART_HIVES: ChartHive[] = [
    { id: '1', name: 'Hive #1 (North)', color: '#EF4444' },
    { id: '2', name: 'Hive #2 (North)', color: '#3B82F6' },
    { id: '3', name: 'Hive #3', color: '#8B5CF6' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReportCard({
    report,
    isActive,
    onPress,
}: {
    report: SavedReport;
    isActive: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={[styles.reportCard, isActive && styles.reportCardActive]}
            onPress={onPress}
        >
            <View style={styles.reportMeta}>
                <Text style={styles.reportType}>{report.type}</Text>
                <Text style={styles.reportMetric}>{report.metric}</Text>
                <Text style={styles.reportHives}>{report.hives} Hives</Text>
            </View>
            <Text style={styles.reportTitle}>{report.title}</Text>
        </TouchableOpacity>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function Analytics() {
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('analysis');
    const [selectedReport, setSelectedReport] = useState<SavedReport>(SAVED_REPORTS[0]);

    const chartSubtitle = `${CHART_SUBTITLE_TEMPLATE} • ${CHART_HIVES.length} hives selected`;

    return (
        <View style={styles.screen}>
            <AppHeader />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageHeader}>
                    <View style={styles.pageTitleRow}>
                        <Ionicons name="bar-chart" size={20} color="#F5A623" />
                        <Text style={styles.pageTitle}>{PAGE_TITLE}</Text>
                    </View>
                    <TouchableOpacity style={styles.newButton}>
                        <Text style={styles.newButtonText}>+ New</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionLabel}>{SECTION_LABEL_REPORTS}</Text>
                        <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
                    </View>

                    {SAVED_REPORTS.map((report) => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            isActive={selectedReport.id === report.id}
                            onPress={() => setSelectedReport(report)}
                        />
                    ))}
                </View>

                <View style={styles.proTipCard}>
                    <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                    <Text style={styles.proTipText}>
                        <Text style={styles.proTipBold}>{PRO_TIP_LABEL}</Text>
                        {PRO_TIP_BODY}
                    </Text>
                </View>

                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'analysis' && styles.tabItemActive]}
                        onPress={() => setActiveTab('analysis')}
                    >
                        <Text style={[styles.tabLabel, activeTab === 'analysis' && styles.tabLabelActive]}>
                            {TAB_LABEL_ANALYSIS}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'configuration' && styles.tabItemActive]}
                        onPress={() => setActiveTab('configuration')}
                    >
                        <Text style={[styles.tabLabel, activeTab === 'configuration' && styles.tabLabelActive]}>
                            {TAB_LABEL_CONFIG}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>{selectedReport.title}</Text>
                    <Text style={styles.chartSubtitle}>{chartSubtitle}</Text>

                    <View style={styles.chartArea}>
                        <View style={styles.chartPlaceholder}>
                            {CHART_HIVES.map((hive) => (
                                <View key={hive.id} style={styles.chartLegendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: hive.color }]} />
                                    <Text style={styles.legendLabel}>{hive.name}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.chartMonthRow}>
                            {CHART_MONTHS.map((month) => (
                                <Text key={month} style={styles.chartMonthLabel}>{month}</Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{STAT_AVERAGE_LABEL}</Text>
                            <Text style={styles.statValue}>{STAT_AVERAGE_VALUE}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{STAT_TREND_LABEL}</Text>
                            <Text style={styles.statTrend}>{STAT_TREND_VALUE}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
