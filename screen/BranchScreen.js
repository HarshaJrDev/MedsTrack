import React, { useCallback, useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';

import { useNavigation ,CommonActions} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height



const BranchScreen = () => {
  const navigation = useNavigation()
  const scrollY = useRef(new Animated.Value(0)).current;


  const IMAGE = require('../assets/ViewBooking.png')

  const data = [
    { id: '1', name: 'Card 1', location: 'Location 1', img: require('../assets/DemoMed.png') },
    { id: '2', name: 'Card 2', location: 'Location 2', img: require('../assets/DemoMed.png') },
    { id: '3', name: 'Card 3', location: 'Location 3', img: require('../assets/DemoMed.png') },
    { id: '4', name: 'Card 4', location: 'Location 4', img: require('../assets/DemoMed.png') },
    { id: 'add', isAddCard: true },
  ];

  const renderItem = useCallback(
    ({ item, index }) => {
      if (item.isAddCard) {
        return (
          
          <TouchableOpacity style={styles.addCard} onPress={()=>navigation.navigate("BranchFormStore")}>
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

      const borderColorTop = scrollY.interpolate({
        inputRange,
        outputRange: ['#4756ca', '#4756ca', '#4756ca', '#4756ca'],
        extrapolate: 'clamp',
      });

      const borderColorRight = scrollY.interpolate({
        inputRange,
        outputRange: ['#4756ca', '#4756ca', '#4756ca', '#4756ca'],
        extrapolate: 'clamp',
      });

      const borderColorBottom = scrollY.interpolate({
        inputRange,
        outputRange: ['#4756ca', '#4756ca', '#4756ca', '#4756ca'],
        extrapolate: 'clamp',
      });

      const borderColorLeft = scrollY.interpolate({
        inputRange,
        outputRange: ['#4756ca', '#4756ca', '#4756ca', '#4756ca'],
        extrapolate: 'clamp',
      });

      const borderWidthTop = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 1],
        extrapolate: 'clamp',
      });

      const borderWidthRight = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 6, 1],
        extrapolate: 'clamp',
      });

      const borderWidthBottom = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 6, 1],
        extrapolate: 'clamp',
      });
      const borderWidthLeft = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 1],
        extrapolate: 'clamp',
      });

      return (

        <Animatable.View animation={'fadeIn'}>
             <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale }, { translateY }],
              opacity,
              borderTopColor: borderColorTop,
              borderRightColor: borderColorRight,
              borderBottomColor: borderColorBottom,
              borderLeftColor: borderColorLeft,
              borderTopWidth: borderWidthTop,
              borderRightWidth: borderWidthRight,
              borderBottomWidth: borderWidthBottom,
              borderLeftWidth:borderWidthLeft
            },
          ]}
        >
     <Image  source={item.img} style={styles.cardImage} />

          <View style={{flexDirection:"row",}}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardLocation}>{item.location}</Text>
          </View>
          <View style={{flexDirection:"row",display:"flex",marginTop:SCREEN_HEIGHT*0.03,left:SCREEN_HEIGHT*0.2,backgroundColor:"#4756ca",alignItems:"center",borderRadius:SCREEN_HEIGHT*0.03,height:SCREEN_HEIGHT*0.04,width:SCREEN_HEIGHT*0.2}}>
              <TouchableOpacity onPress={()=>navigation.replace("MainApp")}>
                <Text style={{fontFamily:"Nunito-Regular",left:7,color:'#fff'}}>View Store </Text>
              </TouchableOpacity>
            </View>

          </View>
         
          
        </Animated.View>
        </Animatable.View>
     
      );
    },
    [scrollY]
  );
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
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
  },
  cardImage: {
    width: '100%',
    height: '65%',
    resizeMode:"contain",
    justifyContent:"center"
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
  addCard: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:"#4756ca",
    borderWidth:1
  },
  addCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily:"Nunito-Regular"
  },
});

export default BranchScreen;
