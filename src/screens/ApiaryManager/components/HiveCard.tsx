import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { Hive } from '../../../@types/apiary';

const STATUS_LABELS = { healthy: 'Healthy', warning: 'Warning', critical: 'Critical' };

type Props = {
  hive: Hive;
  onLog: (hiveId: number, hiveName: string) => void;
  onHistory: (hiveId: number, hiveName: string) => void;
};

export function HiveCard({ hive, onLog, onHistory }: Props) {
  const { colors } = useTheme();

  const statusColor =
    hive.status === 'healthy' ? colors.success :
    hive.status === 'critical' ? colors.danger :
    '#eab308';

  // Parse date without timezone shift by treating it as local midnight
  const lastCheck = new Date(hive.lastCheck + 'T00:00:00')
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={styles.titleRow}>
        <Text style={[styles.name, { color: colors.text }]}>{hive.name}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor + '33' }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>
            {STATUS_LABELS[hive.status]}
          </Text>
        </View>
      </View>
      <Text style={[styles.detail, { color: colors.muted }]}>
        Queen: {hive.queenColor} ({hive.queenYear})
      </Text>
      <Text style={[styles.detail, { color: colors.muted }]}>
        Last Check: {lastCheck}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={() => onLog(hive.id, hive.name)}
        >
          <Text style={[styles.btnText, { color: colors.primaryText }]}>+ Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { borderWidth: 1, borderColor: colors.border }]}
          onPress={() => onHistory(hive.id, hive.name)}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 16, fontWeight: '600' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  detail: { fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { fontSize: 13, fontWeight: '600' },
});
