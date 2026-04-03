import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { HiveLog } from '../../../@types/apiary';

const EVENT_LABELS: Record<string, string> = {
  inspection: 'Inspection',
  feeding: 'Feeding',
  treatment: 'Treatment',
  harvest: 'Harvest',
  observation: 'Observation',
};

type Props = { logs: HiveLog[] };

export function JournalFeed({ logs }: Props) {
  const { colors } = useTheme();

  const formatDate = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (logs.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No journal entries yet.</Text>
        <Text style={[styles.emptyHint, { color: colors.muted }]}>
          Log events from your hive cards to see them here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
      {logs.map(log => (
        <View key={log.id} style={[styles.entry, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={[styles.hiveName, { color: colors.text }]}>{log.hiveName}</Text>
              <Text style={[styles.apiaryName, { color: colors.muted }]}>{log.apiaryName}</Text>
            </View>
            <Text style={[styles.date, { color: colors.muted }]}>{formatDate(log.date)}</Text>
          </View>
          <Text style={[styles.eventType, { color: colors.primary }]}>
            {EVENT_LABELS[log.type] ?? log.type} completed
          </Text>
          {log.notes && (
            <Text style={[styles.notes, { color: colors.muted }]}>Notes: {log.notes}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, paddingBottom: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '500' },
  emptyHint: { fontSize: 13, textAlign: 'center' },
  entry: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 6 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  hiveName: { fontSize: 15, fontWeight: '600' },
  apiaryName: { fontSize: 12 },
  date: { fontSize: 12 },
  eventType: { fontSize: 14, fontWeight: '500' },
  notes: { fontSize: 13 },
});
