import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../Contexts/ThemeContext';

const AMBER = '#F59E0B';
const AMBER_DARK = '#D97706';
const AMBER_LIGHT = '#FEF3C7';
const ORANGE = '#F97316';
const BLUE_LABEL = '#1D4ED8';

const HIVE = {
  name: 'Hive #1',
  apiary: 'North Apiary',
  status: 'healthy' as const,
  queen: { color: 'Blue', year: 2024, temperament: 'Calm' },
  weight: 82.4,
  lastCheck: 'June 12, 2025',
  frames: 8,
  supers: 2,
  notes: 'Strong colony. Queen laying well — solid brood pattern across 6 frames. Honey stores filling the top super. No signs of disease or mites detected during alcohol wash.',
};

const INSPECTIONS = [
  {
    id: 1,
    date: 'Jun 12, 2025',
    inspector: 'John D.',
    queenSeen: true,
    broodPattern: 'Solid',
    miteCount: 0,
    weight: 82.4,
    notes: 'Colony looks strong. Added a second super.',
    status: 'healthy',
  },
  {
    id: 2,
    date: 'May 28, 2025',
    inspector: 'John D.',
    queenSeen: false,
    broodPattern: 'Good',
    miteCount: 1,
    weight: 74.1,
    notes: 'Queen not spotted but fresh eggs visible. Mite count low.',
    status: 'healthy',
  },
  {
    id: 3,
    date: 'May 10, 2025',
    inspector: 'John D.',
    queenSeen: true,
    broodPattern: 'Spotty',
    miteCount: 3,
    weight: 61.8,
    notes: 'Spotty brood — monitoring for possible supersedure. Applied oxalic acid treatment.',
    status: 'attention',
  },
];

const STATUS_CONFIG = {
  healthy: { label: 'Healthy', bg: '#DCFCE7', text: '#16A34A' },
  attention: { label: 'Needs Attention', bg: '#FEF3C7', text: '#D97706' },
  critical: { label: 'Critical', bg: '#FEE2E2', text: '#DC2626' },
};

const QUICK_ACTIONS = [
  { emoji: '📝', label: 'Log Inspection' },
  { emoji: '⚖️', label: 'Log Weight' },
  { emoji: '💊', label: 'Treatment' },
  { emoji: '📷', label: 'Add Photo' },
];

export function HiveDetails() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const statusCfg = STATUS_CONFIG[HIVE.status];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={AMBER} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>beekeepr</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerWeatherIcon}>☀️</Text>
          <Text style={styles.headerTemp}>72°F</Text>
        </View>
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: colors.surface }]} showsVerticalScrollIndicator={false}>
        {/* Hive Title Card */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={[styles.hiveLabelBadge, { backgroundColor: BLUE_LABEL }]}>
              <Text style={styles.hiveLabelText}>{HIVE.name}</Text>
            </View>
            <Text style={[styles.apiaryName, { color: colors.muted }]}>{HIVE.apiary}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.statusText, { color: statusCfg.text }]}>✓  {statusCfg.label}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Weight', value: `${HIVE.weight} lbs`, emoji: '⚖️' },
            { label: 'Frames', value: `${HIVE.frames}`, emoji: '🪵' },
            { label: 'Supers', value: `${HIVE.supers}`, emoji: '📦' },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.quickActionBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tabs */}
        <View style={[styles.tabBar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          {(['overview', 'history'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && { borderBottomColor: AMBER_DARK }]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, { color: activeTab === t ? AMBER_DARK : colors.muted },
                activeTab === t && { fontWeight: '700' }]}>
                {t === 'overview' ? 'Overview' : 'Inspection History'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' ? (
          <View style={styles.tabContent}>
            {/* Queen Info */}
            <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>🐝  Queen Info</Text>
              {[
                { label: 'Marked Color', value: `${HIVE.queen.color} (${HIVE.queen.year})` },
                { label: 'Temperament', value: HIVE.queen.temperament },
                { label: 'Last Seen', value: HIVE.lastCheck },
              ].map((row, idx, arr) => (
                <View
                  key={row.label}
                  style={[styles.infoRow, idx < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
                >
                  <Text style={[styles.infoKey, { color: colors.muted }]}>{row.label}</Text>
                  <Text style={[styles.infoVal, { color: colors.text }]}>{row.value}</Text>
                </View>
              ))}
            </View>

            {/* Notes */}
            <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>📋  Latest Notes</Text>
              <Text style={[styles.notesText, { color: colors.muted }]}>{HIVE.notes}</Text>
            </View>

            {/* Beekeeping Tip */}
            <View style={[styles.tipCard, { backgroundColor: AMBER_LIGHT }]}>
              <Text style={styles.tipTitle}>💡  Tip</Text>
              <Text style={styles.tipBody}>
                A blue-marked queen from 2024 is in her prime laying year. Monitor for supercedure cells next spring as she enters her second season.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.tabContent}>
            {INSPECTIONS.map((insp) => {
              const cfg = STATUS_CONFIG[insp.status as keyof typeof STATUS_CONFIG];
              return (
                <View key={insp.id} style={[styles.inspectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.inspectionHeader}>
                    <View>
                      <Text style={[styles.inspectionDate, { color: colors.text }]}>{insp.date}</Text>
                      <Text style={[styles.inspectionInspector, { color: colors.muted }]}>by {insp.inspector}</Text>
                    </View>
                    <View style={[styles.inspectionStatus, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.inspectionStatusText, { color: cfg.text }]}>{cfg.label}</Text>
                    </View>
                  </View>

                  <View style={styles.inspectionStats}>
                    {[
                      { label: 'Queen Seen', value: insp.queenSeen ? '✓ Yes' : '✗ No', good: insp.queenSeen },
                      { label: 'Brood', value: insp.broodPattern },
                      { label: 'Mite Count', value: `${insp.miteCount}/100`, good: insp.miteCount < 2 },
                      { label: 'Weight', value: `${insp.weight} lbs` },
                    ].map((s) => (
                      <View key={s.label} style={[styles.inspectionStat, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.inspectionStatLabel, { color: colors.muted }]}>{s.label}</Text>
                        <Text style={[styles.inspectionStatValue, { color: 'good' in s ? (s.good ? '#16A34A' : '#DC2626') : colors.text }]}>
                          {s.value}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {insp.notes ? (
                    <Text style={[styles.inspectionNotes, { color: colors.muted }]}>{insp.notes}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Floating Log Button */}
      <View style={[styles.fab, { bottom: 24 }]}>
        <TouchableOpacity style={[styles.fabBtn, { backgroundColor: ORANGE }]}>
          <Text style={styles.fabText}>+  Log Inspection</Text>
        </TouchableOpacity>
      </View>
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
  headerLogo: { fontSize: 20, fontWeight: '800', color: '#1C1917', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerWeatherIcon: { fontSize: 15 },
  headerTemp: { fontSize: 15, fontWeight: '600', color: '#1C1917' },

  scrollView: { flex: 1 },

  titleSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hiveLabelBadge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  hiveLabelText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  apiaryName: { fontSize: 14 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  statusText: { fontSize: 14, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: 17, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  quickActionEmoji: { fontSize: 18 },
  quickActionLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },

  tabBar: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: { paddingBottom: 10, marginRight: 20, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 15, fontWeight: '500' },

  tabContent: { paddingHorizontal: 20, paddingTop: 14, gap: 12 },

  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  infoKey: { fontSize: 14 },
  infoVal: { fontSize: 14, fontWeight: '700' },
  notesText: { fontSize: 14, lineHeight: 22 },

  tipCard: { borderRadius: 16, padding: 16 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#92400E', marginBottom: 6 },
  tipBody: { fontSize: 14, color: '#92400E', lineHeight: 21 },

  inspectionCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  inspectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  inspectionDate: { fontSize: 15, fontWeight: '700' },
  inspectionInspector: { fontSize: 13, marginTop: 2 },
  inspectionStatus: { borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4 },
  inspectionStatusText: { fontSize: 12, fontWeight: '700' },
  inspectionStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  inspectionStat: { borderRadius: 8, padding: 10, minWidth: '46%', flex: 1 },
  inspectionStatLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  inspectionStatValue: { fontSize: 14, fontWeight: '700' },
  inspectionNotes: { fontSize: 13, lineHeight: 19, fontStyle: 'italic' },

  fab: { position: 'absolute', left: 20, right: 20 },
  fabBtn: { borderRadius: 28, paddingVertical: 16, alignItems: 'center' },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
