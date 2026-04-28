import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../Contexts/ThemeContext';

const AMBER = '#F59E0B';

const JOURNAL_FIELDS = [
  'Queen Status',
  'Temperament',
  'Brood Pattern',
  'Mite Count',
  'Weather',
  'Photos',
  'Harvest Weight',
  'Feeding Type',
];

export function Settings() {
  const { colors, theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [fieldChecks, setFieldChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(JOURNAL_FIELDS.map((f) => [f, true]))
  );

  function toggleField(field: string) {
    setFieldChecks((prev: Record<string, boolean>) => ({ ...prev, [field]: !prev[field] }));
  }

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
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.pageSubtitle, { color: colors.muted }]}>
            Manage your app preferences and journal fields.
          </Text>
        </View>

        {/* Appearance Card */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Appearance</Text>
            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
              Choose your preferred color theme.
            </Text>
            <View style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>
                  {isDark ? 'Currently using dark theme.' : 'Currently using light theme.'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: AMBER }}
                thumbColor={isDark ? '#fff' : colors.surface}
              />
            </View>
          </View>
        </View>

        {/* Automation Card */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Automation</Text>
            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
              Configure automatic scheduling and reminders.
            </Text>

            <View style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-Schedule Inspections</Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>
                  Automatically create reminders for hive inspections.
                </Text>
              </View>
              <Switch
                value={autoSchedule}
                onValueChange={setAutoSchedule}
                trackColor={{ false: colors.border, true: AMBER }}
                thumbColor={autoSchedule ? '#fff' : colors.surface}
              />
            </View>
          </View>
        </View>

        {/* Journal Entry Fields Card */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Journal Entry Fields</Text>
            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
              Customize which fields appear when you log data. Turn off fields you don't use to keep things simple.
            </Text>

            {JOURNAL_FIELDS.map((field, idx) => {
              const checked = fieldChecks[field];
              return (
                <TouchableOpacity
                  key={field}
                  style={[
                    styles.fieldRow,
                    idx < JOURNAL_FIELDS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                  ]}
                  onPress={() => toggleField(field)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>{field}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      checked
                        ? styles.checkboxChecked
                        : [styles.checkboxUnchecked, { borderColor: colors.border }],
                    ]}
                  >
                    {checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Account Card */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.accountTitle, { color: colors.muted }]}>Account</Text>
            <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
              Account management features coming soon.
            </Text>
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

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  pageTitle: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  pageSubtitle: { fontSize: 15, lineHeight: 22 },

  section: { paddingHorizontal: 20, paddingTop: 16 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  cardSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 14 },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  settingDesc: { fontSize: 13, lineHeight: 18 },

  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  fieldLabel: { fontSize: 15 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#15803D' },
  checkboxUnchecked: { borderWidth: 1.5 },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },

  accountTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
});
