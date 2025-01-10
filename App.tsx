import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// Import screens
import LoginScreen from './Auth/LoginScreen';
import DashboardScreen from './screen/HomeScreen';
import InventoryScreen from './screen/InventoryScreen';
import PrescriptionScreen from './screen/PrescriptionScreen';
import DispenseScreen from './screen/DispenseScreen';
import ProfileScreen from './screen/ProfileScreens';
import StaffManagementScreen from './screen/StaffManagementScreen';
import SplashScreen from './Auth/SplashScreen';
import RegistrationScreen from './Auth/RegistrationScreen';
import ForgotPassword from './Auth/ForgotScreen';
import VerifyOtp from './Auth/VerifyOtp';
import AddNewStore from './screen/AddNewStore';
import OnBoarding from './screen/OnBoarding';
import SearchScreen from './screen/SearchScreen';

// Custom Drawer Content
const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    {/* Profile Section */}
    <View style={styles.profileContainer}>
      <Image 
        source={require('../MedsTrack/assets/profile-placeholder.webp')} // Replace with actual profile image URL
        style={styles.profileImage}
      />
      <Text style={styles.profileName}>John Doe</Text> {/* Replace with dynamic user name */}
      <Text style={styles.profileEmail}>johndoe@example.com</Text> {/* Replace with dynamic user email */}
    </View>
    {/* Default Drawer Items */}
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator()
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: {
        backgroundColor: '#4756ca',

      },
      headerTintColor: '#fff',
      drawerActiveTintColor:"#fff",
  
      drawerInactiveTintColor: '#fff',
      drawerType: 'front',
      drawerStyle: {backgroundColor:"#4756ca"}
    }}
  >
    <Drawer.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <Drawer.Screen 
      name="Inventory" 
      component={InventoryScreen} 
      options={{ title: 'Inventory' }}
    />
    <Drawer.Screen 
      name="Prescriptions" 
      component={PrescriptionScreen}
      options={{ title: 'Prescriptions' }}
    />
    <Drawer.Screen 
      name="Dispense" 
      component={DispenseScreen}
      options={{ title: 'Dispense' }}
    />
    <Drawer.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    <Drawer.Screen 
      name="StaffManagement" 
      component={StaffManagementScreen}
      options={{ title: 'Staff Management' }}
    />
  </Drawer.Navigator>
);

// Main App
const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="MainApp"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen 
              name="LoginScreen" 
              component={LoginScreen} 
              options={{ headerShown: false, title: 'Login' }}
            />
            <Stack.Screen 
              name="RegistrationScreen" 
              component={RegistrationScreen} 
              options={{ headerShown: false, title: 'Register' }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPassword} 
              options={{ headerShown: false, title: 'Forgot Password' }}
            />
            <Stack.Screen 
              name="VerifyOtp" 
              component={VerifyOtp} 
              options={{ headerShown: false, title: 'Verify OTP' }}
            />
            <Stack.Screen name="MainApp" component={DrawerNavigator} />
            <Stack.Screen 
              name="AddNewStore" 
              component={AddNewStore} 
              options={{ headerShown: false, title: 'Add New Store' }}
            />
            <Stack.Screen 
              name="Inventory" 
              component={InventoryScreen} 
              options={{ headerShown: true }}
            />
            <Stack.Screen 
              name="SearchScreen" 
              component={SearchScreen} 
              options={{ headerShown: true, title: 'Search Product to add', headerTitleStyle: { fontSize: 15 } }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#4756ca',
    width:"100%",
  
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: '#fff',
    fontSize: 14,
  },
});

export default App;
