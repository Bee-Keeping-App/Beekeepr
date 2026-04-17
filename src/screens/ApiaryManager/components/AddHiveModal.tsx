import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { HiveStatus } from '../../../@types/apiary';
import { addHive } from '../../../services/apiaryService';

const QUEEN_COLORS = ['White', 'Yellow', 'Red', 'Green', 'Blue'];
const STATUS_OPTIONS: Array<{ value: HiveStatus; label: string }> = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
];

type Props = {
  visible: boolean;
  apiaryId: number;
  apiaryName: string;
  onClose: () => void;
  onSubmit: () => void;
};

export function AddHiveModal({ visible, apiaryId, apiaryName, onClose, onSubmit }: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [queenColor, setQueenColor] = useState('Blue');
  const [queenYear, setQueenYear] = useState(String(new Date().getFullYear()));
  const [status, setStatus] = useState<HiveStatus>('healthy');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setName('');
      setQueenColor('Blue');
      setQueenYear(String(new Date().getFullYear()));
      setStatus('healthy');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await addHive(apiaryId, name.trim(), queenColor, Number(queenYear) || new Date().getFullYear(), status);
    setLoading(false);
    onSubmit();
  };

  const canSubmit = name.trim().length > 0 && !loading;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Add Hive — {apiaryName}</Text>

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Hive Name</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Hive #4"
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Queen Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {QUEEN_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.chip,
                  { borderColor: colors.border },
                  queenColor === c && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setQueenColor(c)}
              >
                <Text style={[
                  styles.chipText,
                  { color: colors.muted },
                  queenColor === c && { color: colors.primaryText },
                ]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Queen Year</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            value={queenYear}
            onChangeText={setQueenYear}
            placeholder="e.g. 2024"
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
          />

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Initial Health Status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.chip,
                  { borderColor: colors.border },
                  status === value && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setStatus(value)}
              >
                <Text style={[
                  styles.chipText,
                  { color: colors.muted },
                  status === value && { color: colors.primaryText },
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }, !canSubmit && styles.disabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={[styles.submitText, { color: colors.primaryText }]}>
                {loading ? 'Adding...' : 'Add Hive'}
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
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  chipText: { fontSize: 14, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 15 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  cancelText: { fontWeight: '600' },
  submitBtn: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
