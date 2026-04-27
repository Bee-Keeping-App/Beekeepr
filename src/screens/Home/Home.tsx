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
const SKY_BLUE = '#0EA5E9';
const ORANGE = '#F97316';

const TASKS = [
  {
    id: 1,
    title: 'Inspect Hive #3',
    time: '9:00 AM',
    description: 'Check for queen cells and ensuring plenty of space.',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Feed Sugar Syrup',
    time: '11:00 AM',
    description: 'All hives in North Apiary need 1:1 syrup.',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Mite Treatment',
    time: '2:00 PM',
    description: 'Apply oxalic acid vapor if temps allow.',
    status: 'pending',
  },
];

const REMINDERS = [
  { id: 1, title: 'Inspect Hive #3', due: 'Today at 9:00 AM' },
  { id: 2, title: 'Mite Treatment', due: 'Today at 2:00 PM' },
  { id: 3, title: 'Equipment Maintenance', due: 'Mar 15th at 12:00 AM' },
  { id: 4, title: 'Weekly Inspection', due: 'Mar 20th at 12:00 AM' },
];

const BEE_FACTS = [
  'Honey bees communicate with one another by dancing. The waggle dance tells other bees where to find the best nectar.',
  'A single bee will only produce about 1/12 teaspoon of honey in its entire lifetime.',
  'The queen bee can lay up to 2,000 eggs per day during peak season.',
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

type ViewMode = 'Day' | 'Week' | 'Month';

export function Home() {
  const { colors } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('Day');
  const today = new Date();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={AMBER} />

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
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {getGreeting()}, John
          </Text>
          <Text style={[styles.subGreeting, { color: colors.muted }]}>
            Here's what's happening in your apiary today.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <Text style={styles.gearEmoji}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addReminderBtn}>
              <Text style={styles.addReminderText}>+  Add Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather Section */}
        <View style={styles.weatherSection}>
          <View style={styles.weatherCard}>
            <View>
              <Text style={styles.weatherCardLabel}>Current Weather</Text>
              <Text style={styles.weatherTemp}>72°F</Text>
              <Text style={styles.weatherCondition}>Partly Cloudy</Text>
            </View>
            <Text style={styles.bigSunEmoji}>☀️</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={styles.metricEmoji}>💧</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>HUMIDITY</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>45%</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={styles.metricEmoji}>💨</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>WIND</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>5 mph NW</Text>
          </View>
        </View>

        {/* Log Book / Calendar Section */}
        <View style={[styles.calendarCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.calendarHeader}>
            <View style={styles.dateRow}>
              <Text style={styles.calendarEmoji}>📅</Text>
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(today)}
              </Text>
            </View>
            <View style={[styles.todayNav, { backgroundColor: colors.surface }]}>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
                <Text style={[styles.navArrow, { color: colors.muted }]}>‹</Text>
              </TouchableOpacity>
              <Text style={[styles.todayLabel, { color: colors.text }]}>Today</Text>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                <Text style={[styles.navArrow, { color: colors.muted }]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Day / Week / Month Tabs */}
          <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
            {(['Day', 'Week', 'Month'] as ViewMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.tab, viewMode === mode && styles.activeTab]}
                onPress={() => setViewMode(mode)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: viewMode === mode ? AMBER_DARK : colors.muted },
                    viewMode === mode && styles.activeTabText,
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Task Items */}
          {TASKS.map((task, idx) => (
            <View
              key={task.id}
              style={[
                styles.taskItem,
                idx < TASKS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.taskIconCircle,
                  { backgroundColor: task.status === 'completed' ? '#DCFCE7' : '#FEF3C7' },
                ]}
              >
                <Text style={styles.taskClockEmoji}>🕐</Text>
              </View>
              <View style={styles.taskBody}>
                <View style={styles.taskTopRow}>
                  <Text
                    style={[
                      styles.taskTitle,
                      { color: colors.text },
                      task.status === 'completed' && styles.strikethrough,
                    ]}
                  >
                    {task.title}
                  </Text>
                  <Text style={[styles.taskTime, { color: colors.muted }]}>{task.time}</Text>
                </View>
                <Text style={[styles.taskDesc, { color: colors.muted }]}>{task.description}</Text>
                <View
                  style={[
                    styles.badge,
                    task.status === 'completed' ? styles.badgeCompleted : styles.badgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      task.status === 'completed' ? styles.badgeTextCompleted : styles.badgeTextPending,
                    ]}
                  >
                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Reminders Section */}
        <View style={styles.remindersSection}>
          <View style={styles.remindersHeader}>
            <Text style={styles.warnEmoji}>⚠️</Text>
            <Text style={[styles.remindersTitle, { color: colors.text }]}>Reminders</Text>
          </View>
          {REMINDERS.map((reminder) => (
            <View
              key={reminder.id}
              style={[styles.reminderItem, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <View style={styles.reminderAccent} />
              <View style={styles.reminderBody}>
                <Text style={[styles.reminderTitle, { color: colors.text }]}>{reminder.title}</Text>
                <Text style={[styles.reminderDue, { color: colors.muted }]}>Due: {reminder.due}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Did you know? */}
        <View style={styles.factSection}>
          <View style={styles.factCard}>
            <Text style={styles.factTitle}>Did you know?</Text>
            <Text style={styles.factBody}>{BEE_FACTS[0]}</Text>
          </View>
        </View>

        <View style={styles.bottomPad} />
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
  headerTemp: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1917',
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 0 },

  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subGreeting: {
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
  addReminderBtn: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addReminderText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  weatherSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  weatherCard: {
    backgroundColor: SKY_BLUE,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherCardLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
  },
  weatherTemp: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '800',
    marginBottom: 4,
  },
  weatherCondition: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.9,
  },
  bigSunEmoji: { fontSize: 60 },
  metricCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  metricEmoji: { fontSize: 28, marginBottom: 6 },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
  },

  calendarCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  calendarEmoji: { fontSize: 20 },
  dateText: {
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  todayNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  navArrow: { fontSize: 20, lineHeight: 22 },
  todayLabel: { fontSize: 13, fontWeight: '600' },

  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '500' },
  activeTabText: { fontWeight: '700' },

  taskItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  taskIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskClockEmoji: { fontSize: 18 },
  taskBody: { flex: 1 },
  taskTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  strikethrough: { textDecorationLine: 'line-through' },
  taskTime: { fontSize: 13, marginTop: 2 },
  taskDesc: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgePending: { backgroundColor: '#FEF3C7' },
  badgeCompleted: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 13, fontWeight: '600' },
  badgeTextPending: { color: '#D97706' },
  badgeTextCompleted: { color: '#16A34A' },

  remindersSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  remindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  warnEmoji: { fontSize: 20 },
  remindersTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  reminderItem: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  reminderAccent: {
    width: 4,
    backgroundColor: AMBER,
  },
  reminderBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  reminderDue: { fontSize: 13 },

  factSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  factCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 18,
  },
  factTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 8,
  },
  factBody: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 22,
  },

  bottomPad: { height: 32 },
});
