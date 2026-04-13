import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";


export default function Home({ navigation }: any) {
  const widgets = [
    //add more widgets here
    { title: "Weather", body: "Click me to get to the weather page" },
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
          <Text style={styles.subtitle}>Reminders</Text>
          <Text style={styles.description}>
            {/*description of page*/}
            Here's what's happening in your apiary today.
          </Text>
        </View>

        {/*settings and reminder widgets*/}
        <View style={styles.duoRow}>
          <View style={styles.duoSquare}>
            <Text style={styles.duoTitle}>Settings</Text>
          </View>
          <View style={styles.duoRect}>
            <Text style={styles.duoTitle}>Reminders</Text>
          </View>
        </View>

        {/*widget contents*/}
        <View style={styles.widgets}>
          {widgets.map((w) => (
            <React.Fragment key={w.title}>
              {w.title === "Weather" ? (
                <Pressable
                  style={styles.widget}
                  onPress={() => navigation.navigate("Weather")}
                >
                  <Text style={styles.widgetTitle}>{w.title}</Text>
                  <Text style={styles.widgetBody}>{w.body}</Text>
                </Pressable>
              ) : (
                <View style={styles.widget}>
                  <Text style={styles.widgetTitle}>{w.title}</Text>
                  <Text style={styles.widgetBody}>{w.body}</Text>
                </View>
              )}
            </React.Fragment>
          ))}
        </View>

        {/*calender widget with subsquares for the reminders, will have to be dynamic*/}
        <View style={styles.longWidget}>
          <Text style={styles.widgetTitle}>Calender</Text>
          <View style={styles.subSquares}>
            <View style={styles.subSquare} />
            <View style={styles.subSquare} />
            <View style={styles.subSquare} />
            <View style={styles.subSquare} />
            <View style={styles.subSquare} />
            <View style={styles.subSquare} />
          </View>
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
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
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
  duoRow: {
    width: "66%",
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  duoSquare: {
    width: 64,
    height: 64,
    borderRadius: 14,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    marginRight: 12,
  },
  duoRect: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
  },
  duoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
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
  longWidget: {
    width: "100%",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 12,
  },
  subSquares: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  subSquare: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 10,
    marginBottom: 10,
  },
});