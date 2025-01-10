import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Checkbox, Button, DefaultTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
const StoreDetailsForm = () => {
  const [isOwner, setIsOwner] = React.useState(false);
  const [storeName, setStoreName] = React.useState('');
  const [storeLocation, setStoreLocation] = React.useState('');
  const [contactPersonName, setContactPersonName] = React.useState('');
  const [contactPersonEmail, setContactPersonEmail] = React.useState('');
  const [contactPersonPhone, setContactPersonPhone] = React.useState('');
  const [pharmacyLicense, setPharmacyLicense] = React.useState('');
  const [gstNumber, setGstNumber] = React.useState('');
  const [operationDays, setOperationDays] = React.useState('');
  const [operationHours, setOperationHours] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = React.useState(false);
  const navigation = useNavigation()

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: '#000',
    },
  };

  const handleSubmit = () => {
    if (
      storeName ||
      storeLocation ||
      contactPersonName ||
      contactPersonEmail ||
      contactPersonPhone ||
      pharmacyLicense ||
      gstNumber ||
      operationDays ||
      operationHours
    ) {
      setIsModalVisible(true);
    } else {
      console.log('Form submitted');
      navigation.navigate("Mainapp")
      
    }
  };

  const closeModalAndNavigate = () => {
    setIsModalVisible(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
      setSelectedDate(date.toDateString());
      hideDatePicker();
    } else {
      alert("Please select a weekend (Saturday or Sunday).");
    }
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setOperationHours(time.toLocaleTimeString());
    hideTimePicker();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Store Details</Text>

        <TextInput
          label="Store Name"
          value={storeName}
          onChangeText={setStoreName}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
        />
        <TextInput
          label="Store Location"
          value={storeLocation}
          onChangeText={setStoreLocation}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
        />
        <TextInput
          label="Pharmacy License Number"
          value={pharmacyLicense}
          onChangeText={setPharmacyLicense}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
        />
        <TextInput
          label="GST Number"
          value={gstNumber}
          onChangeText={setGstNumber}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
        />

        <TouchableOpacity onPress={showDatePicker} style={[styles.input, styles.pickerBox]}>
          <Text style={styles.pickerText}>{operationDays || 'Select Operation Days'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showTimePicker} style={[styles.input, styles.pickerBox]}>
          <Text style={styles.pickerText}>{operationHours || 'Select Operation Hours'}</Text>
        </TouchableOpacity>

        <Text style={styles.subHeading}>Contact Person Details</Text>
        <View style={styles.checkboxContainer}>
          <Checkbox
          
            status={isOwner ? 'checked' : 'unchecked'}
            onPress={() => setIsOwner(!isOwner)}
          />
          <Text style={styles.checkboxText}>Is the user the owner of the store?</Text>
        </View>
        <TextInput
          label="Contact Person Name"
          value={contactPersonName}
          onChangeText={setContactPersonName}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
        />
        <TextInput
          label="Email"
          value={contactPersonEmail}
          onChangeText={setContactPersonEmail}
          style={styles.input}
          keyboardType="email-address"
          mode="outlined"
          theme={customTheme}
        />
        <TextInput
          label="Phone Number"
          value={contactPersonPhone}
          onChangeText={setContactPersonPhone}
          style={styles.input}
          keyboardType="phone-pad"
          mode="outlined"
          theme={customTheme}
        />

     

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>

          <Text style={{color:"#fff"}}>Submit </Text>
        </Button>
        
        <Modal visible={isModalVisible} animationType="fade" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Details Already Exist</Text>
              <Text style={styles.modalMessage}>The store details already exist. Please login to proceed.</Text>
              <TouchableOpacity onPress={closeModalAndNavigate} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Go to Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        
        />

        {/* Time Picker Modal */}
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',

  },
  pickerBox: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    height:50
  },
  pickerText: {
    fontSize: 16,
    color: '#555',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,

  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor:"#4756ca",
    color:"#fff"
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  modalButton: {
    backgroundColor: '#4756ca',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StoreDetailsForm;
