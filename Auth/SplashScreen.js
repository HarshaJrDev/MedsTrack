import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigation]);

  return (
    <Animatable.View    animation="fadeIn"
    duration={500} style={styles.container}>
      <LinearGradient colors={['#4756ca', '#6d83ff']} style={styles.gradient}>
        <Animatable.Image
          animation="zoomIn"
          source={require('../assets/logo-removebg-preview.png')}
          style={styles.logo}
        />
        <Animatable.Text animation="fadeInUp" delay={500} style={styles.text}>
          MedsTrack
        </Animatable.Text>
      </LinearGradient>
    </Animatable.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    marginBottom: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Nunito-Bold',
  },
});
