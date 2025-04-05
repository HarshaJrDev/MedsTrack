import React, {useCallback, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Share,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BranchScreen = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  const data = [
    {
      id: '1',
      name: 'branch 1',
      location: 'Location 1',
      img: require('../../assets/DemoMed.png'),
    },
    {
      id: '2',
      name: 'branch 2',
      location: 'Location 2',
      img: require('../../assets/DemoMed.png'),
    },
    {
      id: '3',
      name: 'branch 3',
      location: 'Location 3',
      img: require('../../assets/DemoMed.png'),
    },
    {
      id: '4',
      name: 'branch 4',
      location: 'Location 4',
      img: require('../../assets/DemoMed.png'),
    },
    {id: 'add', isAddCard: true},
  ];

  const handleShare = async (branch) => {
    try {
      const result = await Share.share({
        message: `Check out ${branch.name} located at ${branch.location}.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      alert('Error sharing: ' + error.message);
    }
  };

  const renderItem = useCallback(
    ({item, index}) => {
      if (item.isAddCard) {
        return (
          <TouchableOpacity
            style={styles.addCard}
            onPress={() => navigation.navigate('BranchFormStore')}>
            <Text style={styles.addCardText}>+ Add New Store</Text>
          </TouchableOpacity>
        );
      }

      const inputRange = [-1, 0, 270 * index, 270 * (index + 2)];
      const opacityInputRange = [-1, 0, 270 * index, 270 * (index + 1)];
      const translateY = scrollY.interpolate({
        inputRange: [0, 250],
        outputRange: [0, 0],
      });

      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 0],
      });

      const opacity = scrollY.interpolate({
        inputRange: opacityInputRange,
        outputRange: [1, 1, 1, 0],
      });

      return (
        <Animatable.View animation={'fadeIn'}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{scale}, {translateY}],
                opacity,
              },
            ]}>
            <Image source={item.img} style={styles.cardImage} />

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardLocation}>{item.location}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.replace('MainApp')}>
                  <Text style={styles.buttonText}>View details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => handleShare(item)}>
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animatable.View>
      );
    },
    [scrollY],
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingVertical: 10,
  },
  card: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4756ca',
  },
  cardImage: {
    width: '100%',
    height: '65%',
    resizeMode: 'contain',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  cardLocation: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 10,
  },
  viewButton: {
    backgroundColor: '#4756ca',

    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    left:20,
    borderBottomLeftRadius:SCREEN_WIDTH*0.3,
    borderTopLeftRadius:SCREEN_WIDTH*0.3,
    height:35,
    
  },
  shareButton: {
    backgroundColor: '#4756ca',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    left:20,
    borderBottomLeftRadius:SCREEN_WIDTH*0.3,
    borderTopLeftRadius:SCREEN_WIDTH*0.3,
    height:35
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
  },
  addCard: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#4756ca',
    borderWidth: 1,
  },
  addCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Nunito-Regular',
  },
});

export default BranchScreen;
