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

const InventoryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState({type: ''});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [otherCategory, setOtherCategory] = useState('');

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

  const handleConfirm = date => {
    setExpiryDate(moment(date).format('MM-YYYY'));
    hideDatePicker();
  };

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
    });
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
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
    setNewItem({...newItem, expiryDate: moment(date).format('DD-MM-YYYY')});
    hideDatePicker();
  };
  const handleDateConfirmExpiry = date => {
    setNewItem({...newItem, batchExpiry: date.toDateString()});
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
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No items in inventory</Text>
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

              <TextInput
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
              />

              <LinearGradient
                colors={['#4756ca', '#616dc7']}
                style={[
                  styles.input,
                  {
                    borderRadius: SCREEN_HEIGHT * 0.006,
                    height: SCREEN_HEIGHT * 0.059,
                  },
                ]}>
                <TextInput
                  mode="flat"
                  label="Expiry Date (MM-YYYY)"
                  style={[
                    styles.input,
                    {
                      backgroundColor: 'transparent',
                      top: SCREEN_HEIGHT * 0.0 - 6,
                    },
                  ]} // Ensures no black background
                  value={expiryDate}
                  editable={false} // Prevent manual input
                  right={
                    <TextInput.Icon icon="calendar" onPress={showDatePicker} />
                  }
                />
              </LinearGradient>

              <View
                style={{
                  flexDirection: 'row',
                  columnGap: SCREEN_HEIGHT * 0.02,
                  marginTop: 20,
                }}>
                <TextInput
                  mode="outlined"
                  theme={customTheme}
                  label="Unit Per Pack"
                  style={styles.Packinputs}
                  value={newItem.unitPerPack}
                  onChangeText={text =>
                    setNewItem({...newItem, unitPerPack: text})
                  }
                  keyboardType="numeric"
                />

                <TextInput
                  mode="outlined"
                  theme={customTheme}
                  label="No of Packs"
                  style={[styles.Packinputs,{width:170}]}
                  value={newItem.numberOfPacks}
                  onChangeText={text =>
                    setNewItem({...newItem, numberOfPacks: text})
                  }
                  keyboardType="numeric"
                />
              </View>

              <TextInput
                mode="outlined"
                theme={customTheme}
                label=" ₹ MRP"
                style={styles.modalInput}
                value={newItem.mrp}
                onChangeText={text => setNewItem({...newItem, mrp: text})}
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="outlined"
                theme={customTheme}
                label=" ₹ PTR"
                style={styles.modalInput}
                value={newItem.ptr}
                onChangeText={text => setNewItem({...newItem, ptr: text})}
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="outlined"
                theme={customTheme}
                label="Loose Units (If Any)"
                style={styles.modalInput}
                value={newItem.looseUnits}
                onChangeText={text =>
                  setNewItem({...newItem, looseUnits: text})
                }
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={() => setIsModalOpen(true)}
                style={styles.categoryContainer}>
                <Text style={styles.inputLabel}>
                  Category <Text style={{color: 'red'}}>*</Text>
                </Text>
                <Icon name="arrow-drop-down" size={24} color="#000" />
              </TouchableOpacity>

              <View style={{}}>
                {selectedCategory.type === 'Others' && (
                  <TextInput
                    mode="outlined"
                    theme={customTheme}
                    label="Others"
                    style={[styles.modalInput, {width: '100%'}]}
                    value={otherCategory}
                    onChangeText={text => setOtherCategory(text)}
                  />
                )}

                {selectedCategory.type &&
                  selectedCategory.type !== 'Others' && (
                    <View style={{marginTop: 10}}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: '#000',
                          fontFamily: 'Nunito-Regular',
                        }}>
                        Selected Category: {selectedCategory.type}
                      </Text>
                    </View>
                  )}

                {selectedCategory.type === 'Others' && otherCategory !== '' && (
                  <View style={{marginTop: 10}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000',
                        fontFamily: 'Nunito-Regular',
                      }}>
                      Other Category: {otherCategory}
                    </Text>
                  </View>
                )}

                <Modal
                  transparent={true}
                  visible={isModalOpen}
                  animationType="slide"
                  onRequestClose={() => setIsModalOpen(false)}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                    <LinearGradient
                      style={{borderRadius: 10}}
                      colors={['#4756ca', '#4756ca']}>
                      <View
                        style={{
                          width: '80%',

                          padding: 20,
                        }}>
                        <FlatList
                          data={categories}
                          keyExtractor={item => item.value}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              style={{
                                padding: 15,
                              }}
                              onPress={() => handleSelect(item.value)}>
                              <Text style={{fontSize: 14, color: '#fff'}}>
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          )}
                          ItemSeparatorComponent={() => (
                            <View
                              style={{
                                height: SCREEN_HEIGHT * 0.001,
                                backgroundColor: '#fff', // Line color
                                marginHorizontal: 15, // Optional margin for line
                              }}
                            />
                          )}
                        />
                        <TouchableOpacity
                          style={{
                            marginTop: 10,
                            padding: 15,
                            backgroundColor: '#3f4fb8',
                            borderRadius: 5,
                            alignItems: 'center',
                          }}
                          onPress={() => setIsModalOpen(false)}>
                          <Text style={{color: '#fff', fontSize: 14}}>
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </View>
                </Modal>
              </View>

              <View style={{marginTop: 20}}>
                <Text style={styles.inputLabel}>Batch Details</Text>

                <TextInput
                  mode="outlined"
                  theme={customTheme}
                  label="Batch No"
                  style={styles.modalInput}
                  value={newItem.batchNo}
                  onChangeText={text => setNewItem({...newItem, batchNo: text})}
                />
                <TextInput
                  mode="outlined"
                  theme={customTheme}
                  label={
                    <Text>
                      Batch Date <Text style={{color: 'red'}}>*</Text>
                    </Text>
                  }
                  style={styles.modalInput}
                  value={newItem.batchExpiry}
                  onFocus={() => setisDatePickerExpiryVisible(true)}
                />

                <TextInput
                  mode="outlined"
                  theme={customTheme}
                  label="HSN Code"
                  style={styles.modalInput}
                  value={newItem.hsnCode}
                  onChangeText={text => setNewItem({...newItem, hsnCode: text})}
                />

                <TextInput
                  mode="outlined"
                  theme={customTheme}
                  label="Batch GST Rate"
                  style={styles.modalInput}
                  value={newItem.batchGstRate}
                  onChangeText={text =>
                    setNewItem({...newItem, batchGstRate: text})
                  }
                  keyboardType="decimal-pad"
                />

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

      <KeyboardAvoidingView behavior="padding">
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          display="spinner"
        />
      </KeyboardAvoidingView>
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
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: SCREEN_WIDTH - 40,
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
    width: SCREEN_HEIGHT * 0.172,
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
export default InventoryScreen;
