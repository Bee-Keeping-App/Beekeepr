import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { lightColors } from "../../styles/colors";

export function Settings() {
  //Local-only toggles
  const [autoScheduleInspections, setAutoScheduleInspections] = React.useState(false);

  //Local-only per-field visibility for journal entries
  const [journalFields, setJournalFields] = React.useState<Record<string, boolean>>({
    "Queen Status": true,
    Temperament: true,
    "Brood Pattern": true,
    "Mite Count": true,
    Weather: true,
    Photos: true,
    "Harvest Weight": true,
    "Feeding Type": true,
  });

  const toggleJournalField = React.useCallback((label: string) => {
    setJournalFields((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  //Page header
  const headerSection = (
    <View style={styles.header}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        Manage your app preferences and journal fields.
      </Text>
    </View>
  );

  //Automation section (UI only for now)
  const automationSection = (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Automation</Text>
      <Text style={styles.sectionDescription}>
        Configure automatic scheduling and reminders.
      </Text>

      <View style={styles.optionCard}>
        <View style={styles.optionRow}>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Auto-Schedule Inspections</Text>
            <Text style={styles.optionBody}>
              Automatically create reminders for hive inspections.
            </Text>
          </View>

          <Switch
            value={autoScheduleInspections}
            onValueChange={setAutoScheduleInspections}
            trackColor={{ false: lightColors.border, true: lightColors.muted }}
            thumbColor={autoScheduleInspections ? lightColors.primary : lightColors.surface}
          />
        </View>
      </View>
    </View>
  );

  //Journal field visibility controls (UI only for now)
  const journalEntryFieldsSection = (
    <View style={[styles.sectionCard, styles.sectionCardSpacing]}>
      <Text style={styles.sectionTitle}>Journal Entry Fields</Text>
      <Text style={styles.sectionDescription}>
        Customize which fields appear when you log data. Turn off fields you don't use to keep things simple.
      </Text>

      <View style={styles.fieldList}>
        {Object.entries(journalFields).map(([label, checked]) => (
          <View key={label} style={styles.fieldRowWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              onPress={() => toggleJournalField(label)}
              style={[styles.checkboxBase, checked ? styles.checkboxChecked : styles.checkboxUnchecked]}
            >
              {checked ? "✓" : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  //Account section placeholder
  const accountSection = (
    <View style={[styles.sectionCard, styles.sectionCardSpacing, styles.sectionCardDisabled]}>
      <Text style={styles.sectionTitleDisabled}>Account</Text>
      <Text style={styles.sectionDescriptionDisabled}>
        Account management features coming soon.
      </Text>
    </View>
  );

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {headerSection}
        {automationSection}
        {journalEntryFieldsSection}
        {accountSection}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 6,
    color: lightColors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: lightColors.muted,
  },

  sectionCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: lightColors.background,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  sectionCardSpacing: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: lightColors.text,
    marginBottom: 6,
  },
  sectionTitleDisabled: {
    fontSize: 20,
    fontWeight: "700",
    color: lightColors.muted,
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 19,
    color: lightColors.muted,
    marginBottom: 12,
  },
  sectionDescriptionDisabled: {
    fontSize: 14,
    lineHeight: 19,
    color: lightColors.muted,
  },
  sectionCardDisabled: {
    opacity: 0.6,
  },

  optionCard: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    backgroundColor: lightColors.surface,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: lightColors.text,
    marginBottom: 4,
  },
  optionBody: {
    fontSize: 13,
    lineHeight: 18,
    color: lightColors.muted,
  },

  fieldList: {
    gap: 22,
  },
  fieldRowWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  fieldLabel: {
    flex: 1,
    fontSize: 15,
    color: lightColors.text,
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 4,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    fontSize: 16,
    fontWeight: "900",
  },
  checkboxUnchecked: {
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.background,
    color: lightColors.primaryText,
  },
  checkboxChecked: {
    borderWidth: 1,
    borderColor: lightColors.primary,
    backgroundColor: lightColors.primary,
    color: lightColors.primaryText,
  },
});