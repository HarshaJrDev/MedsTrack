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
  ActivityIndicator,
} from 'react-native';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'react-native-animatable';
import {useNavigation, StackActions} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as Reanimatable from 'react-native-animatable';
import 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {REG_API} from '@env';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const animationRef = useRef(null);

  const OTP_LENGTH = 6;
  const [confirmpassword, setconfirmpassword] = useState();
  const [isActivepassword, setisActivepassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState('phone');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isActiveemail, setisActiveemail] = useState(false);
  const [isActiveConfirmPassword, setisActiveConfirmPassword] = useState(false);
  const [username, setusername] = useState('');
  const [isusernameactive, setisusernameactive] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [otpInputs, setOtpInputs] = useState(Array(OTP_LENGTH).fill(''));
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isvisiable, setisvisiable] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isactivefirstname, setisactivefirstname] = useState('');
  const [isactivelastname, setisactivelastname] = useState('');
  const [fullName, setfullName] = useState('');
  const [isactivefullname, setisactivefullname] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = React.useState(false);
  const inputRefs = useRef([]);

  const [errorMessage, setErrorMessage] = useState('');

  // const validateUsername = text => {
  //   // Regular expression for validation
  //   const usernameRegex =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //   if (usernameRegex.test(text)) {
  //     setErrorMessage(
  //       'Username must be at least 8 characters long, include a special character, uppercase, lowercase, and a number.',
  //     );
  //   } else {
  //     setErrorMessage('');
  //   }

  //   setusername(text);
  // };

  useEffect(() => {
    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(50, 220);
  }, []);

  const handleLoginWithEmail = async () => {
    // Validate email and password
    if (!email || !password || !confirmpassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'All fields are required.',
      });
      return;
    }
    if (password !== confirmpassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Please ensure both passwords are the same.',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }
    try {
      console.log('Sending login request...');
      const response = await axios.post(
        REG_API,

        {
          email: email.trim(),
          password: password,
          firstName: firstName,
          lastName: lastName,
          fullName: `${firstName} ${lastName}`.trim(),
          username: email.trim(),
        },
      );
      if (response.status === 200) {
        console.log('API Response:', response.data);
        console.log('Login successful');
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome to the app!',
        });

        console.log('Navigating to OnBoarding...');
        navigation.navigate('OnBoarding');
      } else {
        console.log('Login failed with status:', response.status);
        console.log('API Response:', response);
        Alert.alert(
          'Registration Failed',
          'An error occurred. Please try again.',
        );
      }
    } catch (error) {
      console.error(
        'Error during login:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      console.log('Resetting visibility...');
      setisvisiable(!isvisiable);

      setTimeout(() => {
        console.log('Replacing navigation...');
        navigation.reset({
          index: 0, // Set the index to the first screen
          routes: [{name: 'PharmacyView'}], // Provide the correct route name inside an array
        });
      }, 100);
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            setIsOtpSent(false); // Revert to "Send OTP" when timer ends
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000); // Decrease timer every second
    }
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isTimerActive]);

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

  //Main Signup Fucntion

  const handleVerify = async () => {
    if (!email?.trim() || !password || !confirmpassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'All fields are required.',
      });
      return;
    }

    if (password !== confirmpassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Please ensure both passwords are the same.',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    try {
      setLoading(true); // Start loading
      console.log('Sending registration request...');

      const response = await axios.post(REG_API, {
        email: email.trim(),
        password: password,
        fullName: `${firstName} ${lastName}`,
        username: email.trim(),
      });

      console.log('API Response:', response.data);

      if (response.status === 200) {
        const userData = {
          email: email.trim(),
          password: password,
          fullName: `${firstName} ${lastName}`,
          username: email.trim(),
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Welcome to the app!',
        });

        console.log('Navigating to PharmacyView...');
        setisvisiable(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'PharmacyView'}], // ✅ Wrap it in an array with an object
          // Correct format
        });
      } else {
        console.log('Registration failed with status:', response.status);
        Alert.alert(
          'Registration Failed',
          'An error occurred. Please try again.',
        );
      }
    } catch (error) {
      console.error(
        'Error during registration:',
        error.response?.data || error.message,
      );

      const errorMessage =
        error.response?.data?.message ||
        'Something went wrong. Please try again later.';
      Alert.alert('Error', errorMessage);
    } finally {
      console.log('Resetting visibility...');
      setisvisiable(false);
      setLoading(false); // Stop loading
    }
  };

  const validatePassword = text => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(text)) {
      // setPasswordError(
      //   'Password must be at least 8 characters, include a special character, uppercase, lowercase, and a number.',
      // );
    } else {
      setPasswordError('');
    }
    setPassword(text);
  };

  const toastConfig = {
    custom_success: ({text1, text2, ...rest}) => (
      <LinearGradient
        colors={['#4756ca', '#616dc7']}
        style={{height: 20, width: 20}}>
        <Text style={styles.toastText1}>{text1}</Text>
        <Text style={styles.toastText2}>{text2}</Text>
      </LinearGradient>
    ),
  };
  return (
    <Reanimatable.View
      animation="fadeIn"
      duration={500}
      style={styles.MainContainer}>
      {loading ? (
        <View style={styles.MainContainer}>
          <DotIndicator size={8} color="#4756ca" />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : undefined}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
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
                    Already have an account?
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoginScreen')}>
                  <LinearGradient
                    colors={['#AAB3E580', '#AAB3E580']}
                    style={styles.Box}>
                    <Text
                      style={{
                        fontFamily: 'Nunito-Bold',
                        color: '#fff',
                        textAlign: 'center',
                      }}>
                      Login
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{zIndex: 1, top: SCREEN_HEIGHT * 0.18}}>
                <Toast config={toastConfig} />
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
              <Modal
                animationType="slide"
                transparent={true}
                visible={isvisiable}>
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
                      ref={animationRef}
                      autoPlay
                      loop
                      style={{height: 150, width: 150}}
                      source={require('../assets/Sucessfull.json')}
                    />
                  </View>
                </View>
              </Modal>

              <LinearGradient
                colors={['#AAB3E5', '#4752ca']}
                style={styles.LowerContainer}></LinearGradient>

              <View
                style={[
                  styles.UpperContainer,
                  {marginTop: -SCREEN_HEIGHT * 0.03},
                ]}>
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
                    Welcome!
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

                {selectedOption === 'phone' ? (
                  <>
                    <View
                      style={{
                        marginBottom: SCREEN_HEIGHT * 0.05,
                        top: SCREEN_HEIGHT * 0.05,
                      }}>
                      {/* <TextInput
                      onBlur={() => setisusernameactive(false)}
                      onFocus={() => setisusernameactive(true)}
                      style={[
                        styles.Whiteinput,
                        {
                          borderColor: isusernameactive ? '#4752ca' : '#fff',
                        },
                        {bottom: SCREEN_HEIGHT * 0.03},
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
                          fontSize: 12,
                          bottom: SCREEN_HEIGHT * 0.045,
                          left: SCREEN_HEIGHT * 0.02,
                        }}>
                        {errorMessage}
                      </Text>
                    ) : null} */}

                      <TextInput
                        onBlur={() => setisactivefirstname(false)}
                        onFocus={() => setisactivefirstname(true)}
                        style={[
                          styles.Whiteinput,
                          {
                            borderColor: isactivefirstname ? '#4752ca' : '#fff',
                          },
                          {bottom: SCREEN_HEIGHT * 0.03},
                        ]}
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setfirstName}
                        placeholderTextColor="#000"
                        keyboardType="default"
                      />
                      <TextInput
                        onBlur={() => setisactivelastname(false)}
                        onFocus={() => setisactivelastname(true)}
                        style={[
                          styles.Whiteinput,
                          {
                            borderColor: isactivelastname ? '#4752ca' : '#fff',
                          },
                          {bottom: SCREEN_HEIGHT * 0.03},
                        ]}
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setlastName}
                        placeholderTextColor="#000"
                        keyboardType="default"
                      />
                      {/* <TextInput
                      onBlur={() => setisactivefullname(false)}
                      onFocus={() => setisactivefullname(true)}
                      style={[
                        styles.Whiteinput,
                        {
                          borderColor: isactivefullname ? '#4752ca' : '#fff',
                        },
                        {bottom: SCREEN_HEIGHT * 0.03},
                      ]}
                      placeholder="Full name"
                      value={fullName}
                      onChangeText={setfullName}
                      placeholderTextColor="#000"
                      keyboardType="default"
                    /> */}
                      <TextInput
                        onBlur={() => setisActiveemail(false)}
                        onFocus={() => setisActiveemail(true)}
                        style={[
                          styles.Whiteinput,
                          {borderColor: isActiveemail ? '#4752ca' : '#fff'},
                        ]}
                        placeholder="Enter Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#000"
                      />

                      {/* Password Input */}
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
                            color: 'red',
                            fontSize: 12,
                            bottom: SCREEN_HEIGHT * 0.045,
                            left: SCREEN_HEIGHT * 0.02,
                          }}>
                          {passwordError}
                        </Text>
                      ) : null}
                      <TextInput
                        onBlur={() => setisActiveConfirmPassword(false)}
                        onFocus={() => setisActiveConfirmPassword(true)}
                        style={[
                          styles.Whiteinput,
                          {
                            borderColor: isActiveConfirmPassword
                              ? '#4752ca'
                              : '#fff',
                          },
                        ]}
                        placeholder="Enter Confirm Password"
                        value={confirmpassword}
                        onChangeText={text => setconfirmpassword(text)}
                        placeholderTextColor="#000"
                        secureTextEntry
                        keyboardType="default"
                      />
                    </View>
                    <View
                      style={{
                        marginVertical: SCREEN_HEIGHT * 0.02,
                        justifyContent: 'flex-start',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginHorizontal: SCREEN_WIDTH * 0.05,
                          top: -SCREEN_HEIGHT * 0.05,
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
                            {isOtpSent ? 'OTP Sent' : 'Send OTP'}
                          </Text>
                        </TouchableOpacity>
                        {isTimerActive && (
                          <Text
                            style={{
                              color: '#4752ca',
                              fontSize: 16,
                              fontFamily: 'Nunito-Regular',
                            }}>
                            Wait {timer}s
                          </Text>
                        )}
                      </View>
                    </View>

                    {isOtpSent && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: '100%',
                          columnGap: 17,
                          top: -SCREEN_HEIGHT * 0.06,
                          right: SCREEN_HEIGHT * 0.006,
                        }}>
                        {otpInputs.map((_, index) => (
                          <TextInput
                            key={index}
                            ref={el => (inputRefs.current[index] = el)}
                            value={otpInputs[index]}
                            onChangeText={text =>
                              handleInputChange(text, index)
                            }
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

                    {!isOtpSent ? (
                      <LinearGradient
                        colors={['#4756ca', '#616dc7']}
                        style={[
                          styles.loginButton,
                          {bottom: SCREEN_HEIGHT * 0.05},
                          {top: -30},
                        ]}>
                        <TouchableOpacity
                          style={styles.loginButton}
                          onPress={handleVerify}>
                          <Text style={styles.loginButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    ) : (
                      <LinearGradient
                        colors={['#4756ca', '#616dc7']}
                        style={[
                          styles.loginButton,
                          {bottom: SCREEN_HEIGHT * 0.05},
                          {top: -30},
                        ]}>
                        <TouchableOpacity
                          style={[styles.loginButton]}
                          onPress={handleVerify}>
                          <Text style={styles.loginButtonText}>Sign up</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    )}
                  </>
                ) : (
                  <>
                    <LinearGradient
                      colors={['#4756ca', '#616dc7']}
                      style={[
                        styles.loginButton,
                        {bottom: SCREEN_HEIGHT * 0.05},
                        {top: -30},
                      ]}>
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLoginWithEmail}>
                        <Text style={styles.loginButtonText}>SignUp</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </>
                )}
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Reanimatable.View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  LowerContainer: {
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.88,
    marginHorizontal: SCREEN_WIDTH * 0.06,
    borderTopLeftRadius: SCREEN_HEIGHT * 0.05,
    borderTopRightRadius: SCREEN_HEIGHT * 0.05,
  },
  UpperContainer: {
    borderTopLeftRadius: SCREEN_HEIGHT * 0.05,
    borderTopRightRadius: SCREEN_HEIGHT * 0.05,
    zIndex: 1,
    backgroundColor: '#fff',
    flex: 1,
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
    marginLeft: SCREEN_WIDTH * 0.02,
    justifyContent: 'center',
    borderRadius: SCREEN_WIDTH * 0.025,
    bottom: SCREEN_HEIGHT * 0.03,
  },
  HeaderConatiner: {
    top: SCREEN_HEIGHT * 0.04,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: SCREEN_WIDTH * 0.05,
    bottom: SCREEN_HEIGHT * 0.02,
    left: SCREEN_HEIGHT * 0.01,
  },
  logo: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.15,
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
    borderRadius: SCREEN_HEIGHT * 0.02,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.01,
    marginBottom: SCREEN_HEIGHT * 0.01,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: SCREEN_HEIGHT * 0.002,
    },
    shadowOpacity: 0.25,
    shadowRadius: SCREEN_HEIGHT * 0.005,
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
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1,
    color: '#000',
    borderRadius: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.03,
    backgroundColor: '#E4E1F3',
    alignSelf: 'center',
    bottom: SCREEN_HEIGHT * 0.03,
  },
  loginButton: {
    width: SCREEN_WIDTH * 0.95,
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
    marginTop: SCREEN_HEIGHT * 0.06,
    bottom: SCREEN_HEIGHT * 0.1,
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
    marginLeft: SCREEN_WIDTH * 0.1,
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
