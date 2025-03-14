import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';

const FullGraphScreen = ({ route }) => {
  const { type, chartProps } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Detailed {type === 'bar' ? 'Stock Levels' : 'Orders Trend'}
      </Text>

      {type === 'bar' ? (
        <BarChart {...chartProps} />
      ) : (
        <LineChart {...chartProps} />
      )}
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
});

export default FullGraphScreen;
