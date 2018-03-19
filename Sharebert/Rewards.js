import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
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
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.header} />
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
          Rewards
        </Text>
        <FlatList
          data={rdata}
          keyExtractor={(item, index) => index}
          renderItem={({ item, separators }) => (
            <TouchableOpacity
              onPress={() => this._onPress(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{ backgroundColor: 'white' }}>
                <Text style={styles.text}>{item.Title}</Text>
                <Text style={styles.text2}>{item.Cost} Points</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: -75,
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
  hamburger: {
    width: 30,
    height: 23,
    marginLeft: 10,
    marginTop: -48,
    backgroundColor: 'transparent',
    padding: 0,
  },
  tab: {
    width: 25,
    height: 50,
    marginTop: -800,
    marginBottom: 250,
    backgroundColor: 'transparent',
  },
  text2: {
    color: '#ec47ff',
    textAlign: 'left',
    fontSize: 12,
    marginTop: 40,
    marginLeft: 110,
    backgroundColor: 'transparent',
  },
});
export default Rewards;
