import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const GetLocationBranch = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
          #map { width: 100vw; height: 85vh; }
          #searchBox {
            position: absolute;
            top: 10px; left: 10px; right: 10px;
            z-index: 1000;
            background: white;
            padding: 10px;
            border-radius: 5px;
            display: flex;
          }
          #searchInput {
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
          }
          #searchBtn {
            margin-left: 8px;
            padding: 8px;
            background: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div id="searchBox">
          <input id="searchInput" type="text" placeholder="Search location..." />
          <button id="searchBtn">Search</button>
        </div>
        <div id="map"></div>

        <script>
          var map = L.map('map').setView([12.9716, 77.5946], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          var userMarker;
          function addMarker(lat, lon) {
            if (userMarker) { userMarker.setLatLng([lat, lon]); } 
            else { userMarker = L.marker([lat, lon]).addTo(map); }
            userMarker.bindPopup("Selected Location").openPopup();

            fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lon}&addressdetails=1\`)
              .then(response => response.json())
              .then(data => {
                if (data && data.address) {
                  let addressData = data.address;
                  let fullAddress = data.display_name || "Unknown Address";
                  let landmark = addressData.building || addressData.neighbourhood || "Not Available";
                  let pincode = addressData.postcode || "Not Available";

                  window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    lat, lon, fullAddress, landmark, pincode 
                  }));
                }
              })
              .catch(error => console.error('Error fetching address:', error));
          }

          map.on('click', function(e) { addMarker(e.latlng.lat, e.latlng.lng); });

          document.getElementById("searchBtn").addEventListener("click", function() {
            let query = document.getElementById("searchInput").value;
            if (!query) return;
            fetch(\`https://nominatim.openstreetmap.org/search?format=json&q=\${query}\`)
              .then(response => response.json())
              .then(data => {
                if (data.length > 0) {
                  let { lat, lon, display_name } = data[0];
                  map.setView([lat, lon], 14);
                  addMarker(lat, lon);
                } else {
                  alert("Location not found. Try another search.");
                }
              });
          });

          window.ReactNativeWebView.postMessage("MAP_LOADED");
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event) => {
    if (event.nativeEvent.data === "MAP_LOADED") {
      setLoading(false);
    } else {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        console.log("Received Data:", data);
        navigation.replace('BranchLocationConfirmation', data);
      } catch (error) {
        console.error("Error parsing WebView message:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.infoText}>📍 Please Mark Branch Location Here</Text>
        <WebView 
          originWhitelist={['*']} 
          source={{ html: htmlContent }} 
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "column-reverse", // Makes the text appear above the map
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    color: "#007BFF",
  },
  webview: {
    flex: 1,
    opacity: 1, // Ensures the WebView is visible
  },
});

export default GetLocationBranch;
