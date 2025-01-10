// src/screens/PrescriptionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';

// Sample data
const initialPrescriptions = [
  {
    id: '1',
    patientName: 'John Doe',
    patientId: 'PT001',
    doctorName: 'Dr. Smith',
    date: '2024-10-22',
    status: 'pending',
    medications: [
      { 
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '7 days'
      },
      {
        name: 'Paracetamol',
        dosage: '650mg',
        frequency: 'As needed',
        duration: '5 days'
      }
    ],
    notes: 'Take with meals'
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    patientId: 'PT002',
    doctorName: 'Dr. Johnson',
    date: '2024-10-21',
    status: 'completed',
    medications: [
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Twice daily',
        duration: '5 days'
      }
    ],
    notes: 'Avoid alcohol'
  }
];

const PrescriptionScreen = () => {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    patientId: '',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    medications: [],
    notes: '',
    status: 'pending'
  });
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
      Alert.alert('Error', 'Please fill in all required medication fields');
      return;
    }
    
    setNewPrescription({
      ...newPrescription,
      medications: [...newPrescription.medications, { ...newMedication }]
    });
    
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      duration: ''
    });
  };

  const handleAddPrescription = () => {
    if (!newPrescription.patientName || !newPrescription.patientId || !newPrescription.doctorName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (newPrescription.medications.length === 0) {
      Alert.alert('Error', 'Please add at least one medication');
      return;
    }

    const prescription = {
      id: Date.now().toString(),
      ...newPrescription
    };

    setPrescriptions([prescription, ...prescriptions]);
    setModalVisible(false);
    setNewPrescription({
      patientName: '',
      patientId: '',
      doctorName: '',
      date: new Date().toISOString().split('T')[0],
      medications: [],
      notes: '',
      status: 'pending'
    });
  };

  const handleStatusChange = (prescriptionId, newStatus) => {
    setPrescriptions(prescriptions.map(prescription =>
      prescription.id === prescriptionId
        ? { ...prescription, status: newStatus }
        : prescription
    ));
  };

  const renderPrescriptionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.prescriptionCard}
      onPress={() => {
        setSelectedPrescription(item);
        setDetailModalVisible(true);
      }}
    >
      <View style={styles.prescriptionHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'completed' ? '#51cf66' : '#ffd43b' }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.prescriptionDetails}>
        <Text style={styles.detailText}>Patient ID: {item.patientId}</Text>
        <Text style={styles.detailText}>Doctor: {item.doctorName}</Text>
        <Text style={styles.detailText}>Date: {item.date}</Text>
        <Text style={styles.detailText}>
          Medications: {item.medications.length} items
        </Text>
      </View>

      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => handleStatusChange(item.id, 'completed')}
          >
            <Text style={styles.buttonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by patient name or ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={"#000"}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPrescriptions}
        renderItem={renderPrescriptionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Add New Prescription Modal */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <ScrollView style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>New Prescription</Text>
        <TouchableOpacity 
          style={styles.closeModalButton}
          onPress={() => {
            setModalVisible(false);
            // Reset form data when closing
            setNewPrescription({
              patientName: '',
              patientId: '',
              doctorName: '',
              date: new Date().toISOString().split('T')[0],
              medications: [],
              notes: '',
              status: 'pending'
            });
            setNewMedication({
              name: '',
              dosage: '',
              frequency: '',
              duration: ''
            });
          }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

            <TextInput
              style={[styles.modalInput, styles.notesInput]}
              placeholder="Notes"
              multiline
              value={newPrescription.notes}
              onChangeText={(text) => setNewPrescription({...newPrescription, notes: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddPrescription}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Prescription Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        {selectedPrescription && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Prescription Details</Text>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Patient</Text>
                <Text style={styles.detailValue}>{selectedPrescription.patientName}</Text>
                <Text style={styles.detailValue}>ID: {selectedPrescription.patientId}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Doctor</Text>
                <Text style={styles.detailValue}>{selectedPrescription.doctorName}</Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Medications</Text>
                {selectedPrescription.medications.map((med, index) => (
                  <View key={index} style={styles.medicationDetail}>
                    <Text style={styles.medicationName}>{med.name}</Text>
                    <Text style={styles.medicationInfo}>Dosage: {med.dosage}</Text>
                    <Text style={styles.medicationInfo}>Frequency: {med.frequency}</Text>
                    <Text style={styles.medicationInfo}>Duration: {med.duration}</Text>
                  </View>
                ))}
              </View>
              
              {selectedPrescription.notes && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Notes</Text>
                  <Text style={styles.detailValue}>{selectedPrescription.notes}</Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
color:"#000"
  },
  addButton: {
    backgroundColor: '#4756ca',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500'
  },
  list: {
    padding: 15
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12
  },
  prescriptionDetails: {
    marginBottom: 10
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  completeButton: {
    backgroundColor: '#51cf66',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 10
  },
  closeModalButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1  // This will ensure the title stays centered
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
    position: 'relative'  // This ensures proper positioning of absolute elements
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  medicationSection: {
    marginTop: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  medicationItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5
  },
  medicationDetails: {
    fontSize: 14,
    color: '#666'
  },
  addMedicationButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#ff6b6b'
  },
  saveButton: {
    backgroundColor: '#51cf66'
  },
  detailSection: {
    marginBottom: 20
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2196F3'
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    marginBottom: 3
  },
  medicationDetail: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  medicationInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15
  }
});

export default PrescriptionScreen;