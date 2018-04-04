import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
const backAction = NavigationActions.back({
  key: null
});
import { Constants } from 'expo';
var rdata = [];
var userID = 0;
var userPoints = 0;

class Rewards extends Component {
  constructor(props) {
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    this.state = {
      isOpen: false,
      selectedItem: 'Rewards',
      userPoints: userPoints,
      userID: userID,
    };
    if (rdata.length < 1)
      fetch('https://sharebert.com/RetrieveRewards.php?', { method: 'GET' })
        .then(response => response.json())
        .then(responseData => {
          for (var i = 0; i < 18; i++) {
            var obj = {};

            obj['Title'] = responseData[i]['Title'];
            obj['ImageURL'] = responseData[i]['ImageURL'];
            obj['Cost'] = responseData[i]['Cost'];
            obj['ID'] = responseData[i]['id'];
            rdata.push(obj);
          }
        })
        .done();
  }
  _onPress(item) {
    Alert.alert(
      'Buy Or Share',
      item.Title,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Buy',
          onPress: () => {
            this.checkout(item);
          },
        },
      ],
      { cancelable: false }
    );
  }
  checkout(item) {
    if (userID != 0) {
      var nb = userPoints - item.Cost;
      if (nb >= 0) {
        fetch(
          'https://biosystematic-addit.000webhostapp.com/GiveReward.php?uid=' +
          userID,
          { method: 'POST' }
        )
          .then(() => {
            fetch(
              'https://biosystematic-addit.000webhostapp.com/GiveReward2.php?uid=' +
              userID +
              '&qty=1&rwd=' +
              item.ID +
              '&nb=' +
              nb,
              { method: 'GET' }
            )
              .then(response => response.json())
              .then(responseData => {
                Alert.alert('Success!', 'Enjoy your reward!');
              })
              .done();
          })
          .done();
      } else {
        Alert.alert('Points Error!', 'Insufficient Points');
      }
    }
    else {
      Alert.alert('Not Logged in!', 'Go log in now!')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(backAction);
          }}>

          <Image style={styles.header} />
          <Text style={styles.text2}>
            {userPoints + '\n'}
          </Text>
          <Text style={styles.pointsText}>
            Points
              </Text>
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styles.button}
          source={require('./Logo.png')}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.dispatch(backAction);
          }}>
          <Image
            style={styles.hamburger}
            resizeMode='contain'
            source={require('./assets/arrow.png')}
          />
        </TouchableWithoutFeedback>
        <Image
          resizeMode="contain"
          style={styles.heart}
          source={require('./assets/icons/Reward_Icon.png')} />
        <Text style={styles.title}>
          Rewards
        </Text>
        <Image style={styles.dividerTop} source={require('./assets/empty2.png')}/>
        <ImageBackground
          source={require('./like_background.png')}
          style={{ width: '100%', height: '100%' }}>
          <View style={{ width: '100%', height: '80%' }}>
            <FlatList backgroundColor={'transparent'}
              style={{ width: '100%', height: '80%' }}
              data={rdata}
              keyExtractor={(item, index) => index}
              renderItem={({ item, separators }) => (
                <TouchableOpacity
                  onPress={() => this._onPress(item)}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <View style={{ backgroundColor: 'transparent' }}>
                    <Text style={styles.text3}>{item.Title}</Text>
                    <Text style={styles.text4}>{item.Cost} Points</Text>
                    <Image
                      style={styles.image}
                      source={{
                        uri: item.ImageURL,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: Constants.statusBarHeight,
         backgroundColor: 'transparent',
        
      },
      android: {
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#dee6ee',
      },
    }),

    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  text2: {
    ...Platform.select({
      ios: {
        marginRight: 10,
        marginTop: -40,
        textAlign: 'right',
        fontSize: 15,
        color: '#f427f3',
        backgroundColor: 'transparent',
      },
      android: {
        marginRight: 10,
        marginTop: 0,
        textAlign: 'right',
        fontSize: 15,
        color: '#f427f3',
        backgroundColor: 'transparent',
      },
    }),

  },
  pointsText: {
    ...Platform.select({
      ios: {
        marginRight: 10,
        marginTop: -20,
        textAlign: 'right',
        fontSize: 15,
        color: '#863fba',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
      android: {
        marginRight: 10,
        marginTop: -10,
        textAlign: 'right',
        fontSize: 15,
        color: '#863fba',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
    }),
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
        marginLeft: 0,
        height: 25,
        width: 45,
      },
    }),

  },
  heart:
    {
      ...Platform.select({
        ios: {
          width: Dimensions.get('window').width,
          height: 30,
          paddingTop: 20,
          marginTop: 10,
          marginBottom: 26,
          backgroundColor: 'transparent',
        },
        android: {
          width: Dimensions.get('window').width,
          height: 30,
          paddingTop: 20,
          marginTop: 10,
          marginBottom: 20,
          backgroundColor: 'white',
        },
      }),


    },
  bg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  divider:
    {
      width: Dimensions.get('window').width - 30,
      height: 2,
      marginLeft: 15,
      marginTop: 30,
      backgroundColor: '#dee6ee',
    },
  shareBut:
    {
      width: 40,
      height: 40,
      marginLeft: Dimensions.get('window').width / 1.2,
      marginTop: -25,
    },
  buyBut:
    {
      width: 40,
      height: 40,
      marginLeft: Dimensions.get('window').width / 1.43,
      marginTop: -40,
    },
  dividerTop:
    {
      width: Dimensions.get('window').width,
      height: 3,
      backgroundColor: '#dee6ee',
    },
  title: {
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ff2eff',
        marginTop: -20,
        marginBottom: 0,
        paddingBottom: 6,
        backgroundColor: 'transparent',
      },
      android: {
        fontFamily: "Montserrat",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ff2eff',
        marginTop: -20,
        marginBottom: 0,
        paddingBottom: 6,
        backgroundColor: 'white',

      },
    }),

  },
  image: {

    width: 100,
    height: 100,
    marginTop: -50,
    backgroundColor: 'transparent',
  },
  button: {
    ...Platform.select({
      ios: {
        width: 100,
        height: 70,
        marginTop: -44,
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
    ...Platform.select({
      ios: {
        marginTop: 0,
        width: '100%',
        height: 40,
        backgroundColor: '#dee6ee',
      },
      android: {
        marginTop: -10,
        height: 100,
        backgroundColor: '#dee6ee',
        
      },
    }),

  },
  text: {
    textAlign: 'left',
    fontSize: 12,
    marginTop: 40,
    marginLeft: 110,
    backgroundColor: 'transparent',
  },
  text3: {
    textAlign: 'left',
    fontSize: 12,
    marginTop: 20,
    marginLeft: 110,
    backgroundColor: 'transparent',
    position: "absolute",
    left: 0,
  },
  text4: {
    color: '#ec47ff',
    textAlign: 'left',
    fontSize: 12,
    marginTop: 40,
    marginLeft: 110,
    backgroundColor: 'transparent',
  },
  textEmpty: {
    fontFamily: 'Montserrat',
    color: '#0d2754',
    marginLeft: Dimensions.get('window').width / 4.75,
    marginTop: Dimensions.get('window').height / 5,
  },
  textEmpty2: {
    fontFamily: 'Montserrat',
    color: '#0d2754',
    marginLeft: Dimensions.get('window').width / 3,
  },
  headertext:
    {
      ...Platform.select({
        ios: {
          textAlign: 'center',
          fontFamily: 'Montserrat',
          fontSize: 17,
          marginTop: -32,
          marginLeft: 140,
          backgroundColor: 'transparent',
        },
        android: {
          textAlign: 'center',
          fontFamily: 'Montserrat',
          fontSize: 17,
          marginTop: -32,
          marginLeft: 140,
          backgroundColor: 'transparent',
        },
      }),

    },
});
export default Rewards;
