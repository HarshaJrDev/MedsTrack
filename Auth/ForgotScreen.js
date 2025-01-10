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
} from 'react-native';
import React, {useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'react-native-animatable';
import * as Reanimatable from 'react-native-animatable';
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const ForgotPassword = () => {
  const navigation = useNavigation()
  const [selectedOption, setSelectedOption] = useState('phone');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill(''));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isActiveOpt, setisActiveopt] = useState(false);
  const [isActiveemail, setisActiveemail] = useState(false);
  const [isActive, setisActive] = useState(false);

  const href = useRef();

  //   // const getchange = href.current()
  const handleLoginWithEmail = () => {
    navigation.replace('MainApp');
  };

  const handleOtpChange = (text, index) => {
    const updatedOtp = [...otpInputs];
    updatedOtp[index] = text;
    setOtpInputs(updatedOtp);
  };
  const handleVerifyOtp = () => {
    navigation.replace('MainApp');
  };
  return (
    <Reanimatable.View    animation="fadeIn"
    duration={500} style={styles.MainContainer}>
      <KeyboardAvoidingView
        style={styles.MainContainer}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}>
        <ScrollView disableScrollViewPanResponder showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
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
                    bottom:SCREEN_HEIGHT*0.02
   
                  }}>
                  Don't have an account?
                </Text>
              </View>
              <TouchableOpacity>
                <LinearGradient
                  colors={['#AAB3E580', '#AAB3E580']}
                  style={[styles.Box,{bottom:SCREEN_HEIGHT*0.03}]}>
                  <Text
                    onPress={()=>navigation.navigate('RegistrationScreen')}
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
              {/* <View style={{justifyContent:"center",alignItems:"center",marginTop:SCREEN_HEIGHT*0.03}}>
                <Text style={{fontFamily:"Nunito-Bold",color:"#000",fontSize:SCREEN_HEIGHT*0.04}}>Welcome!</Text>
                <Text style={{fontFamily:"Nunito-Regular",color:"#000",fontSize:SCREEN_HEIGHT*0.021}}>Enter your details below</Text>
              </View> */}

              <View style={styles.MainContainer}>
                <View style={styles.ForgotBox}>
                  <Text style={styles.ForgotLable}>Reset your password</Text>
                  <Text style={styles.subforgotlabel}>
                    Enter the email address you used to register.
                  </Text>
                </View>
                <View style={styles.FotgotInput}>
                  <TextInput
                    onBlur={() => setisActiveemail(false)}
                    onFocus={() => setisActiveemail(true)}
                    style={[
                      styles.Whiteinput,
                      {borderColor: isActiveemail ? '#4756ca' : '#d5d5d5'},
                    ]}
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#000"
                  />
                </View>

                <View>
                  <TouchableOpacity
                    style={styles.touchableArea}
                    onPress={() => navigation.navigate('VerifyOtp', {email})}>
                    <LinearGradient
                      colors={['#4756ca', '#616dc7']}
                      style={styles.loginButton}>
                      <Text style={styles.loginButtonText}>Send OTP</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </Reanimatable.View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  LowerContainer: {
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.88,
    marginHorizontal: SCREEN_HEIGHT * 0.03,
    borderTopLeftRadius: SCREEN_HEIGHT * 0.05,
    borderTopRightRadius: SCREEN_HEIGHT * 0.05,
    top:SCREEN_HEIGHT*0.03
  },
  UpperContainer: {
    width: SCREEN_WIDTH * 1,
    borderTopLeftRadius: SCREEN_HEIGHT * 0.05,
    borderTopRightRadius: SCREEN_HEIGHT * 0.05,
    zIndex: 1,
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.69,

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
    marginHorizontal: SCREEN_WIDTH * 0.05,
    bottom: SCREEN_HEIGHT * 0.02,
    left:SCREEN_HEIGHT*0.01
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E4E1F3',
    bottom: 50,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 70,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SCREEN_HEIGHT * 0.01,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  toggleButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Regular',
  },
  activeToggleButtonText: {
    color: '#000',
    fontFamily: 'Nunito-Regular',
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
    marginVertical: 40,
    top:SCREEN_HEIGHT*0.05
  },
});
