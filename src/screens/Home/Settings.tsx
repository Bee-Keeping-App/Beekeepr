import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/AppHeader';
import { styles } from './Settings.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface JournalField {
    id: string;
    label: string;
    enabled: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Settings';
const PAGE_SUBTITLE = 'Manage your app preferences and journal fields.';

const SECTION_AUTOMATION_TITLE = 'Automation';
const SECTION_AUTOMATION_DESCRIPTION = 'Configure automatic scheduling and reminders.';
const TOGGLE_LABEL = 'Auto-Schedule Inspections';
const TOGGLE_DESCRIPTION = 'Automatically create reminders for hive inspections.';

const SECTION_FIELDS_TITLE = 'Journal Entry Fields';
const SECTION_FIELDS_DESCRIPTION = "Customize which fields appear when you log data. Turn off fields you don't use to keep things simple.";

const SECTION_ACCOUNT_TITLE = 'Account';
const SECTION_ACCOUNT_SUBTITLE = 'Account management features coming soon.';

const INITIAL_JOURNAL_FIELDS: JournalField[] = [
    { id: '1', label: 'Queen Status', enabled: true },
    { id: '2', label: 'Temperament', enabled: true },
    { id: '3', label: 'Brood Pattern', enabled: true },
    { id: '4', label: 'Mite Count', enabled: true },
    { id: '5', label: 'Weather', enabled: true },
    { id: '6', label: 'Photos', enabled: true },
    { id: '7', label: 'Harvest Weight', enabled: true },
    { id: '8', label: 'Feeding Type', enabled: true },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export function Settings() {
    const [autoSchedule, setAutoSchedule] = useState(false);
    const [journalFields, setJournalFields] = useState<JournalField[]>(INITIAL_JOURNAL_FIELDS);

    function toggleField(id: string) {
        setJournalFields((prev) =>
            prev.map((field) =>
                field.id === id ? { ...field, enabled: !field.enabled } : field
            )
        );
    }

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
                </View>

                {/* Automation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{SECTION_AUTOMATION_TITLE}</Text>
                    <Text style={styles.sectionDescription}>{SECTION_AUTOMATION_DESCRIPTION}</Text>
                    <View style={styles.sectionCard}>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleInfo}>
                                <Text style={styles.toggleLabel}>{TOGGLE_LABEL}</Text>
                                <Text style={styles.toggleDescription}>{TOGGLE_DESCRIPTION}</Text>
                            </View>
                            <Switch
                                value={autoSchedule}
                                onValueChange={setAutoSchedule}
                                trackColor={{ false: '#E5E7EB', true: '#F5A623' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                </View>

                {/* Journal Entry Fields */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{SECTION_FIELDS_TITLE}</Text>
                    <Text style={styles.sectionDescription}>{SECTION_FIELDS_DESCRIPTION}</Text>
                    <View style={styles.sectionCard}>
                        {journalFields.map((field, index) => {
                            const isLast = index === journalFields.length - 1;
                            return (
                                <TouchableOpacity
                                    key={field.id}
                                    style={[styles.fieldRow, isLast && styles.fieldRowLast]}
                                    onPress={() => toggleField(field.id)}
                                >
                                    <Text style={styles.fieldLabel}>{field.label}</Text>
                                    <View style={[styles.checkbox, field.enabled ? styles.checkboxChecked : styles.checkboxUnchecked]}>
                                        {field.enabled && (
                                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <View style={styles.accountCard}>
                        <Text style={styles.accountTitle}>{SECTION_ACCOUNT_TITLE}</Text>
                        <Text style={styles.accountSubtitle}>{SECTION_ACCOUNT_SUBTITLE}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
