import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList,Dimensions, TouchableOpacity } from 'react-native';
import { TextInput, DefaultTheme, Button, Menu, List, Divider, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Search from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productForm, setProductForm] = useState('');
  const [mrp, setMrp] = useState('');
  const [unitsPerPack, setUnitsPerPack] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation();

  const productForms = [
    'Table',
    'Syrup',
    'Capsule',
    'Injection',
    'Cream',
    'Drops',
    'Power',
    'Paint',
    'Gel',
    'Suspension',
    'Lotion',
    'Liquid',
    'Ointment',
  ];
  const filteredProductForms = useMemo(() => {
    return productForms.filter(form =>
      form.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, productForms]);

  const handleMenuItemPress = (value) => {
    setProductForm(value);
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Product Name"
        value={productName}
        onChangeText={(text) => setProductName(text)}
        style={styles.input}
        theme={DefaultTheme}
        mode="outlined"
      />
      <TextInput
        label="Company Name"
        value={companyName}
        onChangeText={(text) => setCompanyName(text)}
        style={styles.input}
        theme={DefaultTheme}
        mode="outlined"
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <LinearGradient
            colors={['#fff', '#fff']}
            style={styles.gradientButton}
          >
            <Button
              mode="text"
              color="white"
              onPress={() => setMenuVisible(true)}
            >
              {productForm || 'Select Product Form'}
            </Button>
          </LinearGradient>
        }
      >
        <FlatList
          data={filteredProductForms}
          renderItem={({ item }) => (
            <Menu.Item
              onPress={() => handleMenuItemPress(item)}
              title={item}
              titleStyle={styles.menuItemText}
            />
          )}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={Divider}
        />
      </Menu>
      <TextInput
        label="Product MRP"
        value={mrp}
        onChangeText={(text) => setMrp(text)}
        keyboardType="numeric"
        style={styles.input}
        theme={DefaultTheme}
        mode="outlined"
      />
      <TextInput
        label="Units Per Pack"
        value={unitsPerPack}
        onChangeText={(text) => setUnitsPerPack(text)}
        keyboardType="numeric"
        style={styles.input}
        theme={DefaultTheme}
        mode="outlined"
      />

<View style={{flexDirection:"row",bottom:screenHeight*0.006,columnGap:screenHeight*0.26}} >
<Text>Composition</Text>
<Text>(optional)</Text>

</View>

<TouchableOpacity onPress={()=>navigation.navigate('Inventory')} >
<View style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor:"#fff",
        borderColor: "#888", 
        borderRadius: 8,
        borderWidth:1,
        height:50,
    }}>

  
     
            <Search name="search1" size={25} color={"#000"} style={{left:screenHeight*0.38}} />
    </View>
      

</TouchableOpacity>
 
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    marginBottom: 15,
  },
  gradientButton: {
    marginBottom: 15,
    borderRadius: 5,
    paddingVertical: 10,
  },
  menuItemText: {
    color: 'white',
  },
  Composition:{
    width: screenHeight*0.43
  }
});

export default ProductForm;
