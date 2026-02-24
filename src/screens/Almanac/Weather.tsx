import * as React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

// get key from env
const OPENWEATHER_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY ?? '';

// Fallback coordinates (Troy) used if permission denied / location unavailable
const DEFAULT_LAT = 42.7284;
const DEFAULT_LON = -73.6918;

// one day of forecast data
type ForecastDay = { date: string; max: number; min: number; code: number };

// Leaflet HTML for radar map, centered at provided lat/lon.
// If no OpenWeather key is present, it shows just the OSM basemap (no radar overlay).
const mapHtml = (key: string, lat: number, lon: number) => `<!doctype html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  html,body,#map{height:100%;margin:0}
  .leaflet-control-attribution{font-size:10px}
</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map',{worldCopyJump:true}).setView([${lat}, ${lon}], 11);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap'
  }).addTo(map);

  // Build an overlays collection for the layer control.
  const overlays = {};

  // Current location marker layer (ON by default)
  const hereMarker = L.marker([${lat}, ${lon}]).bindPopup('Current location');
  const hereLayer = L.layerGroup([hereMarker]).addTo(map);
  overlays['Current location'] = hereLayer;

  const key = ${JSON.stringify(key || '')};
  if (key) {
    // Radar / precipitation (ON by default)
    const radar = L.tileLayer(
      'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=' + key,
      { opacity: 0.8 }
    ).addTo(map);
    overlays['Radar (OpenWeather)'] = radar;

    // Temperature (ON by default)
    const temp = L.tileLayer(
      'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=' + key,
      { opacity: 0.55 }
    ).addTo(map);
    overlays['Temperature (OpenWeather)'] = temp;
  }

  // Layer toggle UI (all overlays that were .addTo(map) start checked)
  L.control.layers(null, overlays).addTo(map);
</script>
</body></html>`;

function mapWeatherCodeToLabel(code: number): string {
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2) return 'Partly cloudy';
  if (code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Fog';
  if (code === 51 || code === 53 || code === 55) return 'Drizzle';
  if (code === 56 || code === 57) return 'Freezing drizzle';
  if (code === 61 || code === 63 || code === 65) return 'Rain';
  if (code === 66 || code === 67) return 'Freezing rain';
  if (code === 71 || code === 73 || code === 75) return 'Snow';
  if (code === 77) return 'Snow grains';
  if (code === 80 || code === 81 || code === 82) return 'Showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96 || code === 99) return 'Thunder + hail';
  return 'N/A';
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
}

export function WeatherMap() {
  const [forecast, setForecast] = React.useState<ForecastDay[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Current coordinates used by both forecast + map
  const [lat, setLat] = React.useState<number>(DEFAULT_LAT);
  const [lon, setLon] = React.useState<number>(DEFAULT_LON);

  // 1) On mount: request permission and attempt to read current location.
  // If denied/unavailable, we keep DEFAULT_* (Troy).
  React.useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied; showing Troy, NY.');
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        setError(null);
      } catch (e) {
        console.error('Location error', e);
        setError('Unable to get current location; showing Troy, NY.');
      }
    };

    getLocation();
  }, []);

  // 2) Whenever lat/lon changes, fetch the forecast for that location.
  React.useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
          `&temperature_unit=fahrenheit&timezone=auto`;

        const res = await fetch(url);
        const json = await res.json();

        const days: ForecastDay[] = (json.daily?.time || []).map(
          (date: string, idx: number) => ({
            date,
            max: json.daily.temperature_2m_max[idx],
            min: json.daily.temperature_2m_min[idx],
            code: json.daily.weathercode[idx],
          })
        );

        setForecast(days.slice(0, 7));
        // don't wipe an existing location warning unless the fetch succeeded with real coords
      } catch (e) {
        console.error('Forecast fetch error', e);
        setError((prev) => prev ?? 'Failed to load forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon]);

  const renderForecastContent = () => {
    if (loading) {
      return (
        <View style={styles.forecastCenter}>
          <ActivityIndicator />
          <Text style={styles.forecastLoadingText}>Loading forecast…</Text>
        </View>
      );
    }

    if (forecast.length === 0) {
      return (
        <View style={styles.forecastCenter}>
          <Text style={styles.forecastErrorText}>{error || 'No forecast data'}</Text>
        </View>
      );
    }

    return (
      <>
        {error ? <Text style={styles.forecastBanner}>{error}</Text> : null}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.forecastScrollContent}
        >
          {forecast.map((day) => (
            <View key={day.date} style={styles.forecastBox}>
              <Text style={styles.forecastDay}>{formatDayLabel(day.date)}</Text>
              <Text style={styles.forecastDate}>{formatDateLabel(day.date)}</Text>
              <Text style={styles.forecastTemp}>{Math.round(day.max)}°</Text>
              <Text style={styles.forecastMin}>L {Math.round(day.min)}°</Text>
              <Text style={styles.forecastDesc}>{mapWeatherCodeToLabel(day.code)}</Text>
            </View>
          ))}
        </ScrollView>
      </>
    );
  };

  // render native WebView.
  const renderMap = () => {
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml(OPENWEATHER_KEY, lat, lon) }}
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        allowsInlineMediaPlayback
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.forecastSection}>{renderForecastContent()}</View>
      <View style={styles.mapSection}>{renderMap()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  forecastSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#050505',
  },
  forecastCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastLoadingText: {
    marginTop: 8,
    color: '#ccc',
    fontSize: 14,
  },
  forecastErrorText: {
    color: '#f88',
    fontSize: 14,
  },
  forecastBanner: {
    color: '#ddd',
    fontSize: 12,
    marginBottom: 6,
  },
  forecastScrollContent: {
    alignItems: 'stretch',
    gap: 8,
  },
  forecastBox: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'space-between',
  },
  forecastDay: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 2,
  },
  forecastDate: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  forecastTemp: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  forecastMin: {
    color: '#888',
    fontSize: 12,
  },
  forecastDesc: {
    color: '#ccc',
    fontSize: 11,
    marginTop: 4,
  },
  mapSection: {
    flex: 4,
    backgroundColor: '#000',
  },
});
