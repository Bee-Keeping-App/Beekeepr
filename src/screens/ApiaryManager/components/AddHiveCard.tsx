import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeContext';

type Props = { onPress: () => void };

export function AddHiveCard({ onPress }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={[styles.label, { color: colors.muted }]}>+ Add Hive</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 15, fontWeight: '500' },
});
