import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {TextInput, DefaultTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SearchScreen = () => {
  const [storeName, setStoreName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigation = useNavigation();

  const data = ['Dolo Tab 650mg', 'Paracetamol', 'Ibuprofen', 'Aspirin'];

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: '#000',
    },
  };

  const handleSearch = async text => {
    setStoreName(text);
    if (text.length > 0) {
      const filteredSuggestions = data.filter(item =>
        item.toLowerCase().includes(text.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = async item => {
    setStoreName(item);
    setSuggestions([]);

    const updatedSearches = [
      item,
      ...recentSearches.filter(search => search !== item),
    ].slice(0, 5); // Limit to 5 items
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      'recentSearches',
      JSON.stringify(updatedSearches),
    );
 
  };

  const fetchRecentSearches = async () => {
    const savedSearches = await AsyncStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  };

  const handleAddSearch = () => {
    Toast.show({
      type: 'info',
      text1: 'No Searches Found',
      text2: 'Start by searching for an item.',
    });
  };

  const handleClearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem('recentSearches');
    
    Toast.show({
      type: 'success',
      text1: 'Cleared',
      text2: 'Recent searches have been cleared.',
      
      props: {
        style: {
          width: '90%',
          backgroundColor: '#28a745',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 5,
        },
        textStyle: {
          title: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
          },
          message: {
            color: '#fff',
            fontSize: 14,
            textAlign: 'center',
          },
        },
      },
    });
  };
  
  useEffect(() => {
    fetchRecentSearches();
  }, []);

  return (
    <View style={styles.Container}>

      <View style={{zIndex:1,top:SCREEN_HEIGHT*0.03}} >
      <Toast/>

      </View>
     




      <View style={styles.MainContainer}>
        <TextInput
          placeholder="Eg. Dolo Tab 650mg"
          label="Search Items"
          value={storeName}
          onChangeText={handleSearch}
          style={styles.input}
          mode="outlined"
          theme={customTheme}
        />
        <View style={styles.SearchIcon}>
          <AntDesign name="search1" color="#000" size={20} />
        </View>
      </View>

      {suggestions.length > 0 ? (
        <View style={styles.suggestionBox}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                <Text style={styles.suggestionItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        storeName.length > 0 && (
          <View style={styles.noSuggestions}>
            <Image
              source={require('../assets/Nodata.png')}
              style={{height: 100, width: 100}}
            />
            <Text style={styles.noSuggestionsText}>Not available.</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleSelectSuggestion(storeName)}>
              <Text style={styles.addButtonText}>
                Unable to find an item you looking for?
              </Text>
            </TouchableOpacity>
            <LinearGradient
              style={{
                height: 40,
                width: 150,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}
              colors={['#4756ca', '#616dc7']}>
              <TouchableOpacity onPress={()=>navigation.navigate('AddProduct')}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.addButtonText}>Add Product</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )
      )}

      <View style={styles.SearchTittle}>

        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text
          style={{fontSize: SCREEN_HEIGHT * 0.02, fontFamily: 'Nunito-Bold'}}>
          Recently Searched
        </Text>

        <TouchableOpacity style={{justifyContent:"center",alignItems:"center"}}  onPress={handleClearRecentSearches}>
              <Text style={{color:'#4756ca'}}>Clear All</Text>
            </TouchableOpacity>

        </View>
       
        {recentSearches.length > 0 ? (
          <>
            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.rowContainer}
                  onPress={() => handleSelectSuggestion(item)}>
                  <Text style={[styles.recentItem, {right: 20}]}>{item}</Text>
                  <Feather name="arrow-up-right" size={20} style={styles.icon} />
                </TouchableOpacity>
              )}
            />
           
          </>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleAddSearch}>
            <Text style={styles.addButtonText}>Add Recent Searches</Text>
          </TouchableOpacity>
        )}
      </View>


    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: SCREEN_HEIGHT * 0.02,
  },
  MainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: SCREEN_HEIGHT * 0.02,
  },
  SearchIcon: {
    position: 'absolute',
    right: SCREEN_HEIGHT * 0.02,
    top: SCREEN_HEIGHT * 0.025,
  },
  suggestionBox: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    left: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#fff',
    borderRadius: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_HEIGHT * 0.01,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },
  suggestionItem: {
    fontSize: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_HEIGHT * 0.01,
    marginVertical: SCREEN_HEIGHT * 0.005,
    borderRadius: SCREEN_HEIGHT * 0.01,
  },
  SearchTittle: {
    marginTop: SCREEN_HEIGHT * 0.05,
  },
  recentItem: {
    fontSize: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_HEIGHT * 0.01,
    marginVertical: SCREEN_HEIGHT * 0.003,
    borderRadius: SCREEN_HEIGHT * 0.01,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addButton: {
    marginTop: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.015,
    borderRadius: SCREEN_HEIGHT * 0.02,
  },
  addButtonText: {
    color: '#000',
    fontSize: SCREEN_HEIGHT * 0.02,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  clearButton: {
    marginTop: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.015,
    borderRadius: SCREEN_HEIGHT * 0.02,
    backgroundColor: '#e74c3c',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: SCREEN_HEIGHT * 0.02,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  noSuggestions: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.05,
    padding: SCREEN_HEIGHT * 0.02,
    backgroundColor: '#fff',
    borderRadius: SCREEN_HEIGHT * 0.02,
  },
  noSuggestionsText: {
    color: '#000',
    fontSize: SCREEN_HEIGHT * 0.02,
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
});
