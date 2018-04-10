import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Alert,
  TouchableWithoutFeedback,
  FlatList,
  Share,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import Notification from 'react-native-in-app-notification';
import AwesomeAlert from 'react-native-awesome-alerts';

import { Constants, Font } from 'expo';
const backAction = NavigationActions.back({
  key: null
});
var userPoints = 0;
var userID = 0;
var like;
var like2;
class Likes extends Component {
  constructor(props) {
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    uri2 = this.props.navigation.state.params.uri;
    uri = this.props.navigation.state.params.uri;
    if (userPoints === undefined || userID === undefined) {
      userPoints = 0;
      userID = 0;
    }
    this.state = {
      isOpen: false,
      selectedItem: 'Likes',
      showAlert: false,
      userPoints: userPoints,
      userID: userID,
    };
    this.getFile();
  }
  onMenuItemSelected = item => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
    if (item === 'Likes') {
      this.props.navigation.navigate('Likes');
    } else if (item === 'Explore') {
      this.props.navigation.navigate('Explore');
    }
  };
  showAlert = () => {
    this.setState({
      showAlert: true
    });
    this.forceUpdate();
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
    this.forceUpdate();

  };

  shareURL(item) {
    try {
      Share.share(
        {
          ...Platform.select({
            ios: {
              url: item.URL,
            },
            android: {
              message: 'Look at this : \n' +
                item.URL,
            },
          }),
          title: 'Wow, did you see that?',
        },
        {
          ...Platform.select({
            ios: {
              // iOS only:
              excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
            },
            android: {
              // Android only:
              dialogTitle: 'Share : ' +
                item.Title,
            },
          }),
        }
      ).then(({ action, activityType }) => {
        if (action === Share.dismissedAction) {
          Alert.alert("Hey!", "Don't Forget, You Get Points for Sharing Products!");
        }
        else {
          try {
            if (userID != 0) {
              fetch(
                'https://sharebert.com/DBAwardPoints.php?uid=' +
                userID +
                '&type=1',
                { method: 'GET' }
              )
                .then(response2 => response2.json())
                .then(responseData2 => {
                  if (responseData2['Points'] != userPoints) {

                    userPoints = responseData2['Points'];
                    //Alert.alert('POINTS OBTAINED', "Thanks for Sharing!");
                    if (Platform.OS === 'android') {
                      this.notification.show({
                        title: 'You got points!!',
                        message: 'Thanks For Sharing!',
                        icon: { uri: 'https://i.imgur.com/xW6iH48.png' },
                        onPress: () => this.showAlert(),
                      });

                    }
                    else {
                      this.showAlert();
                      console.log('ios');
                    }
                    this.forceUpdate();

                  }
                })
                .done();
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  // _onPress(item) {
  //   Alert.alert(
  //     'Buy Or Share',
  //     item.Title,
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       { text: 'Share', onPress: () => this.shareURL(item) },
  //       { text: 'Buy', onPress: () => { Linking.openURL(item.URL); } },

  //     ],
  //     { cancelable: false }
  //   );
  // }

  getFile = async (type) => {
    try {
      var likesave;
      if (userID !== undefined) {
        likesave = await AsyncStorage.getItem('@MySuperStore:Likes' + userID);
      }
      else {
        likesave = await AsyncStorage.getItem('@MySuperStore:Likes');
      }
      if (likesave !== null) {
        // We have data!!
        like2 = JSON.parse(likesave);
        like = like2.filter(function (n) { return n });
        like = like.reverse();
      }
      else {
        like = null;
      }
      this.forceUpdate();
    } catch (error) {
      // Error retrieving data
    }
  }

  openURL = item => {
    try {
      console.log('yep');
      if (
        this.state.url ===
        'https://s3.amazonaws.com/sbsupersharebert-us-east-03942032794023/wp-content/uploads/2017/06/19160520/Sharebert_Logo.png'
      ) {
        return;
      }
      try {
        Linking.openURL(item.URL);
      } catch (error) {
        console.error(error);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  showEmptyListView = () => {

    return (

      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.navigate('Explore', {
            id: userID,
            points: userPoints,
            uri: uri,
          });
        }}
      >
        <View style={{
          width: '100%',
          height: '100%'
        }}>
          <Text numberOfLines={2} style={styles.textEmpty}>THINGS YOU LIKE WILL APPEAR HERE!</Text>
          <Text numberOfLines={2} style={styles.textEmpty2}>TAP TO GET STARTED!</Text>
          <Text numberOfLines={2} style={styles.textEmpty}></Text>
          <Text numberOfLines={2} style={styles.textEmpty2}></Text>
          <Text numberOfLines={2} style={styles.textEmpty}></Text>
          <Text numberOfLines={2} style={styles.textEmpty2}></Text>
          <Text numberOfLines={2} style={styles.textEmpty}></Text>
        </View>
      </TouchableWithoutFeedback>
    )

  };
  _renderItem = data => {
    const item = data.item;
    var imageURL2 = ""
    try {

      if (item.ImageURL.includes('tillys')) {

        imageURL2 = item.ImageURL.substring(0, item.ImageURL.indexOf('?'));

      }
      else {
        imageURL2 = item.ImageURL;
      }
      var finalretail = ""
      if (item.Retailer.includes('shopDisney')) {
        finalretail = 'Paid Partnership with Disney';
      }
      else {
        finalretail = item.Retailer;
      }
      return (
        <View >
          <View >
            <TouchableWithoutFeedback onPress={() => this.openURL(item)}>
              <View>
                <Text numberOfLines={2} style={styles.text}>{item.Title}</Text>
                <Image
                  resizeMode={'contain'}
                  style={styles.image}
                  source={{
                    uri: imageURL2,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>

            <Text style={{ marginTop: -50, marginBottom: 30, color: 'black', fontSize: 12, fontFamily: 'Montserrat', width: Dimensions.get('window').width - 10, marginLeft: Dimensions.get('window').width / 2.9 }}>
              from{' '}
              <Text style={{ color: '#ff2eff', fontSize: 12, fontFamily: 'Montserrat' }}> {finalretail}</Text>
            </Text>
            <TouchableWithoutFeedback onPress={() => this.openURL(item)}>
              <Image style={styles.shareBut} source={require('./assets/icons/greenbuybutton.png')} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.shareURL(item)}>
              <Image style={styles.buyBut} source={require('./assets/icons/sharebutton.png')} />
            </TouchableWithoutFeedback>
            <Image style={styles.divider}
              source={require('./assets/empty2.png')}
            />
          </View>
        </View>
      );
    } catch (error) {

    }
  };

  render() {
    const { showAlert } = this.state;
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('Explore', {
              id: userID,
              points: userPoints,
              uri: uri,
            });
          }}
        >
          <View>
            <Image style={styles.header} />
            <Text style={styles.text2}>
              {userPoints + '\n'}
            </Text>
            <Text style={styles.pointsText}>
              Points
              </Text>
          </View>
        </TouchableWithoutFeedback>
        <Image
          resizeMode="contain"
          style={styles.button}
          source={require('./Logo.png')}
        />
        <TouchableWithoutFeedback
          style={styles.hamburger2}
          onPress={() => {
            //this.props.navigation.dispatch(backAction); //navigate to explore

            this.props.navigation.navigate('Explore', {
              id: userID,
              points: userPoints,
              uri: uri,
            });
          }}>
          <Image
            style={styles.hamburger}
            resizeMode='contain'
            source={require('./explore2.png')}
          />
        </TouchableWithoutFeedback>


        <Image
          resizeMode="contain"
          style={styles.heart}
          source={require('./assets/icons/heart_button.png')} />
        <Text style={styles.title}>
          Things You Like
        </Text>
        <Image style={styles.dividerTop}
          source={require('./assets/empty2.png')}
        />

        <ImageBackground
          source={require('./like_background.png')}
          style={{ width: '100%', height: '100%' }}>
          <View style={styles.likesviewscroll}>
            <FlatList backgroundColor={'transparent'}
              style={styles.likesviewscroll}
              data={like}
              keyExtractor={(item, index) => index}
              renderItem={this._renderItem}
              ListEmptyComponent={this.showEmptyListView()}
            />
          </View>
        </ImageBackground>
       

        {
          (Platform.OS === 'android')
            ?
            <Notification
              ref={(ref) => { this.notification = ref; }}
              backgroundColour='#ff2eff'
            />
            :
            <View />
        }
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Points Obtained!"
          message="Hey! Thanks for Sharing a product!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText=""
          confirmText="Awesome!"
          confirmButtonColor="#f427f3"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
          onDismiss={() => {
            this.hideAlert();
          }}
        />

<View style={styles.footer}>
        <Image style={styles.footer} />        
        <TouchableWithoutFeedback style={styles.footerItem}
                    onPress={() => this.props.navigation.navigate('Explore', {
                      id: userID,
                      points: userPoints,
                      uri: uri2,
                    })}>
                    <Image style={styles.exploreBut} resizeMode={"contain"} source={require('./assets/menu/explore.png')}>

                    </Image>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={styles.footerItem}
                    onPress={() => this.props.navigation.navigate('Likes', {
                        id: userID,
                        points: userPoints,
                        uri: uri2,
                    })}>
                    <Image style={styles.likesBut} resizeMode={"contain"} source={require('./assets/menu/likes.png')}>

                    </Image>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={styles.footerRewards}
                    >
                    <Image style={styles.rewardsBut} resizeMode={"contain"} source={require('./assets/menu/rewards.png')}>

                    </Image>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback style={styles.footerProfile}
                    onPress={() => this.props.navigation.navigate('Shipping', {
                        id: userID,
                        points: userPoints,
                        uri: uri2,
                    })}>
                    <Image style={styles.profileBut} resizeMode={"contain"} source={{ uri: uri2 }}>

                    </Image>
                </TouchableWithoutFeedback>
                </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: 'white',

      },
      android: {
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#dee6ee',

      },
    }),


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
        marginTop: 10,
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
        marginBottom: 30,
      },
      android: {
        marginRight: 10,
        marginTop: -10,
        marginBottom: 20,
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
        marginTop: -80,
        width: 100,
        height: 30,
        marginLeft: 10,
        backgroundColor: 'transparent',
        padding: 0,
        marginBottom: 30,

      },
      android: {
        position: 'absolute',
        marginTop: 5,
        marginLeft: 15,
        height: 40,
        width: 90,
      },
    }),

  },
  likesviewscroll: {
    ...Platform.select({
      ios: {
        width: '100%',
        height: '80%',
      },
      android: {
        width: '100%',
        height: '70%',
      },
    }),
  },
  hamburger2: {
    ...Platform.select({
      ios: {
      },
      android: {
        position: 'absolute',
        marginTop: 5,
        marginLeft: 10,
        height: 50,
        width: 150,
      },
    }),

  },
  heart:
    {
      width: Dimensions.get('window').width,
      height: 30,
      paddingTop: 30,
      marginTop: -15,
      marginBottom: 26,
      backgroundColor: 'white',

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
      ...Platform.select({
        ios: {
          width: Dimensions.get('window').width - 30,
          height: 2,
          marginLeft: 15,
          marginTop: 30,
          backgroundColor: '#dee6ee',
        },
        android: {
          width: Dimensions.get('window').width - 30,
          height: 2,
          marginLeft: 15,
          marginTop: 30,
          backgroundColor: '#dee6ee',
        },
      }),

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
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff2eff',
    marginTop: -26,
    marginBottom: 0,
    paddingBottom: 6,
    backgroundColor: 'white',
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
        marginTop: -75,
        marginLeft: Dimensions.get('window').width / 2.6,
        backgroundColor: 'transparent',
        padding: 20,
        marginBottom: 30,
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
        position: 'absolute',
        marginTop: 0,
        width: '100%',
        height: 50,
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
  textEmpty: {
    fontFamily: 'Montserrat',
    color: '#0d2754',
    width: '100%',
    textAlign: "center",
    marginTop: Dimensions.get('window').height / 5,
  },
  textEmpty2: {
    fontFamily: 'Montserrat',
    color: '#0d2754',
    textAlign: "center",
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
    ...Platform.select({
    ios: {
    height: 40,
    width: '100%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#dee6ee',
    },
    android: {
      height: 40,
      width: '100%',
      position: "absolute",
      bottom: 115,
      backgroundColor: '#dee6ee',
    }
  })
  },
  footerItem: {
    ...Platform.select({
      ios: {
    position: "absolute",
    bottom: 0,
    backgroundColor: 'transparent',
      },
      android:{
        position: "absolute",
        bottom: 0,
        backgroundColor: 'transparent',
      }})
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
export default Likes;
