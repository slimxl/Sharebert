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

class Brands extends Component {
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
    
    var Brand11 = {};
    Brand11['Term'] = 'Budget Pet Care';
    Brand11['title'] = 'Budget Pet Care';
    Brand11['image_url'] = require('./assets/brands/budgetpetcare.jpg');
    
    var Brand12 = {};
    Brand12['Term'] = 'Campmor';
    Brand12['title'] = 'Campmor';
    Brand12['image_url'] = require('./assets/brands/campmor.jpg');
    
    var Brand13 = {};
    Brand13['Term'] = 'Carhartt';
    Brand13['title'] = 'Carhartt';
    Brand13['image_url'] = require('./assets/brands/carhartt.jpg');
    
    var Brand14 = {};
    Brand14['Term'] = 'Carls Golfland';
    Brand14['title'] = 'Carls Golfland';
    Brand14['image_url'] = require('./assets/brands/carlsgolfland.jpg');
    
    var Brand15 = {};
    Brand15['Term'] = 'Chaparral Racing';
    Brand15['title'] = 'Chaparral Racing';
    Brand15['image_url'] = require('./assets/brands/chaparralracing.jpg');

    var Brand16 = {};
    Brand16['Term'] = 'CheapAir.com';
    Brand16['title'] = 'CheapAir.com';
    Brand16['image_url'] = require('./assets/brands/cheapair.jpg');

    var Brand17 = {};
    Brand17['Term'] = 'Chesapeake Bay Candle';
    Brand17['title'] = 'Chesapeake Bay Candle';
    Brand17['image_url'] = require('./assets/brands/chesapeakebaycandle.jpg');

    var Brand18 = {};
    Brand18['Term'] = 'Dog';
    Brand18['title'] = 'Dog';
    Brand18['image_url'] = require('./assets/brands/dog.jpg');

    var Brand19 = {};
    Brand19['Term'] = 'Dollar General';
    Brand19['title'] = 'Dollar General';
    Brand19['image_url'] = require('./assets/brands/dollargeneral.jpg');

    var Brand20 = {};
    Brand20['Term'] = 'Dunkin Donuts';
    Brand20['title'] = 'Dunkin Donuts';
    Brand20['image_url'] = require('./assets/brands/dunkindonuts.jpg');

    var Brand21 = {};
    Brand21['Term'] = 'Edwin Watts Golf';
    Brand21['title'] = 'Edwin Watts Golf';
    Brand21['image_url'] = require('./assets/brands/edwinwattsgolf.jpg');

    var Brand22 = {};
    Brand22['Term'] = '800Bear.com';
    Brand22['title'] = '800Bear.com';
    Brand22['image_url'] = require('./assets/brands/ehbear.jpg');

    var Brand23 = {};
    Brand23['Term'] = 'Fanzz';
    Brand23['title'] = 'Fanzz';
    Brand23['image_url'] = require('./assets/brands/fanzz.jpg');

    var Brand24 = {};
    Brand24['Term'] = 'Fat Head';
    Brand24['title'] = 'Fat Head';
    Brand24['image_url'] = require('./assets/brands/fathead.jpg');

    var Brand25 = {};
    Brand25['Term'] = 'Fitbit';
    Brand25['title'] = 'Fitbit';
    Brand25['image_url'] = require('./assets/brands/fitbit.jpg');

    var Brand26 = {};
    Brand26['Term'] = 'Footshop';
    Brand26['title'] = 'Footshop';
    Brand26['image_url'] = require('./assets/brands/footshop.jpg');

    var Brand27 = {};
    Brand27['Term'] = 'Frames Direct';
    Brand27['title'] = 'Frames Direct';
    Brand27['image_url'] = require('./assets/brands/framesdirect.jpg');

    var Brand28 = {};
    Brand28['Term'] = 'The Frye Company';
    Brand28['title'] = 'The Frye Company';
    Brand28['image_url'] = require('./assets/brands/frye.jpg');

    var Brand29 = {};
    Brand29['Term'] = 'GamesDeal';
    Brand29['title'] = 'GamesDeal';
    Brand29['image_url'] = require('./assets/brands/gamesdeal.jpg');

    var Brand30 = {};
    Brand30['Term'] = 'Ghirardelli Chocolate';
    Brand30['title'] = 'Ghirardelli Chocolate';
    Brand30['image_url'] = require('./assets/brands/ghirardelli.jpg');

    var Brand31 = {};
    Brand31['Term'] = 'Glasses.com';
    Brand31['title'] = 'Glasses.com';
    Brand31['image_url'] = require('./assets/brands/glasses.jpg');

    var Brand32 = {};
    Brand32['Term'] = 'Heidi Klum Intimates';
    Brand32['title'] = 'Heidi Klum Intimates';
    Brand32['image_url'] = require('./assets/brands/heidikumintimatews.jpg');

    var Brand33 = {};
    Brand33['Term'] = 'Hobbytron';
    Brand33['title'] = 'Hobbytron';
    Brand33['image_url'] = require('./assets/brands/hobbytron.jpg');

    var Brand34 = {};
    Brand34['Term'] = 'Hotels.com';
    Brand34['title'] = 'Hotels.com';
    Brand34['image_url'] = require('./assets/brands/hotels.jpg');

    var Brand35 = {};
    Brand35['Term'] = 'Jelly Belly';
    Brand35['title'] = 'Jelly Belly';
    Brand35['image_url'] = require('./assets/brands/jellybelly.jpg');

    var Brand36 = {};
    Brand36['Term'] = 'Jinx';
    Brand36['title'] = 'Jinx';
    Brand36['image_url'] = require('./assets/brands/jinx.jpg');

    var Brand37 = {};
    Brand37['Term'] = 'Leatherman';
    Brand37['title'] = 'Leatherman';
    Brand37['image_url'] = require('./assets/brands/leatherman.jpg');

    var Brand38 = {};
    Brand38['Term'] = 'LivingSocial';
    Brand38['title'] = 'LivingSocial';
    Brand38['image_url'] = require('./assets/brands/livingsocial.jpg');

    var Brand39 = {};
    Brand39['Term'] = 'Living Tees';
    Brand39['title'] = 'Living Tees';
    Brand39['image_url'] = require('./assets/brands/livingtees.jpg');

    var Brand40 = {};
    Brand40['Term'] = 'Logitech';
    Brand40['title'] = 'Logitech';
    Brand40['image_url'] = require('./assets/brands/logitech.jpg');

    var Brand41 = {};
    Brand41['Term'] = 'Modells';
    Brand41['title'] = 'Modells';
    Brand41['image_url'] = require('./assets/brands/modellssportinggoods.jpg');

    var Brand42 = {};
    Brand42['Term'] = 'Naked Zebra';
    Brand42['title'] = 'Naked Zebra';
    Brand42['image_url'] = require('./assets/brands/nakedzebra.jpg');

    var Brand43 = {};
    Brand43['Term'] = 'Oakley';
    Brand43['title'] = 'Oakley';
    Brand43['image_url'] = require('./assets/brands/oakley.jpg');

    var Brand44 = {};
    Brand44['Term'] = 'Otel.com';
    Brand44['title'] = 'Otel.com';
    Brand44['image_url'] = require('./assets/brands/otel.jpg');

    var Brand45 = {};
    Brand45['Term'] = 'Outdoor Technology';
    Brand45['title'] = 'Outdoor Technology';
    Brand45['image_url'] = require('./assets/brands/outdoortech.jpg');

    var Brand46 = {};
    Brand46['Term'] = 'Rainier Arms';
    Brand46['title'] = 'Rainier Arms';
    Brand46['image_url'] = require('./assets/brands/rainierarms.jpg');

    var Brand47 = {};
    Brand47['Term'] = 'RefrigiWear';
    Brand47['title'] = 'RefrigiWear';
    Brand47['image_url'] = require('./assets/brands/refrigiwear.jpg');

    var Brand48 = {};
    Brand48['Term'] = 'Rite Aid';
    Brand48['title'] = 'Rite Aid';
    Brand48['image_url'] = require('./assets/brands/riteaidpharmacy.jpg');

    var Brand49 = {};
    Brand49['Term'] = 'Road Runner Sports';
    Brand49['title'] = 'Road Runner Sports';
    Brand49['image_url'] = require('./assets/brands/roadrunnersport.jpg');

    var Brand50 = {};
    Brand50['Term'] = 'Roses Only';
    Brand50['title'] = 'Roses Only';
    Brand50['image_url'] = require('./assets/brands/rosesonly.jpg');

    var Brand51 = {};
    Brand51['Term'] = 'Russell Stover Chocolates';
    Brand51['title'] = 'Russell Stover Chocolates';
    Brand51['image_url'] = require('./assets/brands/russelstover.jpg');

    var Brand52 = {};
    Brand52['Term'] = 'Scholastic';
    Brand52['title'] = 'Scholastic';
    Brand52['image_url'] = require('./assets/brands/scholastic.jpg');

    var Brand53 = {};
    Brand53['Term'] = 'shopDisney';
    Brand53['title'] = 'shopDisney';
    Brand53['image_url'] = require('./assets/brands/shopdisney.jpg');

    var Brand54 = {};
    Brand54['Term'] = 'Sleefs';
    Brand54['title'] = 'Sleefs';
    Brand54['image_url'] = require('./assets/brands/sleefs.jpg');

    var Brand55 = {};
    Brand55['Term'] = 'SnapMade';
    Brand55['title'] = 'SnapMade';
    Brand55['image_url'] = require('./assets/brands/snapmade.jpg');

    var Brand56 = {};
    Brand56['Term'] = 'Spencers Online';
    Brand56['title'] = 'Spencers Online';
    Brand56['image_url'] = require('./assets/brands/spencers.jpg');

    var Brand57 = {};
    Brand57['Term'] = 'Spirit Halloween';
    Brand57['title'] = 'Spirit Halloween';
    Brand57['image_url'] = require('./assets/brands/spirithalloween.jpg');

    var Brand58 = {};
    Brand58['Term'] = 'Spyder';
    Brand58['title'] = 'Spyder';
    Brand58['image_url'] = require('./assets/brands/spyder.jpg');

    var Brand59 = {};
    Brand59['Term'] = 'State Line Tack';
    Brand59['title'] = 'State Line Tack';
    Brand59['image_url'] = require('./assets/brands/statelinetack.jpg');

    var Brand60 = {};
    Brand60['Term'] = 'STUBHUB USD';
    Brand60['title'] = 'STUBHUB USD';
    Brand60['image_url'] = require('./assets/brands/stubhub.jpg');

    var Brand61 = {};
    Brand61['Term'] = 'Sun and Ski';
    Brand61['title'] = 'Sun and Ski';
    Brand61['image_url'] = require('./assets/brands/sunandski.jpg');

    var Brand62 = {};
    Brand62['Term'] = 'Tactics';
    Brand62['title'] = 'Tactics';
    Brand62['image_url'] = require('./assets/brands/tactics.jpg');

    var Brand63 = {};
    Brand63['Term'] = 'TicketNetwork';
    Brand63['title'] = 'TicketNetwork';
    Brand63['image_url'] = require('./assets/brands/ticketnetwork.jpg');

    var Brand64 = {};
    Brand64['Term'] = 'Tillys';
    Brand64['title'] = 'Tillys';
    Brand64['image_url'] = require('./assets/brands/tillys.jpg');

    var Brand65 = {};
    Brand65['Term'] = 'Timberland';
    Brand65['title'] = 'Timberland';
    Brand65['image_url'] = require('./assets/brands/timberland.jpg');

    var Brand66 = {};
    Brand66['Term'] = 'Tractor Supply';
    Brand66['title'] = 'Tractor Supply';
    Brand66['image_url'] = require('./assets/brands/tractorsupplyco.jpg');

    var Brand67 = {};
    Brand67['Term'] = '3V Gear';
    Brand67['title'] = '3V Gear';
    Brand67['image_url'] = require('./assets/brands/tvgear.jpg');


    if(brandArr.length<60)
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
      brandArr.push(Brand22);
      brandArr.push(Brand23);
      brandArr.push(Brand24);
      brandArr.push(Brand25);
      brandArr.push(Brand26);
      brandArr.push(Brand27);
      brandArr.push(Brand28);
      brandArr.push(Brand29);
      brandArr.push(Brand30);
      brandArr.push(Brand31);
      brandArr.push(Brand32);
      brandArr.push(Brand33);
      brandArr.push(Brand34);
      brandArr.push(Brand35);
      brandArr.push(Brand36);
      brandArr.push(Brand37);
      brandArr.push(Brand38);
      brandArr.push(Brand39);
      brandArr.push(Brand40);
  
      brandArr.push(Brand41);
      brandArr.push(Brand42);
      brandArr.push(Brand43);
      brandArr.push(Brand44);
      brandArr.push(Brand45);
      brandArr.push(Brand46);
      brandArr.push(Brand47);
      brandArr.push(Brand48);
      brandArr.push(Brand49);
      brandArr.push(Brand50);
      brandArr.push(Brand51);
      brandArr.push(Brand52);
      brandArr.push(Brand53);
      brandArr.push(Brand54);
      brandArr.push(Brand55);
      brandArr.push(Brand56);
      brandArr.push(Brand57);
      brandArr.push(Brand58);
      brandArr.push(Brand59);
      brandArr.push(Brand60);
  
      brandArr.push(Brand61);
      brandArr.push(Brand62);
      brandArr.push(Brand63);
      brandArr.push(Brand64);
      brandArr.push(Brand65);
      brandArr.push(Brand66);
      brandArr.push(Brand67);
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
              resizeMode={'cover'}
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
        onPress={()=>
        {
          this.getFile();
        }}>
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
    backgroundColor: '#F5FCFF',
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
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
    backgroundColor: '#DCDCDC',
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
export default Brands;
