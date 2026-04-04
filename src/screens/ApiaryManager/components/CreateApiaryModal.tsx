import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';
import { createApiary } from '../../../services/apiaryService';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function CreateApiaryModal({ visible, onClose, onSubmit }: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setName('');
      setLocation('');
      setCoordinates('');
      setNotes('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim()) return;
    setLoading(true);
    await createApiary(
      name.trim(),
      location.trim(),
      coordinates.trim() || undefined,
      notes.trim() || undefined,
    );
    setLoading(false);
    onSubmit();
  };

  const canSubmit = name.trim().length > 0 && location.trim().length > 0 && !loading;

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
          <Text style={[styles.title, { color: colors.text }]}>Create New Apiary</Text>

          {([
            { label: 'Apiary Name *', value: name, setter: setName, placeholder: 'e.g. North Apiary' },
            { label: 'Location *', value: location, setter: setLocation, placeholder: 'e.g. Backyard – North Corner' },
            { label: 'GPS Coordinates (optional)', value: coordinates, setter: setCoordinates, placeholder: 'e.g. 42.7284° N, 73.6918° W' },
          ] as const).map(({ label, value, setter, placeholder }) => (
            <View key={label}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                value={value}
                onChangeText={setter}
                placeholder={placeholder}
                placeholderTextColor={colors.muted}
              />
            </View>
          ))}

          <Text style={[styles.fieldLabel, { color: colors.muted }]}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.multiline, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            placeholder="Additional notes..."
            placeholderTextColor={colors.muted}
            textAlignVertical="top"
          />

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
                {loading ? 'Creating...' : 'Create'}
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
  sheet: { maxHeight: '80%', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sheetContent: { padding: 20, paddingBottom: 32, gap: 10 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 15, marginBottom: 4 },
  multiline: { minHeight: 80 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  cancelText: { fontWeight: '600' },
  submitBtn: { flex: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
