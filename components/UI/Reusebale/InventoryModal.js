import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InventoryModal = ({
  modalVisible,
  setModalVisible,
  newItem,
  setNewItem,
  expiryDate,
  showDatePicker,
  selectedCategory,
  setIsModalOpen,
  isModalOpen,
  categories,
  handleSelect,
  otherCategory,
  setOtherCategory,
  handleAddItem,
  handleCancel,
  styles,
  SCREEN_HEIGHT,
  customTheme
}) => {
  return (
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
              label="Medicine Name"
              style={styles.modalInput}
              value={newItem.name}
              onChangeText={text => setNewItem({ ...newItem, name: text })}
            />

            <LinearGradient colors={['#4756ca', '#616dc7']} style={[styles.input, { borderRadius: SCREEN_HEIGHT * 0.006, height: SCREEN_HEIGHT * 0.059 }]}>  
              <TextInput
                mode="outlined"
                label="Expiry Date (MM-YYYY)"
                style={[styles.input, { backgroundColor: 'transparent' }]} 
                value={expiryDate}
                editable={false}
                right={<TextInput.Icon icon="calendar" onPress={showDatePicker} />}
              />
            </LinearGradient>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
                <Text style={styles.saveButtonText}>Save Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default InventoryModal;