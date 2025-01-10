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
  Image,
  Modal,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import LottieView from 'lottie-react-native';
import * as Reanimatable from 'react-native-animatable';
import 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const VerifyOtp = ({route}) => {
  const {email} = route.params;
    const animationRef = useRef(null);
  const [isVerify, setisVerify] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill(''));
  const [isvisiable, setisvisiable] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();



    useEffect(() => {
  
      // Or set a specific startFrame and endFrame with:
      animationRef.current?.play(50, 220);
    }, []);


  const handleInputChange = (text, index) => {
    const digits = text.split('');
    const newOtpInputs = [...otpInputs];

    if (digits.length === 6) {
      // If 6 digits are pasted, update all inputs
      setOtpInputs(digits);
      digits.forEach((digit, i) => {
        inputRefs.current[i]?.setNativeProps({text: digit});
      });
      inputRefs.current[5]?.focus(); // Focus on the last input
    } else {
      // Otherwise, handle single digit entry
      newOtpInputs[index] = text;
      setOtpInputs(newOtpInputs);

      // Move to the next input if text is entered
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

  const handleVerify = () => {
    const otp = otpInputs.join('');
    console.log('Entered OTP:', otp);
    setisvisiable(!isvisiable);

    const timeoutToHomeScreen = setTimeout(() => {
      navigation.replace('OnBoarding');
    }, 1000);

    return () => {
      clearTimeout(timeoutToHomeScreen);
    };
  };

  return (
    <Reanimatable.View
      animation="fadeIn"
      duration={500}
      style={styles.MainContainer}>
      <KeyboardAvoidingView
        style={styles.MainContainer}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}>
        <ScrollView
          disableScrollViewPanResponder
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <LinearGradient
            style={styles.MainContainer}
            colors={['#4756ca', '#616dc7']}>
            <View style={styles.HeaderConatiner}>
              <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Nunito-Regular',
                    bottom: SCREEN_HEIGHT * 0.02,
                  }}>
                  Don't have an account?
                </Text>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={['#AAB3E580', '#AAB3E580']}
                  style={[styles.Box, {bottom: SCREEN_HEIGHT * 0.03}]}>
                  <Text
                    onPress={() => navigation.navigate('RegistrationScreen')}
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
              {/* <View
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
              </View> */}

              <View style={styles.MainContainer}>
                <View style={[styles.ForgotBox,{top:SCREEN_HEIGHT*0.05}]}>
                  <Text style={styles.ForgotLabel}>Enter your code</Text>
                  <Text style={styles.SubLabel}>
                    Enter the OTP sent to your email for verification{' '}
                    <Text style={styles.Useremail}>{email}</Text>
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    columnGap: 17,
                    marginBottom: 20,
                    marginTop: SCREEN_HEIGHT * 0.04,
             
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
                        {borderColor: otpInputs[index] ? '#4752ca' : '#000'},
                        {right: SCREEN_HEIGHT * 0.0025},
                      ]}
                      keyboardType="number-pad"
                      maxLength={6} // Allow full paste
                      blurOnSubmit={index === otpInputs.length - 1}
                    />
                  ))}
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
                  colors={['#4756ca', '#616dc7']}
                  style={styles.loginButton}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleVerify}>
                    <Text style={styles.loginButtonText}>Verify</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </Reanimatable.View>
  );
};

export default VerifyOtp;

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
    fontSize: 28,
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
    marginLeft: 20,
    justifyContent: 'center',
    borderRadius: 10,
  },
  HeaderConatiner: {
    top: SCREEN_HEIGHT * 0.04,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    bottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  forgotLabel: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Nunito-Regular',
  },
  ImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  SignupContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: SCREEN_HEIGHT * 0.55,
    position: 'absolute',
    marginLeft: SCREEN_HEIGHT * 0.1,
  },
  ForgotLable: {
    textAlign: 'left',
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: '#000',
    marginTop: 10,
  },

  FotgotInput: {
    marginVertical: SCREEN_HEIGHT * 0.035,
  },
  subforgotlabel: {
    textAlign: 'left',

    color: '#000',
    fontFamily: 'Nunito-Regular',
  },
  Whiteinput: {
    width: '95%',
    height: 50,
    borderWidth: 2,
    color: '#000',
    borderRadius: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  loginButton: {
    width: '95%',
    height: 50,
    borderRadius: SCREEN_HEIGHT * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Regular',
  },
  ForgotBox: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  ForgotLabel: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    fontFamily: 'Nunito-Bold',
  },
  otpInput: {
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.1,
    borderWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: SCREEN_WIDTH * 0.015,
    color: '#000',
    fontSize: SCREEN_HEIGHT * 0.022,
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  SubLabel: {
    fontFamily: '',
    fontSize: 15,
    textAlign: 'center',
    color: '#000',
  },
  Useremail: {
    color: '#000',
    fontSize: 17,
    fontFamily: 'Nunito-Bold',
  },
});
