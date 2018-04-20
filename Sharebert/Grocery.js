import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
  AsyncStorage,
  Dimensions,
  View,
  Text,
  TouchableWithoutFeedback,
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

class Grocery extends Component {
  constructor(props) {
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    this.state = {
      userPoints: userPoints,
      userID: userID,
    };


    var Brand1 = {};
    Brand1['Term'] = 'amazonfresh';
    Brand1['title'] = 'Amazon Fresh';
    Brand1['link'] = 'https://amzn.to/2F1coZe';
    Brand1['image_url'] = require('./assets/grocery/amazonfresh.jpg');

    var Brand2 = {};
    Brand2['Term'] = 'bbqbox';
    Brand2['title'] = 'BBQ Box';
    Brand2['link'] = 'https://www.shareasale.com/r.cfm?b=925691&u=1404632&m=68335';
    Brand2['image_url'] = require('./assets/grocery/bbqbox.jpg');

    var Brand3 = {};
    Brand3['Term'] = 'craft beer club';
    Brand3['title'] = 'Craft Beer Club';
    Brand3['link'] = 'https://www.shareasale.com/r.cfm?b=278781&u=1404632&m=30876';
    Brand3['image_url'] = require('./assets/grocery/craftbeerclub.jpg');

    var Brand4 = {};
    Brand4['Term'] = 'foodstirs';
    Brand4['title'] = 'Foodstirs';
    Brand4['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=568140.62&type=3&subid=0';
    Brand4['image_url'] = require('./assets/grocery/foodstirs.jpg');

    var Brand5 = {};
    Brand5['Term'] = 'fossilfarms';
    Brand5['title'] = 'Fossil Farms';
    Brand5['link'] = 'https://www.shareasale.com/r.cfm?b=80824&u=1404632&m=12637';
    Brand5['image_url'] = require('./assets/grocery/fossilfarms.jpg');

    var Brand6 = {};
    Brand6['Term'] = 'goldmedalwineclub';
    Brand6['title'] = 'Gold Medal Wine Club';
    Brand6['link'] = 'https://www.shareasale.com/r.cfm?b=194707&u=1404632&m=24293';
    Brand6['image_url'] = require('./assets/grocery/goldmedalwineclub.jpg');

    var Brand7 = {};
    Brand7['Term'] = 'hellofresh';
    Brand7['title'] = 'Hello Fresh';
    Brand7['link'] = 'http://www.jdoqocy.com/click-8331277-11802340';
    Brand7['image_url'] = require('./assets/grocery/hellofresh.jpg');

    var Brand8 = {};
    Brand8['Term'] = 'houseofglunz';
    Brand8['title'] = 'House of Glunz';
    Brand8['link'] = 'https://www.shareasale.com/r.cfm?b=953933&u=1404632&m=69358';
    Brand8['image_url'] = require('./assets/grocery/houseofglunz.jpg');

    var Brand9 = {};
    Brand9['Term'] = 'urthbox';
    Brand9['title'] = 'Urthbox';
    Brand9['link'] =  'https://www.shareasale.com/r.cfm?b=491113&u=1404632&m=47975';
    Brand9['image_url'] = require('./assets/grocery/urthbox.jpg');

    var Brand10 = {};
    Brand10['Term'] = 'veestro';
    Brand10['title'] = 'Veestro';
    Brand10['link'] = 'https://www.shareasale.com/r.cfm?b=517341&u=1404632&m=49480';
    Brand10['image_url'] = require('./assets/grocery/veestro.jpg');

    var Brand11 = {};
    Brand11['Term'] = 'winc';
    Brand11['title'] = 'winc';
    Brand11['link'] = 'https://www.shareasale.com/r.cfm?b=792888&u=1404632&m=62347';
    Brand11['image_url'] = require('./assets/grocery/winc.jpg');

    var Brand12 = {};
    Brand12['Term'] = 'winecrasher';
    Brand12['title'] = 'Winecrasher';
    Brand12['link'] = 'https://www.shareasale.com/r.cfm?b=865646&u=1404632&m=65843';
    Brand12['image_url'] = require('./assets/grocery/winecrasher.jpg');

    var Brand13 = {};
    Brand13['Term'] = 'wineofthemonthclub';
    Brand13['title'] = 'Wine of the Month Club';
    Brand13['link'] = 'https://www.shareasale.com/r.cfm?b=486942&u=1404632&m=47747';
    Brand13['image_url'] = require('./assets/grocery/wineofthemonthclub.jpg');

    var Brand14 = {};
    Brand14['Term'] = 'wiredforwine';
    Brand14['title'] = 'Wired for Wine';
    Brand14['link'] = 'https://www.shareasale.com/r.cfm?b=211020&u=1404632&m=25630';
    Brand14['image_url'] = require('./assets/grocery/wiredforwine.jpg');

    
    if(brandArr.length<1)
    {
      brandArr.push(Brand1);
      brandArr.push(Brand2);
      brandArr.push(Brand3);
      brandArr.push(Brand4);
      brandArr.push(Brand5);
      brandArr.push(Brand6);
      brandArr.push(Brand7);
      brandArr.push(Brand8);
      brandArr.push(Brand9);
      brandArr.push(Brand10);
      brandArr.push(Brand11);
      brandArr.push(Brand12);
      brandArr.push(Brand13);
      brandArr.push(Brand14);
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
  openURL = (Brand) => {
    try {
      Linking.openURL(Brand);
    } catch (error) {
      console.error(error);
    }
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
                //console.log(item.link);
                this.openURL(item.link);
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
 <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(backAction);
          }}>
        <Image style={styles.header} />
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styles.button}
          source={require('./Logo.png')}
        />
         <TouchableWithoutFeedback
              onPress={() => 
              {
                this.props.navigation.dispatch(backAction);
              }}>
              <Image
                style={styles.hamburger}
                resizeMode='contain'
                source={require('./assets/arrow.png')}
              />

            </TouchableWithoutFeedback>
        <Text style={styles.title}>
          Grocery
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
    ...Platform.select({
      ios: {
        width: 30,
        height: 23,
        marginLeft: 10,
        marginTop: -48,
        backgroundColor: 'transparent',
        padding: 0,
      },
      android: {
        position: 'absolute',
        marginTop: 5,
        marginLeft: -5,
        height: 25,
        width: 70,
      },
    }),

  },
  title: {
    ...Platform.select({
        ios: {
          fontFamily: "Montserrat",
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#0d2754',
          marginTop: 30,
          marginBottom: 0,
          paddingBottom: 6,
          backgroundColor: 'white',
        },
        android: {
            fontFamily: "Montserrat",
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#0d2754',
            marginTop: 60,
            marginBottom: 0,
            paddingBottom: 6,
            backgroundColor: 'white',
        },
    }),
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
    ...Platform.select({
      ios: {
        width: 100,
        height: 70,
        marginTop: -55,
        marginLeft: Dimensions.get('window').width / 2.6,
        backgroundColor: 'transparent',
        padding: 20,
      },
      android: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: Dimensions.get('window').width / 8.5,
        height: 30,
        flexDirection: 'row',
      },
    }),
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
export default Grocery;
