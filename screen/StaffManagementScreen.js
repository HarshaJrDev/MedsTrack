// src/screens/StaffManagementScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import RoleManagement from '../types/RoleManagement';
import ActivityLog from '../components/ActivityLog';
import RNPickerSelect from 'react-native-picker-select';
import {ROLES, PERMISSIONS} from '../types/staffTypes';

// Sample staff data
const initialStaff = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Pharmacist',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Assistant',
    email: 'jane.smith@example.com',
    phone: '+1 234 567 891',
    status: 'active',
  },
];

const StaffManagementScreen = () => {
  // State management
  const [staff, setStaff] = useState(initialStaff);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [activityLogVisible, setActivityLogVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });

  // Filtering and search logic
  const filteredStaff = staff.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'active')
      return matchesSearch && member.status === 'active';
    if (activeFilter === 'inactive')
      return matchesSearch && member.status === 'inactive';
    return (
      matchesSearch && member.role.toLowerCase() === activeFilter.toLowerCase()
    );
  });

  // Handler functions
  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const staffMember = {
      id: Date.now().toString(),
      ...newStaff,
      status: 'active',
    };

    setStaff([staffMember, ...staff]);
    setModalVisible(false);
    setNewStaff({
      name: '',
      role: '',
      email: '',
      phone: '',
    });
  };

  const handleStatusChange = staffId => {
    setStaff(
      staff.map(member =>
        member.id === staffId
          ? {
              ...member,
              status: member.status === 'active' ? 'inactive' : 'active',
            }
          : member,
      ),
    );
  };

  const handleRoleManagement = staffMember => {
    setSelectedStaff(staffMember);
    setRoleModalVisible(true);
  };

  const handleViewActivity = staffId => {
    setSelectedStaffId(staffId);
    setActivityLogVisible(true);
  };

  const handleRoleUpdate = ({role, permissions}) => {
    setStaff(
      staff.map(member =>
        member.id === selectedStaff?.id
          ? {...member, role, permissions}
          : member,
      ),
    );
    setRoleModalVisible(false);
  };

  // Component for staff statistics
  const StaffStats = () => {
    const stats = [
      {label: 'Total Staff', value: staff.length},
      {label: 'Active', value: staff.filter(s => s.status === 'active').length},
      {
        label: 'Inactive',
        value: staff.filter(s => s.status === 'inactive').length,
      },
    ];

    return (
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Component for filters
  const StaffFilters = () => {
    const filters = [
      {id: 'all', label: 'All'},
      {id: 'active', label: 'Active'},
      {id: 'inactive', label: 'Inactive'},
      ...Object.values(ROLES).map(role => ({
        id: role,
        label: role.charAt(0).toUpperCase() + role.slice(1),
      })),
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter(filter.id)}>
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText,
              ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };


  const renderStaffItem = ({item}) => (
    <View style={styles.staffCard}>
      <View style={styles.staffHeader}>
        <Text style={styles.staffName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: item.status === 'active' ? '#51cf66' : '#ff6b6b'},
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.staffDetails}>
        <Text style={styles.detailText}>Role: {item.role}</Text>
        <Text style={styles.detailText}>Email: {item.email}</Text>
        <Text style={styles.detailText}>Phone: {item.phone}</Text>
      </View>

      

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {backgroundColor: item.status === 'active' ? '#ff6b6b' : '#51cf66'},
          ]}
          onPress={() => handleStatusChange(item.id)}>
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setSelectedStaff(item);
            setNewStaff(item);
            setModalVisible(true);
          }}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: '#ffd43b'}]}
          onPress={() => handleRoleManagement(item)}>
          <Text style={styles.actionButtonText}>Manage Role</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: '#2196F3'}]}
          onPress={() => handleViewActivity(item.id)}>
          <Text style={styles.actionButtonText}>View Activity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main render
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search staff by name, role, or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearch}
              onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedStaff(null);
            setModalVisible(true);
          }}>
          <Text style={styles.addButtonText}>+ Add Staff</Text>
        </TouchableOpacity>
      </View>

      <StaffStats />
      <StaffFilters />

      <FlatList
        data={filteredStaff}
        renderItem={renderStaffItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No staff members found matching your search'
                : 'No staff members yet'}
            </Text>
          </View>
        }
      />

      {/* Add/Edit Staff Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedStaff ? 'Edit Staff Member' : 'Add New Staff'}
              </Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TextInput
                style={styles.modalInput}
                placeholder="Full Name *"
                value={newStaff.name}
                onChangeText={text => setNewStaff({...newStaff, name: text})}
              />

              <View style={styles.roleSelectContainer}>
                <Text style={styles.inputLabel}>Select Role *</Text>
                <RNPickerSelect
  onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
  items={Object.values(ROLES).map((role) => ({
    label: role.charAt(0).toUpperCase() + role.slice(1), // Capitalize first letter
    value: role,
  }))}
  value={newStaff.role}
  style={{
    inputIOS: {
      fontSize: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      color: 'black',
      marginBottom: 10,
      backgroundColor: '#f9f9f9', // Light gray background
    },
    inputAndroid: {
      fontSize: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      color: 'black',
      marginBottom: 10,
      backgroundColor: '#f9f9f9', // Light gray background
    },
    placeholder: {
      color: 'gray',
    },
  }}
/>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="Email *"
                value={newStaff.email}
                onChangeText={text => setNewStaff({...newStaff, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Phone"
                value={newStaff.phone}
                onChangeText={text => setNewStaff({...newStaff, phone: text})}
                keyboardType="phone-pad"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={
                    selectedStaff
                      ? () => {
                          setStaff(
                            staff.map(member =>
                              member.id === selectedStaff.id
                                ? {
                                    ...newStaff,
                                    id: member.id,
                                    status: member.status,
                                  }
                                : member,
                            ),
                          );
                          setModalVisible(false);
                        }
                      : handleAddStaff
                  }>
                  <Text style={styles.buttonText}>
                    {selectedStaff ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>



    



      {/* Activity Log Modal */}
      <ActivityLog
        visible={activityLogVisible}
        onClose={() => setActivityLogVisible(false)}
        staffId={selectedStaffId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  list: {
    padding: 15,
  },
  staffCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  staffDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },

  editButton: {
    backgroundColor: '#2196F3',
  },

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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeModalButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4756ca',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#4756ca',
  },
  saveButton: {
    backgroundColor: '#4756ca',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  clearSearch: {
    position: 'absolute',
    right: 10,
    top: 8,
    padding: 5,
  },
  clearSearchText: {
    color: '#666',
    fontSize: 16,
  },
  filtersContainer: {
    padding: 10, 
    backgroundColor: '#fff', 
    borderRadius: 12, // Slightly larger for a smoother look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4, // Stronger shadow on Android
  },
  
  filterButton: {
    paddingHorizontal: 18, // More padding for a premium feel
    paddingVertical: 10,
    borderRadius: 25, // More rounded for a pill-shaped look
    backgroundColor: '#E3F2FD', // Light blue tint for a fresh look
    marginRight: 12,
    borderWidth: 1, 
    borderColor: '#BBDEFB', // Soft border to enhance visibility
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2', // Darker blue for contrast
    textTransform: 'capitalize', // Consistent text style
  },
  
  activeFilter: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,

  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  roleSelectContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  roleOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedRoleOption: {
    backgroundColor: '#2196F3',
    borderColor: '#2196e2',
  },
  roleOptionText: {
    color: '#333',
  },
  selectedRoleOptionText: {
    color: '#fff',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Distribute buttons evenly
    alignItems: 'center', // Align buttons vertically
    flexWrap: 'wrap', // Prevent overflow by wrapping if needed // Adjust spacing
  },
  actionButton: {
    flex: 1, // Ensure equal width for buttons
    marginHorizontal: 1, // Add spacing between buttons
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  
});

export default StaffManagementScreen;
