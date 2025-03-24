import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient"; // Import LinearGradient

const ROLES = ["admin", "manager", "staff", "customer"]; // Example roles

const CustomPicker = ({ selectedValue, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      {/* Selected Value Button */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {selectedValue ? selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1) : "Select Role"}
        </Text>
      </TouchableOpacity>

      {/* Modal for Selecting Role */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <LinearGradient colors={["#4756ca", "#4756ca"]} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Role</Text>
            <FlatList
              data={ROLES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    marginBottom: 10,
  },
  pickerText: {
    fontSize: 16,
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "white",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "white",
  },
});

export default CustomPicker;
