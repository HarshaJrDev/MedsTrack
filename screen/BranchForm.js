import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Checkbox, Button, DefaultTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { BRANCH_API } from '@env';
import { AppContext } from '../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BranchFormStore = () => {
  const navigation = useNavigation();
  const route = useRoute(); // ✅ Moved this above params access to prevent undefined errors

  const { fullAddress, pincode, accessToken, setAccessToken, setPincode } = React.useContext(AppContext);
  
  const { selectedLocation, previousData } = route.params || {}; // ✅ Safely access params

  const [branchName, setBranchName] = React.useState(previousData?.branchName || '');
  const [storeLocation, setStoreLocation] = React.useState(previousData?.storeLocation || '');
  const [licenseNumber, setLicenseNumber] = React.useState(previousData?.licenseNumber || '');
  const [gstNumber, setGstNumber] = React.useState(previousData?.gstNumber || '');
  const [contactPerson, setContactPerson] = React.useState(previousData?.contactPerson || '');
  const [email, setEmail] = React.useState(previousData?.email || '');
  const [phone, setPhone] = React.useState(previousData?.phone || '');
  const [showContactPerson, setShowContactPerson] = React.useState(previousData?.showContactPerson || false);
  const [city, setCity] = React.useState(previousData?.city || '');
  const [state, setState] = React.useState(previousData?.state || '');
  const [country, setCountry] = React.useState(previousData?.country || '');
  const [loading, setLoading] = React.useState(false);

  // ✅ Update store location if selectedLocation changes
  React.useEffect(() => {
    if (selectedLocation?.address) {
      setStoreLocation(selectedLocation.address);
    }
  }, [selectedLocation]);

  // ✅ Extract details from fullAddress
  React.useEffect(() => {
    if (fullAddress) {
      const addressParts = fullAddress.split(',').map(part => part.trim());
      setPincode(addressParts[addressParts.length - 2] || '');
      setState(addressParts[addressParts.length - 3] || '');
      setCity(addressParts[addressParts.length - 5] || '');
      setCountry(addressParts[addressParts.length - 1] || '');
    }
  }, [fullAddress]);

  const showToast = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Validation Error',
      text2: message,
    });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!branchName || !licenseNumber || !email || !phone || !fullAddress) {
      showToast("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      showToast("Please enter a valid email address.");
      return;
    }
  
    setLoading(true);
    
    try {
      let storedAccessToken = accessToken;

      if (!storedAccessToken) {
        const userData = await AsyncStorage.getItem("userData");
        const parsedData = JSON.parse(userData);
  
        if (parsedData?.accessToken) {
          storedAccessToken = parsedData.accessToken;
          setAccessToken(parsedData.accessToken);
        } else {
          throw new Error("User is not logged in. Please log in again.");
        }
      }
  
      const requestBody = {
        branchName,
        licenseNumber,
        contactPerson,
        email,
        phone,
        address: fullAddress,
        postalCode: pincode,
        city,
        state,
        country,
      };
  
      console.log("🚀 Submitting Branch Data:", requestBody);
  
      const response = await axios.post(
        BRANCH_API,
        requestBody,
        {
          headers: { 
            Authorization: `Bearer ${storedAccessToken}`, 
            "Content-Type": "application/json"
          },
        }
      );
  
      console.log("✅ Success Response:", response.data);
  
      setLoading(false);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Pharmacy details submitted successfully!' });
  
      setTimeout(() => {
        navigation.navigate("BranchScreen");
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      
      if (error.response) {
        console.error("❌ API Error Response:", error.response.data);
        console.error("❌ Status Code:", error.response.status);
        Toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: error.response.data?.message || 'Something went wrong. Please try again.',
        });
      } else if (error.request) {
        console.error("❌ No Response from Server:", error.request);
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'No response from server. Please check your internet connection.',
        });
      } else {
        console.error("❌ Unexpected Error:", error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong.',
        });
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Pharmacy Branch Details</Text>

        <TextInput 
          label="Store Name" 
          value={branchName} 
          onChangeText={setBranchName} 
          style={styles.input} 
          mode="outlined" 
          theme={DefaultTheme} 
        />
        <TouchableOpacity
          onPress={() => navigation.replace('GetLocationBranch', { 
            previousData: { branchName, storeLocation, licenseNumber, gstNumber, contactPerson, email, phone, city, state, pincode, country, showContactPerson } 
          })}>
          <View style={[styles.input, styles.searchBar]}>
            <Text style={{ color: storeLocation ? '#000' : '#888' }}>
              {fullAddress || "Select Store Location"}
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput label="Pharmacy License Number" value={licenseNumber} onChangeText={setLicenseNumber} style={styles.input} mode="outlined" theme={DefaultTheme} />

        <TextInput label="GST Number" value={gstNumber} onChangeText={setGstNumber} style={styles.input} mode="outlined" theme={DefaultTheme} />


        <View style={styles.checkboxContainer}>
          <Checkbox status={showContactPerson ? 'checked' : 'unchecked'} onPress={() => setShowContactPerson(!showContactPerson)} />
          <Text style={styles.checkboxLabel}>Add Contact Person Details</Text>
        </View>

        {showContactPerson && (
          <>
            <TextInput label="Contact Person Name" value={contactPerson} onChangeText={setContactPerson} style={styles.input} mode="outlined" theme={DefaultTheme} />
            <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" mode="outlined" theme={DefaultTheme} />
            <TextInput label="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" mode="outlined" theme={DefaultTheme} />
          </>
        )}

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          <Text style={{ color: "#fff" }}>Submit</Text>
        </Button>
        <View>
        <Toast />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subHeading: { fontSize: 18, fontWeight: '500', marginVertical: 10 },
  input: { marginBottom: 10, backgroundColor: 'white' },
  searchBar: { padding: 15, borderRadius: 5, borderWidth: 1, borderColor: '#ccc' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  checkboxLabel: { fontSize: 16, marginLeft: 5 },
  button: { marginTop: 20, backgroundColor: "#4756ca" },
});


export default BranchFormStore;
