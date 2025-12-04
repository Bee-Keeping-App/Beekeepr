//1) A 7-day forecast bar for Troy (I need to make it automatically get the long/lat of the user)
//2) A radar map in the bottom 4/5 of the screen.

import * as React from 'react';
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View,} from 'react-native';
import { WebView } from 'react-native-webview';

//get key from env
const OPENWEATHER_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY ?? '';

//Hard-coded coordinates for troy
const TROY_LAT = 42.7284;
const TROY_LON = -73.6918;

//one day of forecast data
type ForecastDay = { date: string; max: number; min: number; code: number;};

//This builds the HTML string that Leaflet will use to render the radar map.
//It centers the map on Troy, adds an OSM baselayer, and a precipitation overlay
//from OpenWeather as a tile layer.
const mapHtml = (key: string) => `<!doctype html>
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
  const map = L.map('map',{worldCopyJump:true}).setView([${TROY_LAT}, ${TROY_LON}], 11);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap'
  }).addTo(map);

  const radar = L.tileLayer(
    'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${key}',
    { opacity: 0.8 }
  ).addTo(map);

  L.control.layers(null,{'Radar (OpenWeather)':radar}).addTo(map);
</script>
</body></html>`;

//Converts Open-Meteo “weathercode” weather data into readable descriptions
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

//Turns date format into fdays of the week
function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

//Formats date as MM/DD (no year) for the small label under the weekday.
function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
}

export function WeatherMap() {
  //Forecast state
  const [forecast, setForecast] = React.useState<ForecastDay[]>([]);
  //loading + error flags
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  //On mount: call the Open-Meteo API once, parse the JSON,
  //and store the first 7 days in state.
  React.useEffect(() => {
    const fetchForecast = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${TROY_LAT}&longitude=${TROY_LON}&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=auto`.replace(/\s+/g, '');
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
        setError(null);
      } catch (e) {
        console.error('Forecast fetch error', e);
        setError('Failed to load forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  //Renders the top “forecast bar” section.
  const renderForecastContent = () => {
    if (loading) {
      return (
        <View style={styles.forecastCenter}>
          <ActivityIndicator />
          <Text style={styles.forecastLoadingText}>Loading forecast…</Text>
        </View>
      );
    }

    if (error || forecast.length === 0) {
      return (
        <View style={styles.forecastCenter}>
          <Text style={styles.forecastErrorText}>
            {error || 'No forecast data'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastScrollContent}
      >
        {forecast.map((day) => (
          <View key={day.date} style={styles.forecastBox}>
            <Text style={styles.forecastDay}>{formatDayLabel(day.date)}</Text>
            <Text style={styles.forecastDate}>{formatDateLabel(day.date)}</Text>
            <Text style={styles.forecastTemp}>
              {Math.round(day.max)}°
            </Text>
            <Text style={styles.forecastMin}>
              L {Math.round(day.min)}°
            </Text>
            <Text style={styles.forecastDesc}>
              {mapWeatherCodeToLabel(day.code)}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  //Renders the bottom map section.
  //On web we use a raw <iframe>, on native we use a WebView, but both show the same HTML map.
  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <iframe
          srcDoc={mapHtml(OPENWEATHER_KEY)}
          style={styles.webMapIframe as any}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

    //Native: WebView to render the same Leaflet HTML.
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml(OPENWEATHER_KEY) }}
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        allowsInlineMediaPlayback
      />
    );
  };

  //top 1/5th of the screen is the forecast, bottom is the map
  return (
    <View style={styles.screen}>
      <View style={styles.forecastSection}>{renderForecastContent()}</View>
      <View style={styles.mapSection}>{renderMap()}</View>
    </View>
  );
}

//Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  //Container for the top forecast area
  forecastSection: {
    flex: 1, //1/5 of the screen for forecast
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#050505',
  },
  //layout used for loading/error
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
  //styling for the horizontal scrolling
  forecastScrollContent: {
    alignItems: 'stretch',
    gap: 8,
  },
  //forecast care for each day
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
  //map 4/5 bottom screen
  mapSection: {
    flex: 4,
    backgroundColor: '#000',
  },
  //Styles for the web iframe
  webMapIframe: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});
