import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";


export default function Home() {
  const widgets = [
    //add more widgets here
    { title: "Widget One", body: "text for the first widget." },
    { title: "Widget Two", body: "text for the second widget." },
    { title: "Widget Three", body: "text for the third widget." },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {
        /*header text*/}
        <View style={styles.header}>
          {/*title of page*/}
          <Text style={styles.title}>Good Morning, John</Text>
          <Text style={styles.description}>
            {/*description of page*/}
            Here's what's happening in your apiary today.
          </Text>
        </View>

        {/*widget contents*/}
        <View style={styles.widgets}>
          {widgets.map((w) => (
            <View key={w.title} style={styles.widget}>
              <Text style={styles.widgetTitle}>{w.title}</Text>
              <Text style={styles.widgetBody}>{w.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#111",
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: "#555",
  },
  widgets: {
    gap: 12,
  },
  widget: {
    width: "100%",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  widgetBody: {
    fontSize: 14,
    lineHeight: 19,
    color: "#444",
  },
});