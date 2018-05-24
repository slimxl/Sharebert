import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  WebView,
  Platform,
  Linking,
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
var currentreward = '';
var web = false;
var giveaway = false;
var userPoints = 0;
const { width, height } = Dimensions.get('window');
class Rewards extends Component {
  constructor(props) {
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    uri2 = this.props.navigation.state.params.uri;
    this.state = {
      isOpen: false,
      DailyGiveaway: false,
      selectedItem: 'Rewards',
      userPoints: userPoints,
      userID: userID,
      rewards: [],
    };
    if (userID != 0) {
      //this.setUserDaily();  // Checking the set function...Success!
      this.checkUserDaily();  //Checking the check function...Success!

    }
    fetch('https://sharebert.com/s/RetrieveRewards.php?', { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {
        var data2 = []
        for (var i = 0; i < responseData.length; i++) {
          var obj = {};

          obj['Title'] = responseData[i]['Title'];
          obj['ImageURL'] = responseData[i]['ImageURL'];
          obj['Cost'] = responseData[i]['Cost'];
          obj['ID'] = responseData[i]['id'];
          obj['Link'] = responseData[i]['Link'];
          //if(obj['Cost']!=='100'|| parseInt(obj['Cost'],10)>25000)
          data2.push(obj);
        }
        //var reversed = data2.reverse(); 
        this.setState({
          rewards: data2,
        })
      })
      .done();


  }
  _onPress(item) {
    Alert.alert(
      'Claim Prize',
      item.Title,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Claim',
          onPress: () => {
            this.checkout(item);
          },
        },
      ],
      { cancelable: false }
    );
  };
  checkout(item) {
    if (userID != 0) {
      var nb = userPoints - item.Cost;
      if (nb >= 0) {
        fetch(
          'https://sharebert.com/s/GiveReward.php?uid=' +
          userID,
          { method: 'POST' }
        )
          .then(() => {
            fetch(
              'https://sharebert.com/s/GiveReward2.php?uid=' +
              userID +
              '&qty=1&rwd=' +
              item.ID +
              '&nb=' +
              nb,
              { method: 'GET' }
            )
              .then(response => response.json())
              .then(responseData => {
                if (item.Cost === '100') {
                  try {
                    //Linking.openURL(item.Link);
                    web = true;
                    currentreward = item.Link;
                  } catch (error) {
                    console.error(error);
                  }
                }
                userPoints = nb;
                this.forceUpdate();
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
  };
  resetTo(route) {
    this.props.navigation.pop(0)
    this.props.navigation.navigate(route, {
      id: userID,
      points: userPoints,
      uri: uri2,
    })
  };
  checkUserDaily = () => {
    fetch('https://sharebert.com/s/UserCheckALL.php?uid=' + userID, { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {
        if (responseData[0]['DailyGiveaway'] === '1') {
          this.setState({
            DailyGiveaway: true,
          })
          this.forceUpdate();
          console.log('True');
        }
        else {
          console.log('False');
        }
      })
      .done();
  }

  setUserDaily = () => {
    if (userPoints - 10 < 0 && this.state.DailyGiveaway === false) {
      Alert.alert('Points Error!', 'Insufficient Points');
      return;
    }
    else if (this.state.DailyGiveaway === false) {

      Alert.alert(
        'Unlocking the daily giveaway only costs 10 points',
        'Are you ready?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Unlock',
            onPress: () => {
              fetch('https://sharebert.com/s/SetDailyGiveaway.php?uid=' + userID, { method: 'GET' })
                .then(response => {
                  this.setState({
                    DailyGiveaway: true,
                  })
                  userPoints -= 10;
                  try {
                    //Linking.openURL('https://sharebert.com/shop/dailygiveaway')
                    giveaway = true;
                    web = false;
                    this.forceUpdate();
                  }
                  catch (error) {
                    console.log(error);
                  }

                })
                .done();
            },
          }
        ],
        { cancelable: false }
      );
    }
    else {
      try {
        //Linking.openURL('https://sharebert.com/shop/dailygiveaway')
        giveaway = true;
        web = false;
        this.forceUpdate();
      }
      catch (error) {
        console.log(error);
      }
    }

  }
  showEmptyListView = () => {

    return (
      <View style={styles.card}>

        <Image
          resizeMode="contain"
          style={styles.imageload}

          source={require('./assets/loading3.gif')}
        />
      </View>
    )
  };

  renderHeader = () => {
    return (
      <View style={styles.giveawaycenterview}>
        <Image
          style={styles.giveawaycenter}
          resizeMode='contain'
          source={require('./assets/giveaway/header.png')}
        />
        <Image
          style={styles.giveawaycenter2}
          resizeMode='contain'
          source={require('./assets/giveaway/logo.png')}
        />
        <TouchableWithoutFeedback
          style={styles.giveawaycenter3}
          onPress={() => this.setUserDaily()}
        >
          {
            this.state.DailyGiveaway ? <Image
              style={styles.giveawaycenter3}
              resizeMode='contain'
              source={require('./assets/giveaway/tap2.png')}
            /> :
              <Image
                style={styles.giveawaycenter3}
                resizeMode='contain'
                source={require('./assets/giveaway/tap.png')}
              />
          }
        </TouchableWithoutFeedback>
        <Image style={styles.divider}
          source={require('./assets/empty2.png')}
        />
      </View>
    );
  };

  _renderItem = data => {
    const item = data.item;
    return (
    <TouchableOpacity
      onPress={() => this._onPress(item)}>
      <View style={{ backgroundColor: 'transparent' }}>
        <Text style={styles.text3}>{item.Title}</Text>
        {item.Cost === '100' ? <Text style={styles.text4}>{item.Cost} Points + Shipping</Text> : <Text style={styles.text4}>{item.Cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Points</Text>}
        <Image
          style={styles.image}
          resizeMode='contain'
          source={{
            uri: item.ImageURL,
          }}
        />
      </View>
    </TouchableOpacity>
    );
  }
  render() {
    if (web) {
      return (
        <View style={styles.container}>
          <Image style={styles.dividerTop} source={require('./assets/likesbg.png')} />

          <TouchableOpacity
            onPress={() => {
              web = false;
              this.forceUpdate();

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
            source={require('./assets/icons/logoicon.png')}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              web = false;
              this.forceUpdate();
            }}>
            <Image
              style={styles.hamburger}
              resizeMode='contain'
              source={require('./assets/arrow_w.png')}
            />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>
            Sharebert Rewards
          </Text>
          <WebView
            source={{ uri: currentreward }}
            style={{ marginTop: 15 }}
          />
        </View>
      );
    }
    else if (giveaway) {
      return (
        <View style={styles.container}>
          <Image style={styles.dividerTop} source={require('./assets/likesbg.png')} />

          <TouchableOpacity
            onPress={() => {
              giveaway = false;

              this.forceUpdate();

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
            source={require('./assets/icons/logoicon.png')}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              giveaway = false;
              this.forceUpdate();
            }}>
            <Image
              style={styles.hamburger}
              resizeMode='contain'
              source={require('./assets/arrow_w.png')}
            />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>
            Sharebert Rewards
          </Text>
          <WebView
            source={{ uri: 'https://sharebert.com/shop/dailygiveaway' }}
            style={{ marginTop: 15 }}
          />
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Image style={styles.dividerTop} source={require('./assets/likesbg.png')} />

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
              this.props.navigation.state.params.updateData(userPoints);

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
            source={require('./assets/icons/logoicon.png')}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.goBack();
              this.props.navigation.state.params.updateData(userPoints);
            }}>
            <Image
              style={styles.hamburger}
              resizeMode='contain'
              source={require('./assets/arrow_w.png')}
            />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>
            Sharebert Rewards
          </Text>
          <ImageBackground
            source={require('./like_background.png')}
            style={{ width: '100%', height: '100%' }}>
            <View style={{ width: '100%', height: Dimensions.get('window').height - 130 }}>
              <OptimizedFlatList backgroundColor={'transparent'}
                style={{ width: '100%', height: Dimensions.get('window').height - 130, }}
                data={this.state.rewards}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={this.showEmptyListView()}
                ListHeaderComponent={() => this.renderHeader()}
                renderItem={this._renderItem}
              />
            </View>
          </ImageBackground>
        </View>
      );
    }

  }
}

class RewardItem extends React.PureComponent {
  render() {
    return (
        <View 
                style={{
                  paddingVertical: 10,
                }}>
                  <TouchableOpacity onPress={() => null}>
                    <Text 
                      style={{
                        color: '#000', 
                        height: 40,
                        justifyContent: 'center'
                      }}>
                      {this.props.produto.descricao}
                    </Text>
                  </TouchableOpacity>
                </View>
    )
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
        color: 'white',
        backgroundColor: 'transparent',
      },
      android: {
        marginRight: 8,
        marginTop: 10,
        textAlign: 'right',
        fontSize: 15,
        color: 'white',
        backgroundColor: 'transparent',
      },
    }),
  },
  pointsText: {
    ...Platform.select({
      ios: {
        marginRight: 10,
        marginTop: -17,
        textAlign: 'right',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        marginBottom: 30,
      },
      android: {
        marginRight: 10,
        marginTop: -7,
        marginBottom: 20,
        textAlign: 'right',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
    }),
  },
  giveawaycenterview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  giveawaycenter: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: '80%',
    marginTop: 5,
  },
  giveawaycenter2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    height: 100,
    width: '70%',

  },
  giveawaycenter3: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: '70%',

  },
  hamburger: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        top: 5,
        width: 100,
        height: 30,
        left: -25,
        backgroundColor: 'transparent',
        padding: 0,

      },
      android: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 15,
        left: -25,
        height: 30,
        width: 90,
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
      marginTop: 5,
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
      ...Platform.select({
        ios: {
          width: Dimensions.get('window').width,
          position: "absolute",
          top: -25,
          height: 100,
          backgroundColor: 'transparent',
        },
        android: {
          width: Dimensions.get('window').width,
          position: "absolute",
          top: 0,
          height: 100,
          backgroundColor: 'transparent',
        },
      }),
    },
  title: {
    ...Platform.select({
      ios: {
        fontFamily: "MontserratLight",
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        marginTop: -30,
        marginBottom: 0,
        paddingBottom: 6,
        backgroundColor: 'transparent',
      },
      android: {
        fontFamily: "MontserratLight",
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        marginTop: 0,
        marginBottom: 0,
        paddingBottom: 6,
        backgroundColor: 'transparent',
      },
    }),

  },
  image: {
    borderRadius: 20,
    width: 100,
    height: 100,
    marginTop: -50,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  button: {
    ...Platform.select({
      ios: {
        width: 150,
        height: 50,
        marginTop: -65,
        marginLeft: Dimensions.get('window').width * .5 - 75,
        backgroundColor: 'transparent',
        padding: 20,
        marginBottom: 30,
      },
      android: {
        position: 'absolute',
        width: 150,
        height: 50,
        marginTop: 10,
        left: (Dimensions.get('window').width * .5) - 75,
        backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
      },
      android: {
        marginTop: -10,
        height: 100,
        backgroundColor: 'transparent',

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
  imageload: {
    width,
    marginLeft: Dimensions.get('window').width / 90,
    marginTop: Dimensions.get('window').height / 4.5,

    flex: 1,
  },
  text3: {
    textAlign: 'left',
    fontSize: 12,
    marginTop: 20,
    marginLeft: 140,
    backgroundColor: 'transparent',
    position: "absolute",
    left: 0,
  },
  text4: {
    color: '#ec47ff',
    textAlign: 'left',
    fontSize: 12,
    marginTop: 40,
    marginLeft: 140,
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
  exploreBut:
    {
      height: 25,
      width: 25,
      position: "absolute",
      bottom: 0,
      left: 0,
      marginLeft: Dimensions.get('window').width / 16,
      marginBottom: 5,
      backgroundColor: 'transparent',
    },
  likesBut:
    {
      height: 25,
      width: 25,
      marginLeft: Dimensions.get('window').width / 3.3,
      marginBottom: 5,
      position: "absolute",
      bottom: 0,
      left: 0,
      backgroundColor: 'transparent',
    },
  footerRewards: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  rewardsBut:
    {
      height: 25,
      width: 25,
      marginRight: Dimensions.get('window').width / 3.3,
      marginBottom: 5,
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: 'transparent',
    },
  footerProfile: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  profileBut:
    {
      height: 25,
      width: 25,
      position: "absolute",
      bottom: 0,
      right: 0,
      marginRight: Dimensions.get('window').width / 16,
      marginBottom: 5,
      borderRadius: 12,
      backgroundColor: 'transparent',
    },

  footer: {
    height: 40,
    width: '100%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#dee6ee',
  },
  footerItem: {
    position: "absolute",
    bottom: 0,
    backgroundColor: 'transparent',
  },
  footerItem2: {
    position: "absolute",
    bottom: 0,
    height: 30,
    backgroundColor: 'transparent',
  },

  footerLikes: {
    height: 20,
    borderRadius: 12,
    width: 20,
    bottom: 0,
    backgroundColor: 'transparent',
    marginBottom: -20,
    marginLeft: Dimensions.get('window').width / 4.1,
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
