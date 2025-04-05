import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DashboardScreen = ({ navigation }) => {
  const barData = [
    { value: 45, label: 'Mon' },
    { value: 80, label: 'Tue', frontColor: '#3f4fb8' },
    { value: 60, label: 'Wed', frontColor: '#3f4fb8' },
    { value: 90, label: 'Thu' },
    { value: 50, label: 'Fri', frontColor: '#3f4fb8' },
    { value: 30, label: 'Sat' },
    { value: 20, label: 'Sun' },
  ];

  const lineData = [
    { value: 150 },
    { value: 180 },
    { value: 120 },
    { value: 200 },
    { value: 170 },
    { value: 160 },
    { value: 140 },
  ];

  return (
    <LinearGradient style={styles.container} colors={['#b6c1ee', '#3f4fb8']}>
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

        {/* Bar Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Stock Levels</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FullGraph', {
                  type: 'bar',
                  chartProps: {
                    barWidth: 22,
                    noOfSections: 3,
                    barBorderRadius: 4,
                    frontColor: 'lightgray',
                    data: barData,
                    yAxisThickness: 0,
                    xAxisThickness: 0,
                  },
                })
              }
            >
              <Icon name="arrow-expand" size={24} color="#3f4fb8" />
            </TouchableOpacity>
          </View>

          <BarChart
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={0}
          />
        </View>

        {/* Line Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Orders Trend</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FullGraph', {
                  type: 'line',
                  chartProps: {
                    data: lineData,
                    thickness: 3,
                    color: '#3f4fb8',
                    hideDataPoints: true,
                    startFillColor: '#b6c1ee',
                    startOpacity: 0.3,
                    endOpacity: 0.1,
                    spacing: 40,
                  },
                })
              }
            >
              <Icon name="arrow-expand" size={24} color="#3f4fb8" />
            </TouchableOpacity>
          </View>

          <LineChart
            data={lineData}
            thickness={3}
            color={'#3f4fb8'}
            hideDataPoints
            startFillColor={'#b6c1ee'}
            startOpacity={0.3}
            endOpacity={0.1}
            spacing={40}
          />
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
    shadowOffset: { width: 0, height: 2 },
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
  chartContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f4fb8',
  },
});

export default DashboardScreen;
