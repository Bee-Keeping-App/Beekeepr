import * as React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useTheme } from '../../Contexts/ThemeContext';

const OPENWEATHER_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY ?? '';

const DEFAULT_LAT = 42.7284;
const DEFAULT_LON = -73.6918;
const DEFAULT_LOCATION_NAME = 'Troy, NY';

const AMBER = '#F59E0B';
const SKY_BLUE = '#0EA5E9';

type ForecastDay = { date: string; max: number; min: number; code: number };

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
  const overlays = {};
  const hereMarker = L.marker([${lat}, ${lon}]).bindPopup('Your location');
  const hereLayer = L.layerGroup([hereMarker]).addTo(map);
  overlays['Your location'] = hereLayer;
  const key = ${JSON.stringify(key || '')};
  if (key) {
    const radar = L.tileLayer(
      'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=' + key,
      { opacity: 0.8 }
    ).addTo(map);
    overlays['Radar'] = radar;
    const temp = L.tileLayer(
      'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=' + key,
      { opacity: 0.55 }
    ).addTo(map);
    overlays['Temperature'] = temp;
  }
  L.control.layers(null, overlays).addTo(map);
</script>
</body></html>`;

function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function weatherCodeToLabel(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 55) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow Showers';
  return 'Thunderstorm';
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr;
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function WeatherMap() {
  const { colors } = useTheme();
  const [forecast, setForecast] = React.useState<ForecastDay[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [locationName, setLocationName] = React.useState(DEFAULT_LOCATION_NAME);
  const [error, setError] = React.useState<string | null>(null);
  const [lat, setLat] = React.useState(DEFAULT_LAT);
  const [lon, setLon] = React.useState(DEFAULT_LON);
  const [activeTab, setActiveTab] = React.useState<'forecast' | 'map'>('forecast');

  React.useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied — showing Troy, NY.');
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);

        const geo = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        if (geo.length > 0) {
          const g = geo[0];
          const parts = [g.city ?? g.subregion, g.region].filter(Boolean);
          if (parts.length > 0) setLocationName(parts.join(', '));
        }
        setError(null);
      } catch {
        setError('Unable to get location — showing Troy, NY.');
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
          `&temperature_unit=fahrenheit&timezone=auto`;
        const res = await fetch(url);
        const json = await res.json();
        const days: ForecastDay[] = (json.daily?.time ?? []).map((date: string, i: number) => ({
          date,
          max: json.daily.temperature_2m_max[i],
          min: json.daily.temperature_2m_min[i],
          code: json.daily.weathercode[i],
        }));
        setForecast(days.slice(0, 7));
      } catch {
        setError((prev) => prev ?? 'Failed to load forecast.');
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon]);

  const today = forecast[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AMBER }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={AMBER} />

      {/* Amber Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>beekeepr</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerWeatherIcon}>☀️</Text>
          <Text style={styles.headerTemp}>
            {today ? `${Math.round(today.max)}°F` : '—'}
          </Text>
        </View>
      </View>

      <View style={[styles.body, { backgroundColor: colors.surface }]}>
        {/* Location + current summary */}
        <View style={[styles.currentCard, { backgroundColor: SKY_BLUE }]}>
          <View>
            <View style={styles.locationRow}>
              <Text style={styles.pinEmoji}>📍</Text>
              <Text style={styles.locationName}>{locationName}</Text>
            </View>
            <Text style={styles.currentTemp}>
              {today ? `${Math.round(today.max)}°F` : '—'}
            </Text>
            <Text style={styles.currentCondition}>
              {today ? weatherCodeToLabel(today.code) : 'Loading…'}
            </Text>
          </View>
          <Text style={styles.currentEmoji}>
            {today ? weatherCodeToEmoji(today.code) : '🌤️'}
          </Text>
        </View>

        {error ? (
          <View style={[styles.bannerRow, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.bannerText}>⚠️  {error}</Text>
          </View>
        ) : null}

        {/* Tabs: Forecast / Radar Map */}
        <View style={[styles.tabBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {(['forecast', 'map'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && { backgroundColor: AMBER }]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, { color: activeTab === t ? '#1C1917' : colors.muted }]}>
                {t === 'forecast' ? '📅  7-Day Forecast' : '🗺  Radar Map'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === 'forecast' ? (
          <View style={styles.forecastContainer}>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator color={AMBER} size="large" />
                <Text style={[styles.loadingText, { color: colors.muted }]}>Loading forecast…</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {forecast.map((day, idx) => (
                  <View
                    key={day.date}
                    style={[
                      styles.forecastRow,
                      { borderBottomColor: colors.border },
                      idx === 0 && { backgroundColor: colors.surface },
                    ]}
                  >
                    <View style={styles.forecastLeft}>
                      <Text style={[styles.forecastDay, { color: colors.text }, idx === 0 && { fontWeight: '800' }]}>
                        {formatDayLabel(day.date)}
                      </Text>
                      <Text style={[styles.forecastDate, { color: colors.muted }]}>
                        {formatDateLabel(day.date)}
                      </Text>
                    </View>
                    <Text style={styles.forecastEmoji}>{weatherCodeToEmoji(day.code)}</Text>
                    <Text style={[styles.forecastCondition, { color: colors.muted }]}>
                      {weatherCodeToLabel(day.code)}
                    </Text>
                    <View style={styles.forecastTemps}>
                      <Text style={[styles.forecastHigh, { color: colors.text }]}>
                        {Math.round(day.max)}°
                      </Text>
                      <Text style={[styles.forecastLow, { color: colors.muted }]}>
                        {Math.round(day.min)}°
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Beekeeping insight card */}
                <View style={[styles.insightCard, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.insightTitle}>🐝  Beekeeping Outlook</Text>
                  <Text style={styles.insightBody}>
                    {today && today.max >= 60
                      ? `Good conditions for hive inspections. Temps reaching ${Math.round(today.max)}°F — bees will be active and foraging.`
                      : `Cool conditions ahead. Limit hive openings and ensure adequate winter stores. Inspect only on warmer afternoons.`}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: mapHtml(OPENWEATHER_KEY, lat, lon) }}
              setSupportMultipleWindows={false}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              allowsInlineMediaPlayback
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: AMBER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLogo: { fontSize: 20, fontWeight: '800', color: '#1C1917', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerWeatherIcon: { fontSize: 15 },
  headerTemp: { fontSize: 15, fontWeight: '600', color: '#1C1917' },

  body: { flex: 1 },

  currentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  pinEmoji: { fontSize: 14 },
  locationName: { color: '#fff', fontSize: 14, fontWeight: '600', opacity: 0.9 },
  currentTemp: { color: '#fff', fontSize: 52, fontWeight: '800', lineHeight: 58 },
  currentCondition: { color: '#fff', fontSize: 16, opacity: 0.9 },
  currentEmoji: { fontSize: 64 },

  bannerRow: {
    marginHorizontal: 16,
    marginTop: -4,
    marginBottom: 8,
    borderRadius: 10,
    padding: 10,
  },
  bannerText: { color: '#92400E', fontSize: 13 },

  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabText: { fontSize: 14, fontWeight: '600' },

  forecastContainer: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingText: { fontSize: 14 },

  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  forecastLeft: { width: 72 },
  forecastDay: { fontSize: 14, fontWeight: '600' },
  forecastDate: { fontSize: 12, marginTop: 1 },
  forecastEmoji: { fontSize: 24, width: 36, textAlign: 'center' },
  forecastCondition: { flex: 1, fontSize: 13, paddingLeft: 8 },
  forecastTemps: { alignItems: 'flex-end' },
  forecastHigh: { fontSize: 16, fontWeight: '700' },
  forecastLow: { fontSize: 13 },

  insightCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  insightTitle: { fontSize: 15, fontWeight: '800', color: '#92400E', marginBottom: 6 },
  insightBody: { fontSize: 14, color: '#92400E', lineHeight: 21 },

  mapContainer: { flex: 1, marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
});
