import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { LogEventType } from '../../../@types/apiary';
import { logHiveEvent } from '../../../services/apiaryService';

const EVENT_TYPES: Array<{ value: LogEventType; label: string }> = [
  { value: 'inspection', label: 'Inspection' },
  { value: 'feeding', label: 'Feeding' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'observation', label: 'Observation' },
];

type Props = {
  visible: boolean;
  hiveId: number;
  hiveName: string;
  onClose: () => void;
  onSubmit: () => void;
};

export function HiveLogModal({ visible, hiveId, hiveName, onClose, onSubmit }: Props) {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState<LogEventType>('inspection');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelectedType('inspection');
      setNotes('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    setLoading(true);
    await logHiveEvent(hiveId, selectedType, notes);
    setLoading(false);
    onSubmit();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Log Event — {hiveName}</Text>

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Event Type</Text>
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

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Notes (optional)</Text>
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
              style={[styles.submitBtn, { backgroundColor: colors.primary }, loading && styles.disabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={[styles.submitText, { color: colors.primaryText }]}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  fieldLabel: { fontSize: 13, fontWeight: '500' },
  chipRow: { flexGrow: 0 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  chipText: { fontSize: 14, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 80 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  cancelText: { fontWeight: '600' },
  submitBtn: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
