import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/AppHeader';
import { styles } from './Home.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

type CalendarTab = 'Day' | 'Week' | 'Month';
type TaskStatus = 'pending' | 'completed';

interface Task {
    id: string;
    time: string;
    title: string;
    description: string;
    status: TaskStatus;
}

interface Reminder {
    id: string;
    title: string;
    due: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GREETING_NAME = 'John';
const GREETING_TITLE = `Good Morning, ${GREETING_NAME}`;
const GREETING_SUBTITLE = "Here's what's happening in your apiary today.";

const WEATHER_TEMP = '72°F';
const WEATHER_CONDITION = 'Partly Cloudy';
const WEATHER_LABEL = 'Current Weather';
const HUMIDITY_VALUE = '45%';
const WIND_VALUE = '5 mph NW';

const CURRENT_DATE = 'March 13, 2026';
const DID_YOU_KNOW_TITLE = 'Did you know?';
const DID_YOU_KNOW_TEXT = 'PlaceholderText1 PlaceholderText2 PlaceholderText3 PlaceholderText4 PlaceholderText5.';

const CALENDAR_TABS: CalendarTab[] = ['Day', 'Week', 'Month'];

const TASKS: Task[] = [
    {
        id: '1',
        time: '9:00 AM',
        title: 'Inspect Hive #3',
        description: 'PlaceholderText1 PlaceholderText2 PlaceholderText3.',
        status: 'pending',
    },
    {
        id: '2',
        time: '11:00 AM',
        title: 'Feed Sugar Syrup',
        description: 'PlaceholderText1 PlaceholderText2 PlaceholderText3.',
        status: 'completed',
    },
    {
        id: '3',
        time: '2:00 PM',
        title: 'Mite Treatment',
        description: 'PlaceholderText1 PlaceholderText2 PlaceholderText3.',
        status: 'pending',
    },
];

const REMINDERS: Reminder[] = [
    { id: '1', title: 'Inspect Hive #3', due: 'Due: Today at 9:00 AM' },
    { id: '2', title: 'Mite Treatment', due: 'Due: Today at 2:00 PM' },
    { id: '3', title: 'Equipment Maintenance', due: 'Due: Mar 15th at 12:00 AM' },
    { id: '4', title: 'Weekly Inspection', due: 'Due: Mar 20th at 12:00 AM' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaskItem({ task }: { task: Task }) {
    const isPending = task.status === 'pending';

    return (
        <View style={styles.taskItem}>
            <View
                style={[
                    styles.taskIndicator,
                    isPending ? styles.taskIndicatorPending : styles.taskIndicatorCompleted,
                ]}
            />
            <View style={styles.taskContent}>
                <Text style={styles.taskTime}>{task.time}</Text>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <View style={[styles.taskBadge, isPending ? styles.taskBadgePending : styles.taskBadgeCompleted]}>
                    <Text style={[styles.taskBadgeText, isPending ? styles.taskBadgeTextPending : styles.taskBadgeTextCompleted]}>
                        {isPending ? 'Pending' : 'Completed'}
                    </Text>
                </View>
            </View>
        </View>
    );
}

function ReminderItem({ reminder }: { reminder: Reminder }) {
    return (
        <View style={styles.reminderCard}>
            <Text style={styles.reminderTitle}>{reminder.title}</Text>
            <Text style={styles.reminderDue}>{reminder.due}</Text>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function Home() {
    const [activeTab, setActiveTab] = useState<CalendarTab>('Day');

    return (
        <View style={styles.screen}>
            <AppHeader />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greetingText}>{GREETING_TITLE}</Text>
                    <Text style={styles.greetingSubtext}>{GREETING_SUBTITLE}</Text>
                    <View style={styles.addReminderRow}>
                        <TouchableOpacity style={styles.bellButton}>
                            <Ionicons name="notifications-outline" size={18} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addReminderButton}>
                            <Ionicons name="add" size={16} color="#F5A623" />
                            <Text style={styles.addReminderText}>Add Reminder</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Weather Card */}
                <View style={styles.weatherCard}>
                    <View>
                        <Text style={styles.weatherLabel}>{WEATHER_LABEL}</Text>
                        <Text style={styles.weatherTemp}>{WEATHER_TEMP}</Text>
                        <Text style={styles.weatherCondition}>{WEATHER_CONDITION}</Text>
                    </View>
                    <Ionicons name="partly-sunny" size={56} color="#FFFFFF" style={styles.weatherIcon} />
                </View>

                {/* Humidity & Wind */}
                <View style={styles.weatherStatsSection}>
                    <View style={styles.weatherStatRow}>
                        <Ionicons name="water-outline" size={22} color="#5BC4D4" />
                        <View>
                            <Text style={styles.weatherStatLabel}>HUMIDITY</Text>
                            <Text style={styles.weatherStatValue}>{HUMIDITY_VALUE}</Text>
                        </View>
                    </View>
                    <View style={styles.weatherStatDivider} />
                    <View style={styles.weatherStatRow}>
                        <Ionicons name="flag-outline" size={22} color="#9CA3AF" />
                        <View>
                            <Text style={styles.weatherStatLabel}>WIND</Text>
                            <Text style={styles.weatherStatValue}>{WIND_VALUE}</Text>
                        </View>
                    </View>
                </View>

                {/* Calendar / Tasks */}
                <View style={styles.calendarSection}>
                    <View style={styles.calendarHeader}>
                        <Text style={styles.calendarDate}>{CURRENT_DATE}</Text>
                        <View style={styles.calendarNavRow}>
                            <TouchableOpacity style={styles.calendarNavButton}>
                                <Ionicons name="chevron-back" size={16} color="#6B7280" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.todayButton}>
                                <Text style={styles.todayButtonText}>Today</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.calendarNavButton}>
                                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.calendarTabRow}>
                        {CALENDAR_TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.calendarTab, activeTab === tab && styles.calendarTabActive]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.calendarTabText, activeTab === tab && styles.calendarTabTextActive]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {TASKS.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </View>

                {/* Reminders */}
                <View style={styles.remindersSection}>
                    <View style={styles.remindersHeader}>
                        <Ionicons name="warning-outline" size={20} color="#F5A623" />
                        <Text style={styles.remindersTitle}>Reminders</Text>
                    </View>
                    {REMINDERS.map((reminder) => (
                        <ReminderItem key={reminder.id} reminder={reminder} />
                    ))}
                </View>

                {/* Did You Know */}
                <View style={styles.didYouKnowCard}>
                    <Text style={styles.didYouKnowTitle}>{DID_YOU_KNOW_TITLE}</Text>
                    <Text style={styles.didYouKnowText}>{DID_YOU_KNOW_TEXT}</Text>
                </View>
            </ScrollView>
        </View>
    );
}
