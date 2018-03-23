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
  FlatList,
  Share,
  Platform,
  Dimensions,
} from 'react-native';

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
    uri = this.props.navigation.state.params.uri;
    if (userPoints === undefined || userID === undefined) {
      userPoints = 0;
      userID = 0;
    }
    this.state = {
      isOpen: false,
      selectedItem: 'Likes',
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

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

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
                    Alert.alert('POINTS OBTAINED', "Thanks for Sharing!");

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
        { text: 'Share', onPress: () => this.shareURL(item) },
        { text: 'Buy', onPress: () => { Linking.openURL(item.URL); } },

      ],
      { cancelable: false }
    );
  }

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
      }
      else {
        like = null;
      }
      this.forceUpdate();
    } catch (error) {
      // Error retrieving data
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(this.props.navigation.navigate('Explore', {
              id: userID,
              points: userPoints,
              uri: uri,
            }));
          }}>

          <Image style={styles.header} />
          <Text style={styles.headertext}>
            Tap to Explore
              </Text>
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styles.button}
          source={require('./Logo.png')}
        />
        <TouchableOpacity
          onPress={() => {
            //this.props.navigation.dispatch(backAction); //navigate to explore

            this.props.navigation.dispatch(this.props.navigation.navigate('Explore', {
              id: userID,
              points: userPoints,
              uri: uri,
            }));
          }}>
          <Image
            style={styles.hamburger}
            source={require('./purplemenuicon.png')}
          />
        </TouchableOpacity>
          <Image 
          resizeMode="contain" 
          style={styles.heart}
            source={require('./assets/icons/heart_button.png')}/>
        <Text style={styles.title}>
          My Likes
        </Text>
        <Image style={styles.divider}
                />
        <FlatList backgroundColor={'white'}
          data={like}
          keyExtractor={(item, index) => index}
          renderItem={({ item, separators }) => (
            <TouchableOpacity
              onPress={() => this._onPress(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{ backgroundColor: 'white' }}>
                <Text style={styles.text}>{item.Title}</Text>
                <Image
                  resizeMode={'contain'}
                  style={styles.image}
                  source={{
                    uri: item.ImageURL,
                  }}
                />
                <Image style={styles.divider}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: Constants.statusBarHeight,
      },
      android: {
        marginTop: 80,
      },
    }),

    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  hamburger: {
    ...Platform.select({
      ios: {
        marginTop: -47,
      },
      android: {
        marginTop: -10,
      },
    }),
    width: 30,
    height: 23,
    marginLeft: 10,
    
    backgroundColor: 'transparent',
    padding: 0,
  },
  heart:
  {
    width: Dimensions.get('window').width,
    height: 30,
    marginTop: -15,
    marginBottom: 26,
    backgroundColor: 'white',
    
  },
  divider:
  {
    width: Dimensions.get('window').width - 30,
    height: 2,
    marginLeft: 15,
    backgroundColor: '#dee6ee',
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff2eff',
    marginTop: -26,
    backgroundColor: 'white',
  },
  image: {
    
    width: 100,
    height: 100,
    marginTop: -50,
  },
  button: {
    width: 100,
    height: 70,
    marginTop: -44,
    marginLeft: 60,
    backgroundColor: 'transparent',
    padding: 20,
  },
  header: {
    ...Platform.select({
      ios: {
        marginTop: 0,
      },
      android: {
        marginTop: -10,
      },
    }),
    width: '100%',
    height: 40,
    backgroundColor: '#dee6ee',
  },
  text: {
    textAlign: 'left',
    fontSize: 12,
    marginTop: 40,
    marginLeft: 110,
    backgroundColor: 'transparent',
  },
  headertext:
    {
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: 17,
      marginTop: -32,
      marginLeft: 140,
      backgroundColor: 'transparent',
    },
});
export default Likes;
