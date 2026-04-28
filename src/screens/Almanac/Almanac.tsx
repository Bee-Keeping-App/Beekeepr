import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../Contexts/ThemeContext';

const AMBER = '#F59E0B';
const AMBER_DARK = '#D97706';
const ORANGE = '#F97316';
const BLUE_LABEL = '#1D4ED8';

type HiveStatus = 'healthy' | 'attention' | 'critical';

interface Hive {
  id: number;
  name: string;
  status: HiveStatus;
  queen: string;
  lastCheck: string;
}

interface Apiary {
  id: number;
  name: string;
  location: string;
  hives: Hive[];
}

const APIARIES: Apiary[] = [
  {
    id: 1,
    name: 'North Apiary',
    location: 'Backyard - North Corner',
    hives: [
      { id: 1, name: 'Hive #1', status: 'healthy', queen: 'Blue (2024)', lastCheck: 'Jun 12' },
      { id: 2, name: 'Hive #2', status: 'healthy', queen: 'Yellow (2023)', lastCheck: 'Jun 10' },
      { id: 3, name: 'Hive #3', status: 'attention', queen: 'Red (2022)', lastCheck: 'Jun 8' },
    ],
  },
  {
    id: 2,
    name: 'South Garden',
    location: 'Community Garden Plot 4B',
    hives: [
      { id: 4, name: 'Hive #1', status: 'healthy', queen: 'White (2023)', lastCheck: 'Jun 20' },
    ],
  },
];

const STATUS_CONFIG: Record<HiveStatus, { label: string; bg: string; text: string }> = {
  healthy: { label: 'Healthy', bg: '#DCFCE7', text: '#16A34A' },
  attention: { label: 'Needs Attention', bg: '#FEF3C7', text: '#D97706' },
  critical: { label: 'Critical', bg: '#FEE2E2', text: '#DC2626' },
};

type TabMode = 'apiaries' | 'journal';

export function Almanac() {
  const { colors, theme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabMode>('apiaries');
  const [expandedApiaries, setExpandedApiaries] = useState<Set<number>>(new Set([1]));

  function toggleApiary(id: number) {
    setExpandedApiaries((prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={AMBER} />

      {/* Amber Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>beekeepr</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('Weather')}>
          <Text style={styles.headerWeatherIcon}>☀️</Text>
          <Text style={styles.headerTemp}>72°F</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.surface }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Apiary Manager</Text>
          <Text style={[styles.pageSubtitle, { color: colors.muted }]}>
            Manage hives and track your beekeeping journey.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <Text style={styles.gearEmoji}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickEntryBtn}
              onPress={() => Alert.alert('Quick Entry', 'What would you like to log?', [
                { text: 'Inspection', onPress: () => navigation.navigate('HiveDetails') },
                { text: 'Weight', onPress: () => {} },
                { text: 'Treatment', onPress: () => {} },
                { text: 'Cancel', style: 'cancel' },
              ])}
            >
              <Text style={styles.quickEntryText}>+  Quick Entry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'apiaries' && { borderBottomColor: AMBER_DARK }]}
            onPress={() => setActiveTab('apiaries')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'apiaries' ? AMBER_DARK : colors.muted },
                activeTab === 'apiaries' && styles.activeTabText,
              ]}
            >
              My Apiaries
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'journal' && { borderBottomColor: AMBER_DARK }]}
            onPress={() => setActiveTab('journal')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'journal' ? AMBER_DARK : colors.muted },
                activeTab === 'journal' && styles.activeTabText,
              ]}
            >
              Journal Feed
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'apiaries' ? (
          <View style={styles.content}>
            {APIARIES.map((apiary) => {
              const expanded = expandedApiaries.has(apiary.id);
              return (
                <View
                  key={apiary.id}
                  style={[styles.apiaryCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  {/* Apiary Header */}
                  <TouchableOpacity
                    style={styles.apiaryHeader}
                    onPress={() => toggleApiary(apiary.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chevron}>{expanded ? '∨' : '›'}</Text>
                    <View style={styles.apiaryInfo}>
                      <Text style={[styles.apiaryName, { color: colors.text }]}>{apiary.name}</Text>
                      <View style={styles.locationRow}>
                        <Text style={styles.pinEmoji}>📍</Text>
                        <Text style={[styles.apiaryLocation, { color: colors.muted }]}>{apiary.location}</Text>
                      </View>
                    </View>
                    <View style={[styles.hiveBadge, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.hiveBadgeCount, { color: colors.text }]}>{apiary.hives.length}</Text>
                      <Text style={[styles.hiveBadgeLabel, { color: BLUE_LABEL }]}>Hives</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Hive Cards */}
                  {expanded && (
                    <View style={styles.hivesContainer}>
                      {apiary.hives.map((hive) => {
                        const statusCfg = STATUS_CONFIG[hive.status];
                        return (
                          <View
                            key={hive.id}
                            style={[styles.hiveCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                          >
                            <View style={styles.hiveTopRow}>
                              <View style={[styles.hiveLabelBadge, { backgroundColor: BLUE_LABEL }]}>
                                <Text style={styles.hiveLabelText}>{hive.name}</Text>
                              </View>
                              <View style={[styles.checkbox, { borderColor: colors.border }]} />
                            </View>

                            <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                              <Text style={[styles.statusCheck, { color: statusCfg.text }]}>✓</Text>
                              <Text style={[styles.statusText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
                            </View>

                            <View style={styles.hiveInfoRow}>
                              <Text style={[styles.hiveInfoKey, { color: colors.muted }]}>Queen</Text>
                              <Text style={[styles.hiveInfoVal, { color: colors.text }]}>{hive.queen}</Text>
                            </View>
                            <View style={[styles.hiveInfoRow, { borderBottomWidth: 0 }]}>
                              <Text style={[styles.hiveInfoKey, { color: colors.muted }]}>Last Check</Text>
                              <Text style={[styles.hiveInfoVal, { color: colors.text }]}>{hive.lastCheck}</Text>
                            </View>

                            <View style={styles.hiveActions}>
                              <TouchableOpacity
                                style={[styles.logBtn, { borderColor: AMBER }]}
                              >
                                <Text style={[styles.logBtnText, { color: AMBER_DARK }]}>+  Log</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.historyBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                onPress={() => navigation.navigate('HiveDetails')}
                              >
                                <Text style={[styles.historyBtnText, { color: colors.text }]}>∿  History</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}

                      {/* Add Hive placeholder */}
                      <TouchableOpacity style={[styles.addHiveCard, { borderColor: colors.border }]}>
                        <Text style={[styles.addHivePlus, { color: colors.muted }]}>+</Text>
                        <Text style={[styles.addHiveLabel, { color: colors.muted }]}>Add Hive</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Create New Apiary */}
            <TouchableOpacity style={[styles.createApiaryBtn, { borderColor: colors.border }]}>
              <Text style={[styles.createApiaryText, { color: colors.muted }]}>+  Create New Apiary</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
          </View>
        ) : (
          <View style={styles.content}>
            {[
              { emoji: '✂️', category: 'Colony Management', title: 'Spring Splits: How to Divide a Hive and Prevent Swarming', author: 'Dr. Emily Carr', time: '6 min read' },
              { emoji: '🐛', category: 'Pest Control', title: 'Varroa Mite Treatment Options: A Seasonal Guide', author: 'Tom Hargrove', time: '8 min read' },
              { emoji: '🍯', category: 'Harvesting', title: 'When and How to Extract Honey Without Stressing Your Colony', author: 'Maria Chen', time: '5 min read' },
            ].map((article) => (
              <TouchableOpacity
                key={article.title}
                style={[styles.articleCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Article')}
                activeOpacity={0.75}
              >
                <View style={[styles.articleIconBox, { backgroundColor: colors.surface }]}>
                  <Text style={styles.articleEmoji}>{article.emoji}</Text>
                </View>
                <View style={styles.articleInfo}>
                  <Text style={[styles.articleCategory, { color: colors.muted }]}>{article.category}</Text>
                  <Text style={[styles.articleTitle, { color: colors.text }]} numberOfLines={2}>{article.title}</Text>
                  <Text style={[styles.articleMeta, { color: colors.muted }]}>{article.author} · {article.time}</Text>
                </View>
                <Text style={[styles.articleChevron, { color: colors.muted }]}>›</Text>
              </TouchableOpacity>
            ))}

            <View style={[styles.emptyState, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 4 }]}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No personal entries yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                Use Quick Entry to start logging your beekeeping activities.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: AMBER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerWeatherIcon: { fontSize: 15 },
  headerTemp: { fontSize: 15, fontWeight: '600', color: '#1C1917' },

  scrollView: { flex: 1 },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearEmoji: { fontSize: 22 },
  quickEntryBtn: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  quickEntryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 20,
    marginHorizontal: 20,
  },
  tab: {
    paddingBottom: 10,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: { fontWeight: '700' },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  apiaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  apiaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  chevron: {
    fontSize: 18,
    color: '#9CA3AF',
    width: 20,
    textAlign: 'center',
  },
  apiaryInfo: { flex: 1 },
  apiaryName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pinEmoji: { fontSize: 13 },
  apiaryLocation: { fontSize: 13 },
  hiveBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  hiveBadgeCount: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  hiveBadgeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },

  hivesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  hiveCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  hiveTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hiveLabelBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hiveLabelText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  statusCheck: { fontSize: 13, fontWeight: '700' },
  statusText: { fontSize: 13, fontWeight: '700' },
  hiveInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  hiveInfoKey: { fontSize: 14 },
  hiveInfoVal: { fontSize: 14, fontWeight: '700' },
  hiveActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  logBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logBtnText: { fontSize: 14, fontWeight: '700' },
  historyBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  historyBtnText: { fontSize: 14, fontWeight: '600' },

  addHiveCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addHivePlus: { fontSize: 26, fontWeight: '300' },
  addHiveLabel: { fontSize: 15, fontWeight: '600' },

  createApiaryBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 8,
  },
  createApiaryText: { fontSize: 16, fontWeight: '600' },

  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 40,
    alignItems: 'center',
    gap: 10,
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, lineHeight: 20, textAlign: 'center' },

  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  articleIconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  articleEmoji: { fontSize: 26 },
  articleInfo: { flex: 1 },
  articleCategory: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  articleTitle: { fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  articleMeta: { fontSize: 12 },
  articleChevron: { fontSize: 22, flexShrink: 0 },
});
