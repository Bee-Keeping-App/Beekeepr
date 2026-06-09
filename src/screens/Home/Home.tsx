import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../Contexts/ThemeContext';

const AMBER = '#F59E0B';
const AMBER_DARK = '#D97706';
const SKY_BLUE = '#0EA5E9';
const ORANGE = '#F97316';

interface Task {
  id: number;
  title: string;
  time: string;
  description: string;
  status: 'pending' | 'completed';
}

interface Reminder {
  id: number;
  title: string;
  description: string;
  time: string;
  endTime: string;
  recurring: boolean;
  linkedTaskId: number | null;
}

interface FormDraft {
  title: string;
  description: string;
  time: string;
  endTime: string;
  recurring: boolean;
  linkedTaskId: number | null;
}

const BLANK_DRAFT: FormDraft = {
  title: '',
  description: '',
  time: '',
  endTime: '',
  recurring: false,
  linkedTaskId: null,
};

// TODO [API]: GET /api/tasks?userId=:userId&date=:isoDate
// Replace this array with a useEffect fetch. Date param filters to the selected calendar day;
// for Week/Month views pass &startDate=&endDate= instead.
// Response shape: Task[] where Task = { _id: string, userId: string, title: string,
//   description: string, time: string, date: string (ISO), status: 'pending'|'completed' }
// Wire: const [tasks, setTasks] = useState<Task[]>([]);
//       useEffect(() => { fetch(`/api/tasks?userId=${userId}&date=${today.toISOString()}`)
//         .then(r => r.json()).then(setTasks); }, [userId, today]);
// POST /api/tasks  — body: { userId, title, description, time, date, status: 'pending' }
// PATCH /api/tasks/:id — body: { status } to toggle complete
// DELETE /api/tasks/:id
const TASKS_INITIAL: Task[] = [
  { id: 1, title: 'Inspect Hive #3', time: '9:00 AM', description: 'Check for queen cells and ensuring plenty of space.', status: 'pending' },
  { id: 2, title: 'Feed Sugar Syrup', time: '11:00 AM', description: 'All hives in North Apiary need 1:1 syrup.', status: 'completed' },
  { id: 3, title: 'Mite Treatment', time: '2:00 PM', description: 'Apply oxalic acid vapor if temps allow.', status: 'pending' },
];

// TODO [API]: GET /api/reminders?userId=:userId
// Returns all reminders for the user (not date-scoped — reminders are persistent).
// Response shape: Reminder[] where Reminder = { _id: string, userId: string, title: string,
//   description: string, time: string, endTime: string, recurring: boolean,
//   linkedTaskId: string|null (ObjectId ref to tasks collection) }
// Wire: const [reminders, setReminders] = useState<Reminder[]>([]);
//       useEffect(() => { fetch(`/api/reminders?userId=${userId}`)
//         .then(r => r.json()).then(setReminders); }, [userId]);
// POST /api/reminders — body: { userId, title, description, time, endTime, recurring, linkedTaskId }
// DELETE /api/reminders/:id
// Note: when linkedTaskId is set, deleting the linked task should cascade-delete or null the reminder.
//       Handle this in the task DELETE endpoint on the backend.
const REMINDERS_INITIAL: Reminder[] = [
  { id: 1, title: 'Inspect Hive #3', description: 'Check for queen cells and colony health.', time: '9:00 AM', endTime: '', recurring: false, linkedTaskId: 1 },
  { id: 2, title: 'Equipment Maintenance', description: 'Clean supers and frames before storage.', time: '12:00 PM', endTime: '', recurring: true, linkedTaskId: null },
  { id: 3, title: 'Weekly Inspection', description: 'Full apiary walkthrough — all hives.', time: '10:00 AM', endTime: '12:00 PM', recurring: true, linkedTaskId: null },
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
  const { colors, theme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const [viewMode, setViewMode] = useState<ViewMode>('Day');
  const today = new Date();
  const isDark = theme === 'dark';
  const pendingBg = isDark ? '#451A03' : '#FEF3C7';
  const pendingText = isDark ? '#FCD34D' : '#D97706';
  const completedBg = isDark ? '#14532D' : '#DCFCE7';
  const completedText = isDark ? '#4ADE80' : '#16A34A';

  const [tasks] = useState<Task[]>(TASKS_INITIAL);
  const [reminders, setReminders] = useState<Reminder[]>(REMINDERS_INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<FormDraft>(BLANK_DRAFT);
  const [isRange, setIsRange] = useState(false);

  function openBlankModal() {
    setDraft(BLANK_DRAFT);
    setIsRange(false);
    setShowModal(true);
  }

  function openModalForTask(task: Task) {
    setDraft({
      title: task.title,
      description: task.description,
      time: task.time,
      endTime: '',
      recurring: false,
      linkedTaskId: task.id,
    });
    setIsRange(false);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function saveReminder() {
    if (!draft.title.trim() || !draft.time.trim()) return;
    const next: Reminder = {
      id: Date.now(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      time: draft.time.trim(),
      endTime: isRange ? draft.endTime.trim() : '',
      recurring: draft.recurring,
      linkedTaskId: draft.linkedTaskId,
    };
    setReminders((prev) => [...prev, next]);
    setShowModal(false);
  }

  function deleteReminder(id: number) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function handleTaskBell(task: Task) {
    const existing = reminders.find((r) => r.linkedTaskId === task.id);
    if (existing) {
      Alert.alert(
        'Reminder Set',
        `"${existing.title}" at ${existing.time}${existing.endTime ? ` – ${existing.endTime}` : ''}`,
        [
          { text: 'Remove Reminder', style: 'destructive', onPress: () => deleteReminder(existing.id) },
          { text: 'Close', style: 'cancel' },
        ]
      );
    } else {
      openModalForTask(task);
    }
  }

  const canSave = draft.title.trim().length > 0 && draft.time.trim().length > 0;
  const linkedTaskName = draft.linkedTaskId !== null
    ? tasks.find((t) => t.id === draft.linkedTaskId)?.title ?? null
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={AMBER} />

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
          <Text style={[styles.greeting, { color: colors.text }]}>{getGreeting()}, John</Text>
          <Text style={[styles.subGreeting, { color: colors.muted }]}>
            Here's what's happening in your apiary today.
          </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.gearEmoji}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addReminderBtn} onPress={openBlankModal}>
              <Text style={styles.addReminderText}>🔔  Add Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather */}
        <View style={styles.weatherSection}>
          <TouchableOpacity
            style={styles.weatherCard}
            onPress={() => navigation.navigate('WeatherModal')}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.weatherCardLabel}>Current Weather</Text>
              <Text style={styles.weatherTemp}>72°F</Text>
              <Text style={styles.weatherCondition}>Partly Cloudy</Text>
              <Text style={styles.weatherTapHint}>Tap for full forecast →</Text>
            </View>
            <Text style={styles.bigSunEmoji}>☀️</Text>
          </TouchableOpacity>

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

        {/* Tasks / Calendar Card */}
        <View style={[styles.calendarCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.calendarHeader}>
            <View style={styles.dateRow}>
              <Text style={styles.calendarEmoji}>📅</Text>
              <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(today)}</Text>
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

          <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
            {(['Day', 'Week', 'Month'] as ViewMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.tab,
                  viewMode === mode && {
                    backgroundColor: colors.background,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 2,
                  },
                ]}
                onPress={() => setViewMode(mode)}
              >
                <Text style={[styles.tabText, { color: viewMode === mode ? AMBER_DARK : colors.muted }, viewMode === mode && styles.activeTabText]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tasks.map((task, idx) => {
            const hasReminder = reminders.some((r) => r.linkedTaskId === task.id);
            return (
              <View
                key={task.id}
                style={[styles.taskItem, idx < tasks.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              >
                <View style={[styles.taskIconCircle, { backgroundColor: task.status === 'completed' ? completedBg : pendingBg }]}>
                  <Text style={styles.taskClockEmoji}>🕐</Text>
                </View>
                <View style={styles.taskBody}>
                  <View style={styles.taskTopRow}>
                    <Text style={[styles.taskTitle, { color: colors.text }, task.status === 'completed' && styles.strikethrough]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskRight}>
                      <Text style={[styles.taskTime, { color: colors.muted }]}>{task.time}</Text>
                      <TouchableOpacity
                        onPress={() => handleTaskBell(task)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={[styles.bellBtn, { backgroundColor: hasReminder ? (isDark ? '#451A03' : '#FEF3C7') : colors.surface }]}
                      >
                        <Text style={[styles.bellIcon, { color: hasReminder ? AMBER_DARK : colors.muted }]}>
                          {hasReminder ? '🔔' : '🔕'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[styles.taskDesc, { color: colors.muted }]}>{task.description}</Text>
                  <View style={[styles.badge, { backgroundColor: task.status === 'completed' ? completedBg : pendingBg }]}>
                    <Text style={[styles.badgeText, { color: task.status === 'completed' ? completedText : pendingText }]}>
                      {task.status === 'completed' ? 'Completed' : 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Reminders Section */}
        <View style={styles.remindersSection}>
          <View style={styles.remindersHeader}>
            <Text style={styles.warnEmoji}>🔔</Text>
            <Text style={[styles.remindersTitle, { color: colors.text }]}>Reminders</Text>
            <View style={[styles.reminderCount, { backgroundColor: isDark ? '#451A03' : '#FEF3C7' }]}>
              <Text style={[styles.reminderCountText, { color: isDark ? '#FCD34D' : AMBER_DARK }]}>{reminders.length}</Text>
            </View>
          </View>

          {reminders.length === 0 ? (
            <View style={[styles.emptyReminders, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.muted }]}>No reminders yet. Tap "🔔 Add Reminder" or the bell icon on any task.</Text>
            </View>
          ) : (
            reminders.map((reminder) => {
              const linkedTask = reminder.linkedTaskId !== null
                ? tasks.find((t) => t.id === reminder.linkedTaskId)
                : null;
              return (
                <View key={reminder.id} style={[styles.reminderItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.reminderAccent} />
                  <View style={styles.reminderBody}>
                    <View style={styles.reminderTopRow}>
                      <Text style={[styles.reminderTitle, { color: colors.text }]}>{reminder.title}</Text>
                      <View style={styles.reminderBadges}>
                        {reminder.recurring && (
                          <View style={[styles.recurringBadge, { backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE' }]}>
                            <Text style={[styles.recurringText, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>🔁</Text>
                          </View>
                        )}
                        <TouchableOpacity onPress={() => deleteReminder(reminder.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <Text style={[styles.deleteX, { color: colors.muted }]}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {reminder.description.length > 0 && (
                      <Text style={[styles.reminderDesc, { color: colors.muted }]}>{reminder.description}</Text>
                    )}
                    <Text style={[styles.reminderTime, { color: AMBER_DARK }]}>
                      ⏰  {reminder.endTime ? `${reminder.time} – ${reminder.endTime}` : reminder.time}
                    </Text>
                    {linkedTask && (
                      <View style={[styles.linkedTaskRow, { backgroundColor: isDark ? '#292524' : colors.surface }]}>
                        <Text style={[styles.linkedTaskText, { color: colors.muted }]}>📌  Task: {linkedTask.title}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Add / Edit Reminder Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeModal} />
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Reminder</Text>
              <TouchableOpacity onPress={closeModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={[styles.modalClose, { color: colors.muted }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Linked task banner */}
            {linkedTaskName && (
              <View style={[styles.linkedBanner, { backgroundColor: isDark ? '#451A03' : '#FEF3C7' }]}>
                <Text style={[styles.linkedBannerText, { color: isDark ? '#FCD34D' : AMBER_DARK }]}>
                  📌  Linked to task: {linkedTaskName}
                </Text>
                <TouchableOpacity onPress={() => setDraft((d) => ({ ...d, linkedTaskId: null }))} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Text style={[styles.unlinkText, { color: isDark ? '#FCD34D' : AMBER_DARK }]}>Unlink</Text>
                </TouchableOpacity>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalBody}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Title *</Text>
              <TextInput
                value={draft.title}
                onChangeText={(v) => setDraft((d) => ({ ...d, title: v }))}
                placeholder="e.g. Inspect Hive #3"
                placeholderTextColor={colors.muted}
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              />

              <Text style={[styles.fieldLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                value={draft.description}
                onChangeText={(v) => setDraft((d) => ({ ...d, description: v }))}
                placeholder="Optional details…"
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
                style={[styles.textInput, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              />

              <View style={styles.timeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>{isRange ? 'Start Time *' : 'Time *'}</Text>
                  <TextInput
                    value={draft.time}
                    onChangeText={(v) => setDraft((d) => ({ ...d, time: v }))}
                    placeholder="9:00 AM"
                    placeholderTextColor={colors.muted}
                    style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  />
                </View>
                {isRange && (
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>End Time</Text>
                    <TextInput
                      value={draft.endTime}
                      onChangeText={(v) => setDraft((d) => ({ ...d, endTime: v }))}
                      placeholder="11:00 AM"
                      placeholderTextColor={colors.muted}
                      style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.toggleRow} onPress={() => setIsRange((v) => !v)}>
                <View style={[styles.togglePill, { backgroundColor: isRange ? AMBER : colors.surface, borderColor: isRange ? AMBER_DARK : colors.border }]}>
                  <View style={[styles.toggleThumb, isRange && styles.toggleThumbOn]} />
                </View>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>Time range</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toggleRow} onPress={() => setDraft((d) => ({ ...d, recurring: !d.recurring }))}>
                <View style={[styles.togglePill, { backgroundColor: draft.recurring ? AMBER : colors.surface, borderColor: draft.recurring ? AMBER_DARK : colors.border }]}>
                  <View style={[styles.toggleThumb, draft.recurring && styles.toggleThumbOn]} />
                </View>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>Recurring</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: canSave ? ORANGE : colors.border }]}
                onPress={saveReminder}
                disabled={!canSave}
              >
                <Text style={[styles.saveBtnText, { color: canSave ? '#fff' : colors.muted }]}>Save Reminder</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  scrollContent: { paddingBottom: 20 },

  greetingSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },
  greeting: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subGreeting: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  gearEmoji: { fontSize: 22 },
  addReminderBtn: { flex: 1, backgroundColor: ORANGE, borderRadius: 28, paddingVertical: 14, alignItems: 'center' },
  addReminderText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  weatherSection: { paddingHorizontal: 20, paddingTop: 20 },
  weatherCard: {
    backgroundColor: SKY_BLUE,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherCardLabel: { color: '#fff', fontSize: 14, fontWeight: '600', opacity: 0.9, marginBottom: 8 },
  weatherTemp: { color: '#fff', fontSize: 44, fontWeight: '800', marginBottom: 4 },
  weatherCondition: { color: '#fff', fontSize: 15, opacity: 0.9 },
  weatherTapHint: { color: '#fff', fontSize: 12, opacity: 0.7, marginTop: 8 },
  bigSunEmoji: { fontSize: 60 },
  metricCard: { borderRadius: 16, borderWidth: 1, paddingVertical: 20, alignItems: 'center', marginBottom: 12 },
  metricEmoji: { fontSize: 28, marginBottom: 6 },
  metricLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: '700' },

  calendarCard: { marginHorizontal: 20, marginTop: 8, borderRadius: 16, borderWidth: 1, padding: 16 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  calendarEmoji: { fontSize: 20 },
  dateText: { fontSize: 18, fontWeight: '800', flexShrink: 1 },
  todayNav: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 },
  navArrow: { fontSize: 20, lineHeight: 22 },
  todayLabel: { fontSize: 13, fontWeight: '600' },

  tabBar: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 14, fontWeight: '500' },
  activeTabText: { fontWeight: '700' },

  taskItem: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  taskIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  taskClockEmoji: { fontSize: 18 },
  taskBody: { flex: 1 },
  taskTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  taskTitle: { fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8, lineHeight: 22 },
  strikethrough: { textDecorationLine: 'line-through' },
  taskRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  taskTime: { fontSize: 13 },
  bellBtn: { borderRadius: 8, padding: 5 },
  bellIcon: { fontSize: 16 },
  taskDesc: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: 13, fontWeight: '600' },

  remindersSection: { paddingHorizontal: 20, paddingTop: 20 },
  remindersHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  warnEmoji: { fontSize: 20 },
  remindersTitle: { fontSize: 22, fontWeight: '800', flex: 1 },
  reminderCount: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  reminderCountText: { fontSize: 13, fontWeight: '700' },

  emptyReminders: { borderRadius: 12, borderWidth: 1, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 21 },

  reminderItem: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  reminderAccent: { width: 4, backgroundColor: AMBER },
  reminderBody: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 4 },
  reminderTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  reminderTitle: { fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8 },
  reminderBadges: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  recurringBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  recurringText: { fontSize: 12, fontWeight: '700' },
  deleteX: { fontSize: 14, fontWeight: '700' },
  reminderDesc: { fontSize: 13, lineHeight: 19 },
  reminderTime: { fontSize: 13, fontWeight: '600' },
  linkedTaskRow: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 2 },
  linkedTaskText: { fontSize: 12, fontWeight: '500' },

  bottomPad: { height: 100 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%', paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 4 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalClose: { fontSize: 18, fontWeight: '700', padding: 4 },

  linkedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkedBannerText: { fontSize: 13, fontWeight: '600', flex: 1 },
  unlinkText: { fontSize: 13, fontWeight: '700', marginLeft: 8 },

  modalBody: { paddingHorizontal: 20, paddingBottom: 40, gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  textInput: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  togglePill: { width: 48, height: 28, borderRadius: 14, borderWidth: 1, padding: 3, justifyContent: 'center' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#D1D5DB', alignSelf: 'flex-start' },
  toggleThumbOn: { backgroundColor: '#1C1917', alignSelf: 'flex-end' },
  toggleLabel: { fontSize: 15, fontWeight: '500' },

  saveBtn: { borderRadius: 28, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  saveBtnText: { fontSize: 16, fontWeight: '700' },
});
