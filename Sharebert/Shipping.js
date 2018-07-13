import React, { Component } from 'react';
import LoginScreen from './LoginScreen';
import { NavigationActions } from 'react-navigation';
import Dialog from "react-native-dialog";
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
import Firebase from './Firebase';

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
      dialogVisible: false,
      isOpen: false,
      inputValue: "Referral Code",
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

  fetchData = () => {
    if (userID != 0) {
      fetch(
        'https://sharebert.com/s/ShipGet.php?uid=' +
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
  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
  handleSend = () =>{
    fetch(
      'https://sharebert.com/s/SetReferral.php?uid=' +
      userID +
      '&referral=' + this.state.inputValue,
      { method: 'GET' }
    ).done();
    this.handleCancel();
  }
  sendData = () => {
    fetch(
      'https://sharebert.com/s/ShipSend2.php?uid=' +
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
    this.props.navigation.goBack();

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
    this.props.navigation.popToTop();
  }
  clearFile2 = () => {
    this.props.navigation.push('Main', {
      loggedbool2: false,
      id: userID,
      points: userPoints,
      uri: uri2,
    });
  }

  _handleTextChange = inputValue => {
    this.setState({ inputValue });
  };
  clearLikes = async () => {
    // await AsyncStorage.removeItem('@MySuperStore:Likes' + userID);
    // Alert.alert("Likes Cleared!");
    // const value = await AsyncStorage.getItem('@MySuperStore:Likes' + userID);
    // console.log('likes' + value);
    // this.forceUpdate();
    this.props.navigation.state.params.clearLikes();
  };
  resetTo(route) {
    this.props.navigation.pop(0)
    this.props.navigation.navigate(route, {
      id: userID,
      points: userPoints,
      uri: uri2,
    })
  }

  render() {
    return (
      <View style={styles.container}>

        <ImageBackground
          source={require('./like_background.png')}
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, position: 'absolute', top: 0 }}>
          <View style={{ width: '100%', height: Dimensions.get('window').height }}>
            <Image style={styles.dividerTop} source={require('./assets/likesbg.png')} />
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
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
              source={require('./assets/icons/logoicon.png')}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.goBack();

              }}>
              <Image
                style={styles.hamburger}
                resizeMode='contain'
                source={require('./assets/arrow_w.png')}
              />
            </TouchableWithoutFeedback>
            <Text style={styles.title}>
              My Profile
        </Text>
            <ScrollView
              style={{ marginTop: 20, backgroundColor: 'transparent', }}
              vertical={true}>
              <Text style={styles.paragraph}>
                Name:
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.name}
                onChangeText={(text) => {
                  user.Name = text;
                  this.setState({ name: text })
                }}
                placeholderTextColor={'#01284e'}
                style={styles.textField}
              />
              <Text style={styles.paragraph}>
                Address:
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.address}
                onChangeText={(text) => {
                  user.Address = text;
                  this.setState({ address: text })
                }}
                placeholderTextColor={'#01284e'}
                style={styles.textField}
              />
              <Text style={styles.paragraph}>
                City:
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.city}
                onChangeText={(text) => {
                  user.City = text;
                  this.setState({ city: text })
                }}
                placeholderTextColor={'#01284e'}
                style={styles.textField}
              />
              <Text style={styles.paragraphS}>
                State:
            </Text>
              <Picker
                style={styles.textFieldS}
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

              <Text style={styles.paragraphZ}>
                Zip:
            </Text>
              <TextInput
                textAlign="left"
                onSubmitEditing={this.onSubmitEdit}
                value={this.state.zip}
                onChangeText={(text) => {
                  user.Zip = text;
                  this.setState({ zip: text })
                }}
                placeholderTextColor={'#01284e'}
                style={styles.textField}
              />
              <TouchableOpacity onPress={this.saveForm}
                style={{
                  width: 100, height: 75,
                  marginLeft: (Dimensions.get('window').width * .5) - 50
                }}>
                <Image
                  resizeMode="contain"
                  style={styles.button2}
                  source={require('./assets/icons/save_button.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                width: 250, height: 50,
                marginLeft: (Dimensions.get('window').width * .5) - 125
              }}
                onPress={() => { Linking.openURL('https://sharebert.com/privacy-policy/'); }}>
                <Image
                  resizeMode="contain"
                  style={styles.button3}
                  source={require('./assets/icons/policy.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.clearLikes}
                style={{
                  width: 250, height: 50,
                  marginLeft: (Dimensions.get('window').width * .5) - 125,
                }}>
                <Image
                  resizeMode="contain"
                  style={styles.button3}
                  source={require('./assets/icons/delete_likes.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                this.clearFile();
              }}
                style={{
                  width: 250, height: 50,
                  marginLeft: (Dimensions.get('window').width * .5) - 125
                }}>
                {!loggedbool
                  ? <Image
                    resizeMode="contain"
                    style={styles.button3}
                    source={require('./assets/icons/login_n.png')}
                  />
                  : <Image
                    resizeMode="contain"
                    style={styles.button3}
                    source={require('./assets/icons/logout.png')}
                  />}
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Main', 
                {
                  id: userID,
                  points: userPoints,
                  uri: uri2,
                });
              }}
              style={{
                width: 250, height: 50, 
                marginLeft: (Dimensions.get('window').width * .5) - 125
              }}>
                   <Text style={{backgroundColor: 'white'}}>
                    Super secret game button
                  </Text>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={this.showDialog}
                style={{
                  width: 250, height: 50,
                  marginLeft: (Dimensions.get('window').width * .5) - 125
                }}>
                <Text style={{ backgroundColor: 'white' }}>
                  Set Referral
                  </Text>
              </TouchableOpacity>

              <View>
                <Dialog.Container
                  visible={this.state.dialogVisible}
                >
                  <Dialog.Title>Referral</Dialog.Title>
                  <Dialog.Description>
                    Type or Paste in Referral Code
                  </Dialog.Description>
                  <Dialog.Input
                    onFocus={() => {
                      this.setState({
                        inputValue: "",
                      });
                    }} 
                    onChangeText={this._handleTextChange}
                    value={this.state.inputValue}>

                  </Dialog.Input>
                  <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                  <Dialog.Button label="Okay" onPress={this.handleSend} />
                </Dialog.Container>
              </View>
              {/* <TouchableOpacity onPress={() => {
                this.clearFile2();
              }}
              style={{
                width: 250, height: 50, 
                marginLeft: (Dimensions.get('window').width * .5) - 125
              }}>
                 <Image
                    resizeMode="contain"
                    style={styles.button3}
                    source={require('./assets/icons/play.png')}
                  />
              </TouchableOpacity> */}

            </ScrollView>
            <Text style={styles.text}>
              We take privacy seriously.{"\n"}
              We'll never sell or trade your data.
          </Text>
          </View>

        </ImageBackground>
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
        backgroundColor: 'transparent',
      },
      android: {
        marginTop: -10,
        backgroundColor: 'transparent',
        height: 100,
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
  button2: {//save
    ...Platform.select({
      ios: {
        width: 100,
        height: 75,
        backgroundColor: 'transparent',
      },
      android: {
        width: 100,
        height: 75,
        backgroundColor: 'transparent',
      },
    }),
  },
  button3: {//others
    ...Platform.select({
      ios: {
        marginTop: -10,
        width: 250,
        height: 75,
        backgroundColor: 'transparent',
      },
      android: {
        marginTop: -10,
        width: 250,
        height: 75,
        backgroundColor: 'transparent',
      },
    }),
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
  textField: {
    ...Platform.select({
      ios: {
        fontSize: 20,
        right: 10,
        color: '#f310a0',
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width - 100,
        height: 44,
        padding: 8,
        marginTop: -42,
        marginLeft: 100,
        borderRadius: 8
      },
      android: {
        fontSize: 20,
        right: 10,
        color: '#01284e',
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width - 100,
        height: 44,
        padding: 8,
        marginTop: -42,
        marginLeft: 100,
        borderRadius: 8
      },
    }),

  },
  textFieldZ: {
    ...Platform.select({
      ios: {
        fontSize: 20,
        right: 10,
        color: '#f310a0',
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width - 100,
        height: 44,
        padding: 8,
        marginTop: 108,
        marginLeft: 100,
        borderRadius: 8
      },
      android: {
        fontSize: 20,
        right: 10,
        color: '#01284e',
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width - 100,
        height: 44,
        padding: 8,
        marginTop: -42,
        marginLeft: 100,
        borderRadius: 8
      },
    }),
  },
  textFieldS: {
    ...Platform.select({
      ios: {
        right: 10,
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width,
        height: 44,
        padding: 8,
        marginTop: -137,
        marginBottom: 5,
        borderRadius: 8
      },
      android: {
        right: 10,
        backgroundColor: 'transparent',
        width: Dimensions.get('window').width - 100,
        height: 44,
        padding: 8,
        marginTop: -45,
        marginLeft: 100,
        borderRadius: 8
      },
    }),

  },
  paragraph: {
    ...Platform.select({
      ios: {
        color: '#01284e',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
      },
      android: {
        color: '#f310a0',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
      },
    }),
  },
  paragraphS: {
    ...Platform.select({
      ios: {
        color: '#01284e',
        marginBottom: 10,
        marginTop: 85,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
      },
      android: {
        color: '#f310a0',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
      },
    }),
  },
  paragraphZ: {
    ...Platform.select({
      ios: {
        color: '#01284e',
        marginBottom: 10,
        marginTop: 165,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
      },
      android: {
        color: '#f310a0',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
      },
    }),
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
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#ec47ff',
    backgroundColor: 'transparent',
    marginBottom: 35,
  },
  image: {
    width,
    flex: 3,
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
  bg: {
    height: 190,
    width: '100%',
    marginTop: -150,
    backgroundColor: '#dee6ee',
  },
});
export default Shipping;
