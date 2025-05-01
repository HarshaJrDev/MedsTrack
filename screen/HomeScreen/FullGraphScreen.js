import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const FullGraphScreen = ({ route }) => {
  const { type, chartProps } = route.params;
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleCollapseAndGoBack = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9, // shrink effect
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack(); // return after animation
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleCollapseAndGoBack} style={styles.iconWrapper}>
        <MaterialCommunityIcons name="arrow-expand-all" size={28} color="#3f4fb8" />
      </TouchableOpacity>

      <Text style={styles.title}>
        Detailed {type === 'bar' ? 'Stock Levels' : 'Orders Trend'}
      </Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {type === 'bar' ? (
          <BarChart {...chartProps} />
        ) : (
          <LineChart {...chartProps} />
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f4fb8',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
});

export default FullGraphScreen;
