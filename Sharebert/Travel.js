import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
  AsyncStorage,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Alert,
  FlatList,
  Share,
  Platform,
} from 'react-native';

import { Constants } from 'expo';
const backAction = NavigationActions.back({
  key: null
});
var userPoints = 0;
var userID = 0;
var like;
var brandArr = [];

// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;
// const SCREEN_HEIGHT = width < height ? height : width;
const isSmallDevice = SCREEN_WIDTH <= 414;
const numColumns = isSmallDevice ? 2 : 3;
// item size
const PRODUCT_ITEM_HEIGHT = 175;
const PRODUCT_ITEM_OFFSET = 5;
const PRODUCT_ITEM_MARGIN = PRODUCT_ITEM_OFFSET * 2;

class Travel extends Component {
  constructor(props) {
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    this.state = {
      userPoints: userPoints,
      userID: userID,
    };


    var Brand1 = {};
    Brand1['Term'] = 'Ace hardware';
    Brand1['title'] = 'Ace hardware';
    Brand1['image_url'] = require('./assets/brands/acehardware.jpg');

    var Brand2 = {};
    Brand2['Term'] = 'Aeropostale';
    Brand2['title'] = 'Aeropostale';
    Brand2['image_url'] = require('./assets/brands/aeropostle.jpg');

    var Brand3 = {};
    Brand3['Term'] = 'Amazon';
    Brand3['title'] = 'Amazon';
    Brand3['image_url'] = require('./assets/brands/amazon.jpg');

    var Brand4 = {};
    Brand4['Term'] = 'American Apparel';
    Brand4['title'] = 'American Apparel';
    Brand4['image_url'] = require('./assets/brands/americanapparel.jpg');

    var Brand5 = {};
    Brand5['Term'] = 'Avast';
    Brand5['title'] = 'Avast';
    Brand5['image_url'] = require('./assets/brands/avast.jpg');
    
    var Brand6 = {};
    Brand6['Term'] = 'AVG';
    Brand6['title'] = 'AVG';
    Brand6['image_url'] = require('./assets/brands/avgantivirus.jpg');
    
    var Brand7 = {};
    Brand7['Term'] = 'Beretta USA';
    Brand7['title'] = 'Beretta USA';
    Brand7['image_url'] = require('./assets/brands/beretta.jpg');
    
    var Brand8 = {};
    Brand8['Term'] = 'Billabong';
    Brand8['title'] = 'Billabong';
    Brand8['image_url'] = require('./assets/brands/billabong.jpg');
    
    var Brand9 = {};
    Brand9['Term'] = 'BodyGlove';
    Brand9['title'] = 'BodyGlove';
    Brand9['image_url'] = require('./assets/brands/bodyglove.jpg');
    
    var Brand10 = {};
    Brand10['Term'] = 'Brayola';
    Brand10['title'] = 'Brayola';
    Brand10['image_url'] = require('./assets/brands/brayola.jpg');
    
    if(brandArr.length<10)
    {

      brandArr.push(Brand1);
      brandArr.push(Brand2);
      brandArr.push(Brand3);
      brandArr.push(Brand4);
      brandArr.push(Brand6);
      brandArr.push(Brand7);
      brandArr.push(Brand8);
      brandArr.push(Brand9);
      brandArr.push(Brand10);
    }
    
    
  }

  _getItemLayout = (data, index) => {
    const productHeight = PRODUCT_ITEM_HEIGHT + PRODUCT_ITEM_MARGIN;
    return {
      length: productHeight,
      offset: productHeight * index,
      index,
    };
  };

  _keyExtractor = item => {
    return item.code_group;
  };

  
  _onPress(item) {

  }

  _renderItem = data => {
    const item = data.item;
    return (
      <View style={styles.item}>
      <TouchableOpacity onPress={() => 
              {
                this.props.navigation.navigate('Explore', {
                  id: userID,
                  points: userPoints,
                  brands: item.title,
                })
              }}>
        {!item.image_url
          ? <View style={styles.itemImage}>
              <Text>No image</Text>
            </View>
          : <Image
              source={item.image_url}
              resizeMode={'contain'}
              style={styles.itemImage}
            />}
        </TouchableOpacity>
            
        <Text numberOfLines={3} style={styles.itemTitle}>
          {item.title}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
      <TouchableOpacity>
        <Image style={styles.header} />
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styles.button}
          source={require('./Logo.png')}
        />
        <TouchableOpacity
              onPress={() => 
              {
                this.props.navigation.dispatch(backAction);
              }}>
              <Image
                style={styles.hamburger}
                source={require('./purplemenuicon.png')}
              />

            </TouchableOpacity>
        <Text style={styles.title}>
          Brands
        </Text>
        <FlatList
          style={styles.listContainer}
          data={brandArr}
          keyExtractor={(item, index) => index}
          renderItem={this._renderItem}
          getItemLayout={this._getItemLayout}
          numColumns={numColumns}
        />
      </View>
    );
  }
}
const colors = {
    snow: 'white',
    darkPurple: '#140034',
    placeholder: '#eee',
  };

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: 'white',
  },
  hamburger: {
    width: 30,
    height: 23,
    marginLeft: 10,
    marginTop: -48,
    backgroundColor: 'transparent',
    padding: 0,
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff2eff',
    marginTop: -15,
  },
image: {
    width: 100,
    height: 100,
    marginTop: 0,
  },
  listContainer: {
    flex: 1,
    padding: PRODUCT_ITEM_OFFSET,
  },
  itemImage: {
    width: (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
      PRODUCT_ITEM_MARGIN,
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
    }),
    margin: PRODUCT_ITEM_OFFSET * 2,
  },
  item: {
    margin: PRODUCT_ITEM_OFFSET,
    overflow: 'hidden',
    borderRadius: 3,
    width: (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
      PRODUCT_ITEM_MARGIN,
    height: PRODUCT_ITEM_HEIGHT,
    flexDirection: 'column',
    backgroundColor: colors.snow,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  button: {
    width: 100,
    height: 70,
    marginTop: -55,
    marginLeft: 60,
    backgroundColor: 'transparent',
    padding: 20,
  },
  header: {
    width: '100%',
    height: 40,
    backgroundColor: '#dee6ee',
    marginTop: 0,
  },
text: {
    textAlign: 'left',
    fontSize: 12,
    marginTop: 40,
    marginLeft: 110,
    backgroundColor: 'transparent',
  },
});
export default Travel;
