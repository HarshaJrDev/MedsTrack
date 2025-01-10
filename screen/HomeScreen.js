import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const DashboardScreen = ({ navigation }) => {
  return (
    <LinearGradient   style={styles.container} colors={['#b6c1ee', '#3f4fb8']}>
          <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>150</Text>
          <Text style={styles.statLabel}>Total Medicines</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Low Stock Items</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Today's Orders</Text>
        </View>
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Inventory')}
        >
          <Text style={styles.menuText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Prescriptions')}
        >
          <Text style={styles.menuText}>Prescriptions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Dispense')}
        >
          <Text style={styles.menuText}>Dispense Medication</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    </LinearGradient>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4756ca',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
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
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default DashboardScreen;