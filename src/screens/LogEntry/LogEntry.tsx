import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../Contexts/ThemeContext';
import { useLogSettings } from '../../Contexts/LogSettingsContext';

const AMBER = '#F59E0B';
const AMBER_DARK = '#D97706';
const ORANGE = '#F97316';

type RouteParams = { hiveName?: string; hiveId?: string; apiaryName?: string };

interface SelectedHive {
  id: string;
  name: string;
  apiaryName: string;
}

// TODO [API]: GET /api/apiaries?userId=:userId
// Returns all apiaries + their hives for the hive-selector step of this form.
// Response shape: { id: string, name: string, hives: { id: string, name: string }[] }[]
// Only id and name are needed here — no status/queen detail required for selection.
// Wire: const [apiaries, setApiaries] = useState(DEMO_APIARIES);
//   const { userId } = useAuth();
//   useEffect(() => { fetch(`/api/apiaries?userId=${userId}`)
//     .then(r => r.json())
//     .then(data => setApiaries(data.map(a => ({ id: a._id, name: a.name,
//       hives: a.hives.map(h => ({ id: h._id, name: h.name })) })))); }, [userId]);
// When apiaries is empty, the selector step should show an empty state:
//   "No hives yet — add one from the Apiary Manager tab."
const DEMO_APIARIES = [
  {
    id: '1',
    name: 'North Apiary',
    hives: [
      { id: '1', name: 'Hive #1' },
      { id: '2', name: 'Hive #2' },
      { id: '3', name: 'Hive #3' },
    ],
  },
  {
    id: '2',
    name: 'South Garden',
    hives: [{ id: '4', name: 'Hive #1' }],
  },
];

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
  treatmentType: 'oxalic_acid' | 'apivar' | 'apiguard' | 'hopguard' | 'other' | null;
  treatmentNotes: string;
  feeding: boolean | null;
  feedType: 'syrup_1_1' | 'syrup_2_1' | 'pollen_sub' | 'fondant' | 'other' | null;
  feedNotes: string;
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
  treatmentType: null,
  treatmentNotes: '',
  feeding: null,
  feedType: null,
  feedNotes: '',
  overallStatus: null,
  notes: '',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionDivider({ label, colors }: { label: string; colors: { border: string; muted: string } }) {
  return (
    <View style={[divStyles.row, { borderTopColor: colors.border }]}>
      <Text style={[divStyles.label, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

function FieldLabel({ emoji, label, colors }: { emoji: string; label: string; colors: { text: string } }) {
  return (
    <View style={formStyles.fieldLabelRow}>
      <Text style={formStyles.fieldEmoji}>{emoji}</Text>
      <Text style={[formStyles.fieldLabel, { color: colors.text }]}>{label}</Text>
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

function SubTextInput({
  placeholder,
  value,
  onChange,
  colors,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  colors: { background: string; border: string; text: string; muted: string };
}) {
  return (
    <TextInput
      style={[formStyles.subInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      value={value}
      onChangeText={onChange}
      textAlignVertical="top"
      multiline
      numberOfLines={3}
    />
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function LogEntry() {
  const { colors, theme } = useTheme();
  const { isEnabled } = useLogSettings();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();

  const paramHiveName = route.params?.hiveName ?? '';
  const paramHiveId = route.params?.hiveId ?? '';
  const paramApiaryName = route.params?.apiaryName ?? '';

  // If a hive was passed in via route params, skip the selector step
  const skippedSelection = paramHiveId.length > 0;

  const [step, setStep] = useState<'select' | 'form'>(skippedSelection ? 'form' : 'select');
  const [selectedHives, setSelectedHives] = useState<SelectedHive[]>(
    skippedSelection
      ? [{ id: paramHiveId, name: paramHiveName, apiaryName: paramApiaryName }]
      : []
  );
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleHive(hive: SelectedHive) {
    setSelectedHives(prev => {
      const exists = prev.some(h => h.id === hive.id);
      return exists ? prev.filter(h => h.id !== hive.id) : [...prev, hive];
    });
  }

  function isHiveSelected(id: string) {
    return selectedHives.some(h => h.id === id);
  }

  function isDirty() {
    return (
      form.queenSeen !== null ||
      form.queenCells !== null ||
      form.broodPattern !== null ||
      form.temperament !== null ||
      form.treatmentApplied !== null ||
      form.feeding !== null ||
      form.overallStatus !== null ||
      form.notes.trim().length > 0 ||
      form.treatmentNotes.trim().length > 0 ||
      form.feedNotes.trim().length > 0
    );
  }

  function handleFormBack() {
    if (isDirty()) {
      Alert.alert(
        'Discard Entry?',
        'You have unsaved changes. Leaving will lose everything you entered.',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              if (skippedSelection) navigation.goBack();
              else setStep('select');
            },
          },
        ]
      );
    } else {
      if (skippedSelection) navigation.goBack();
      else setStep('select');
    }
  }

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 'select') {
        navigation.goBack();
      } else {
        handleFormBack();
      }
      return true;
    });
    return () => sub.remove();
  });

  function handleSave() {
    // TODO [API]: POST /api/inspections — called once per selected hive
    // NOTE: Multi-hive duplication is a known inefficiency. See ToDo.md.
    // Future work: POST /api/inspections/batch with payload { hiveIds: string[], ...formFields }
    //
    // Per-hive payload:
    // {
    //   hiveId:           string,
    //   apiaryName:       string,
    //   inspectionDate:   ISO string,
    //   inspectorId:      string,     // from Clerk auth context
    //   queenSeen:        boolean | null,
    //   queenCells:       boolean | null,
    //   broodPattern:     'solid' | 'good' | 'spotty' | 'none' | null,
    //   framesOfBees:     number,
    //   framesOfBrood:    number,
    //   honeyStores:      number,
    //   pollenStores:     number,
    //   hiveWeight:       number,   // lbs
    //   miteCount:        number,   // per 100 bees
    //   temperament:      'calm' | 'gentle' | 'defensive' | 'aggressive' | null,
    //   treatmentApplied: boolean | null,
    //   treatmentType:    'oxalic_acid' | 'apivar' | 'apiguard' | 'hopguard' | 'other' | null,
    //   treatmentNotes:   string,
    //   feeding:          boolean | null,
    //   feedType:         'syrup_1_1' | 'syrup_2_1' | 'pollen_sub' | 'fondant' | 'other' | null,
    //   feedNotes:        string,
    //   overallStatus:    'healthy' | 'attention' | 'critical' | null,
    //   notes:            string,
    // }
    // Returns: { id, createdAt }

    selectedHives.forEach(hive => {
      const payload = {
        hiveId: hive.id,
        hiveName: hive.name,
        apiaryName: hive.apiaryName,
        inspectionDate: new Date().toISOString(),
        ...form,
      };
      console.log('[LogEntry] INSPECTION PAYLOAD:', JSON.stringify(payload, null, 2));
    });

    const label =
      selectedHives.length === 1
        ? selectedHives[0].name
        : `${selectedHives.length} hives`;

    Alert.alert(
      '✓ Entry Saved',
      `Inspection logged for ${label}.\n\n(Database not yet connected — payload${selectedHives.length > 1 ? 's' : ''} logged to console.)`,
      [{ text: 'Done', onPress: () => navigation.goBack() }]
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  // ── Step 1: Hive Selector ─────────────────────────────────────────────────
  if (step === 'select') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={AMBER} />

        <View style={shStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={shStyles.cancelBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={shStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={shStyles.title}>Select Hive</Text>
          {selectedHives.length > 0 ? (
            <View style={shStyles.badge}>
              <Text style={shStyles.badgeText}>{selectedHives.length}</Text>
            </View>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        <ScrollView
          style={[shStyles.scroll, { backgroundColor: colors.surface }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[shStyles.hint, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[shStyles.hintText, { color: colors.muted }]}>
              Select one or more hives. The same entry will be saved for each hive you choose.
            </Text>
          </View>

          {DEMO_APIARIES.map(apiary => (
            <View key={apiary.id}>
              <View style={[shStyles.apiaryHeader, { borderBottomColor: colors.border }]}>
                <Text style={[shStyles.apiaryName, { color: colors.muted }]}>{apiary.name.toUpperCase()}</Text>
              </View>
              {apiary.hives.map(hive => {
                const selected = isHiveSelected(hive.id);
                return (
                  <TouchableOpacity
                    key={hive.id}
                    style={[
                      shStyles.hiveRow,
                      { borderBottomColor: colors.border, backgroundColor: selected ? AMBER + '1A' : colors.surface },
                    ]}
                    onPress={() => toggleHive({ id: hive.id, name: hive.name, apiaryName: apiary.name })}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[shStyles.hiveRowName, { color: colors.text }]}>{hive.name}</Text>
                      <Text style={[shStyles.hiveRowApiary, { color: colors.muted }]}>{apiary.name}</Text>
                    </View>
                    <View
                      style={[
                        shStyles.checkbox,
                        selected ? shStyles.checkboxOn : [shStyles.checkboxOff, { borderColor: colors.border }],
                      ]}
                    >
                      {selected && <Text style={shStyles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Continue bar */}
        <View style={[shStyles.continueBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[shStyles.continueBtn, selectedHives.length === 0 && { opacity: 0.35 }]}
            onPress={() => { if (selectedHives.length > 0) setStep('form'); }}
            activeOpacity={0.8}
          >
            <Text style={shStyles.continueBtnText}>
              {selectedHives.length === 0
                ? 'Select at least one hive'
                : `Continue with ${selectedHives.length} hive${selectedHives.length > 1 ? 's' : ''} →`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Step 2: Inspection Form ───────────────────────────────────────────────
  const hiveLabel =
    selectedHives.length === 1
      ? selectedHives[0].name
      : `${selectedHives.length} hives`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={AMBER} />

      <View style={formStyles.header}>
        <TouchableOpacity
          onPress={handleFormBack}
          style={formStyles.cancelBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={formStyles.cancelText}>{skippedSelection ? 'Cancel' : '← Hives'}</Text>
        </TouchableOpacity>
        <Text style={formStyles.headerTitle}>Log Inspection</Text>
        <Text style={formStyles.headerDate}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
      </View>

      <ScrollView
        style={[formStyles.scroll, { backgroundColor: colors.surface }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Hive banner */}
        <View style={[formStyles.hiveBanner, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[formStyles.hiveName, { color: colors.text }]}>{hiveLabel}</Text>
            {selectedHives.length > 1 && (
              <Text style={[formStyles.hiveSubtitle, { color: colors.muted }]} numberOfLines={1}>
                {selectedHives.map(h => h.name).join(', ')}
              </Text>
            )}
            <Text style={[formStyles.hiveDate, { color: colors.muted }]}>{today}</Text>
          </View>
          {!skippedSelection && (
            <TouchableOpacity onPress={() => setStep('select')} style={formStyles.changeBtn}>
              <Text style={formStyles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          )}
          <Text style={formStyles.hiveEmoji}>🐝</Text>
        </View>

        {/* ── Queen ── */}
        {(isEnabled('queenSeen') || isEnabled('queenCells')) && (
          <SectionDivider label="QUEEN" colors={colors} />
        )}
        {isEnabled('queenSeen') && (
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="👑" label="Queen Seen" colors={colors} />
            <YesNoField value={form.queenSeen} onChange={v => set('queenSeen', v)} colors={colors} />
          </View>
        )}
        {isEnabled('queenCells') && (
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="🥚" label="Queen Cells Present" colors={colors} />
            <YesNoField value={form.queenCells} onChange={v => set('queenCells', v)} colors={colors} />
          </View>
        )}

        {/* ── Brood & Population ── */}
        {(isEnabled('broodPattern') || isEnabled('framesOfBees') || isEnabled('framesOfBrood')) && (
          <SectionDivider label="BROOD & POPULATION" colors={colors} />
        )}
        {isEnabled('broodPattern') && (
          <View style={formStyles.fieldBlock}>
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
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="🐝" label="Frames of Bees" colors={colors} />
            <StepperField value={form.framesOfBees} max={20} onChange={v => set('framesOfBees', v)} colors={colors} />
          </View>
        )}
        {isEnabled('framesOfBrood') && (
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="🐣" label="Frames of Brood" colors={colors} />
            <StepperField value={form.framesOfBrood} max={20} onChange={v => set('framesOfBrood', v)} colors={colors} />
          </View>
        )}

        {/* ── Stores ── */}
        {(isEnabled('honeyStores') || isEnabled('pollenStores')) && (
          <SectionDivider label="STORES" colors={colors} />
        )}
        {isEnabled('honeyStores') && (
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="🍯" label="Honey Stores (frames)" colors={colors} />
            <StepperField value={form.honeyStores} max={20} onChange={v => set('honeyStores', v)} colors={colors} />
          </View>
        )}
        {isEnabled('pollenStores') && (
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="🌼" label="Pollen Stores (frames)" colors={colors} />
            <StepperField value={form.pollenStores} max={20} onChange={v => set('pollenStores', v)} colors={colors} />
          </View>
        )}

        {/* ── Weight & Mites ── */}
        {(isEnabled('hiveWeight') || isEnabled('miteCount')) && (
          <SectionDivider label="WEIGHT & MITES" colors={colors} />
        )}
        {isEnabled('hiveWeight') && (
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="⚖️" label="Hive Weight" colors={colors} />
            <StepperField value={form.hiveWeight} max={300} onChange={v => set('hiveWeight', v)} unit="lbs" colors={colors} />
          </View>
        )}
        {isEnabled('miteCount') && (
          <View style={formStyles.fieldBlock}>
            <FieldLabel emoji="🔬" label="Mite Count (per 100 bees)" colors={colors} />
            <StepperField value={form.miteCount} max={20} onChange={v => set('miteCount', v)} colors={colors} />
          </View>
        )}

        {/* ── Temperament ── */}
        {isEnabled('temperament') && (
          <>
            <SectionDivider label="TEMPERAMENT" colors={colors} />
            <View style={formStyles.fieldBlock}>
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

        {/* ── Treatment ── */}
        {isEnabled('treatmentApplied') && (
          <>
            <SectionDivider label="TREATMENT" colors={colors} />
            <View style={formStyles.fieldBlock}>
              <FieldLabel emoji="💊" label="Treatment Applied" colors={colors} />
              <YesNoField
                value={form.treatmentApplied}
                onChange={v => {
                  set('treatmentApplied', v);
                  if (!v) { set('treatmentType', null); set('treatmentNotes', ''); }
                }}
                colors={colors}
              />
            </View>
            {form.treatmentApplied === true && (
              <>
                <View style={formStyles.fieldBlock}>
                  <FieldLabel emoji="🧪" label="Treatment Type" colors={colors} />
                  <SegmentField
                    options={[
                      { label: 'Oxalic', value: 'oxalic_acid', color: '#7C3AED' },
                      { label: 'ApiVar', value: 'apivar', color: '#0369A1' },
                      { label: 'Apiguard', value: 'apiguard', color: '#0F766E' },
                      { label: 'HopGuard', value: 'hopguard', color: AMBER_DARK },
                      { label: 'Other', value: 'other', color: '#6B7280' },
                    ]}
                    value={form.treatmentType}
                    onChange={v => set('treatmentType', v)}
                    colors={colors}
                  />
                </View>
                <View style={formStyles.fieldBlock}>
                  <FieldLabel emoji="📋" label="Treatment Notes" colors={colors} />
                  <SubTextInput
                    placeholder="Dosage, method, duration, batch number…"
                    value={form.treatmentNotes}
                    onChange={v => set('treatmentNotes', v)}
                    colors={colors}
                  />
                </View>
              </>
            )}
          </>
        )}

        {/* ── Feeding ── */}
        {isEnabled('feeding') && (
          <>
            <SectionDivider label="FEEDING" colors={colors} />
            <View style={formStyles.fieldBlock}>
              <FieldLabel emoji="🍬" label="Colony Fed" colors={colors} />
              <YesNoField
                value={form.feeding}
                onChange={v => {
                  set('feeding', v);
                  if (!v) { set('feedType', null); set('feedNotes', ''); }
                }}
                colors={colors}
              />
            </View>
            {form.feeding === true && (
              <>
                <View style={formStyles.fieldBlock}>
                  <FieldLabel emoji="🥣" label="Feed Type" colors={colors} />
                  <SegmentField
                    options={[
                      { label: '1:1 Syrup', value: 'syrup_1_1', color: '#16A34A' },
                      { label: '2:1 Syrup', value: 'syrup_2_1', color: AMBER_DARK },
                      { label: 'Pollen Sub', value: 'pollen_sub', color: '#D97706' },
                      { label: 'Fondant', value: 'fondant', color: '#0369A1' },
                      { label: 'Other', value: 'other', color: '#6B7280' },
                    ]}
                    value={form.feedType}
                    onChange={v => set('feedType', v)}
                    colors={colors}
                  />
                </View>
                <View style={formStyles.fieldBlock}>
                  <FieldLabel emoji="📋" label="Feed Notes" colors={colors} />
                  <SubTextInput
                    placeholder="Amount, feeder type, observations…"
                    value={form.feedNotes}
                    onChange={v => set('feedNotes', v)}
                    colors={colors}
                  />
                </View>
              </>
            )}
          </>
        )}

        {/* ── Overall Status ── */}
        {isEnabled('overallStatus') && (
          <>
            <SectionDivider label="OVERALL STATUS" colors={colors} />
            <View style={formStyles.fieldBlock}>
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
        <View style={formStyles.fieldBlock}>
          <FieldLabel emoji="📝" label="General Notes" colors={colors} />
          <TextInput
            style={[formStyles.notesInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            multiline
            numberOfLines={5}
            placeholder="Observations, concerns, follow-up reminders…"
            placeholderTextColor={colors.muted}
            value={form.notes}
            onChangeText={v => set('notes', v)}
            textAlignVertical="top"
          />
        </View>

        {/* Action buttons */}
        <View style={formStyles.actionRow}>
          <TouchableOpacity
            style={[formStyles.discardBtn, { borderColor: colors.border }]}
            onPress={handleFormBack}
            activeOpacity={0.7}
          >
            <Text style={[formStyles.discardText, { color: colors.muted }]}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={formStyles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={formStyles.saveBtnText}>SAVE ENTRY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

// Hive selector step styles
const shStyles = StyleSheet.create({
  header: {
    backgroundColor: AMBER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cancelBtn: { paddingRight: 12 },
  cancelText: { fontSize: 16, fontWeight: '600', color: '#1C1917' },
  title: { fontSize: 18, fontWeight: '800', color: '#1C1917', flex: 1, textAlign: 'center' },
  badge: {
    width: 40,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1C1917',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: AMBER, fontSize: 14, fontWeight: '800' },
  scroll: { flex: 1 },
  hint: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  hintText: { fontSize: 14, lineHeight: 20 },
  apiaryHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  apiaryName: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  hiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 72,
  },
  hiveRowName: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  hiveRowApiary: { fontSize: 13 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOn: { backgroundColor: '#15803D' },
  checkboxOff: { borderWidth: 1.5 },
  checkmark: { color: '#fff', fontSize: 15, fontWeight: '700' },
  continueBar: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  continueBtn: {
    backgroundColor: ORANGE,
    borderRadius: 28,
    paddingVertical: 20,
    alignItems: 'center',
  },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});

// Form step styles
const formStyles = StyleSheet.create({
  header: {
    backgroundColor: AMBER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cancelBtn: { paddingRight: 8 },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#1C1917' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1C1917', flex: 1, textAlign: 'center' },
  headerDate: { fontSize: 14, fontWeight: '600', color: '#1C1917' },
  scroll: { flex: 1 },
  hiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  hiveName: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  hiveSubtitle: { fontSize: 12, marginBottom: 2 },
  hiveDate: { fontSize: 13 },
  changeBtn: { paddingHorizontal: 4 },
  changeBtnText: { fontSize: 14, fontWeight: '700', color: AMBER_DARK },
  hiveEmoji: { fontSize: 34 },
  fieldBlock: { paddingHorizontal: 16, paddingBottom: 16 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  fieldEmoji: { fontSize: 20 },
  fieldLabel: { fontSize: 17, fontWeight: '700' },
  subInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
    lineHeight: 22,
  },
  notesInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 16,
    minHeight: 120,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  discardBtn: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1.5,
    paddingVertical: 20,
    alignItems: 'center',
  },
  discardText: { fontSize: 16, fontWeight: '700' },
  saveBtn: {
    flex: 2,
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
  row: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  btn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    minWidth: 60,
  },
  btnText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
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
