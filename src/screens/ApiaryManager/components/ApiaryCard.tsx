import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { Apiary, Hive } from '../../../@types/apiary';
import { getHivesForApiary } from '../../../services/apiaryService';
import { HiveCard } from './HiveCard';
import { AddHiveCard } from './AddHiveCard';
import { HiveLogModal } from './HiveLogModal';
import { HiveHistoryModal } from './HiveHistoryModal';
import { AddHiveModal } from './AddHiveModal';

type Props = {
  apiary: Apiary;
  onDataChanged: () => void;
};

export function ApiaryCard({ apiary, onDataChanged }: Props) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [hives, setHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state — null means closed
  const [logModal, setLogModal] = useState<{ hiveId: number; hiveName: string } | null>(null);
  const [historyModal, setHistoryModal] = useState<{ hiveId: number; hiveName: string } | null>(null);
  const [addHiveVisible, setAddHiveVisible] = useState(false);

  const loadHives = useCallback(async () => {
    setLoading(true);
    const data = await getHivesForApiary(apiary.id);
    setHives(data);
    setLoading(false);
  }, [apiary.id]);

  useEffect(() => {
    if (expanded) loadHives();
  }, [expanded, loadHives]);

  const handleLogSubmit = () => {
    setLogModal(null);
    loadHives();
    onDataChanged();
  };

  const handleAddHiveSubmit = () => {
    setAddHiveVisible(false);
    loadHives();
    onDataChanged();
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header row — tap to expand/collapse */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.7}
      >
        <View style={styles.headerInfo}>
          <Text style={[styles.apiaryName, { color: colors.text }]}>{apiary.name}</Text>
          <Text style={[styles.location, { color: colors.muted }]}>{apiary.location}</Text>
          <Text style={[styles.hiveCount, { color: colors.muted }]}>
            {apiary.hiveCount} Hive{apiary.hiveCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={[styles.arrow, { color: colors.muted }]}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Hive list — rendered when expanded */}
      {expanded && (
        <View style={styles.hivesContainer}>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : (
            <>
              {hives.map(hive => (
                <HiveCard
                  key={hive.id}
                  hive={hive}
                  onLog={(id, name) => setLogModal({ hiveId: id, hiveName: name })}
                  onHistory={(id, name) => setHistoryModal({ hiveId: id, hiveName: name })}
                />
              ))}
              <AddHiveCard onPress={() => setAddHiveVisible(true)} />
            </>
          )}
        </View>
      )}

      {/* Modals — mounted lazily via conditional render */}
      {logModal && (
        <HiveLogModal
          visible
          hiveId={logModal.hiveId}
          hiveName={logModal.hiveName}
          onClose={() => setLogModal(null)}
          onSubmit={handleLogSubmit}
        />
      )}
      {historyModal && (
        <HiveHistoryModal
          visible
          hiveId={historyModal.hiveId}
          hiveName={historyModal.hiveName}
          onClose={() => setHistoryModal(null)}
        />
      )}
      <AddHiveModal
        visible={addHiveVisible}
        apiaryId={apiary.id}
        apiaryName={apiary.name}
        onClose={() => setAddHiveVisible(false)}
        onSubmit={handleAddHiveSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerInfo: { gap: 3 },
  apiaryName: { fontSize: 17, fontWeight: '700' },
  location: { fontSize: 13 },
  hiveCount: { fontSize: 13 },
  arrow: { fontSize: 16 },
  hivesContainer: { paddingHorizontal: 12, paddingBottom: 12 },
  loader: { paddingVertical: 20 },
});
