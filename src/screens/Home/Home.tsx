import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { lightColors } from "../../styles/colors";
import * as Location from "expo-location";

//use troy coordinates as a fallback
const DEFAULT_LAT = 42.7284;
const DEFAULT_LON = -73.6918;

function mapWeatherCodeToLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 56 || code === 57) return "Freezing drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 66 || code === 67) return "Freezing rain";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 77) return "Snow grains";
  if (code === 80 || code === 81 || code === 82) return "Showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunder + hail";
  return "N/A";
}


export default function Home({ navigation }: any) {
  const [temperatureF, setTemperatureF] = React.useState<number | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [humidity, setHumidity] = React.useState<number | null>(null);
  const [windSpeed, setWindSpeed] = React.useState<number | null>(null);

  const scrollRef = React.useRef<ScrollView>(null);
  const remindersYRef = React.useRef(0);

  type Reminder = {
    id: string;
    title: string;
    description: string;
  };

  const [reminders, setReminders] = React.useState<Reminder[]>([
    { id: "r1", title: "Inspect Hive #3", description: "Check brood pattern and food stores." },
    { id: "r2", title: "Mite Treatment", description: "Prep supplies and plan application." },
    { id: "r3", title: "Equipment Maintenance", description: "Clean smoker and inspect tools." },
  ]);
  const [isAddingReminder, setIsAddingReminder] = React.useState(false);
  const [newReminderTitle, setNewReminderTitle] = React.useState("");
  const [newReminderDescription, setNewReminderDescription] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      let lat = DEFAULT_LAT;
      let lon = DEFAULT_LON;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        }
      } catch {
        //fallback
      }

      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weathercode,relative_humidity_2m,wind_speed_10m` +
          `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

        const res = await fetch(url);
        const json = await res.json();

        const temp = typeof json?.current?.temperature_2m === "number" ? json.current.temperature_2m : null;
        const code = typeof json?.current?.weathercode === "number" ? json.current.weathercode : null;
        const hum = typeof json?.current?.relative_humidity_2m === "number" ? json.current.relative_humidity_2m : null;
        const wind = typeof json?.current?.wind_speed_10m === "number" ? json.current.wind_speed_10m : null;
        const desc = code == null ? null : mapWeatherCodeToLabel(code);

        if (cancelled) return;
        setTemperatureF(temp);
        setDescription(desc);
        setHumidity(hum);
        setWindSpeed(wind);
      } catch (e) {
        console.error("Home weather fetch error", e);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const tempText =
    typeof temperatureF === "number" ? `${Math.round(temperatureF)}°F` : "--°F";
  const descText = description ?? "";
  const humidityText =
    typeof humidity === "number" ? `${Math.round(humidity)}%` : "--%";
  const windText =
    typeof windSpeed === "number" ? `${Math.round(windSpeed)} mph` : "-- mph";

  const widgets = [
    //add more widgets here
    { title: "Weather", body: "" },
    { title: "Humidity", body: humidityText },
    { title: "Wind speed", body: windText },
  ];

  const addReminder = () => {
    const title = newReminderTitle.trim();
    const desc = newReminderDescription.trim();
    if (!title) return;

    setReminders((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        description: desc,
      },
    ]);
    setNewReminderTitle("");
    setNewReminderDescription("");
    setIsAddingReminder(false);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const openAddReminder = () => {
    setIsAddingReminder(true);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: remindersYRef.current, animated: true });
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
          <Pressable style={styles.duoRect} onPress={openAddReminder}>
            <Text style={styles.duoTitle}>Add Reminder</Text>
          </Pressable>
        </View>

        {/*widget contents*/}
        <View style={styles.widgets}>
          {widgets.map((w) => (
            <React.Fragment key={w.title}>
              {w.title === "Weather" ? (
                <Pressable
                  style={styles.weatherWidget}
                  onPress={() => navigation.navigate("Weather")}
                >
                  <Text style={styles.weatherHeader}>Current Weather</Text>
                  <Text style={styles.weatherTemp}>{tempText}</Text>
                  {descText ? (
                    <Text style={styles.weatherDesc}>{descText}</Text>
                  ) : null}
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

        {/*reminders section*/}
        <View
          style={styles.remindersSection}
          onLayout={(e) => {
            remindersYRef.current = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.remindersHeaderRow}>
            <Text style={styles.remindersHeader}>Reminders</Text>
          </View>

          {isAddingReminder ? (
            <View style={styles.addReminderCard}>
              <Text style={styles.addReminderLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={newReminderTitle}
                onChangeText={setNewReminderTitle}
                placeholder="Reminder title"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="sentences"
              />
              <Text style={styles.addReminderLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={newReminderDescription}
                onChangeText={setNewReminderDescription}
                placeholder="Reminder description"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="sentences"
                multiline
              />

              <View style={styles.addReminderActions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => {
                    setIsAddingReminder(false);
                    setNewReminderTitle("");
                    setNewReminderDescription("");
                  }}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionButton,
                    !newReminderTitle.trim() ? styles.actionButtonDisabled : null,
                  ]}
                  onPress={addReminder}
                  disabled={!newReminderTitle.trim()}
                >
                  <Text style={styles.actionButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          <View style={styles.remindersList}>
            {reminders.map((r) => (
              <View key={r.id} style={styles.reminderCard}>
                <View style={styles.reminderTopRow}>
                  <Text style={styles.reminderTitle}>{r.title}</Text>
                  <Pressable
                    onPress={() => deleteReminder(r.id)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete reminder ${r.title}`}
                    style={styles.reminderDeleteButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#111" />
                  </Pressable>
                </View>
                {!!r.description && (
                  <Text style={styles.reminderDescription}>{r.description}</Text>
                )}
              </View>
            ))}
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
  remindersSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  remindersHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  remindersHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  remindersList: {
    gap: 10,
  },
  reminderCard: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  reminderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 4,
  },
  reminderDeleteButton: {
    padding: 4,
  },
  reminderDescription: {
    fontSize: 14,
    lineHeight: 19,
    color: "#444",
  },
  addReminderCard: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  addReminderLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    color: "#111",
    marginBottom: 10,
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  addReminderActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  weatherWidget: {
    width: "100%",
    borderRadius: 14,
    padding: 16,
    backgroundColor: lightColors.primary,
  },
  weatherHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: lightColors.primaryText,
    marginBottom: 10,
  },
  weatherTemp: {
    fontSize: 52,
    fontWeight: "800",
    color: lightColors.primaryText,
    lineHeight: 56,
    marginBottom: 6,
  },
  weatherDesc: {
    fontSize: 16,
    fontWeight: "600",
    color: lightColors.primaryText,
    opacity: 0.9,
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