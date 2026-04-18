import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
          `&current=temperature_2m,weathercode&temperature_unit=fahrenheit&timezone=auto`;

        const res = await fetch(url);
        const json = await res.json();

        const temp = typeof json?.current?.temperature_2m === "number" ? json.current.temperature_2m : null;
        const code = typeof json?.current?.weathercode === "number" ? json.current.weathercode : null;
        const desc = code == null ? null : mapWeatherCodeToLabel(code);

        if (cancelled) return;
        setTemperatureF(temp);
        setDescription(desc);
      } catch (e) {
        console.error("Home weather fetch error", e);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const widgets = [
    //add more widgets here
    { title: "Weather", body: "" },
    { title: "Widget Two", body: "text for the second widget." },
    { title: "Widget Three", body: "text for the third widget." },
  ];

  const tempText =
    typeof temperatureF === "number" ? `${Math.round(temperatureF)}°F` : "--°F";
  const descText = description ?? "";

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