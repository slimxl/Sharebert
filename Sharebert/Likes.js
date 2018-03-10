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
} from 'react-native';

import { Constants } from 'expo';
const backAction = NavigationActions.back({
  key: null
});
var userPoints = 0;
var userID = 0;
var like;
class Likes extends Component {
  constructor(props) {
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
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
              message: 'Have a look on : \n' +
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
      );
    } catch (error) {
      console.error(error);
    }

    try {
      if (userID != 0) {
        Alert.alert('POINTS OBTAINED');
        fetch(
          'https://biosystematic-addit.000webhostapp.com/DBAwardPoints.php?uid=' +
            userID +
            '&type=1',
          { method: 'GET' }
        )
          .then(response2 => response2.json())
          .then(responseData2 => {
            Alert.alert('POINTS OBTAINED');
            this.setState({
              userPoints: responseData2['Points'],
            });
          })
          .done();
      }
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
        { text: 'Buy', onPress: () => {Linking.openURL(item.URL);} },
        
      ],
      { cancelable: false }
    );
  }

  getFile=async(type)=>{
    try {   
      if(this.userID !== undefined)
      {
        const likesave = await AsyncStorage.getItem('@MySuperStore:Likes' + this.userID);
        Alert.alert("Reading Likes for "+ this.userID + "...");
      }
      else
      {
      const likesave = await AsyncStorage.getItem('@MySuperStore:Likes');
      Alert.alert("Reading Likes for logout...");
      }
        Alert.alert(likesave + "wow");
      if (likesave !== null){
        // We have data!!
        console.log(likesave);
        like = JSON.parse(likesave);
        Alert.alert(like + "a like");
      }
      else
      {
        Alert.alert("Likes are null! :(");
      }
    } catch (error) {
      // Error retrieving data
    }
  }

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
          Likes
        </Text>
        <FlatList
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
    );
  }
}

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
    marginTop: -50,
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
export default Likes;
