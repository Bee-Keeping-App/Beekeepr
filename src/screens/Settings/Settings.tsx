import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { lightColors } from "../../styles/colors";

export function Settings() {
  const [autoScheduleInspections, setAutoScheduleInspections] = React.useState(false);

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.description}>
            Manage your app preferences and journal fields.
          </Text>
        </View>

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: lightColors.text,
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 19,
    color: lightColors.muted,
    marginBottom: 12,
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
});