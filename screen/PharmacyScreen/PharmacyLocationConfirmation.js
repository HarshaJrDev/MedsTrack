import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { TextInput, Button, DefaultTheme } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppContext } from "../../Context/AppContext";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#000",
    primary: "#4756ca",
  },
};

const LocationConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Use Global Context
  const { fullAddress, setFullAddress, landmark, setLandmark, lat, setLat, lon, setLon, pincode, setPincode } = useContext(AppContext);

  // Populate context from route params
  useEffect(() => {
    if (route.params) {
      setFullAddress(route.params.fullAddress || "");
      setLandmark(route.params.landmark || "");
      setLat(route.params.lat || null);
      setLon(route.params.lon || null);
    }
  }, [route.params]);
  const handleConfirm = () => {
    navigation.replace("PharmacyDetails", { selectedLocation: fullAddress });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Confirm Location</Text>

        <TextInput label="Full Address" value={fullAddress} style={styles.input} mode="outlined" theme={customTheme} editable={false} />
        <TextInput label="Landmark" value={landmark} style={styles.input} mode="outlined" theme={customTheme} editable={false} />
        {/* <Text>{fullAddress}</Text> */}

        <TextInput label="Latitude" value={lat?.toString()} style={styles.input} mode="outlined" theme={customTheme} editable={false} />
        <TextInput label="Longitude" value={lon?.toString()} style={styles.input} mode="outlined" theme={customTheme} editable={false} />

        <Button mode="contained" onPress={handleConfirm} style={styles.button}>
          Confirm
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { marginBottom: 10, backgroundColor: "white" },
  button: { marginTop: 20, backgroundColor: "#4756ca" },
});

export default LocationConfirmation;
