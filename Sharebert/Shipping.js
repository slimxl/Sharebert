import React, { Component } from 'react';
import LoginScreen from './LoginScreen';
import { NavigationActions } from 'react-navigation';
import {
  View,
  AsyncStorage,
  Platform,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
  TextInput,
  Picker,
  Dimensions,
  Alert,
} from 'react-native';

import { Constants } from 'expo';
const { width } = 10;
var loggedin = 'Log Out'
var loggedbool = false;
var userID = 0;
var userPoints = 0;
var user = {};
const backAction = NavigationActions.back({
  key: null
});
class Shipping extends Component {
  constructor(props) {
    user.Name = '';
    user.Phone = '';
    user.Email = '';
    user.Address = '';
    user.City = '';
    user.State = '';
    user.StateIndex = '';
    user.Zip = '';
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    uri2 = this.props.navigation.state.params.uri;
    this.fetchData();
    this.state = {
      isOpen: false,
      selectedItem: 'Shipping',
      userPoints: userPoints,
      name: '',
      phone: '',
      email: '',
      address: '',
      state: '',
      city: '',
      stateIndex: '',
      zip: '',
      language: 0,
    };
    if (userID === 0) {
      loggedin = 'Log In';
    }
    else {
      loggedbool = true;
    }
  }

  onMenuItemSelected = item => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
    if (item === 'Shipping') {
      this.props.navigation.navigate('Shipping');
    } else if (item === 'Explore') {
      this.props.navigation.navigate('Explore');
    }
  };

  fetchData = () => {
    if (userID != 0) {
      fetch(
        'https://sharebert.com/ShipGet.php?uid=' +
        userID,
        { method: 'GET' }
      )
        .then(response2 => response2.json())
        .then(responseData2 => {
          user.Name = responseData2['ShipName'];
          user.Phone = responseData2['Phone'];
          user.Email = responseData2['User_Email'];
          user.Address = responseData2['Address'];
          user.City = responseData2['City'];
          user.State = responseData2['State']
          user.Zip = responseData2['Postal'];
          user.StateIndex = responseData2['StateIndex'];
          if (user.Name === 'null') {
            user.Name = '';
          }
          if (user.Phone === 'null') {
            user.Phone = '';
          }
          if (user.Address === 'null') {
            user.Address = '';
          }
          if (user.City === 'null') {
            user.City = '';
          }
          if (user.Zip === 'null') {
            user.Zip = '';
          }

          this.setState({
            name: user.Name,
            phone: user.Phone,
            email: user.Email,
            address: user.Address,
            city: user.City,
            state: user.State,
            stateIndex: user.StateIndex,
            zip: user.Zip,
          });
          this.forceUpdate();
        })
        .done();
    }


  };

  sendData = () => {
    fetch(
      'https://sharebert.com/ShipSend2.php?uid=' +
      +userID + '&' +
      'uname=' + user.Name + '&' +
      'uem=' + user.Email + '&' +
      'uadd=' + user.Address + '&' +
      'ucit=' + user.City + '&' +
      'ustate=' + user.State + '&' +
      'upost=' + user.Zip + '&' +
      'upho=' + user.Phone + '&' +
      'uind=' + user.StateIndex,
      { method: 'GET' }
    ).done();
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  goBack = () => {
    this.props.navigation.pop();
  };
  saveForm = () => {
    if (this.state.email === '') {
      Alert.alert('No Email!', 'Try Again!');
      return;
    }
    if (userID != 0) {
      Alert.alert("User Data Confirmation",
        + user.Name + " \n"
        + user.Phone + " \n"
        + user.Address + " \n"
        + user.State + " \n"
        + user.Zip + " \n",
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => this.sendData() },
        ],
        { cancelable: false });
    }


  };

  clearFile = () => {
    this.props.navigation.navigate('LoginScreen', {
      loggedbool2: false,
      id: 0,
      points: 0,
    });
  }

  clearLikes = async () => {
    await AsyncStorage.removeItem('@MySuperStore:Likes' + userID);
    Alert.alert("Likes Cleared!");
    const value = await AsyncStorage.getItem('@MySuperStore:Likes' + userID);
    console.log('likes' + value);
    this.forceUpdate();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(backAction);
          }}>

          <Image style={styles.header} />
          <Text style={styles.text3}>
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
        <ImageBackground
          source={require('./like_background.png')}
          style={{ width: '100%', height: '100%', marginTop: 10 }}>
          <View style={{ width: '100%', height: '90%' }}>
            <ScrollView
              style={{ marginTop: 20, backgroundColor: 'transparent', }}
              vertical={true}>
              <Text style={styles.paragraph}>
                Name
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.name}
                onChangeText={(text) => {
                  user.Name = text;
                  this.setState({ name: text })
                }}
                placeholderTextColor={'#4c515b'}
                style={{
                  fontSize: 20,
                  backgroundColor: '#d9dbdd',
                  width: Dimensions.get('window').width - 40,
                  height: 44,
                  padding: 8,
                  marginTop: 0,
                  marginLeft: 20,
                  borderRadius: 8,
                }}
              />
              <Text style={styles.paragraph}>
                Phone
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.phone}
                onChangeText={(text) => {
                  user.Phone = text;
                  this.setState({ phone: text })
                }}
                placeholderTextColor={'#4c515b'}
                style={{
                  fontSize: 20,
                  backgroundColor: '#d9dbdd',
                  width: Dimensions.get('window').width - 40,
                  height: 44,
                  padding: 8,
                  marginTop: 0,
                  marginLeft: 20,
                  borderRadius: 8,
                }}
              />
              <Text style={styles.paragraph}>
                Address
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.address}
                onChangeText={(text) => {
                  user.Address = text;
                  this.setState({ address: text })
                }}
                placeholderTextColor={'#4c515b'}
                style={{
                  fontSize: 20,
                  backgroundColor: '#d9dbdd',
                  width: Dimensions.get('window').width - 40,
                  height: 44,
                  padding: 8,
                  marginTop: 0,
                  marginLeft: 20,
                  borderRadius: 8
                }}
              />
              <Text style={styles.paragraph}>
                City
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.city}
                onChangeText={(text) => {
                  user.City = text;
                  this.setState({ city: text })
                }}
                placeholderTextColor={'#4c515b'}
                style={{
                  fontSize: 20,
                  backgroundColor: '#d9dbdd',
                  width: Dimensions.get('window').width - 40,
                  height: 44,
                  padding: 8,
                  marginTop: 0,
                  marginLeft: 20,
                  borderRadius: 8
                }}
              />
              <Text style={styles.paragraph}>
                State
            </Text>
              <Picker
                style={{ marginTop: -25 }}
                selectedValue={this.state.state}
                onValueChange={(itemValue, itemIndex) => {
                  user['State'] = itemValue;
                  user['StateIndex'] = itemIndex;
                  this.setState({ state: itemValue })
                }}>
                <Picker.Item label="Alabama" value="AL" />
                <Picker.Item label="Alaska" value="AK" />
                <Picker.Item label="Arizona" value="AZ" />
                <Picker.Item label="Arkansas" value="AR" />
                <Picker.Item label="California" value="CA" />
                <Picker.Item label="Colorado" value="CO" />
                <Picker.Item label="Connecticut" value="CT" />
                <Picker.Item label="Delaware" value="DE" />
                <Picker.Item label="Florida" value="FL" />
                <Picker.Item label="Georgia" value="GA" />
                <Picker.Item label="Hawaii" value="HI" />
                <Picker.Item label="Idaho" value="ID" />
                <Picker.Item label="Illinois" value="IL" />
                <Picker.Item label="Indiana" value="IN" />
                <Picker.Item label="Iowa" value="IA" />
                <Picker.Item label="Kansas" value="KS" />
                <Picker.Item label="Kentucky" value="KY" />
                <Picker.Item label="Louisiana" value="LA" />
                <Picker.Item label="Maine" value="ME" />
                <Picker.Item label="Maryland" value="MD" />
                <Picker.Item label="Massachusetts" value="MA" />
                <Picker.Item label="Michigan" value="MI" />
                <Picker.Item label="Minnesota" value="MN" />
                <Picker.Item label="Mississippi" value="MS" />
                <Picker.Item label="Missouri" value="MO" />
                <Picker.Item label="Montana" value="MT" />
                <Picker.Item label="Nebraska" value="NE" />
                <Picker.Item label="Nevada" value="NV" />
                <Picker.Item label="New Hampshire" value="NH" />
                <Picker.Item label="New Jersey" value="NJ" />
                <Picker.Item label="New Mexico" value="NM" />
                <Picker.Item label="New York" value="NY" />
                <Picker.Item label="North Carolina" value="NC" />
                <Picker.Item label="North Dakota" value="ND" />
                <Picker.Item label="Ohio" value="OH" />
                <Picker.Item label="Oklahoma" value="OK" />
                <Picker.Item label="Oregon" value="OR" />
                <Picker.Item label="Pennsylvania" value="PA" />
                <Picker.Item label="Rhode Island" value="RI" />
                <Picker.Item label="South Carolina" value="SC" />
                <Picker.Item label="South Dakota" value="SD" />
                <Picker.Item label="Tennessee" value="TN" />
                <Picker.Item label="Texas" value="TX" />
                <Picker.Item label="Utah" value="UT" />
                <Picker.Item label="Vermont" value="VT" />
                <Picker.Item label="Virginia" value="VA" />
                <Picker.Item label="Washington" value="WA" />
                <Picker.Item label="Washington, D.C" value="DC" />
                <Picker.Item label="West Virginia" value="WV" />
                <Picker.Item label="Wisconsin" value="WI" />
                <Picker.Item label="Wyoming" value="WY" />
              </Picker>

              <Text style={styles.paragraph}>
                Postal Code
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.zip}
                onChangeText={(text) => {
                  user.Zip = text;
                  this.setState({ zip: text })
                }}
                placeholderTextColor={'#4c515b'}
                style={{
                  fontSize: 20,
                  backgroundColor: '#d9dbdd',
                  width: Dimensions.get('window').width - 40,
                  height: 44,
                  padding: 8,
                  marginTop: 0,
                  marginLeft: 20,
                  marginBottom: 20,
                  borderRadius: 8
                }}
              />
              <TouchableOpacity onPress={this.saveForm}>
                <Image
                  resizeMode="contain"
                  style={styles.button2}
                  source={require('./assets/icons/save.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Linking.openURL('https://sharebert.com/privacy-policy/'); }}>
                <Image
                  resizeMode="contain"
                  style={styles.button2}
                  source={require('./assets/icons/privacy.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                this.clearFile();
              }}>
                {!loggedbool
                  ? <Image
                    resizeMode="contain"
                    style={styles.button2}
                    source={require('./assets/icons/btn_login.png')}
                  />
                  : <Image
                    resizeMode="contain"
                    style={styles.button2}
                    source={require('./assets/icons/btn_logout.png')}
                  />}
              </TouchableOpacity>


              <TouchableOpacity onPress={this.clearLikes}>
                <Image
                  resizeMode="contain"
                  style={styles.button2}
                  source={require('./assets/icons/clear.png')}
                />
              </TouchableOpacity>

            </ScrollView>
            <Text style={styles.text}>
          We do not sell, trade, or otherwise share your personal information with any other company or agency. By submitting your information, you agree to have your name, address, phone number, and email stored on our secured servers.
          </Text>
          </View>
          
        </ImageBackground>
        

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
            onPress={() => this.props.navigation.navigate('Rewards', {
              id: userID,
              points: userPoints,
              uri: uri2,
            })}
          >
            <Image style={styles.rewardsBut} resizeMode={"contain"} source={require('./assets/menu/rewards.png')}>

            </Image>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback style={styles.footerProfile}
           >
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
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#F5FCFF',
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
      },
    }),

  },
  button: {
    ...Platform.select({
      ios: {
        width: 100,
        height: 70,
        marginTop: -50,
        marginLeft: Dimensions.get('window').width / 2.6,
        backgroundColor: 'transparent',
        padding: 40,
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
  button2: {
    ...Platform.select({
      ios: {
        width: '75%',
        height: 70,
        marginTop: 10,
        marginLeft: Dimensions.get('window').width / 8,
        backgroundColor: 'transparent',
        padding: 30,
      },
      android: {
        width: '75%',
        height: 70,
        marginTop: 10,
        marginLeft: Dimensions.get('window').width / 8,
        backgroundColor: 'transparent',
        padding: 30,
      },
    }),
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  paragraph2: {
    margin: 24,
    fontSize: 24,
    height: 60,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#f42ed0',
  },
  text3: {
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
  text2: {
    marginRight: 10,
    marginTop: -40,
    textAlign: 'right',
    fontSize: 15,
    color: '#f427f3',
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: 'transparent',
    marginBottom:10,
  },
  image: {
    width,
    flex: 3,
  },
  hamburger: {
    ...Platform.select({
      ios: {
        width: 30,
        height: 23,
        marginLeft: 10,
        marginTop: -55,
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
  bg: {
    height: 190,
    width: '100%',
    marginTop: -150,
    backgroundColor: '#dee6ee',
  },
});
export default Shipping;
