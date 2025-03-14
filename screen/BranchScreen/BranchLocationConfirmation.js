import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView,TouchableOpacity} from 'react-native';
import {TextInput, Button, DefaultTheme} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppContext} from '../../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LeftArrow from 'react-native-vector-icons/AntDesign'


const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000',
    primary: '#4756ca',
  },
};

const LocationConfirmation = () => {

  const [SelectedLocation,setSelectedLocation]=useState('')
  const navigation = useNavigation();
  const route = useRoute();
  const {
    fullAddress,
    setFullAddress,
    landmark,
    setLandmark,
    lat,
    setLat,
    lon,
    setLon,
    pincode,
    setPincode,
  } = useContext(AppContext);

  // Populate context from route params
  useEffect(() => {
    if (route.params) {
      setFullAddress(route.params.fullAddress || '');
      setLandmark(route.params.landmark || '');
      setLat(route.params.lat || null);
      setLon(route.params.lon || null);
    }
    getStoredLocation()
  }, [route.params]);
  const handleConfirm = () => {
    navigation.replace('BranchFormStore', {selectedLocation: fullAddress});
  };

  const getStoredLocation = async () => {
    try {
      const storedData = await AsyncStorage.getItem("favoriteLocations");
      if (storedData !== null) {
        const location = JSON.parse(storedData);
        console.log("Retrieved Location:", location);
        setSelectedLocation(location);
      } else {
        console.log("No stored location found.");
      }
    } catch (error) {
      console.error("Error retrieving location:", error);
    }
  };
  





  return (
    <ScrollView>
      <View style={styles.container}>
        <View  style={{marginVertical:10}}>
          <TouchableOpacity onPress={()=>navigation.navigate('GetLocationBranch')}>
          <LeftArrow  name={'left'} size={20}/>
          </TouchableOpacity>

        </View>
        <Text style={styles.heading}>Confirm Branch Location</Text>

        <TextInput
          label="Full Address"
          value={fullAddress}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
          editable={false}
        />
        <TextInput
          label="Landmark"
          value={landmark}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
          editable={false}
        />
        {/* <Text>{fullAddress}</Text> */}

        <TextInput
          label="Latitude"
          value={lat?.toString()}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
          editable={false}
        />
        <TextInput
          label="Longitude"
          value={lon?.toString()}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
          editable={false}
        />

        <Button
          mode="contained"
          onPress={handleConfirm}
          style={styles.button}
          labelStyle={{color: 'white'}}>
          Confirm
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  heading: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  input: {marginBottom: 10, backgroundColor: 'white'},
  button: {marginTop: 20, backgroundColor: '#4756ca'},
});

export default LocationConfirmation;
