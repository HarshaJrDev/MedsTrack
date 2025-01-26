import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'react-native-animatable';
import * as Reanimatable from 'react-native-animatable';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const LoginScreen = () => {
    const [isActivepassword, setisActivepassword] = useState(false);
    const [isusernameactive, setisusernameactive] = useState('');
  const navigation = useNavigation();
  const animationRef = useRef(null);
  const [isvisiable, setisvisiable] = useState(false);
  const [selectedOption, setSelectedOption] = useState('phone');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill(''));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isActiveemail, setisActivee] = useState(false);
  const [isActive, setisActive] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [username, setusername] = useState('');
  const [timer, setTimer] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
      const [passwordError, setPasswordError] = useState('');
  const inputRefs = useRef([]);


  const validateUsername = text => {
    // Regular expression for validation
    const usernameRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(text)) {
      setErrorMessage(
        'Username must be at least 8 characters long, include a special character, uppercase, lowercase, and a number.',
      );
    } else {
      setErrorMessage('');
    }

    setusername(text);
  };

  useEffect(() => {
    if (animationRef.current) {
      // Play the animation
      animationRef.current.play();

      // Stop the animation after 2 seconds
      const timer = setTimeout(() => {
        animationRef.current?.pause(); // Pause or stop the animation
      }, 10);

      // Cleanup timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  const validatePassword = text => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(text)) {
      setPasswordError(
        'Password must be at least 8 characters, include a special character, uppercase, lowercase, and a number.',
      );
    } else {
      setPasswordError('');
    }
    setPassword(text);
  };


  const handleLoginWithEmail =  async () => {
    console.log('Starting handleVerify...');
    
    // Check for missing fields
    if (!email || !password || !username) {
      console.log('Missing fields:', { email, password, username });
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'All fields are required.',
      });
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log('Invalid email format:', email.trim());
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }
  
    try {
      console.log('Sending registration request...');
      const response = await axios.post(
        'https://britepharma-dev.bliptyn.com/api/v1/auth/login',
        {
          email: email.trim(),
          password: password,
          username: username,
        }
      );
  
      console.log('API Response:', response.data);
  
      if (response.status === 200) {
        console.log('Registration successful:', response.data);
  
        const userData = {
          email: email.trim(),
          password: password,
          username: username,
        };
  
        console.log('Saving user data to AsyncStorage:', userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Welcome to the app!',
        });
  
        console.log('Navigating to AddProduct...');
        setisvisiable(!isvisiable);
        navigation.replace('AddProduct');
      } else {
        console.log('Registration failed with status:', response.status);
        Alert.alert(
          'Registration Failed',
          'An error occurred. Please try again.'
        );
      }
    } catch (error) {
      console.error(
        'Error during registration:',
        error.response?.data || error.message
      );
  
      const errorMessage =
        error.response?.data?.message ||
        'Something went wrong. Please try again later.';
      Alert.alert('Error', errorMessage);
    } finally {
      console.log('Resetting visibility...');
      setisvisiable(!isvisiable);
  
      setTimeout(() => {
        console.log('Replacing navigation to OnBoarding...');
        navigation.replace('OnBoarding');
      }, 100);
    }
  };
  




  const handleSendOtp = () => {
    showSuccessToast();
    setIsOtpSent(true);
    setIsTimerActive(true);
    setTimer(30);
    console.log('Timer started');
  };

  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: 'OTP Sent!',
      text2: 'The OTP has been sent successfully.',
    });
  };

  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleInputChange = (text, index) => {
    const digits = text.split('');
    const newOtpInputs = [...otpInputs];

    if (digits.length === 6) {
      setOtpInputs(digits);
      digits.forEach((digit, i) => {
        inputRefs.current[i]?.setNativeProps({text: digit});
      });
      inputRefs.current[5]?.focus();
    } else {
      newOtpInputs[index] = text;
      setOtpInputs(newOtpInputs);

      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (text, index) => {
    if (text === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  useEffect(() => {}, [navigation]);

  useEffect(() => {
    return () => {};
  }, []);

  const handleVerify = async () => {
    console.log('Starting handleVerify...');
    
    // Check for missing fields
    if (!email || !password || !username) {
      console.log('Missing fields:', { email, password, username });
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'All fields are required.',
      });
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log('Invalid email format:', email.trim());
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }
  
    try {
      console.log('Sending registration request...');
      const response = await axios.post(
        'https://britepharma-dev.bliptyn.com/api/v1/auth/login',
        {
          email: email.trim(),
          password: password,
          username: username,
        }
      );
  
      console.log('API Response:', response.data);
  
      if (response.status === 200) {
        console.log('Registration successful:', response.data);
  
        const userData = {
          email: email.trim(),
          password: password,
          username: username,
        };
  
        console.log('Saving user data to AsyncStorage:', userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Welcome to the app!',
        });
  
        console.log('Navigating to AddProduct...');
        setisvisiable(!isvisiable);
        navigation.replace('AddProduct');
      } else {
        console.log('Registration failed with status:', response.status);
        Alert.alert(
          'Registration Failed',
          'An error occurred. Please try again.'
        );
      }
    } catch (error) {
      console.error(
        'Error during registration:',
        error.response?.data || error.message
      );
  
      const errorMessage =
        error.response?.data?.message ||
        'Something went wrong. Please try again later.';
      Alert.alert('Error', errorMessage);
    } finally {
      console.log('Resetting visibility...');
      setisvisiable(!isvisiable);
  
      setTimeout(() => {
        console.log('Replacing navigation to OnBoarding...');
        navigation.replace('OnBoarding');
      }, 100);
    }
  };
  







  
  const handleforgotpassword = () => {
    navigation.push('ForgotPassword');
  };

  return (
    <Reanimatable.View
      animation="fadeIn"
      duration={500}
      style={styles.MainContainer}>
      <KeyboardAvoidingView
        style={[styles.MainContainer]}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            style={styles.MainContainer}
            colors={['#4756ca', '#616dc7']}>
            <View style={styles.HeaderConatiner}>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  bottom: SCREEN_HEIGHT * 0.03,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Nunito-Regular',
                    top: 10,
                  }}>
                  Don't have an account?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('RegistrationScreen')}>
                <LinearGradient
                  colors={['#AAB3E580', '#AAB3E580']}
                  style={[styles.Box]}>
                  <Text
                    style={{
                      fontFamily: 'Nunito-Bold',
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                    Get Started
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{bottom: SCREEN_HEIGHT * 0.02}}>
              <Toast />
            </View>
            <View style={styles.CompanyTittleContainer}>
              <Text style={styles.CompanyTittle}>MedsTrack</Text>
              <View>
                <Image
                  source={require('../assets/logo-removebg-preview.png')}
                  style={styles.logo}
                />
              </View>
            </View>

            <LinearGradient
              colors={['#AAB3E5', '#4752ca']}
              style={styles.LowerContainer}></LinearGradient>

            <View style={styles.UpperContainer}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: SCREEN_HEIGHT * 0.03,
                }}>
                <Text
                  style={{
                    fontFamily: 'Nunito-Bold',
                    color: '#000',
                    fontSize: SCREEN_HEIGHT * 0.04,
                  }}>
                  Welcome Back
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito-Regular',
                    color: '#000',
                    fontSize: SCREEN_HEIGHT * 0.021,
                  }}>
                  Enter your details below
                </Text>
              </View>

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedOption === 'phone' && styles.activeToggleButton,
                  ]}
                  onPress={() => {
                    setSelectedOption('phone');
                    setIsOtpSent(false);
                  }}>
                  <Text
                    style={[
                      styles.toggleButtonText,
                      selectedOption === 'phone' &&
                        styles.activeToggleButtonText,
                    ]}>
                    Phone/OTP
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedOption === 'email' && styles.activeToggleButton,
                  ]}
                  onPress={() => setSelectedOption('email')}>
                  <Text
                    style={[
                      styles.toggleButtonText,
                      selectedOption === 'email' &&
                        styles.activeToggleButtonText,
                    ]}>
                    Email/Password
                  </Text>
                </TouchableOpacity>
              </View>
              {selectedOption === 'phone' ? (
                <>
                  <View>
                    <TextInput
                      onBlur={() => setisActive(false)}
                      onFocus={() => setisActive(true)}
                      style={[
                        styles.Whiteinput,
                        {borderColor: isActive ? '#4752ca' : '#fff'},
                        {top: -SCREEN_HEIGHT * 0.03},
                      ]}
                      placeholder="Enter Phone Number"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholderTextColor="#000"
                      keyboardType="phone-pad"
                    />
                  </View>
                  {isOtpSent && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '100%',
                        columnGap: 17,
                        marginBottom: 20,
                        right: SCREEN_HEIGHT * 0.005,
                      }}>
                      {otpInputs.map((_, index) => (
                        <TextInput
                          key={index}
                          ref={el => (inputRefs.current[index] = el)}
                          value={otpInputs[index]}
                          onChangeText={text => handleInputChange(text, index)}
                          onKeyPress={({nativeEvent}) => {
                            if (nativeEvent.key === 'Backspace') {
                              handleBackspace(otpInputs[index], index);
                            }
                          }}
                          style={[
                            styles.otpInput,
                            {
                              borderColor: otpInputs[index]
                                ? '#4752ca'
                                : '#000',
                            },
                          ]}
                          keyboardType="number-pad"
                          maxLength={6}
                          blurOnSubmit={index === otpInputs.length - 1}
                        />
                      ))}
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginHorizontal: SCREEN_WIDTH * 0.05,
                    }}>
                    <TouchableOpacity
                      disabled={isTimerActive}
                      onPress={handleSendOtp}>
                      <Text
                        style={{
                          fontSize: 15,
                          textAlign: 'right',
                          fontFamily: 'Nunito-Regular',
                          color: isTimerActive ? '#000' : '#000',
                        }}>
                        {isOtpSent ? '' : ''}
                      </Text>
                    </TouchableOpacity>
                    {isTimerActive && (
                      <View style={{bottom: SCREEN_HEIGHT * 0.01}}>
                        <Text
                          style={{
                            color: '#4752ca',
                            fontSize: 16,
                            fontFamily: 'Nunito-Regular',
                          }}>
                          Wait {timer}s
                        </Text>
                      </View>
                    )}
                  </View>
                  {!isOtpSent ? (
                    <LinearGradient
                      colors={['#4756ca', '#616dc7']}
                      style={[
                        styles.loginButton,
                        {top: -SCREEN_HEIGHT * 0.03},
                      ]}>
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleSendOtp}>
                        <Text style={styles.loginButtonText}>Verify OTP </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  ) : (
                    <LinearGradient
                      colors={['#4756ca', '#616dc7']}
                      style={styles.loginButton}>
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleVerify}>
                        <Text style={styles.loginButtonText}>Login</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  )}
                </>
              ) : (
                <>

<TextInput
                                      onBlur={() => setisusernameactive(false)}
                                      onFocus={() => setisusernameactive(true)}
                                      style={[
                                        styles.Whiteinput,
                                        {
                                          borderColor: isusernameactive ? '#4752ca' : '#fff',
                                        },{top: -SCREEN_HEIGHT * 0.04}
                                   
                                      ]}
                                      placeholder="User name"
                                      value={username}
                                      onChangeText={validateUsername}
                                      placeholderTextColor="#000"
                                      keyboardType="default"
                                    />
                                    {errorMessage ? (
                                      <Text
                                        style={{
                                          color: 'red',
                                          width:SCREEN_HEIGHT*0.4,
                                          fontSize: 12,
                                 bottom:SCREEN_HEIGHT * 0.03,
                                          left: SCREEN_HEIGHT * 0.03,
                                        }}>
                                        {errorMessage}
                                      </Text>
                                    ) : null}
                  <TextInput
                    onBlur={() =>setisActivee(false)}
                    onFocus={() =>setisActivee(true)}
                    style={[
                      styles.Whiteinput,
                      {borderColor: isActiveemail ? '#4752ca' : '#fff'},
                      {top: -SCREEN_HEIGHT * 0.02},
                    ]}
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#000"
                  />
                       <TextInput
                                        onBlur={() => setisActivepassword(false)}
                                        onFocus={() => setisActivepassword(true)}
                                        style={[
                                          styles.Whiteinput,
                                          {
                                            borderColor: isActivepassword ? '#4752ca' : '#fff',
                                          }, 
                                        ]}
                                        placeholder="Enter Password"
                                        value={password}
                                        onChangeText={validatePassword}
                                        placeholderTextColor="#000"
                                        secureTextEntry
                                        keyboardType="default"
                                      />
                                      {passwordError ? (

                             
                           <Text
                           style={{
                            width:SCREEN_HEIGHT*0.4,
                
                             color: 'red',
                             fontSize: 12,
        
                             left: SCREEN_HEIGHT * 0.04,
            
                           }}>
                                          {passwordError}
                                        </Text>
                                      ) : null}
                
                  <LinearGradient
                    colors={['#4756ca', '#616dc7']}
                    style={[styles.loginButton,{top:SCREEN_HEIGHT*0.02}]}>
                    <TouchableOpacity
                      style={[styles.loginButton]}
                      onPress={handleLoginWithEmail}>
                      <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </>
              )}
              {selectedOption === 'email' && (
                <Text onPress={handleforgotpassword} style={styles.forgotLabel}>
                  Forgot Password?
                </Text>
              )}
            </View>
            <Modal animationType="slide" transparent visible={isvisiable}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                <View
                  style={{
                    height: 200,
                    width: 200,
                    backgroundColor: '#4a5556',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <LottieView
                    style={{height: 150, width: 150}}
                    duration={14}
                    ref={animationRef}
                    autoPlay
                    loop
                    source={require('../assets/Sucessfull.json')}
                  />
                </View>
              </View>
            </Modal>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </Reanimatable.View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  LowerContainer: {
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.93,
    marginHorizontal: SCREEN_WIDTH * 0.03,
    borderTopLeftRadius: SCREEN_HEIGHT * 0.05,
    borderTopRightRadius: SCREEN_HEIGHT * 0.05,
  },
  UpperContainer: {
    marginBottom: -SCREEN_HEIGHT * 0.05,
    borderTopLeftRadius: SCREEN_HEIGHT * 0.05,
    borderTopRightRadius: SCREEN_HEIGHT * 0.05,
    zIndex: 1,
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.8,
    bottom: SCREEN_HEIGHT * 0.03,
  },
  CompanyTittle: {
    fontFamily: 'Nunito-Bold',
    fontSize: SCREEN_HEIGHT * 0.035,
    color: '#fff',
    textAlign: 'center',
    top: SCREEN_HEIGHT * 0.1,
  },
  CompanyTittleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  Box: {
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.3,
    marginLeft: SCREEN_WIDTH * 0.06,
    justifyContent: 'center',
    borderRadius: SCREEN_HEIGHT * 0.01,
    bottom: SCREEN_HEIGHT * 0.03,
  },
  HeaderConatiner: {
    top: SCREEN_HEIGHT * 0.04,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: SCREEN_WIDTH * 0.05,
    bottom: SCREEN_HEIGHT * 0.025,
  },
  logo: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_HEIGHT * 0.06,
    borderRadius: SCREEN_HEIGHT * 0.01,
    backgroundColor: '#E4E1F3',
    bottom: SCREEN_HEIGHT * 0.06,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SCREEN_HEIGHT * 0.012,
    alignItems: 'center',
    borderRadius: SCREEN_HEIGHT * 0.01,
    marginHorizontal: SCREEN_WIDTH * 0.01,
    justifyContent: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#fff',
    borderRadius: SCREEN_HEIGHT * 0.025,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.01,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: SCREEN_HEIGHT * 0.002,
    },
    shadowOpacity: 0.25,
    shadowRadius: SCREEN_HEIGHT * 0.004,
    elevation: 5,
  },
  toggleButtonText: {
    color: '#000',
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Regular',
  },
  activeToggleButtonText: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
  },
  Whiteinput: {
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1,
    color: '#000',
    borderRadius: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    backgroundColor: '#E4E1F3',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.9,
  },
  loginButton: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
    borderRadius: SCREEN_HEIGHT * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

  },
  loginButtonText: {
    color: '#fff',
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Regular',
  },
  forgotLabel: {
    color: '#000',
    fontSize: SCREEN_HEIGHT * 0.02,
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
    fontFamily: 'Nunito-Regular',
  },
  ImageContainer: {
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  SignupContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: SCREEN_HEIGHT * 0.55,
    position: 'absolute',
    marginLeft: SCREEN_WIDTH * 0.02,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  OtpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpInput: {
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.1,
    borderWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: SCREEN_WIDTH * 0.015,
    color: '#4752ca',
    fontSize: SCREEN_HEIGHT * 0.022,
    marginLeft: SCREEN_WIDTH * 0.02,
  },
});
