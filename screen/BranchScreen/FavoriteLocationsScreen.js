import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const FavoriteLocationsScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteLocations');
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorite locations');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (index) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this favorite location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFavorites = [...favorites];
              updatedFavorites.splice(index, 1);
              
              await AsyncStorage.setItem(
                'favoriteLocations',
                JSON.stringify(updatedFavorites)
              );
              
              setFavorites(updatedFavorites);
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert('Error', 'Failed to remove favorite location');
            }
          },
        },
      ]
    );
  };

  const editFavorite = (location, index) => {
    navigation.navigate('EditFavoriteLocation', { 
      location,
      index,
      onUpdate: (updatedLocation, locationIndex) => {
        const updatedFavorites = [...favorites];
        updatedFavorites[locationIndex] = updatedLocation;
        setFavorites(updatedFavorites);
        saveFavoritesToStorage(updatedFavorites);
      }
    });
  };

  const saveFavoritesToStorage = async (favoritesToSave) => {
    try {
      await AsyncStorage.setItem(
        'favoriteLocations',
        JSON.stringify(favoritesToSave)
      );
    } catch (error) {
      console.error('Error saving favorites:', error);
      Alert.alert('Error', 'Failed to save favorite locations');
    }
  };

  const useSelectedLocation = (location) => {
    navigation.navigate('BranchLocationConfirmation', location);
  };

  const addNewLocation = () => {
    navigation.navigate('GetLocationBranch');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4756ca" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite Locations</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="place" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No favorite locations saved</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addNewLocation}
          >
            <Text style={styles.addButtonText}>Add New Location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={favorites}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={styles.favoriteItem}
                onPress={() => useSelectedLocation(item)}
              >
                <View style={styles.favoriteContent}>
                  <View style={styles.iconContainer}>
                    <Icon name="place" size={24} color="#4756ca" />
                  </View>
                  <View style={styles.addressContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {item.formattedAddress || item.fullAddress}
                    </Text>
                    <Text style={styles.addressDetails} numberOfLines={2}>
                      {item.fullAddress}
                    </Text>
                    <Text style={styles.coordinates}>
                      {item.lat.toFixed(6)}, {item.lon.toFixed(6)}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  {/* <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => editFavorite(item, index)}
                  >
                    <Icon name="edit" size={20} color="#4756ca" />
                  </TouchableOpacity> */}
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => removeFavorite(index)}
                  >
                    <Icon name="delete" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
          
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={addNewLocation}
          >
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#4756ca',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  favoriteItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f2f4ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  addressDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4756ca',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default FavoriteLocationsScreen;