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
const AMBER_LIGHT = '#FEF3C7';
const AMBER_DARK = '#D97706';
const ORANGE = '#F97316';

const HIVE_COLORS = {
  hive1: '#F97316',
  hive2: '#EF4444',
  hive3: '#3B82F6',
};

const Y_LABELS = [100, 75, 50, 25, 0];

const SAVED_REPORTS = [
  { id: 1, title: 'Hive Weight Trends', tags: ['LINE', 'weight', '3 Hives'],
    metric: 'Hive Weight (lbs)', average: '77.2', unit: 'lbs', trend: '+12%', trendGood: true,
    data: { labels: ['Mar 23', 'Jul 17', 'Nov 10', 'Mar 13'], hive1: [52, 77, 95, 80], hive2: [50, 80, 99, 82], hive3: [43, 75, 88, 79] } },
  { id: 2, title: 'Mite Levels Warning', tags: ['BAR', 'miteCount', '3 Hives'],
    metric: 'Mite Count (/100 bees)', average: '2.1', unit: '/100', trend: '+40%', trendGood: false,
    data: { labels: ['Mar 23', 'Jul 17', 'Nov 10', 'Mar 13'], hive1: [0, 1, 4, 2], hive2: [0, 2, 5, 3], hive3: [1, 1, 3, 1] } },
];

interface LineSegmentProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

function LineSegment({ x1, y1, x2, y2, color }: LineSegmentProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: midX - length / 2,
        top: midY - 1.5,
        width: length,
        height: 3,
        backgroundColor: color,
        borderRadius: 1.5,
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

const CHART_W = 248;
const CHART_H = 160;
const Y_MIN = 0;
const Y_MAX = 100;

function toChartPoint(value: number, index: number, numPoints: number) {
  const x = (index / (numPoints - 1)) * CHART_W;
  const y = CHART_H - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H;
  return { x, y };
}

function ChartLines({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v, i) => toChartPoint(v, i, data.length));
  return (
    <>
      {points.slice(0, -1).map((pt, i) => (
        <LineSegment
          key={i}
          x1={pt.x}
          y1={pt.y}
          x2={points[i + 1].x}
          y2={points[i + 1].y}
          color={color}
        />
      ))}
      {points.map((pt, i) => (
        <View
          key={`dot-${i}`}
          style={{
            position: 'absolute',
            left: pt.x - 4,
            top: pt.y - 4,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
          }}
        />
      ))}
    </>
  );
}

export function Analytics() {
  const { colors, theme } = useTheme();
  const [selectedReport, setSelectedReport] = useState(0);
  const report = SAVED_REPORTS[selectedReport];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={AMBER} />

      {/* Amber Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>beekeepr</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerWeatherIcon}>☀️</Text>
          <Text style={styles.headerTemp}>72°F</Text>
        </View>
      </View>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.surface }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Row */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.chartBarEmoji}>📊</Text>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Analytics Studio</Text>
          </View>
          <TouchableOpacity style={[styles.newBtn, { backgroundColor: colors.text }]}>
            <Text style={[styles.newBtnText, { color: colors.background }]}>+  New</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Saved Reports */}
        <View style={styles.section}>
          <View style={styles.savedHeader}>
            <Text style={styles.gridEmoji}>⊞</Text>
            <Text style={[styles.savedTitle, { color: colors.muted }]}>SAVED REPORTS</Text>
            <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
              <Text style={[styles.countText, { color: colors.text }]}>{SAVED_REPORTS.length}</Text>
            </View>
          </View>

          {SAVED_REPORTS.map((report, idx) => (
            <TouchableOpacity
              key={report.id}
              onPress={() => setSelectedReport(idx)}
              style={[
                styles.reportCard,
                {
                  backgroundColor: colors.background,
                  borderColor: idx === selectedReport ? AMBER : colors.border,
                  borderWidth: idx === selectedReport ? 2 : 1,
                },
                idx === selectedReport && { backgroundColor: AMBER_LIGHT },
              ]}
            >
              <Text style={[styles.reportTitle, { color: colors.text }]}>{report.title}</Text>
              <View style={styles.tagRow}>
                {report.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.tagText, { color: colors.muted }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}

          {/* Pro Tip */}
          <View style={[styles.proTipCard, { backgroundColor: AMBER_LIGHT, borderColor: AMBER }]}>
            <Text style={[styles.proTipIcon, { color: AMBER_DARK }]}>ⓘ</Text>
            <Text style={[styles.proTipText, { color: AMBER_DARK }]}>
              Pro Tip: Compare your hive weight against local blooming periods to predict honey flows.
            </Text>
          </View>
        </View>

        {/* Chart Card */}
        <View style={[styles.chartCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {/* Breadcrumb */}
          <View style={styles.breadcrumb}>
            <Text style={[styles.breadcrumbBase, { color: colors.muted }]}>Analysis</Text>
            <Text style={[styles.breadcrumbArrow, { color: colors.muted }]}> › </Text>
            <Text style={[styles.breadcrumbActive, { color: colors.text }]}>{report.title}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity>
              <Text style={[styles.editConfig, { color: colors.muted }]}>Edit{'\n'}Configuration</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.chartDivider, { backgroundColor: colors.border }]} />

          {/* Chart Title */}
          <Text style={[styles.chartTitle, { color: colors.text }]}>{report.title}</Text>
          <Text style={[styles.chartSubtitle, { color: colors.muted }]}>
            Comparing{' '}
            <Text style={{ color: ORANGE, fontWeight: '600' }}>{report.metric}</Text>
            {' '}• 3 hives selected
          </Text>

          {/* Legend */}
          <View style={styles.legend}>
            {[
              { color: HIVE_COLORS.hive1, label: 'Hive #1 (North)' },
              { color: HIVE_COLORS.hive2, label: 'Hive #2 (North)' },
              { color: HIVE_COLORS.hive3, label: 'Hive #3 (South)' },
            ].map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, { color: item.color }]}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Chart Area */}
          <View style={styles.chartArea}>
            {/* Y Axis */}
            <View style={styles.yAxis}>
              {Y_LABELS.map((label) => (
                <Text key={label} style={[styles.yLabel, { color: colors.muted }]}>{label}</Text>
              ))}
              <Text style={[styles.yAxisTitle, { color: colors.muted }]}>{report.metric}</Text>
            </View>

            {/* Chart Canvas */}
            <View style={{ flex: 1 }}>
              <View style={[styles.chartCanvas, { borderColor: colors.border }]}>
                {/* Grid lines */}
                {Y_LABELS.slice(1).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.gridLine,
                      { top: (i / (Y_LABELS.length - 1)) * CHART_H, borderColor: colors.border },
                    ]}
                  />
                ))}

                {/* Data lines */}
                <ChartLines data={report.data.hive1} color={HIVE_COLORS.hive1} />
                <ChartLines data={report.data.hive2} color={HIVE_COLORS.hive2} />
                <ChartLines data={report.data.hive3} color={HIVE_COLORS.hive3} />
              </View>

              {/* X Axis Labels */}
              <View style={styles.xAxis}>
                {report.data.labels.map((label) => (
                  <Text key={label} style={[styles.xLabel, { color: colors.muted }]}>{label}</Text>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.chartDivider, { backgroundColor: colors.border }]} />

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>AVERAGE</Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: colors.text }]}>{report.average}</Text>
                <Text style={[styles.statUnit, { color: colors.muted }]}> {report.unit}</Text>
              </View>
            </View>
            <View style={styles.statBlock}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>TREND</Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statTrend, { color: report.trendGood ? '#16A34A' : '#DC2626' }]}>
                  {report.trend}
                </Text>
                <Text style={[styles.statUnit, { color: colors.muted }]}> vs last period</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
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
  headerLogo: { fontSize: 20, fontWeight: '800', color: '#1C1917', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerWeatherIcon: { fontSize: 15 },
  headerTemp: { fontSize: 15, fontWeight: '600', color: '#1C1917' },

  scrollView: { flex: 1 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chartBarEmoji: { fontSize: 22, color: ORANGE },
  pageTitle: { fontSize: 22, fontWeight: '800' },
  newBtn: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  newBtnText: { fontSize: 14, fontWeight: '700' },

  divider: { height: 1, marginHorizontal: 0 },

  section: { paddingHorizontal: 20, paddingTop: 16 },

  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  gridEmoji: { fontSize: 16 },
  savedTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, flex: 1 },
  countBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: { fontSize: 12, fontWeight: '700' },

  reportCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  reportTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, fontWeight: '600' },

  proTipCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  proTipIcon: { fontSize: 18, marginTop: 1 },
  proTipText: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '500' },

  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 16,
    overflow: 'hidden',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  breadcrumbBase: { fontSize: 13 },
  breadcrumbArrow: { fontSize: 13 },
  breadcrumbActive: { fontSize: 14, fontWeight: '700' },
  editConfig: { fontSize: 12, textAlign: 'right' },
  chartDivider: { height: 1 },

  chartTitle: { fontSize: 20, fontWeight: '800', paddingHorizontal: 16, paddingTop: 14, marginBottom: 4 },
  chartSubtitle: { fontSize: 13, paddingHorizontal: 16, marginBottom: 12 },

  legend: { paddingHorizontal: 16, gap: 4, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13, fontWeight: '600' },

  chartArea: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 },
  yAxis: {
    width: 36,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
    height: CHART_H + 20,
  },
  yLabel: { fontSize: 10 },
  yAxisTitle: {
    position: 'absolute',
    fontSize: 9,
    transform: [{ rotate: '-90deg' }],
    left: -22,
    top: CHART_H / 2,
    width: 80,
    textAlign: 'center',
  },
  chartCanvas: {
    width: CHART_W,
    height: CHART_H,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_W,
    marginTop: 4,
  },
  xLabel: { fontSize: 9 },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 32,
  },
  statBlock: { gap: 4 },
  statLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { fontSize: 26, fontWeight: '800' },
  statTrend: { fontSize: 22, fontWeight: '800', color: '#16A34A' },
  statUnit: { fontSize: 13 },
});
