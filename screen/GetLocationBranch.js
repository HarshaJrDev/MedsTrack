import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GetLocationBranch = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const webViewRef = useRef(null);
  const [isAutoLocationEnabled, setIsAutoLocationEnabled] = useState(false);

  // Function to search for locations
  const searchLocation = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setShowSearchResults(true);
      // Inject search operation into WebView
      const searchScript = `
        fetch('https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}')
          .then(response => response.json())
          .then(data => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'SEARCH_RESULTS',
              results: data.slice(0, 5)
            }));
          })
          .catch(error => console.error('Search error:', error));
      `;
      webViewRef.current.injectJavaScript(searchScript);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // Function to select a search result
  const selectSearchResult = (item) => {
    setShowSearchResults(false);
    setSearchQuery(item.display_name);
    
    // Center map on selected location and create marker
    const goToLocationScript = `
      map.setView([${item.lat}, ${item.lon}], 15);
      createMarker(${item.lat}, ${item.lon});
      true;
    `;
    webViewRef.current.injectJavaScript(goToLocationScript);
  };
  
  // Function to get user's current location - only when button is pressed
  const getCurrentLocation = () => {
    const getUserLocationScript = `
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          map.setView([lat, lon], 15);
          createMarker(lat, lon);
        },
        function(error) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'LOCATION_ERROR',
            message: error.message
          }));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
      true;
    `;
    webViewRef.current.injectJavaScript(getUserLocationScript);
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; }
          #map { width: 100vw; height: 100vh; }
          .ola-pin {
            width: 30px;
            height: 40px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -15px;
            margin-top: -40px;
            z-index: 1000;
            pointer-events: none;
            animation: pin-drop 0.5s ease-out;
          }
          .ola-pin:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 8px;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            filter: blur(2px);
          }
          @keyframes pin-drop {
            0% { transform: translateY(-50px); }
            60% { transform: translateY(5px); }
            100% { transform: translateY(0); }
          }
          .custom-popup .leaflet-popup-content-wrapper {
            background: #4756ca;
            color: white;
            border-radius: 12px;
          }
          .custom-popup .leaflet-popup-tip {
            background: #4756ca;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="ola-pin">
          <svg width="30" height="40" viewBox="0 0 48 64">
            <path d="M24 0C10.7 0 0 10.7 0 24c0 19.2 24 40 24 40s24-20.8 24-40C48 10.7 37.3 0 24 0z" fill="#4756ca"/>
            <circle cx="24" cy="24" r="12" fill="#ffffff"/>
          </svg>
        </div>

        <script>
          // Map initialization with new theme colors
          var map = L.map('map', {
            zoomControl: false, 
            attributionControl: false
          }).setView([12.9716, 77.5946], 13);
          
          // Custom theme tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);
          
          map.on('load', function() {
            window.ReactNativeWebView.postMessage("MAP_LOADED");
          });
          
          var locationMarkers = [];
          
          // Create marker at specific location
          function createMarker(lat, lon) {
            // Clear existing markers
            locationMarkers.forEach(marker => map.removeLayer(marker));
            locationMarkers = [];
            
            // Create custom marker
            var marker = L.marker([lat, lon], {
              icon: L.divIcon({
                html: \`<div>
                        <svg width="30" height="40" viewBox="0 0 48 64">
                          <path d="M24 0C10.7 0 0 10.7 0 24c0 19.2 24 40 24 40s24-20.8 24-40C48 10.7 37.3 0 24 0z" fill="#4756ca"/>
                          <circle cx="24" cy="24" r="12" fill="#ffffff"/>
                        </svg>
                      </div>\`,
                className: 'custom-marker',
                iconSize: [30, 40],
                iconAnchor: [15, 40]
              })
            }).addTo(map);
            
            locationMarkers.push(marker);
            
            // Get address data
            fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&addressdetails=1')
              .then(response => response.json())
              .then(data => {
                if (data && data.address) {
                  let fullAddress = data.display_name || "Unknown Address";
                  let formattedAddress = formatAddress(data.address);
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'LOCATION_SELECTED',
                    lat: lat, 
                    lon: lon, 
                    fullAddress: fullAddress,
                    formattedAddress: formattedAddress,
                    addressComponents: data.address
                  }));
                }
              })
              .catch(error => console.error('Error fetching address:', error));
          }
          
          function formatAddress(addressObj) {
            const components = [];
            if (addressObj.road) components.push(addressObj.road);
            if (addressObj.suburb) components.push(addressObj.suburb);
            if (addressObj.city) components.push(addressObj.city);
            if (addressObj.state) components.push(addressObj.state);
            return components.join(', ');
          }
          
          // Handle manual location selection via map click
          map.on('click', function(e) {
            createMarker(e.latlng.lat, e.latlng.lng);
          });
          
          // Function for select location by center point (used by button)
          function selectCenterLocation() {
            var center = map.getCenter();
            createMarker(center.lat, center.lng);
          }
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === "MAP_LOADED") {
      setLoading(false);
      // NOT automatically getting location on load anymore
    } else {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'SEARCH_RESULTS') {
          setSearchResults(data.results);
        } else if (data.type === 'LOCATION_SELECTED') {
          setSelectedLocation({
            lat: data.lat,
            lon: data.lon,
            fullAddress: data.fullAddress,
            formattedAddress: data.formattedAddress,
            addressComponents: data.addressComponents
          });
          setModalVisible(true);
        } else if (data.type === 'LOCATION_ERROR') {
          console.warn('Location error:', data.message);
        }
      } catch (error) {
        console.error("Error parsing WebView message:", error);
      }
    }
  };

  // Function to confirm the center location
  const confirmCenterLocation = () => {
    const script = `selectCenterLocation(); true;`;
    webViewRef.current.injectJavaScript(script);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4756ca" />
        </View>
      )}
      
      <View style={styles.content}>
        <WebView 
          ref={webViewRef}
          originWhitelist={['*']} 
          source={{ html: htmlContent }} 
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
        />
        
        {/* Ola-styled search bar overlay */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBarWrapper}>
            <Icon name="arrow-back" size={24} color="#000" style={styles.backIcon} 
                  onPress={() => navigation.goBack()} />
            <View style={styles.searchBar}>
              <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for an address..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={searchLocation}
                onFocus={() => setShowSearchResults(true)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}>
                  <Icon name="cancel" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Search Results */}
          {showSearchResults && (
            <ScrollView style={styles.searchResults}>
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.searchResultItem}
                    onPress={() => selectSearchResult(item)}
                  >
                    <Icon name="place" size={20} color="#4756ca" />
                    <View style={styles.resultTextContainer}>
                      <Text style={styles.resultPrimaryText} numberOfLines={1}>
                        {item.address?.road || item.address?.name || 'Location'}
                      </Text>
                      <Text style={styles.resultSecondaryText} numberOfLines={1}>
                        {item.display_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : searchQuery.length > 2 ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>
              ) : null}
            </ScrollView>
          )}
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Current location button */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={getCurrentLocation}
          >
            <Icon name="my-location" size={22} color="#fff" />
          </TouchableOpacity>
          
          {/* Confirm center location button */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmPinButton]}
            onPress={confirmCenterLocation}
          >
            <Icon name="place" size={22} color="#fff" />
            <Text style={styles.confirmPinText}>Confirm Pin Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ola-themed confirmation modal with updated colors */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.dragHandle} />
            </View>
            
            <View style={styles.addressContainer}>
              <View style={styles.addressIconContainer}>
                <Icon name="place" size={24} color="#4756ca" />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressLabel}>Selected Location</Text>
                <Text style={styles.addressMain} numberOfLines={1}>
                  {selectedLocation?.formattedAddress || selectedLocation?.fullAddress}
                </Text>
                <Text style={styles.addressSecondary} numberOfLines={2}>
                  {selectedLocation?.fullAddress}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={() => {
                  setModalVisible(false);
                  navigation.replace('BranchLocationConfirmation', selectedLocation);
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.additionalOptions}>
              <TouchableOpacity style={styles.optionItem}>
                <Icon name="star" size={20} color="#616dc7" />
                <Text style={styles.optionText}>Save as favorite</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem}>
                <Icon name="share" size={20} color="#616dc7" />
                <Text style={styles.optionText}>Share this location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa"
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { 
    flex: 1,
    position: 'relative'
  },
  webview: { 
    flex: 1 
  },
  // Search bar styles
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backIcon: {
    padding: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  // Search results styles
  searchResults: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    borderRadius: 8,
    maxHeight: 300,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  resultPrimaryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  resultSecondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 14,
  },
  // Action buttons
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#4756ca',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmPinButton: {
    flexDirection: 'row',
    width: 'auto',
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  confirmPinText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: { 
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)" 
  },
  modalContent: { 
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f2f4ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  addressMain: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressSecondary: {
    fontSize: 14,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#4756ca',
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#4756ca',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 2,
    padding: 15,
    backgroundColor: '#4756ca',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  additionalOptions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default GetLocationBranch;