import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../Contexts/ThemeContext';
import { useLogSettings } from '../../Contexts/LogSettingsContext';

const AMBER = '#F59E0B';
const AMBER_DARK = '#D97706';
const ORANGE = '#F97316';

type RouteParams = { hiveName?: string; hiveId?: string };

interface FormState {
  queenSeen: boolean | null;
  queenCells: boolean | null;
  broodPattern: 'solid' | 'good' | 'spotty' | 'none' | null;
  framesOfBees: number;
  framesOfBrood: number;
  honeyStores: number;
  pollenStores: number;
  hiveWeight: number;
  miteCount: number;
  temperament: 'calm' | 'gentle' | 'defensive' | 'aggressive' | null;
  treatmentApplied: boolean | null;
  feeding: boolean | null;
  overallStatus: 'healthy' | 'attention' | 'critical' | null;
  notes: string;
}

const INITIAL_FORM: FormState = {
  queenSeen: null,
  queenCells: null,
  broodPattern: null,
  framesOfBees: 8,
  framesOfBrood: 6,
  honeyStores: 4,
  pollenStores: 2,
  hiveWeight: 82,
  miteCount: 0,
  temperament: null,
  treatmentApplied: null,
  feeding: null,
  overallStatus: null,
  notes: '',
};

// ─── Reusable field components ───────────────────────────────────────────────

function SectionDivider({ label, colors }: { label: string; colors: { border: string; muted: string } }) {
  return (
    <View style={[divStyles.row, { borderTopColor: colors.border }]}>
      <Text style={[divStyles.label, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

function YesNoField({
  value,
  onChange,
  colors,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  colors: { background: string; border: string; text: string };
}) {
  return (
    <View style={ynStyles.row}>
      <TouchableOpacity
        style={[ynStyles.btn, { borderColor: value === true ? '#16A34A' : colors.border, backgroundColor: value === true ? '#16A34A' : colors.background }]}
        onPress={() => onChange(true)}
        activeOpacity={0.7}
      >
        <Text style={[ynStyles.btnText, { color: value === true ? '#fff' : colors.text }]}>YES</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[ynStyles.btn, { borderColor: value === false ? '#DC2626' : colors.border, backgroundColor: value === false ? '#DC2626' : colors.background }]}
        onPress={() => onChange(false)}
        activeOpacity={0.7}
      >
        <Text style={[ynStyles.btnText, { color: value === false ? '#fff' : colors.text }]}>NO</Text>
      </TouchableOpacity>
    </View>
  );
}

function SegmentField<T extends string>({
  options,
  value,
  onChange,
  colors,
}: {
  options: { label: string; value: T; color?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  colors: { background: string; border: string; text: string };
}) {
  return (
    <View style={segStyles.row}>
      {options.map((opt) => {
        const active = value === opt.value;
        const activeColor = opt.color ?? AMBER;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[segStyles.btn, { flex: 1, borderColor: active ? activeColor : colors.border, backgroundColor: active ? activeColor : colors.background }]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[segStyles.btnText, { color: active ? '#fff' : colors.text }]} numberOfLines={1}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function StepperField({
  value,
  onChange,
  min = 0,
  max = 20,
  unit,
  colors,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  colors: { background: string; border: string; text: string; surface: string };
}) {
  return (
    <View style={stpStyles.row}>
      <TouchableOpacity
        style={[stpStyles.btn, { backgroundColor: colors.background, borderColor: colors.border }]}
        onPress={() => onChange(Math.max(min, value - 1))}
        activeOpacity={0.6}
      >
        <Text style={[stpStyles.btnText, { color: colors.text }]}>−</Text>
      </TouchableOpacity>
      <View style={[stpStyles.valueBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[stpStyles.value, { color: colors.text }]}>{value}</Text>
        {unit ? <Text style={[stpStyles.unit, { color: colors.text }]}>{unit}</Text> : null}
      </View>
      <TouchableOpacity
        style={[stpStyles.btn, { backgroundColor: colors.background, borderColor: colors.border }]}
        onPress={() => onChange(Math.min(max, value + 1))}
        activeOpacity={0.6}
      >
        <Text style={[stpStyles.btnText, { color: colors.text }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function FieldLabel({ emoji, label, colors }: { emoji: string; label: string; colors: { text: string } }) {
  return (
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldEmoji}>{emoji}</Text>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function LogEntry() {
  const { colors, theme } = useTheme();
  const { isEnabled } = useLogSettings();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const hiveName = route.params?.hiveName ?? 'Select Hive';

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    // TODO: POST /api/inspections — send full form state regardless of which fields are enabled
    // All fields are always stored; isEnabled() only controls what the user sees in this form
    console.log('LOG ENTRY PAYLOAD:', JSON.stringify({ hiveName, ...form }, null, 2));
    Alert.alert(
      'Entry Saved',
      'Your log entry has been recorded.\n\nDatabase hook not yet connected — payload logged to console.',
      [{ text: 'Done', onPress: () => navigation.goBack() }]
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={AMBER} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Entry</Text>
        <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.surface }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hive & Date banner */}
        <View style={[styles.hiveBanner, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.hiveName, { color: colors.text }]}>{hiveName}</Text>
            <Text style={[styles.hiveDate, { color: colors.muted }]}>{today}</Text>
          </View>
          <Text style={styles.hiveEmoji}>🐝</Text>
        </View>

        {/* ── Queen ── */}
        {(isEnabled('queenSeen') || isEnabled('queenCells')) && (
          <SectionDivider label="QUEEN" colors={colors} />
        )}

        {isEnabled('queenSeen') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="👑" label="Queen Seen" colors={colors} />
            <YesNoField value={form.queenSeen} onChange={v => set('queenSeen', v)} colors={colors} />
          </View>
        )}

        {isEnabled('queenCells') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🥚" label="Queen Cells Present" colors={colors} />
            <YesNoField value={form.queenCells} onChange={v => set('queenCells', v)} colors={colors} />
          </View>
        )}

        {/* ── Brood & Population ── */}
        {(isEnabled('broodPattern') || isEnabled('framesOfBees') || isEnabled('framesOfBrood')) && (
          <SectionDivider label="BROOD & POPULATION" colors={colors} />
        )}

        {isEnabled('broodPattern') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🍯" label="Brood Pattern" colors={colors} />
            <SegmentField
              options={[
                { label: 'Solid', value: 'solid', color: '#16A34A' },
                { label: 'Good', value: 'good', color: AMBER_DARK },
                { label: 'Spotty', value: 'spotty', color: ORANGE },
                { label: 'None', value: 'none', color: '#DC2626' },
              ]}
              value={form.broodPattern}
              onChange={v => set('broodPattern', v)}
              colors={colors}
            />
          </View>
        )}

        {isEnabled('framesOfBees') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🐝" label="Frames of Bees" colors={colors} />
            <StepperField value={form.framesOfBees} max={20} onChange={v => set('framesOfBees', v)} colors={colors} />
          </View>
        )}

        {isEnabled('framesOfBrood') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🐣" label="Frames of Brood" colors={colors} />
            <StepperField value={form.framesOfBrood} max={20} onChange={v => set('framesOfBrood', v)} colors={colors} />
          </View>
        )}

        {/* ── Stores ── */}
        {(isEnabled('honeyStores') || isEnabled('pollenStores')) && (
          <SectionDivider label="STORES" colors={colors} />
        )}

        {isEnabled('honeyStores') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🍯" label="Honey Stores (frames)" colors={colors} />
            <StepperField value={form.honeyStores} max={20} onChange={v => set('honeyStores', v)} colors={colors} />
          </View>
        )}

        {isEnabled('pollenStores') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🌼" label="Pollen Stores (frames)" colors={colors} />
            <StepperField value={form.pollenStores} max={20} onChange={v => set('pollenStores', v)} colors={colors} />
          </View>
        )}

        {/* ── Weight & Mites ── */}
        {(isEnabled('hiveWeight') || isEnabled('miteCount')) && (
          <SectionDivider label="WEIGHT & MITES" colors={colors} />
        )}

        {isEnabled('hiveWeight') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="⚖️" label="Hive Weight" colors={colors} />
            <StepperField value={form.hiveWeight} max={300} onChange={v => set('hiveWeight', v)} unit="lbs" colors={colors} />
          </View>
        )}

        {isEnabled('miteCount') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🔬" label="Mite Count (per 100 bees)" colors={colors} />
            <StepperField value={form.miteCount} max={20} onChange={v => set('miteCount', v)} colors={colors} />
          </View>
        )}

        {/* ── Temperament ── */}
        {isEnabled('temperament') && (
          <>
            <SectionDivider label="TEMPERAMENT" colors={colors} />
            <View style={styles.fieldBlock}>
              <FieldLabel emoji="😤" label="Colony Temperament" colors={colors} />
              <SegmentField
                options={[
                  { label: 'Calm', value: 'calm', color: '#16A34A' },
                  { label: 'Gentle', value: 'gentle', color: AMBER_DARK },
                  { label: 'Defensive', value: 'defensive', color: ORANGE },
                  { label: 'Aggressive', value: 'aggressive', color: '#DC2626' },
                ]}
                value={form.temperament}
                onChange={v => set('temperament', v)}
                colors={colors}
              />
            </View>
          </>
        )}

        {/* ── Treatment & Feeding ── */}
        {(isEnabled('treatmentApplied') || isEnabled('feeding')) && (
          <SectionDivider label="TREATMENT & FEEDING" colors={colors} />
        )}

        {isEnabled('treatmentApplied') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="💊" label="Treatment Applied" colors={colors} />
            <YesNoField value={form.treatmentApplied} onChange={v => set('treatmentApplied', v)} colors={colors} />
          </View>
        )}

        {isEnabled('feeding') && (
          <View style={styles.fieldBlock}>
            <FieldLabel emoji="🍬" label="Colony Fed" colors={colors} />
            <YesNoField value={form.feeding} onChange={v => set('feeding', v)} colors={colors} />
          </View>
        )}

        {/* ── Overall Status ── */}
        {isEnabled('overallStatus') && (
          <>
            <SectionDivider label="OVERALL STATUS" colors={colors} />
            <View style={styles.fieldBlock}>
              <FieldLabel emoji="✅" label="Health Assessment" colors={colors} />
              <SegmentField
                options={[
                  { label: '🟢 Healthy', value: 'healthy', color: '#16A34A' },
                  { label: '🟡 Attention', value: 'attention', color: AMBER_DARK },
                  { label: '🔴 Critical', value: 'critical', color: '#DC2626' },
                ]}
                value={form.overallStatus}
                onChange={v => set('overallStatus', v)}
                colors={colors}
              />
            </View>
          </>
        )}

        {/* ── Notes (always shown) ── */}
        <SectionDivider label="NOTES" colors={colors} />
        <View style={styles.fieldBlock}>
          <FieldLabel emoji="📝" label="Notes" colors={colors} />
          <TextInput
            style={[styles.notesInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            multiline
            numberOfLines={5}
            placeholder="Write any observations, concerns, or reminders…"
            placeholderTextColor={colors.muted}
            value={form.notes}
            onChangeText={v => set('notes', v)}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>SAVE LOG ENTRY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    backgroundColor: AMBER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: { marginRight: 12, padding: 4 },
  backArrow: { fontSize: 22, fontWeight: '700', color: '#1C1917' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1C1917', flex: 1 },
  headerDate: { fontSize: 14, fontWeight: '600', color: '#1C1917' },

  scroll: { flex: 1 },

  hiveBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  hiveName: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  hiveDate: { fontSize: 13 },
  hiveEmoji: { fontSize: 40 },

  fieldBlock: { paddingHorizontal: 16, paddingBottom: 16 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  fieldEmoji: { fontSize: 20 },
  fieldLabel: { fontSize: 17, fontWeight: '700' },

  notesInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 16,
    minHeight: 120,
    lineHeight: 24,
  },

  saveSection: { paddingHorizontal: 16, paddingTop: 8 },
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 28,
    paddingVertical: 20,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
});

const divStyles = StyleSheet.create({
  row: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingTop: 16,
  },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
});

const ynStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
});

const segStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  btn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  btnText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
});

const stpStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: 28, fontWeight: '300' },
  valueBox: {
    flex: 1,
    height: 64,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  value: { fontSize: 28, fontWeight: '700' },
  unit: { fontSize: 14, fontWeight: '500', marginTop: 6 },
});