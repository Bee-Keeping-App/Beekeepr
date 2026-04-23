import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Location from "expo-location";

//use troy coordinates as a fallback
const DEFAULT_LAT = 42.7284;
const DEFAULT_LON = -73.6918;

export default function TopBar() {
  const [temperatureF, setTemperatureF] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
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
          //ignore
        }
        //open-meteo api
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m&temperature_unit=fahrenheit&timezone=auto`;

        const res = await fetch(url);
        const json = await res.json();
        const temp = typeof json?.current?.temperature_2m === "number" ? json.current.temperature_2m : null;

        if (cancelled) return;
        setTemperatureF(temp);
      } catch (e) {
        console.error("TopBar weather fetch error", e);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const tempText = typeof temperatureF === "number" ? `${Math.round(temperatureF)}°` : "--°";

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.leftText}>Beekeepr</Text>
        <Text style={styles.rightText}>{tempText}</Text>
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