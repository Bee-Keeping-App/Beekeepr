import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { Apiary, Hive, LogEventType } from '../../../@types/apiary';
import { getHivesForApiary, logHiveEvent } from '../../../services/apiaryService';

const EVENT_TYPES: Array<{ value: LogEventType; label: string }> = [
  { value: 'inspection', label: 'Inspection' },
  { value: 'feeding', label: 'Feeding' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'observation', label: 'Observation' },
];

type Props = {
  visible: boolean;
  apiaries: Apiary[];
  onClose: () => void;
  onSubmit: () => void;
};

export function QuickEntryModal({ visible, apiaries, onClose, onSubmit }: Props) {
  const { colors } = useTheme();
  const [selectedApiary, setSelectedApiary] = useState<Apiary | null>(null);
  const [hives, setHives] = useState<Hive[]>([]);
  const [selectedHive, setSelectedHive] = useState<Hive | null>(null);
  const [selectedType, setSelectedType] = useState<LogEventType>('inspection');
  const [notes, setNotes] = useState('');
  const [loadingHives, setLoadingHives] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelectedApiary(null);
      setHives([]);
      setSelectedHive(null);
      setSelectedType('inspection');
      setNotes('');
    }
  }, [visible]);

  useEffect(() => {
    if (selectedApiary) {
      setLoadingHives(true);
      setSelectedHive(null);
      getHivesForApiary(selectedApiary.id).then(data => {
        setHives(data);
        setLoadingHives(false);
      });
    }
  }, [selectedApiary]);

  const handleSubmit = async () => {
    if (!selectedHive) return;
    setSubmitting(true);
    await logHiveEvent(selectedHive.id, selectedType, notes);
    setSubmitting(false);
    onSubmit();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <ScrollView
          style={[styles.sheet, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.text }]}>Quick Entry</Text>

          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Select Apiary</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {apiaries.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[
                  styles.chip,
                  { borderColor: colors.border },
                  selectedApiary?.id === a.id && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setSelectedApiary(a)}
              >
                <Text style={[
                  styles.chipText,
                  { color: colors.muted },
                  selectedApiary?.id === a.id && { color: colors.primaryText },
                ]}>
                  {a.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedApiary && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.muted }]}>Select Hive</Text>
              {loadingHives ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                  {hives.map(h => (
                    <TouchableOpacity
                      key={h.id}
                      style={[
                        styles.chip,
                        { borderColor: colors.border },
                        selectedHive?.id === h.id && { backgroundColor: colors.primary, borderColor: colors.primary },
                      ]}
                      onPress={() => setSelectedHive(h)}
                    >
                      <Text style={[
                        styles.chipText,
                        { color: colors.muted },
                        selectedHive?.id === h.id && { color: colors.primaryText },
                      ]}>
                        {h.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </>
          )}

          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Event Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {EVENT_TYPES.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.chip,
                  { borderColor: colors.border },
                  selectedType === value && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setSelectedType(value)}
              >
                <Text style={[
                  styles.chipText,
                  { color: colors.muted },
                  selectedType === value && { color: colors.primaryText },
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            placeholder="Add notes..."
            placeholderTextColor={colors.muted}
            textAlignVertical="top"
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: colors.primary },
                (!selectedHive || submitting) && styles.disabled,
              ]}
              onPress={handleSubmit}
              disabled={!selectedHive || submitting}
            >
              <Text style={[styles.submitText, { color: colors.primaryText }]}>
                {submitting ? 'Saving...' : 'Log Event'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { maxHeight: '85%', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sheetContent: { padding: 20, paddingBottom: 32, gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  sectionLabel: { fontSize: 13, fontWeight: '500' },
  chipRow: { flexGrow: 0 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  chipText: { fontSize: 14, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 80 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  cancelText: { fontWeight: '600' },
  submitBtn: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
