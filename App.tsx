import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

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
import SearchScreen from './screen/SearchScreen';
import AddProduct from './screen/AddProduct';
import PharmacyDetails from './screen/PharmacyForm';
import PharmacyView from './screen/PharmacyScreen';
import LocationSearch from './screen/GetLocationPharmacy';
import LocationConfirmation from './screen/PharmacyLocationConfirmation';
import { LocationProvider } from './Context/AppContext';
import BranchFormStore from './screen/BranchForm';
import BranchScreen from './screen/BranchScreen';
import BranchLocationConfirmation from './screen/BranchLocationConfirmation';
import GetLocationBranch from './screen/GetLocationBranch';
import SwitchBranchAndPharmacy from './screen/SwitchBranchAndPharmacy';
import AddComposition from './screen/AddComposition';

const rnBiometrics = new ReactNativeBiometrics();

// Biometric Authentication Function
const authenticateBiometrically = async () => {
  try {
    const { biometryType } = await rnBiometrics.isSensorAvailable();

    if (biometryType) {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access',
      });
      return result.success;
    } else {
      Alert.alert('Biometrics Not Available', 'Your device does not support biometric authentication.');
      return false;
    }
  } catch (error) {
    console.error('Error during biometric authentication:', error);
    Alert.alert('Authentication Error', 'An error occurred during authentication.');
    return false;
  }
};

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const [userData, setUserData] = useState({
    name: 'User',
    email: 'user@example.com',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData({
            name: parsedData.name || 'User',
            email: parsedData.email || 'user@example.com',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userData');
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          } catch (error) {
            console.error('Error during sign out:', error);
          }
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Image source={require('../MedsTrack/assets/profile-placeholder.webp')} style={styles.profileImage} />
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem label="Sign Out" labelStyle={{ color: 'white' }} onPress={handleSignOut} style={{ marginTop: 20 }} />
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: { backgroundColor: '#4756ca' },
      headerTintColor: '#fff',
      drawerActiveTintColor: '#fff',
      drawerInactiveTintColor: '#fff',
      drawerType: 'front',
      drawerStyle: { backgroundColor: '#4756ca' },
    }}
  >
    <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    <Drawer.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
    <Drawer.Screen name="Prescriptions" component={PrescriptionScreen} options={{ title: 'Prescriptions' }} />
    <Drawer.Screen name="Dispense" component={DispenseScreen} options={{ title: 'Dispense' }} />
    <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    <Drawer.Screen name="StaffManagement" component={StaffManagementScreen} options={{ title: 'Staff Management' }} />
    <Drawer.Screen name="SwitchBranchAndPharmacy" component={SwitchBranchAndPharmacy}/>
  </Drawer.Navigator>
);

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="MainApp" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="BranchScreen" component={BranchScreen} options={{headerShown:false}} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
    <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} options={{ headerShown:false }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgot Password' }} />
    <Stack.Screen name="VerifyOtp" component={VerifyOtp} options={{ title: 'Verify OTP' }} />
    <Stack.Screen name="BranchFormStore" component={BranchFormStore} options={{ title: 'Add New Store' }} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: true, headerTitleStyle: { fontSize: 15 } }} />
    <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerTitleStyle: { fontSize: 15 } }} />
    <Stack.Screen name="LocationSearch" component={LocationSearch} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="PharmacyDetails" component={PharmacyDetails} options={{ headerTitleStyle: { fontSize: 15 } ,headerShown: false}} />
    <Stack.Screen name="PharmacyView" component={PharmacyView} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="LocationConfirmation" component={LocationConfirmation} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="BranchLocationConfirmation" component={BranchLocationConfirmation} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="GetLocationBranch" component={GetLocationBranch} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="AddComposition" component={AddComposition} options={{ headerTitleStyle: { fontSize: 15 }, title:"Composition",headerShown: true }} />
  </Stack.Navigator>
);

const HomeNavigator = () => (
  <Stack.Navigator initialRouteName="MainApp">
    <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Inventory" component={InventoryScreen} options={{ headerShown: true, title: 'Inventory' }} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: true, headerTitleStyle: { fontSize: 15 } }} />
    <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false, headerTitleStyle: { fontSize: 15 } }} />
    <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} options={{ headerShown:false }} />
    <Stack.Screen name="BranchScreen" component={BranchScreen} options={{headerShown:false}} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login',headerShown: false }} />
    <Stack.Screen name="BranchFormStore" component={BranchFormStore} options={{ title: 'Add New Store' }} />
    <Stack.Screen name="PharmacyDetails" component={PharmacyDetails} options={{ headerTitleStyle: { fontSize: 15 } ,headerShown: false}} />
    <Stack.Screen name="PharmacyView" component={PharmacyView} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="LocationSearch" component={LocationSearch} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="LocationConfirmation" component={LocationConfirmation} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="BranchLocationConfirmation" component={BranchLocationConfirmation} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="GetLocationBranch" component={GetLocationBranch} options={{ headerTitleStyle: { fontSize: 15 },headerShown: false }} />
    <Stack.Screen name="AddComposition" component={AddComposition} options={{ headerTitleStyle: { fontSize: 15 }, title:"Composition",headerShown: true }} />
  </Stack.Navigator>
);

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginCredentials = async () => {
      try {
        const token = await AsyncStorage.getItem('userData');
        if (token) {
          const authenticated = await authenticateBiometrically();
          if (authenticated) {
            setIsLogin(true);
          } else {
            await AsyncStorage.removeItem('userData');
            setIsLogin(false);
          }
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error('Error checking login credentials:', error);
        setIsLogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginCredentials();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
         <Stack.Screen name="AddNewStore" component={BranchFormStore} options={{ title: 'Add New Store' }} />
        <ActivityIndicator size="large" color="#4756ca" />
      </View>
    );
  }

  return (
    <LocationProvider>
       <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          {isLogin ? <HomeNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>

    </LocationProvider>
   
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#4756ca',
    width: '100%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
