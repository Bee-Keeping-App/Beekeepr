import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { lightColors } from "../../styles/colors";

export function LogBook() {
  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Apiary Manager</Text>
          <Text style={styles.description}>
            Manage hives and track your beekeeping journey.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 6,
    color: lightColors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: lightColors.muted,
  },
});