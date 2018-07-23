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
      travelArr: [],
    };

    this.getTravel();

  }

  getTravel = () => {
    fetch('https://sharebert.com/s/GetTravel.php', { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {
        var data2 = [];
        for (var i = 0; i < Object.keys(responseData).length; i++) {
          var obj = {};
         
          obj['Title'] = responseData[i]['Title'];
          obj['ImageURL'] = responseData[i]['ImageURL'];
          obj['URL'] = responseData[i]['URL'];
          data2.push(obj);
        }
        console.log(data2);
        this.setState({
          travelArr: data2,
        });
        this.forceUpdate();
      })
      .done();
  }

  _getItemLayout = (data, index) => {
    const productHeight = PRODUCT_ITEM_HEIGHT + PRODUCT_ITEM_MARGIN;
    return {
      length: productHeight,
      offset: productHeight * index,
      index,
    };
  };
  openURL = (link) => {
    try {
      Linking.openURL(link);
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
        <TouchableOpacity onPress={() => {
          Linking.openURL(item.URL)
        }}>
          {!item.ImageURL
            ? <View style={styles.itemImage}>
              <Text>No image</Text>
            </View>
            : <Image
              source={{
                uri: item.ImageURL,
              }}
              resizeMode={'contain'}
              style={styles.itemImage}
            />}
        </TouchableOpacity>

        <Text numberOfLines={3} style={styles.itemTitle}>
          {item.Title}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Image style={styles.header} />
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styles.button}
          source={require('./assets/icons/logo2.png')}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.goBack();
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
          data={this.state.travelArr}
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
        width: 100,
        marginTop: 10,
        marginLeft: Dimensions.get('window').width * .5 - 50,
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
