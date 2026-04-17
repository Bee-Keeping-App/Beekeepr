import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { HiveLog } from '../../../@types/apiary';
import { getHiveLogs } from '../../../services/apiaryService';

const EVENT_LABELS: Record<string, string> = {
  inspection: 'Inspection',
  feeding: 'Feeding',
  treatment: 'Treatment',
  harvest: 'Harvest',
  observation: 'Observation',
};

type Props = {
  visible: boolean;
  hiveId: number;
  hiveName: string;
  onClose: () => void;
};

export function HiveHistoryModal({ visible, hiveId, hiveName, onClose }: Props) {
  const { colors } = useTheme();
  const [logs, setLogs] = useState<HiveLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && hiveId) {
      setLoading(true);
      getHiveLogs(hiveId).then(data => {
        setLogs(data);
        setLoading(false);
      });
    }
  }, [visible, hiveId]);

  const formatDate = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>History — {hiveName}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[styles.closeBtn, { color: colors.muted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : logs.length === 0 ? (
            <Text style={[styles.empty, { color: colors.muted }]}>No events logged yet.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {logs.map((log, index) => (
                <View key={log.id} style={styles.entry}>
                  <View style={styles.timeline}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                    {index < logs.length - 1 && (
                      <View style={[styles.line, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                  <View style={styles.entryContent}>
                    <Text style={[styles.entryDate, { color: colors.muted }]}>
                      {formatDate(log.date)}
                    </Text>
                    <Text style={[styles.entryType, { color: colors.text }]}>
                      {EVENT_LABELS[log.type] ?? log.type} completed
                    </Text>
                    {log.notes && (
                      <Text style={[styles.entryNotes, { color: colors.muted }]}>
                        {log.notes}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: { fontSize: 18, padding: 4 },
  loader: { marginTop: 20 },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 15 },
  entry: { flexDirection: 'row', marginBottom: 16 },
  timeline: { width: 24, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  line: { width: 2, flex: 1, marginTop: 4 },
  entryContent: { flex: 1, paddingLeft: 12 },
  entryDate: { fontSize: 12 },
  entryType: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  entryNotes: { fontSize: 13, marginTop: 2 },
});
