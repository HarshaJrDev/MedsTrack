import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GetLocationBranch = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const webViewRef = useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
          #map { width: 100vw; height: 100vh; }
        </style>
      </head>
      <body>
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
                    type: 'LOCATION_SELECTED',
                    lat, lon, fullAddress, landmark, pincode 
                  }));
                }
              })
              .catch(error => console.error('Error fetching address:', error));
          }

          map.on('click', function(e) { addMarker(e.latlng.lat, e.latlng.lng); });

          window.ReactNativeWebView.postMessage("MAP_LOADED");
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event) => {
    if (event.nativeEvent.data === "MAP_LOADED") {
      setIsLoading(false);
    } else {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        console.log("Received Data:", data);
        
        if (data.type === 'LOCATION_SELECTED') {
          setSelectedLocation({
            lat: data.lat,
            lon: data.lon,
            address: data.fullAddress,
            landmark: data.landmark,
            pincode: data.pincode
          });
          setLocationAddress(data.fullAddress);
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Error parsing WebView message:", error);
      }
    }
  };

  const handleConfirmLocation = () => {
    setModalVisible(false);
    if (selectedLocation) {
      navigation.replace('BranchLocationConfirmation', selectedLocation);
    } else {
      console.error("No location selected");
    }
  };

  const handleCancelLocation = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        ref={webViewRef}
        source={{ html: htmlContent }} 
        style={styles.webView} 
        onMessage={handleMessage} 
        javaScriptEnabled
        domStorageEnabled
        geolocationEnabled
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Location</Text>
            <Text style={styles.locationAddress} numberOfLines={3}>{locationAddress}</Text>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCancelLocation}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleConfirmLocation}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'white'
  },
  webView: {
    flex: 1
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  locationAddress: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  confirmButton: {
    backgroundColor: '#000',
  },
  cancelButtonText: {
    color: '#333'
  },
  confirmButtonText: {
    color: 'white'
  }
});

export default GetLocationBranch;
