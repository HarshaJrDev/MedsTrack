import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput, DefaultTheme} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000',
  },
};

const AddComposition = () => {
  const [selectedCategory, setSelectedCategory] = useState({type: ''});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [otherCategory, setOtherCategory] = useState('');
  const [isDatePickerExpiryVisible, setisDatePickerExpiryVisible] =
    useState(false);

  const [expiryDate, setExpiryDate] = useState('');

  const [newItem, setNewItem] = useState({
    name: '',
    stock: '',
    category: '',
    price: '',
    supplier: '',
    expiryDate: '',
    unitPerPack: '',
    numberOfPacks: '',
    mrp: '',
    ptr: '',
    looseUnits: '',
    batchNo: '',
    batchExpiry: '',
    hsnCode: '',
    batchGstRate: '',
    CompositionName: '',
    StrengthValue: '',
    Strengthtype: '',
  });

  const categories = [
    {label: 'Select Category', value: ''},
    {label: 'Ayurvedic', value: 'Ayurvedic'},
    {label: 'Cosmetic', value: 'Cosmetic'},
    {label: 'Drug', value: 'Drug'},
    {label: 'Generic', value: 'Generic'},
    {label: 'Nutraceuticals', value: 'Nutraceuticals'},
    {label: 'OTC', value: 'OTC'},
    {label: 'Surgical', value: 'Surgical'},
    {label: 'Others', value: 'Others'},
  ];

  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddItem = () => {
    const item = {
      id: Date.now().toString(),
      ...newItem,
      stock:
        parseInt(newItem.numberOfPacks || '0') *
          parseInt(newItem.unitPerPack || '0') +
        parseInt(newItem.looseUnits || '0'),
      unitPerPack: parseInt(newItem.unitPerPack || '0'),
      numberOfPacks: parseInt(newItem.numberOfPacks || '0'),
      looseUnits: parseInt(newItem.looseUnits || '0'),
      mrp: parseFloat(newItem.mrp || '0'),
      ptr: parseFloat(newItem.ptr || '0'),
      batchGstRate: parseFloat(newItem.batchGstRate || '0'),
    };

    // Validate required fields
    if (!item.name) {
      Alert.alert('Error', 'Medicine Name is required');
      return;
    }

    if (!item.expiryDate) {
      Alert.alert('Error', 'Expiry Date is required');
      return;
    }

    if (!item.category) {
      // ✅ FIXED: Correct validation for category
      Alert.alert('Error', 'Category is required');
      return;
    }

    setInventory([...inventory, item]); // Add item to inventory

    // ✅ Ensure modal opens when needed
    setModalVisible(true);

    // Reset form
    setNewItem({
      name: '',
      stock: '',
      category: '',
      price: '',
      supplier: '',
      expiryDate: '',
      unitPerPack: '',
      numberOfPacks: '',
      mrp: '',
      ptr: '',
      looseUnits: '',
      batchNo: '',
      batchExpiry: '',
      hsnCode: '',
      batchGstRate: '',
      CompositionName: '',
      StrengthValue: '',
      Strengthtype: '',
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const handleUpdateStock = (id, adjustment) => {
    setInventory(
      inventory.map(item => {
        if (item.id === id) {
          const newStock = item.stock + adjustment;
          if (newStock < 0) {
            Alert.alert('Error', 'Stock cannot be negative');
            return item;
          }
          return {...item, stock: newStock};
        }
        return item;
      }),
    );
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideDatePickerExpiry = () => {
    setisDatePickerExpiryVisible(false);
  };

  const formatMonthYear = text => {
    // Remove any non-numeric characters
    let cleaned = text.replace(/\D/g, '');

    if (cleaned.length > 6) {
      cleaned = cleaned.slice(0, 6); // Restrict length to MMYYYY format
    }

    let formattedText = cleaned;

    // Insert "-" after the month (first two digits)
    if (cleaned.length >= 3) {
      formattedText = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }

    return formattedText;
  };

  const handleSelect = value => {
    setSelectedCategory({...selectedCategory, type: value});
    console.log('Selected Category:', value); // Log the selected category

    if (value !== 'Others') {
      setOtherCategory(''); // Clear the "Other" input if not selected
    }
    setIsModalOpen(false);
  };

  const handleDateConfirm = date => {
    setExpiryDate(moment(date).format('MM-YYYY'));
    hideDatePicker();
  };
  const handleDateConfirmExpiry = date => {
    setNewItem({...newItem, batchExpiry: date.toDateString()});
    hideDatePickerExpiry();
  };

  const handleCancel = async () => {
    try {
      await AsyncStorage.removeItem('recentSearches');
      setModalVisible(false);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View
          style={[
            styles.stockIndicator,
            {backgroundColor: item.stock < 100 ? '#ff6b6b' : '#51cf66'},
          ]}
        />
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemInfo}>Stock: {item.stock} units</Text>
        <Text style={styles.itemInfo}>Category: {selectedCategory.type}</Text>
        <Text style={styles.itemInfo}>MRP: ₹{item.mrp.toFixed(2)}</Text>
        <Text style={styles.itemInfo}>PTR: ₹{item.ptr.toFixed(2)}</Text>
        <Text style={styles.itemInfo}>Expires: {item.expiryDate}</Text>
        <Text style={styles.itemInfo}>Batch No: {item.batchNo}</Text>
        <Text style={styles.itemInfo}>GST Rate: {item.batchGstRate}%</Text>
      </View>

      <View style={styles.stockControls}>
        <TouchableOpacity
          style={[styles.stockButton, styles.decrementButton]}
          onPress={() => handleUpdateStock(item.id, -1)}>
          <Text style={styles.stockButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.stockButton, styles.incrementButton]}
          onPress={() => handleUpdateStock(item.id, 1)}>
          <Text style={styles.stockButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.searchInput}
          onPress={() => navigation.navigate('SearchScreen')}>
          <Text>Search...</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.addButtonText}>
            + Add composition{' '}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No items in Composition</Text>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Item</Text>

              {/* <TextInput
                mode="outlined"
                theme={customTheme}
                label={
                  <Text>
                    Medicine Name <Text style={{color: 'red'}}>*</Text>
                  </Text>
                }
                style={styles.modalInput}
                value={newItem.name}
                onChangeText={text => setNewItem({...newItem, name: text})}
              /> */}
              <TextInput
                mode="outlined"
                theme={customTheme}
                label={
                  <Text>
                    Composition Name <Text style={{color: 'red'}}>*</Text>
                  </Text>
                }
                style={styles.modalInput}
                value={newItem.CompositionName}
                onChangeText={text => setNewItem({...newItem, name: text})}
              />
              <TextInput
                mode="outlined"
                theme={customTheme}
                label={
                  <Text>
                    Strength Value <Text style={{color: 'red'}}>*</Text>
                  </Text>
                }
                style={styles.modalInput}
                value={newItem.StrengthValue}
                onChangeText={text =>
                  setNewItem({...newItem, StrengthValue: text})
                } // ✅ FIXED
                keyboardType="numeric"
              />

              <TextInput
                mode="outlined"
                theme={customTheme}
                label={
                  <Text>
                    Strength Type (mg/ml/g){' '}
                    <Text style={{color: 'red'}}>*</Text>
                  </Text>
                }
                style={styles.modalInput}
                value={newItem.Strengthtype}
                onChangeText={text =>
                  setNewItem({...newItem, Strengthtype: text})
                } // ✅ FIXED
              />

              <View style={{marginTop: 20}}>
   

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleAddItem}>
                    <Text style={styles.saveButtonText}>Save Item</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#000',
    justifyContent: 'center',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#3f4fb8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    width: 100,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 60,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  itemCard: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 8,
    padding: 15,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#4756ca',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  itemDetails: {
    marginBottom: 10,
  },
  itemInfo: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
  },
  stockControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  stockButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  decrementButton: {
    backgroundColor: '#ff6b6b',
  },
  incrementButton: {
    backgroundColor: '#51cf66',
  },
  stockButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {

    justifyContent: 'center',
    alignItems: 'center',
marginTop:60
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: SCREEN_WIDTH - 40,
    flex: 1,
    
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 15,
  },
  Packinputs: {
    marginBottom: 15,

    width: SCREEN_HEIGHT * 0.17,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#000',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#3f4fb8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#3f4fb8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row', // Aligns text and icon in a row
    alignItems: 'center', // Centers them vertically
    justifyContent: 'space-between', // Spaces text and icon apart
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: 'white',
  },
});
export default AddComposition;
