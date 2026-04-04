import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native';
import { useTheme } from '../../Contexts/ThemeContext';
import { Apiary, HiveLog } from '../../@types/apiary';
import { getApiaries, getAllLogs } from '../../services/apiaryService';
import { ApiaryCard } from './components/ApiaryCard';
import { JournalFeed } from './components/JournalFeed';
import { CreateApiaryModal } from './components/CreateApiaryModal';
import { QuickEntryModal } from './components/QuickEntryModal';

type Tab = 'apiaries' | 'journal';

export function ApiaryManager() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('apiaries');
  const [apiaries, setApiaries] = useState<Apiary[]>([]);
  const [logs, setLogs] = useState<HiveLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [createApiaryVisible, setCreateApiaryVisible] = useState(false);
  const [quickEntryVisible, setQuickEntryVisible] = useState(false);

  const loadData = useCallback(async () => {
    const [fetchedApiaries, fetchedLogs] = await Promise.all([
      getApiaries(),
      getAllLogs(),
    ]);
    setApiaries(fetchedApiaries);
    setLogs(fetchedLogs);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Called by child components after a hive event or structural change
  const handleDataChanged = useCallback(async () => {
    const [fetchedApiaries, fetchedLogs] = await Promise.all([
      getApiaries(),
      getAllLogs(),
    ]);
    setApiaries(fetchedApiaries);
    setLogs(fetchedLogs);
  }, []);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Apiary Manager</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Manage hives and track your beekeeping journey.
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { borderColor: colors.border }]}
            onPress={() => Alert.alert('Settings', 'Apiary settings coming soon.')}
          >
            <Text style={styles.iconBtnText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickEntryBtn, { backgroundColor: colors.primary }]}
            onPress={() => setQuickEntryVisible(true)}
          >
            <Text style={[styles.quickEntryBtnText, { color: colors.primaryText }]}>＋ Quick Entry</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {(['apiaries', 'journal'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? colors.primary : colors.muted },
            ]}>
              {tab === 'apiaries' ? 'My Apiaries' : 'Journal Feed'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : activeTab === 'apiaries' ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {apiaries.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No apiaries yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                Create your first apiary to get started.
              </Text>
            </View>
          )}
          {apiaries.map(apiary => (
            <ApiaryCard
              key={apiary.id}
              apiary={apiary}
              onDataChanged={handleDataChanged}
            />
          ))}
          {/* Create New Apiary button — dashed card at the bottom */}
          <TouchableOpacity
            style={[styles.createApiaryBtn, { borderColor: colors.border }]}
            onPress={() => setCreateApiaryVisible(true)}
          >
            <Text style={[styles.createApiaryText, { color: colors.primary }]}>
              ＋ Create New Apiary
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.journalContainer}>
          <JournalFeed logs={logs} />
        </View>
      )}

      {/* ── Top-level Modals ─────────────────────────────────────────────── */}
      <CreateApiaryModal
        visible={createApiaryVisible}
        onClose={() => setCreateApiaryVisible(false)}
        onSubmit={() => { setCreateApiaryVisible(false); loadData(); }}
      />
      <QuickEntryModal
        visible={quickEntryVisible}
        apiaries={apiaries}
        onClose={() => setQuickEntryVisible(false)}
        onSubmit={() => { setQuickEntryVisible(false); handleDataChanged(); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  headerText: { flex: 1, gap: 4 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13 },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: { fontSize: 18 },
  quickEntryBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  quickEntryBtnText: { fontWeight: '700', fontSize: 14 },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: { fontSize: 15, fontWeight: '600' },

  // Content
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  createApiaryBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  createApiaryText: { fontSize: 15, fontWeight: '600' },
  journalContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
});
