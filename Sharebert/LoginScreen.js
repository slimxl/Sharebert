import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Google, Facebook,AuthSession } from 'expo';
var doubleclick = false;
var lastlogged = false;
var userEmail2 = '';
var userID = 0;
var name2 = 'Not Logged In';
var userPoints = 0;
var uri2 =
  'https://www.thesourcepartnership.com/wp-content/uploads/2017/05/facebook-default-no-profile-pic-300x300.jpg';

class LoginScreen extends Component {
  onSubmitEdit(location) {
    if (location === 'later') {
      name2 = 'Not Logged In';
      userID = 0;
      userEmail2 = '';
      userPoints = 0;
      uri2 =
        'https://www.thesourcepartnership.com/wp-content/uploads/2017/05/facebook-default-no-profile-pic-300x300.jpg';

        this.props.navigation.navigate('Explore', {
          id: 0,
          points: 0,
        });
    }
    else
    {
    doubleclick = false;
    //Alert.alert(name2,'Points: '+userPoints +' Email: '+userEmail2);
    this.props.navigation.navigate('Explore', {
      id: userID,
      points: userPoints,
    });
  }
  }
  _handleFinalGoogleLogin = async () =>{
    try {
      const { type, user } = await Google.logInAsync({
        androidStandaloneAppClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
        iosStandaloneAppClientId: '376011592870-sg2cq3fdqh6jk9tnbvope04f2sta0k2m.apps.googleusercontent.com',
        androidClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
        iosClientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      switch (type) {
        case 'success': {
          Alert.alert('Logged in!', `Hi ${user.name}!`);
          userEmail2 = user.email;
          doubleclick = true;
          name2 = user.name;
          uri2 = user.photoUrl;
          lastlogged = true;
          
          this.checkPoints();
          break;
        }
        case 'cancel': {
          Alert.alert('Cancelled!', 'Login was cancelled!');
          break;
        }
        default: {
          Alert.alert('Oops!', 'Login failed!');
        }
      }
    } catch (e) {
      Alert.alert('Oops!', 'Login failed!');
    }
  }
  _handleGoogleLogin = () => {
    if(doubleclick)
    {
      Alert.alert("Hang On!");
      return;
    }
    if(!lastlogged)
    {
      this._handleFinalGoogleLogin();
    }
    else
    {
      
      Alert.alert(
        'Login as '+name2+"?","",
        [
          {
            text: 'No',
            onPress: () => {this._handleFinalGoogleLogin()},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              this.onSubmitEdit("google");
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  _handleFacebookLogin = () => {
    if(doubleclick)
    {
      Alert.alert("Hang On!");
      return;
    }
    if(!lastlogged)
    {
      this._handleFinalFacebookLogin();
    }
    else
    {
      
      Alert.alert(
        'Login as '+name2+"?","",
        [
          {
            text: 'No',
            onPress: () => {this._handleFinalFacebookLogin()},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              this.onSubmitEdit("google");
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  _handlePressAsync = async () => {
    if(doubleclick)
    {
      Alert.alert("Hang On!");
      return;
    }
    let redirectUrl = AuthSession.getRedirectUrl();

    // You need to add this url to your authorized redirect urls on your Facebook app
    console.log({ redirectUrl });

    // NOTICE: Please do not actually request the token on the client (see:
    // response_type=token in the authUrl), it is not secure. Request a code
    // instead, and use this flow:
    // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
    // The code here is simplified for the sake of demonstration. If you are
    // just prototyping then you don't need to concern yourself with this and
    // can copy this example, but be aware that this is not safe in production.

    let result = await AuthSession.startAsync({
      authUrl:
        `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
        `&client_id=${1841427549503210}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });

    if (result.type !== 'success') {
      alert('Uh oh, something went wrong');
      return;
    }

    let accessToken = result.params.access_token;
    let userInfoResponse = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`
    );
    const userInfo = await userInfoResponse.json();
    if(userInfo.name!='')
    {
     // Alert.alert('Logged in!', `Hi ${userInfo.name}!`);
              userEmail2 = userInfo.email;
              name2 = userInfo.name;
              uri2 =
                'https://graph.facebook.com/' +
                userInfo.id +
                '/picture? type=large';
                this.checkPoints();
    }
  };

  
  saveFile=async()=>{
    try {
      await AsyncStorage.setItem('@MySuperStore:name', name2);
      await AsyncStorage.setItem('@MySuperStore:email', userEmail2);
      await AsyncStorage.setItem('@MySuperStore:uri2', uri2);
      await AsyncStorage.setItem('@MySuperStore:points', userPoints);
      await AsyncStorage.setItem('@MySuperStore:id', userID); 
    } catch (error) {
      // Error saving data
    }

   
  }

  getFile=async(type)=>{
    try {
      const namesaved = await AsyncStorage.getItem('@MySuperStore:name');
      if (namesaved !== null){
        // We have data!!
        console.log(namesaved);
        name2 = namesaved;
        lastlogged = true;
        if(type === 'Facebook')
        {
          this._handleFacebookLogin();
        }
        else{
          this._handleGoogleLogin();

        }
      }
    } catch (error) {
      // Error retrieving data
      lastlogged = false;
    }
  }



  _handleFinalFacebookLogin = async () => {
    if(doubleclick)
    {
      Alert.alert("Hang On!");
      return;
    }
    try {
      const {
        type,
        token,
      } = await Facebook.logInWithReadPermissionsAsync(
        '1841427549503210', // Replace with your own app id in standalone app
        { permissions: ['public_profile', 'email'] }
      );

      switch (type) {
        case 'success': {
          // Get the user's name using Facebook's Graph API
          fetch(
            'https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' +
              token
          )
            .then(response => response.json())
            .then(json => {
              Alert.alert('Logged in!', `Hi ${json.name}!`);
              userEmail2 = json.email;
              name2 = json.name;
              uri2 =
                'https://graph.facebook.com/' +
                json.id +
                '/picture? type=large';
                this.checkPoints();
                doubleclick = true;
            })
            .catch(() => {});
          break;
        }
        case 'cancel': {
          Alert.alert('Cancelled!', 'Login was cancelled!');
          break;
        }
        default: {
          Alert.alert('Oops!', 'Login failed!');
        }
      }
    } catch (e) {
      Alert.alert('Oops!', 'Login failed!');
    }
  };

  checkPoints = () => {
    
    if (userEmail2 != '') {
      fetch(
        'https://sharebert.com/ReturnLoginToServerWeb.php?uemail=' +
          userEmail2 +
          '&uname=' +
          name2,
        { method: 'GET' }
      )
        .then(() => {
          fetch(
            'https://sharebert.com/RetrievePointsWeb.php?uemail=' +
              userEmail2,
            { method: 'GET' }
          )
            .then(response => response.json())
            .then(responseData => {
              var test = responseData['Points'];
              userPoints = test;
            })
            .done();
        })
        .done();
        
        
        fetch(
            'https://biosystematic-addit.000webhostapp.com/GetIDfromEmail.php?uemail=' +
              userEmail2,
            { method: 'GET' }
          )
            .then(response2 => response2.json())
            .then(responseData2 => {
              var test = responseData2['id'];
             userID = test;
             this.saveFile();
             this.onSubmitEdit('Login');
            })
            .done();
        
        
    }
    else
    {
      Alert.alert("no Email");
    }
  };
  render() {
    return (
      <View>
        <Image
          resizeMode="contain"
          style={styles.button}
          source={require('./sign_bg.png')}
        />
        <View style={styles.bg}>
          <TouchableOpacity
            onPress={this.getFile}
            style={styles.loging}>
            <Image
              resizeMode="contain"
              style={styles.button3}
              source={require('./google_sign.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.getFile('Facebook')}
            style={styles.loginf}>
            <Image
              resizeMode="contain"
              style={styles.button2}
              source={require('./facebook_login_btn.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onSubmitEdit('later')}
            style={styles.later}>
            <Text style={styles.text}>
              SIGN IN LATER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  loging: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loginf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  later: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4b4d4f',
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  button2: {
    flex: 1,
    width: 200,
    height: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button3: {
    flex: 1,
    width: 200,
    height: 50,
    marginTop: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 25,
  },
});
export { userEmail2 };
export { name2 };
export { uri2 };
export {userPoints};
export {userID};
export default LoginScreen;
