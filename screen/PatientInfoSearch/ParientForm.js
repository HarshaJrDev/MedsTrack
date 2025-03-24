import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, DefaultTheme, Button } from 'react-native-paper';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const PatientForm = () => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const handleSubmit = () => {
    // Handle form submission logic (e.g., save data to a database or state management)
    console.log('Patient Name:', patientName);
    console.log('Patient Phone:', patientPhone);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Patient Name"
        value={patientName}
        onChangeText={text => setPatientName(text)}
        style={styles.input}
        theme={DefaultTheme}
        mode="outlined"
      />
      <TextInput
        label="Patient Phone Number"
        value={patientPhone}
        onChangeText={text => setPatientPhone(text)}
        style={styles.input}
        theme={DefaultTheme}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default PatientForm;