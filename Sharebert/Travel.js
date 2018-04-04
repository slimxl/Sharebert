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
    Brand1['Term'] = 'Tripping';
    Brand1['title'] = 'Tripping';
    Brand1['link'] = 'http://www.dpbolvw.net/click-8331277-13174391';
    Brand1['image_url'] = require('./assets/travel/tripping.png');

    var Brand2 = {};
    Brand2['Term'] = 'Travelocity';
    Brand2['title'] = 'Travelocity';
    Brand2['link'] = 'http://www.tkqlhce.com/click-8331277-10842219';
    Brand2['image_url'] = require('./assets/travel/travelocity.png');

    var Brand3 = {};
    Brand3['Term'] = 'One Travel';
    Brand3['title'] = 'One Travel';
    Brand3['link'] = 'http://www.pntrac.com/t/8-206-163999-1508';
    Brand3['image_url'] = require('./assets/travel/onetravel.png');

    var Brand4 = {};
    Brand4['Term'] = 'CheapAir';
    Brand4['title'] = 'CheapAir';
    Brand4['link'] = 'http://www.anrdoezrs.net/click-8331277-11014261';
    Brand4['image_url'] = require('./assets/travel/cheapair.png');

    var Brand5 = {};
    Brand5['Term'] = 'CheapOair';
    Brand5['title'] = 'CheapOair';
    Brand5['link'] = 'http://www.jdoqocy.com/click-8331277-12953065';
    Brand5['image_url'] = require('./assets/travel/cheapoair.png');

    var Brand6 = {};
    Brand6['Term'] = 'CheapTickets';
    Brand6['title'] = 'CheapTickets';
    Brand6['link'] = 'http://www.kqzyfj.com/click-8331277-12843040';
    Brand6['image_url'] = require('./assets/travel/cheaptickets.png');

    var Brand7 = {};
    Brand7['Term'] = 'Extended Stay America';
    Brand7['title'] = 'Extended Stay America';
    Brand7['link'] = 'http://www.jdoqocy.com/click-8331277-13107969';
    Brand7['image_url'] = require('./assets/travel/extended.png');

    var Brand8 = {};
    Brand8['Term'] = 'Homestay';
    Brand8['title'] = 'Homestay';
    Brand8['link'] = 'http://www.kqzyfj.com/click-8331277-12353257';
    Brand8['image_url'] = require('./assets/travel/homestay.png');

    var Brand9 = {};
    Brand9['Term'] = 'HotelPlanner.com';
    Brand9['title'] = 'HotelPlanner.com';
    Brand9['link'] =  'http://www.jdoqocy.com/click-8331277-10391851';
    Brand9['image_url'] = require('./assets/travel/hotelplanner.png');

    var Brand10 = {};
    Brand10['Term'] = 'Hotels.com';
    Brand10['title'] = 'Hotels.com';
    Brand10['link'] = 'http://www.anrdoezrs.net/click-8331277-10443216';
    Brand10['image_url'] = require('./assets/travel/hotels.png');

    var Brand11 = {};
    Brand11['Term'] = 'LivingSocial';
    Brand11['title'] = 'LivingSocial';
    Brand11['link'] = 'http://www.anrdoezrs.net/click-8331277-11659343';
    Brand11['image_url'] = require('./assets/travel/livingsocial.png');

    var Brand12 = {};
    Brand12['Term'] = 'Otel.com';
    Brand12['title'] = 'Otel.com';
    Brand12['link'] = 'http://www.anrdoezrs.net/click-8331277-10784091';
    Brand12['image_url'] = require('./assets/travel/otel.png');

    var Brand13 = {};
    Brand13['Term'] = 'Palace Resorts';
    Brand13['title'] = 'Palace Resorts';
    Brand13['link'] = 'http://www.kqzyfj.com/click-8331277-13221537';
    Brand13['image_url'] = require('./assets/travel/palaceresorts.png');

    var Brand14 = {};
    Brand14['Term'] = 'Walt Disney Travel Company';
    Brand14['title'] = 'Walt Disney Travel Company';
    Brand14['link'] = 'http://www.tkqlhce.com/click-8331277-13265516';
    Brand14['image_url'] = require('./assets/travel/disney.png');

    var Brand15 = {};
    Brand15['Term'] = 'Booking.com';
    Brand15['title'] = 'Booking.com';
    Brand15['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=343625.119&type=3&subid=';
    Brand15['image_url'] = require('./assets/travel/booking.png');

    var Brand16 = {};
    Brand16['Term'] = 'Camping World';
    Brand16['title'] = 'Camping World';
    Brand16['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=414807.10002997&type=3&subid=';
    Brand16['image_url'] = require('./assets/travel/campingworld.png');

    var Brand17 = {};
    Brand17['Term'] = 'CarRentals.com';
    Brand17['title'] = 'CarRentals.com';
    Brand17['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=453842.10000029&type=4&subid=';
    Brand17['image_url'] = require('./assets/travel/carrentals.png');

    var Brand18 = {};
    Brand18['Term'] = 'LaQuinta';
    Brand18['title'] = 'LaQuinta';
    Brand18['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=53964.10000074&type=4&subid=';
    Brand18['image_url'] = require('./assets/travel/laquinta.png');

    var Brand19 = {};
    Brand19['Term'] = 'Thrifty Rent-A-Car';
    Brand19['title'] = 'Thrifty Rent-A-Car';
    Brand19['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=171424.10000028&type=3&subid='
    Brand19['image_url'] = require('./assets/travel/thrifty.png');

    var Brand20 = {};
    Brand20['Term'] = 'TicketCity';
    Brand20['title'] = 'TicketCity';
    Brand20['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=360735.376&type=4&subid=';
    Brand20['image_url'] = require('./assets/travel/ticketcity.png');

    var Brand21 = {};
    Brand21['Term'] = 'Travelation';
    Brand21['title'] = 'Travelation ';
    Brand21['link'] = 'https://click.linksynergy.com/fs-bin/click?id=MIcOmftyarA&offerid=562139.573&type=4&subid=';
    Brand21['image_url'] = require('./assets/travel/travelation.png');



  
    
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
      brandArr.push(Brand15);
      brandArr.push(Brand16);
      brandArr.push(Brand17);
      brandArr.push(Brand18);
      brandArr.push(Brand19);
      brandArr.push(Brand20);
      brandArr.push(Brand21);


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
          Travel
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
export default Travel;
