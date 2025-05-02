import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GetLocationBranch = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [labelName, setLabelName] = useState('');
  const webViewRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Debounce search to improve performance
  const searchLocation = query => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length > 2) {
      // Set a timeout to delay the search until user stops typing
      searchTimeoutRef.current = setTimeout(() => {
        setShowSearchResults(true);
        performSearch(query);
      }, 500); // 500ms debounce
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const performSearch = (query) => {
    const searchScript = (query, countryCode = 'IN') => `
      fetch('https://nominatim.openstreetmap.org/search?format=json&countrycodes=${countryCode}&q=${encodeURIComponent(
        query,
      )}')
        .then(response => response.json())
        .then(data => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SEARCH_RESULTS',
            results: data.slice(0, 5)
          }));
        })
        .catch(error => {
          console.error('Search error:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SEARCH_ERROR',
            message: error.toString()
          }));
        });
    `;
    
    // Ensure WebView reference exists before injecting script
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(searchScript(query));
    }
  };

  const selectSearchResult = item => {
    setShowSearchResults(false);
    setSearchQuery(item.display_name);

    // Center map on selected location and create marker
    const goToLocationScript = `
      map.setView([${item.lat}, ${item.lon}], 15);
      createMarker(${item.lat}, ${item.lon}, false);
      true;
    `;
    webViewRef.current.injectJavaScript(goToLocationScript);
  };

  // Function to get user's current location - only when button is pressed
  const getCurrentLocation = () => {
    const script = `
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          map.setView([lat, lon], 15);
          createMarker(lat, lon, false);
          document.getElementById('centerPin').style.display = 'none';
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
    webViewRef.current.injectJavaScript(script);
  };
  
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body { margin: 0; padding: 0; height: 100%; }
        #map { height: 100vh; width: 100vw; }
        .center-pin {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -100%);
          z-index: 999;
          pointer-events: none;
        }
        .custom-marker {
          background: none;
          border: none;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div class="center-pin" id="centerPin">
        <svg width="30" height="40" viewBox="0 0 48 64">
          <path d="M24 0C10.7 0 0 10.7 0 24c0 19.2 24 40 24 40s24-20.8 24-40C48 10.7 37.3 0 24 0z" fill="#4756ca"/>
          <circle cx="24" cy="24" r="12" fill="#ffffff"/>
        </svg>
      </div>
  
      <script>
        let map, marker;
  
        function formatAddress(addr) {
          const parts = [];
          if (addr.road) parts.push(addr.road);
          if (addr.suburb) parts.push(addr.suburb);
          if (addr.city) parts.push(addr.city);
          if (addr.state) parts.push(addr.state);
          return parts.join(', ');
        }
  
        function createMarker(lat, lon, shouldFetch = true) {
          if (marker) map.removeLayer(marker);
  
          marker = L.marker([lat, lon], {
            icon: L.divIcon({
              html: \`
                <svg width="30" height="40" viewBox="0 0 48 64">
                  <path d="M24 0C10.7 0 0 10.7 0 24c0 19.2 24 40 24 40s24-20.8 24-40C48 10.7 37.3 0 24 0z" fill="#4756ca"/>
                  <circle cx="24" cy="24" r="12" fill="#ffffff"/>
                </svg>\`,
              className: 'custom-marker',
              iconSize: [30, 40],
              iconAnchor: [15, 40],
            })
          }).addTo(map);
  
          if (shouldFetch) {
            fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&addressdetails=1')
              .then(res => res.json())
              .then(data => {
                const fullAddress = data.display_name || '';
                const formattedAddress = formatAddress(data.address);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'LOCATION_SELECTED',
                  lat,
                  lon,
                  fullAddress,
                  formattedAddress,
                  addressComponents: data.address,
                }));
              })
              .catch(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'LOCATION_ERROR',
                  message: 'Failed to fetch address.'
                }));
              });
          }
        }
  
        function selectCenterLocation() {
          const center = map.getCenter();
          createMarker(center.lat, center.lng, true);
          const pin = document.getElementById('centerPin');
          if (pin) pin.style.display = 'none';
        }
  
        document.addEventListener("DOMContentLoaded", function () {
          map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([12.9716, 77.5946], 13);
  
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);
  
          map.on('click', function (e) {
            createMarker(e.latlng.lat, e.latlng.lng, true);
  
            const pin = document.getElementById('centerPin');
            if (pin) pin.style.display = 'none';
          });
  
          map.whenReady(() => {
            map.invalidateSize();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_LOADED' }));
          });
        });
  
        window.selectCenterLocation = selectCenterLocation;
      </script>
    </body>
  </html>
  `;

  const handleMessage = (event) => {
    const message = event.nativeEvent.data;
  
    try {
      const data = JSON.parse(message);
  
      switch (data.type) {
        case 'MAP_LOADED':
          setLoading(false);
          break;
        case 'LOCATION_SELECTED':
          setSelectedLocation({
            lat: data.lat,
            lon: data.lon,
            fullAddress: data.fullAddress || '',
            formattedAddress: data.formattedAddress || '',
            addressComponents: data.addressComponents || {},
          });
          setModalVisible(true);
          break;
        case 'LOCATION_ERROR':
          console.warn('Location error:', data.message);
          break;
        case 'SEARCH_RESULTS':
          // Handle search results from WebView
          setSearchResults(data.results || []);
          break;
        case 'SEARCH_ERROR':
          console.warn('Search error:', data.message);
          setSearchResults([]);
          break;
        default:
          console.warn('Unhandled message type:', data.type);
      }
    } catch (e) {
      if (message === 'MAP_LOADED') {
        setLoading(false);
      } else {
        console.error('WebView message error:', e);
      }
    }
  };

  const confirmCenterLocation = () => {
    webViewRef.current.injectJavaScript(`selectCenterLocation(); true;`);
  };


  const checkIfFavorite = async (lat, lon) => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favoriteLocations');
      
      if (existingFavorites) {
        const favorites = JSON.parse(existingFavorites);
        
        // Check if there's a favorite with matching coordinates
        const foundFavorite = favorites.find(
          fav => 
            Math.abs(fav.lat - lat) < 0.0001 && 
            Math.abs(fav.lon - lon) < 0.0001
        );
        
        if (foundFavorite) {
          setIsFavorite(true);
          setLabelName(foundFavorite.labelName || '');
          return true;
        }
      }
      
      setIsFavorite(false);
      setLabelName('');
      return false;
    } catch (error) {
      console.error('Error checking favorites:', error);
      return false;
    }
  };
  const toggleFavorite = async () => {
    if (!selectedLocation) return;
    
    try {
      const existingFavorites = await AsyncStorage.getItem('favoriteLocations');
      let favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
      
      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(
          fav => 
            Math.abs(fav.lat - selectedLocation.lat) >= 0.0001 || 
            Math.abs(fav.lon - selectedLocation.lon) >= 0.0001
        );
        setIsFavorite(false);
        setLabelName('');
      } else {
        // Add to favorites
        favorites.push({
          lat: selectedLocation.lat,
          lon: selectedLocation.lon,
          fullAddress: selectedLocation.fullAddress,
          formattedAddress: selectedLocation.formattedAddress,
          labelName: labelName || 'Favorite Location',
          timestamp: new Date().toISOString(),
        });
        setIsFavorite(true);
      }
      
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favorites));
      Alert.alert(
        isFavorite ? 'Removed from Favorites' : 'Added to Favorites', 
        isFavorite ? 'This location has been removed from your favorites.' : 'This location has been added to your favorites.'
      );
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      Alert.alert('Error', 'Could not update favorites. Please try again.');
    }
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
          source={{html: htmlContent}}
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          cacheEnabled={true}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          onLoadStart={() => setLoading(true)}
        />

        <View style={styles.searchContainer}>
          <View style={styles.searchBarWrapper}>
            <Icon
              name="arrow-back"
              size={24}
              color="#000"
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            />
            <View style={styles.searchBar}>
              <Icon
                name="search"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for an address..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={searchLocation}
                onFocus={() => {
                  if (searchQuery.length > 2) {
                    setShowSearchResults(true);
                  }
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}>
                  <Icon name="cancel" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {showSearchResults && (
            <ScrollView style={styles.searchResults}>
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => {
                  const matchIndex = item.display_name
                    .toLowerCase()
                    .indexOf(searchQuery.toLowerCase());
                  let beforeMatch = item.display_name.substring(0, matchIndex);
                  let matchText = item.display_name.substring(
                    matchIndex,
                    matchIndex + searchQuery.length,
                  );
                  let afterMatch = item.display_name.substring(
                    matchIndex + searchQuery.length,
                  );
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.searchResultItem}
                      onPress={() => selectSearchResult(item)}>
                      <Icon name="place" size={20} color="#4756ca" />
                      <View style={styles.resultTextContainer}>
                        <Text style={styles.resultPrimaryText}>
                          {beforeMatch}
                          <Text style={styles.highlight} numberOfLines={1} ellipsizeMode='tail' >{matchText}</Text>
                          {afterMatch}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        <View style={styles.bottomInfoContainer}>
          <Text style={styles.locationPrompt}>
         Please place the pin at your required location
          </Text>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={getCurrentLocation}>
            <Icon name="my-location" size={22} color="#fff" />
          </TouchableOpacity>
{/* 
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmPinButton]}
            onPress={confirmCenterLocation}>
            <Icon name="place" size={22} color="#fff" />
            <Text style={styles.confirmPinText}>Confirm Location</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.dragHandle} />
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#4756ca" />
              </TouchableOpacity>
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.addressIconContainer}>
                <Icon name="place" size={24} color="#4756ca" />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressLabel}>Selected Location</Text>
                <Text style={styles.addressMain}>
                  {selectedLocation?.formattedAddress || selectedLocation?.fullAddress}
                </Text>
                <Text style={styles.addressSecondary}>
                  {selectedLocation?.fullAddress}
                </Text>
              </View>
            </View>

            {/* Favorite label input */}
            <View style={styles.favoriteInputContainer}>
              <TextInput
                style={styles.labelInput}
                placeholder="Label this location (optional)"
                value={labelName}
                onChangeText={setLabelName}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('BranchLocationConfirmation', selectedLocation);
                }}>
                <Text style={styles.confirmButtonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.additionalOptions,{alignItems:"center",flexDirection:"row"}]}>
              <TouchableOpacity 
                style={styles.optionItem} 
                onPress={toggleFavorite}>
                <Icon 
                  name={isFavorite ? "favorite" : "favorite-outline"} 
                  size={20} 
                  color="#616dc7" 
                />
                <Text style={styles.optionText}>
                  {isFavorite ? "Remove from favorites" : "Save as favorite"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
  onPress={() => navigation.navigate('FavoriteLocationsScreen')} 
  style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
>
  <Icon 
    name="edit"  // or "edit-2", "create", etc. depending on your icon set
    size={20} 
    color="#616dc7" 
    style={{ marginRight: 5 }} 
  />
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
    backgroundColor: '#f8f9fa',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
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
    shadowOffset: {width: 0, height: 2},
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
  searchingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 12,
    borderRadius: 8,
  },
  searchingText: {
    marginLeft: 10,
    color: '#666',
  },
  searchResults: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    borderRadius: 8,
    maxHeight: 300,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 14,
  },
  // Bottom info prompt
  bottomInfoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  locationPrompt: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: 10,
    borderRadius: 20,
    fontSize: 14,
    textAlign: 'center',
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
    shadowOffset: {width: 0, height: 2},
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
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
    flexDirection:"row",
    columnGap:190

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
  highlight: {
    fontWeight: 'bold',
    color: '#4756ca',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
    zIndex: 10,
  },
});

export default GetLocationBranch;