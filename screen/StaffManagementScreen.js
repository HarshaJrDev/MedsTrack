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
import {ROLES, PERMISSIONS} from '../types/staffTypes';
import CustomPicker from '../components/UI/Reusebale/CustomPicker/CustomPicker';

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

// Define color palette for consistency
const COLORS = {
  primary: '#4756CA',
  secondary: '#6C757D',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  lightGray: '#E9ECEF',
  mediumGray: '#CED4DA',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  background: '#F5F7FA',
};

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
      Alert.alert('Required Fields', 'Please fill in all required fields');
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
      {label: 'Total Staff', value: staff.length, color: COLORS.primary},
      {
        label: 'Active', 
        value: staff.filter(s => s.status === 'active').length,
        color: COLORS.success
      },
      {
        label: 'Inactive',
        value: staff.filter(s => s.status === 'inactive').length,
        color: COLORS.danger
      },
    ];

    return (
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={[styles.statValue, {color: stat.color}]}>{stat.value}</Text>
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
              activeFilter === filter.id && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(filter.id)}>
            <Text
              style={[
                styles.filterButtonText,
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
            {backgroundColor: item.status === 'active' ? COLORS.success : COLORS.danger},
          ]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.staffDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Role:</Text>
          <Text style={styles.detailValue}>{item.role}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {backgroundColor: item.status === 'active' ? COLORS.primary : COLORS.primary},
            ]}
            onPress={() => handleStatusChange(item.id)}>
            <Text style={styles.actionButtonText}>
              {item.status === 'active' ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: COLORS.primary}]}
            onPress={() => {
              setSelectedStaff(item);
              setNewStaff(item);
              setModalVisible(true);
            }}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: COLORS.primary}]}
            onPress={() => handleRoleManagement(item)}>
            <Text style={styles.actionButtonText}>Manage Role</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: COLORS.primary}]}
            onPress={() => handleViewActivity(item.id)}>
            <Text style={styles.actionButtonText}>View Activity</Text>
          </TouchableOpacity>
        </View>
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
            placeholderTextColor={COLORS.textSecondary}
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
            setNewStaff({
              name: '',
              role: '',
              email: '',
              phone: '',
            });
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
        <View style={styles.modalOverlay}>
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

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScrollView}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder='Please enter fullName'
                  placeholderTextColor={COLORS.textSecondary}
                  value={newStaff.name}
                  onChangeText={text => setNewStaff({...newStaff, name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Role *</Text>
                <CustomPicker
                  selectedValue={newStaff.role}
                  onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                placeholder='Please enter email'
                  style={styles.modalInput}
                  placeholderTextColor={COLORS.textSecondary}
                  value={newStaff.email}
                  onChangeText={text => setNewStaff({...newStaff, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                placeholder='Please enter phone number'
                  style={styles.modalInput}
                  placeholderTextColor={COLORS.textSecondary}
                  value={newStaff.phone}
                  onChangeText={text => setNewStaff({...newStaff, phone: text})}
                  keyboardType="phone-pad"
                />
              </View>

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
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    height: 44,
    backgroundColor: COLORS.lightGray,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingRight: 40,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  clearSearch: {
    position: 'absolute',
    right: 12,
    top: 11,
    padding: 4,
  },
  clearSearchText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    marginLeft: 12,
    elevation: 2,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Stats styling
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    marginVertical: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  
  // Filters styling
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    marginBottom: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
  },
  filterButton: {
    paddingHorizontal: 16,
    alignItems:"center",
    justifyContent:"center",

    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    height:30
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  
  // List and card styling
  list: {
    padding: 12,
  },
  staffCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 12,
  },
  
  // Staff details styling
  staffDetails: {
    marginBottom: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 50,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  
  // Action buttons styling
  actionButtonsContainer: {
    gap: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  
  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeModalButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.lightGray,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Empty state styling
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StaffManagementScreen;