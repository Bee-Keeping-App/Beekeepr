import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopBar() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.leftText}>Beekeepr</Text>
        <Text style={styles.rightText}>Temp Placeholder</Text>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#e3ad19",
  },
  container: {
    height: 56,
    backgroundColor: "#e3ad19",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) * 0 : 0,
  },
  leftText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  rightText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});