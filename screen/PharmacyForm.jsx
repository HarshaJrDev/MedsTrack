import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Checkbox, Button, DefaultTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BRANCH_API } from '@env';
import Toast from 'react-native-toast-message';
import { AppContext } from '../Context/AppContext';

const PharmacyDetails = () => {
  const [branchName, setBranchName] = React.useState('');
  const [storeLocation, setStoreLocation] = React.useState('');
  const [licenseNumber, setLicenseNumber] = React.useState('');
  const [gstNumber, setGstNumber] = React.useState('');
  const [contactPerson, setContactPerson] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [pincode, setPincode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [showContactPerson, setShowContactPerson] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { fullAddress, accessToken } = React.useContext(AppContext);
  const { selectedLocation, previousData } = route.params || {};

  // Preserve previous form data when navigating back
  React.useEffect(() => {
    if (previousData) {
      setBranchName(previousData.branchName);
      setStoreLocation(previousData.storeLocation);
      setLicenseNumber(previousData.licenseNumber);
      setGstNumber(previousData.gstNumber);
      setContactPerson(previousData.contactPerson);
      setEmail(previousData.email);
      setPhone(previousData.phone);
      setCity(previousData.city);
      setState(previousData.state);
      setPincode(previousData.pincode);
      setCountry(previousData.country);
      setShowContactPerson(previousData.showContactPerson);
    }
  }, [previousData]);

  React.useEffect(() => {
    if (selectedLocation) {
      setStoreLocation(selectedLocation.address || '');
    }
  }, [selectedLocation]);

  React.useEffect(() => {
    if (fullAddress) {
      const addressParts = fullAddress.split(',').map(part => part.trim());
      setPincode(addressParts[addressParts.length - 2] || '');
      setState(addressParts[addressParts.length - 3] || '');
      setCity(addressParts[addressParts.length - 5] || '');
      setCountry(addressParts[addressParts.length - 1] || '');
    }
  }, [fullAddress]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!branchName || !licenseNumber || !email || !phone || !fullAddress) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill in all required fields.' });
      return;
    }
    if (!validateEmail(email)) {
      Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('userData');
      const { accessToken } = JSON.parse(userData) || {};
      if (!accessToken) {
        Toast.show({ type: 'error', text1: 'Authentication Error', text2: 'User is not logged in. Please log in again.' });
        setLoading(false);
        return;
      }
      await axios.post(
        BRANCH_API,
        {
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
        },
        {
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        }
      );
      setLoading(false);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Pharmacy details submitted successfully!' });
      setTimeout(() => {
        navigation.replace("PharmacyView");
      }, 2000);
    } catch (error) {
      setLoading(false);
      Toast.show({ type: 'error', text1: 'Submission Failed', text2: error.response?.data?.message || 'Something went wrong. Please try again.' });
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Pharmacy Details</Text>
        <TextInput label="Store Name" value={branchName} onChangeText={setBranchName} style={styles.input} mode="outlined" theme={DefaultTheme} />
        <TouchableOpacity
          onPress={() => navigation.replace('LocationSearch', { previousData: { branchName, storeLocation, licenseNumber, gstNumber, contactPerson, email, phone, city, state, pincode, country, showContactPerson } })}>
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
            <Text style={styles.subHeading}>Contact Person Details</Text>
            <TextInput label="Contact Person Name" value={contactPerson} onChangeText={setContactPerson} style={styles.input} mode="outlined" theme={DefaultTheme} />
            <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" mode="outlined" theme={DefaultTheme} />
            <TextInput label="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" mode="outlined" theme={DefaultTheme} />
          </>
        )}
        <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Submit</Text>}
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
export default PharmacyDetails;
