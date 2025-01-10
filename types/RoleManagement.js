// src/components/RoleManagement.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../types/staffTypes';

const RoleManagement = ({ visible, onClose, onSave, initialRole = ROLES.ASSISTANT }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [customPermissions, setCustomPermissions] = useState(
    ROLE_PERMISSIONS[initialRole]
  );

  const handlePermissionToggle = (permission) => {
    if (customPermissions.includes(permission)) {
      setCustomPermissions(customPermissions.filter(p => p !== permission));
    } else {
      setCustomPermissions([...customPermissions, permission]);
    }
  };

  const handleSave = () => {
    onSave({ role: selectedRole, permissions: customPermissions });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Role Management</Text>
          
          <ScrollView>
            <View style={styles.roleSection}>
              <Text style={styles.sectionTitle}>Select Role</Text>
              {Object.values(ROLES).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    selectedRole === role && styles.selectedRole
                  ]}
                  onPress={() => {
                    setSelectedRole(role);
                    setCustomPermissions(ROLE_PERMISSIONS[role]);
                  }}
                >
                  <Text style={[
                    styles.roleText,
                    selectedRole === role && styles.selectedRoleText
                  ]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.permissionSection}>
              <Text style={styles.sectionTitle}>Permissions</Text>
              {Object.values(PERMISSIONS).map((permission) => (
                <View key={permission} style={styles.permissionItem}>
                  <Text style={styles.permissionText}>
                    {permission.split('_').join(' ').toUpperCase()}
                  </Text>
                  <Switch
                    value={customPermissions.includes(permission)}
                    onValueChange={() => handlePermissionToggle(permission)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2196F3',
  },
  roleButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedRole: {
    backgroundColor: '#2196F3',
  },
  roleText: {
    fontSize: 16,
  },
  selectedRoleText: {
    color: '#fff',
  },
  permissionSection: {
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
  },
  saveButton: {
    backgroundColor: '#51cf66',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RoleManagement;