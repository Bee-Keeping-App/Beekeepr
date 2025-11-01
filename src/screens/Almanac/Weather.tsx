import * as React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
// Native only:
import { WebView } from 'react-native-webview';

//this doesnt work yet, gotta figure out enviromental variables
const OPENWEATHER_KEY = WEATHER_API_KEY;

const html = (key: string) => `<!doctype html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#map{height:100%;margin:0}.leaflet-control-attribution{font-size:10px}</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>

const map = L.map('map',{worldCopyJump:true}).setView([20,0],2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap'}).addTo(map);

const radar = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${key}',{opacity:1.0}).addTo(map);

L.control.layers(null,{'Radar (OpenWeather)':radar}).addTo(map);

</script>
</body></html>`;

export function WeatherMap() {
  if (Platform.OS === 'web') {
    // Web: use a plain iframe
    return (
      // @ts-ignore — allow web DOM element in RN Web build
      <iframe
        srcDoc={html(OPENWEATHER_KEY)}
        style={{
          border: 0,
          width: '100%',
          height: '100vh', // fill viewport
          display: 'block',
          background: '#000',
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    );
  }

  // iOS/Android: use WebView
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: html(OPENWEATHER_KEY) }}
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        allowsInlineMediaPlayback
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});