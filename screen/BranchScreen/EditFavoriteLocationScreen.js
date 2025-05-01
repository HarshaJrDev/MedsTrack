import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditFavoriteLocationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { location, index, onUpdate } = route.params;

  const [formattedAddress, setFormattedAddress] = useState(
    location.formattedAddress || location.fullAddress
  );
  const [fullAddress, setFullAddress] = useState(location.fullAddress);
  const [labelName, setLabelName] = useState(location.labelName || '');

  const saveChanges = async () => {
    if (!formattedAddress.trim()) {
      Alert.alert('Error', 'Address cannot be empty');
      return;
    }

    try {
      // Get all favorite locations
      const storedFavorites = await AsyncStorage.getItem('favoriteLocations');
      let favorites = [];
      
      if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
      }

      // Create updated location object
      const updatedLocation = {
        ...location,
        formattedAddress: formattedAddress.trim(),
        fullAddress: fullAddress.trim(),
        labelName: labelName.trim(),
      };

      // Update the location at the given index
      favorites[index] = updatedLocation;
      
      // Save updated favorites back to storage
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favorites));
      
      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate(updatedLocation, index);
      }
      
      Alert.alert('Success', 'Location updated successfully', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]);
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Error', 'Failed to update location');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Favorite Location</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Label (Optional)</Text>
          <View style={styles.inputContainer}>
            <Icon name="label" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={labelName}
              onChangeText={setLabelName}
              placeholder="E.g., Home, Work, etc."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Short Address</Text>
          <View style={styles.inputContainer}>
            <Icon name="place" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formattedAddress}
              onChangeText={setFormattedAddress}
              placeholder="Short address description"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Address</Text>
          <View style={styles.inputContainer}>
            <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={fullAddress}
              onChangeText={setFullAddress}
              placeholder="Complete address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesLabel}>Coordinates</Text>
          <Text style={styles.coordinates}>
            Latitude: {location.lat.toFixed(6)}
          </Text>
          <Text style={styles.coordinates}>
            Longitude: {location.lon.toFixed(6)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveChanges}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  coordinatesContainer: {
    backgroundColor: '#f2f4ff',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  coordinatesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4756ca',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: '#4756ca',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4756ca',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    flex: 2,
    padding: 14,
    backgroundColor: '#4756ca',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditFavoriteLocationScreen;