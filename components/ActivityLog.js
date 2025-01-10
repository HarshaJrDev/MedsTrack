// src/components/ActivityLog.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';

const ActivityLog = ({ visible, onClose, staffId }) => {
  // Sample activity data - Replace with actual data from your backend
  const [activities] = useState([
    {
      id: '1',
      type: 'LOGIN',
      timestamp: '2024-03-15 09:00:00',
      details: 'User logged in successfully'
    },
    {
      id: '2',
      type: 'DISPENSE',
      timestamp: '2024-03-15 09:30:00',
      details: 'Dispensed medication to patient John Doe'
    },
    {
      id: '3',
      type: 'INVENTORY',
      timestamp: '2024-03-15 10:15:00',
      details: 'Updated stock for Paracetamol'
    }
  ]);

  const getActivityColor = (type) => {
    switch (type) {
      case 'LOGIN':
        return '#2196F3';
      case 'DISPENSE':
        return '#51cf66';
      case 'INVENTORY':
        return '#ffd43b';
      default:
        return '#666';
    }
  };

  const renderActivity = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[
        styles.activityBadge,
        { backgroundColor: getActivityColor(item.type) }
      ]}>
        <Text style={styles.activityType}>{item.type}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityDetails}>{item.details}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Activity Log</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingVertical: 10,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  activityType: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
  },
  activityDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default ActivityLog;