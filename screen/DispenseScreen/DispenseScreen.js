// src/screens/DispenseScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

// Sample medicine data - Replace with your actual data
const medicineInventory = [
  { id: '1', name: 'Paracetamol', stock: 500, price: 9.99 },
  { id: '2', name: 'Amoxicillin', stock: 200, price: 15.99 },
  { id: '3', name: 'Ibuprofen', stock: 300, price: 12.99 },
  // Add more medicines as needed
];

const DispenseScreen = ({navigation}) => {
  const [patientName, setPatientName] = useState('');
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  // Handle taking prescription photo
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles permissions differently
  };

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Permission Denied You need to grant camera permission',

    });
  }

  const ErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Cancelled User cancelled camera',

    });
  }

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      showToast
      return;
    }
  
    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    };
  
    try {
      const result = await launchCamera(options);
  
      if (result.didCancel) {
        ErrorToast
      } else if (result.errorMessage) {
        Alert.alert('Error', result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        setPrescriptionImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  const handlePickFromGallery = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    try {
      const result = await launchImageLibrary(options);
  
      if (result.didCancel) {
        Alert.alert('Cancelled', 'User cancelled gallery selection');
      } else if (result.errorMessage) {
        Alert.alert('Error', result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        setPrescriptionImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  // Handle medicine search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = medicineInventory.filter(medicine =>
      medicine.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMedicines(filtered);
  };

  // Handle medicine selection and quantity
  const handleSelectMedicine = (medicine) => {
    if (medicine.stock === 0) {
      Alert.alert('Error', 'Medicine out of stock');
      return;
    }

    Alert.prompt(
      'Enter Quantity',
      `Available stock: ${medicine.stock}`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Add',
          onPress: (quantity) => {
            const numQuantity = parseInt(quantity);
            if (isNaN(numQuantity) || numQuantity <= 0) {
              Alert.alert('Error', 'Please enter a valid quantity');
              return;
            }
            if (numQuantity > medicine.stock) {
              Alert.alert('Error', 'Quantity exceeds available stock');
              return;
            }
            addMedicineToDispense(medicine, numQuantity);
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  // Add medicine to dispense list
  const addMedicineToDispense = (medicine, quantity) => {
    setSelectedMedicines([
      ...selectedMedicines,
      {
        ...medicine,
        quantity,
        totalPrice: medicine.price * quantity
      }
    ]);
    setSearchModalVisible(false);
    setSearchQuery('');
  };

  // Remove medicine from dispense list
  const removeMedicine = (medicineId) => {
    setSelectedMedicines(selectedMedicines.filter(med => med.id !== medicineId));
  };

  // Calculate total amount
  const totalAmount = selectedMedicines.reduce((sum, medicine) => 
    sum + medicine.totalPrice, 0
  );

  // Handle final dispensing
  const handleDispense = () => {
    if (!patientName) {
      Alert.alert('Error', 'Please enter patient name');
      return;
    }
    if (selectedMedicines.length === 0) {
      Alert.alert('Error', 'Please add medicines to dispense');
      return;
    }

    // Add your dispensing logic here
    Alert.alert(
      'Success',
      'Medicines dispensed successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            setPatientName('');
            setPrescriptionImage(null);
            setSelectedMedicines([]);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Patient Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          {/* <TextInput
            style={styles.input}
            placeholder="Patient Name"
            value={patientName}
            onChangeText={setPatientName}
          /> */}

          <TouchableOpacity onPress={(()=>navigation.navigate('PatientInfoSearch'))}>
          <View style={{ flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 15,
    color: '#000',
    justifyContent: 'center',
    borderWidth: 0.1,}}>

      <Text>Search..</Text>

          </View>

          </TouchableOpacity>

 

        </View>

        {/* Prescription Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription Image</Text>
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={handleTakePhoto}
          >
            {prescriptionImage ? (
              <Image
                source={{ uri: prescriptionImage.uri }}
                style={styles.prescriptionImage}
              />
            ) : (
              <Text style={styles.imageButtonText}>Take Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Medicine Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicines to Dispense</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setSearchModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Medicine</Text>
          </TouchableOpacity>

          {/* Selected Medicines List */}
          {selectedMedicines.map((medicine) => (
            <View key={medicine.id} style={styles.selectedMedicine}>
              <View>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDetails}>
                  Quantity: {medicine.quantity} × ${medicine.price.toFixed(2)}
                </Text>
                <Text style={styles.medicineTotal}>
                  Total: ${medicine.totalPrice.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMedicine(medicine.id)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Total Amount */}
          {selectedMedicines.length > 0 && (
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>
                Total Amount: ${totalAmount.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Dispense Button */}
        <TouchableOpacity 
          style={styles.dispenseButton}
          onPress={handleDispense}
        >
          <Text style={styles.dispenseButtonText}>Dispense Now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Medicine Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Medicine</Text>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => {
                  setSearchModalVisible(false);
                  setSearchQuery('');
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search medicines..."
              value={searchQuery}
              onChangeText={handleSearch}
            />

            <FlatList
              data={filteredMedicines}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.medicineItem}
                  onPress={() => handleSelectMedicine(item)}
                >
                  <View>
                    <Text style={styles.medicineName}>{item.name}</Text>
                    <Text style={styles.medicineDetails}>
                      Stock: {item.stock} | Price: ${item.price.toFixed(2)}
                    </Text>
                  </View>
                  <View style={[
                    styles.stockIndicator,
                    { backgroundColor: item.stock > 100 ? '#51cf66' : '#ffd43b' }
                  ]} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No medicines found</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2196F3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  imageButton: {
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontSize: 16,
    color: '#666',
  },
  prescriptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#4756ca',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedMedicine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
  },
  medicineDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  medicineTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3',
    marginTop: 4,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginTop: 15,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'right',
  },
  dispenseButton: {
    backgroundColor: '#4756ca',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dispenseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeModalButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  stockIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default DispenseScreen;