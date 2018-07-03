import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Google, Facebook, AuthSession, Font } from 'expo';
import { Analytics, PageHit } from 'expo-analytics';
import Firebase from './Firebase';

class PlaylistItem {
  constructor(name, uri, isVideo) {
    this.name = name;
    this.uri = uri;
    this.isVideo = isVideo;
  }
}
var doubleclick = false;
var lastlogged = true;
var userEmail2 = '';
var userID = 0;
var PLAYLIST = [];
var name2 = 'Not Logged In';
var userPoints = 0;
var stype;
var suser;
const analytics = new Analytics('UA-118973857-1', { debug: true });
var uri2 =
  'https://sharebert.com/medias/blank.png';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.getData();
    this.grabPlaylistItems();
    console.disableYellowBox = true;
    Font.loadAsync({
      'Montserrat': require('./assets/fonts/Montserrat.otf'),
      'MontserratBold': require('./assets/fonts/MontserratBold.otf'),
      'MontserratLight': require('./assets/fonts/MontserratLight.otf'),
      'MontserratBoldItalic': require('./assets/fonts/MontserratBoldItalic.otf'),
      'MontserratItalic': require('./assets/fonts/MontserratItalic.otf'),

    });

    analytics.hit(new PageHit('IsItWorking'))
      .then(() => {
        console.log("success");
        //console.log(analytics)
      })
      .catch(e => console.log(e.message));
  }

  debugAnalyticmsg = () => {
    Alert.alert('DEBUG', JSON.stringify(analytics, null, 4));
  };

  onSubmitEdit(location) {
    if (location === 'later') {
      name2 = 'Not Logged In';
      userID = 0;
      userEmail2 = '';
      userPoints = 0;
      uri2 =
        'https://sharebert.com/medias/blank.png';

      this.props.navigation.navigate('Explore', {
        id: userID,
        points: userPoints,
        uri: uri2,
        PLAYLIST: PLAYLIST
        //this.props.navigation.navigate('Main', {
        //  id: 0,
        //  points: 0,
        //  uri: uri2,
      });
    }
    else {
      if (userID !== '0') {
        // Firebase.database().ref('users/' + userID).once('value', (snapshot) => {
        //   if(snapshot.val()=== null)
        //     {
        //       Firebase.database().ref('users/' + userID).push({
        //         User_Email: userEmail2,
        //         User_Name: name2,
        //       });
        //     }
        // });
        var ref = Firebase.database().ref('users/' + userID);
        ref.once('value')
          .then(function (snapshot) {
            if (snapshot.val() === null) {
              Firebase.database().ref('users/' + userID).set({
                User_Email: userEmail2,
                User_Name: name2,
              });
            }
          });
      }
      doubleclick = false;
      //Alert.alert(name2,'Points: '+userPoints +' Email: '+userEmail2);
      this.props.navigation.navigate('Explore', {
        id: userID,
        points: userPoints,
        uri: uri2,
        email: userEmail2,
        notification: this.props.screenProps,
        PLAYLIST: PLAYLIST
      });

    }
  }
  _handleFinalGoogleLogin = async () => {
    try {
      if (Platform.OS === 'ios') {
        const { type, user } = await Google.logInAsync({
          androidStandaloneAppClientId: '1078598871426-90mv7k4f48vpaaj6s9ld9usv1m4rtofp.apps.googleusercontent.com',
          iosStandaloneAppClientId: '376011592870-vudl1kb57fmvg541i988gq8ospcchd8q.apps.googleusercontent.com',
          androidClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
          iosClientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          behavior: 'web',
        });
        stype = type;
        suser = user;
      }
      else if (Platform.OS === 'android') {
        const { type, user } = await Google.logInAsync({
          androidStandaloneAppClientId: '1078598871426-90mv7k4f48vpaaj6s9ld9usv1m4rtofp.apps.googleusercontent.com',
          iosStandaloneAppClientId: '376011592870-vudl1kb57fmvg541i988gq8ospcchd8q.apps.googleusercontent.com',
          androidClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
          iosClientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          behavior: 'system',
        });
        stype = type;
        suser = user;
      }


      switch (stype) {
        case 'success': {
          Alert.alert('Logged in!', `Hi ${suser.name}!`);
          userEmail2 = suser.email;
          doubleclick = true;
          name2 = suser.name;
          uri2 = suser.photoUrl;
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
          //Alert.alert('googleDefault', JSON.stringify(stype));

          console.log(stype + "google");
        }
      }
    } catch (e) {
      //console.log(e + "google");
      Alert.alert('Oops!', 'Login failed!');
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);

      //Alert.alert('googleErr', JSON.stringify(e.message));
    }
  }
  _handleGoogleLogin = () => {
    if (doubleclick) {
      Alert.alert("Hang On!");
      return;
    }

    if (lastlogged === false || name2 === 'Not Logged In') {
      this._handleFinalGoogleLogin();
    }
    else {
      if (Platform.OS === 'ios') {
        Alert.alert(
          'Login as ' + name2 + "?", "",
          [
            {
              text: 'No',
              onPress: () => { this._handleFinalGoogleLogin() },
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                this.checkUpdatePoints();
              },
            },
          ],
          { cancelable: false }
        );
      }
      else {
        this._handleFinalGoogleLogin();
      }

    }
  };

  _handleFacebookLogin = () => {
    if (doubleclick) {
      Alert.alert("Hang On!");
      return;
    }
    if (lastlogged === false || name2 === 'Not Logged In') {
      this._handleFinalFacebookLogin();
    }
    else {
      if (Platform.OS === 'ios') {
        Alert.alert(
          'Login as ' + name2 + "?", "",
          [
            {
              text: 'No',
              onPress: () => { this._handleFinalFacebookLogin() },
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                this.checkUpdatePoints();
              },
            },
          ],
          { cancelable: false }
        );
      }
      else {
        this._handleFinalFacebookLogin();
      }

    }
  };
  _handlePressAsync = async () => {
    if (doubleclick) {
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
    if (userInfo.name != '') {
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

  saveNewPoints = async () => {
    try {
      await AsyncStorage.setItem('@MySuperStore:points', userPoints);
    } catch (error) {
      // Error saving data
    }
  };

  saveFile = async () => {
    try {
      await AsyncStorage.setItem('@MySuperStore:name', name2);
      await AsyncStorage.setItem('@MySuperStore:email', userEmail2);
      await AsyncStorage.setItem('@MySuperStore:uri2', uri2);
      await AsyncStorage.setItem('@MySuperStore:points', userPoints);
      await AsyncStorage.setItem('@MySuperStore:id', userID);
    } catch (error) {
      // Error saving data
    }
  };

  componentWillMount() {
    AsyncStorage.getItem('@MySuperStore:name').then((namesaved) => {
      //console.log(namesaved);

    });
  };

  getData = async () => {
    const namesaved = await AsyncStorage.getItem('@MySuperStore:name');
    //console.log(namesaved);
    if (namesaved !== null && namesaved !== undefined && namesaved !== "") {
      // We have data!!
      //console.log(namesaved);
      name2 = namesaved;
      const emailsaved = await AsyncStorage.getItem('@MySuperStore:email');
      userEmail2 = emailsaved;
      const uri2saved = await AsyncStorage.getItem('@MySuperStore:uri2');
      uri2 = uri2saved;
      const pointssaved = await AsyncStorage.getItem('@MySuperStore:points');
      userPoints = pointssaved;
      const useridsaved = await AsyncStorage.getItem('@MySuperStore:id');
      userID = useridsaved;

      lastlogged = true;
    }
  }
  getFile = async (type) => {
    try {
      const namesaved = await AsyncStorage.getItem('@MySuperStore:name');
      //console.log(namesaved);
      if (namesaved !== null && namesaved !== undefined && namesaved !== "") {
        // We have data!!
        //console.log(namesaved);
        name2 = namesaved;
        const emailsaved = await AsyncStorage.getItem('@MySuperStore:email');
        userEmail2 = emailsaved;
        const uri2saved = await AsyncStorage.getItem('@MySuperStore:uri2');
        uri2 = uri2saved;
        const pointssaved = await AsyncStorage.getItem('@MySuperStore:points');
        userPoints = pointssaved;
        const useridsaved = await AsyncStorage.getItem('@MySuperStore:id');
        userID = useridsaved;

        lastlogged = true;
        if (type === 'Facebook') {
          this._handleFacebookLogin();
        }
        else {
          this._handleGoogleLogin();
        }
      }
      else {
        if (type === 'Facebook') {
          this._handleFacebookLogin();
        }
        else {
          this._handleGoogleLogin();

        }
      }
    } catch (error) {
      // Error retrieving data
      lastlogged = false;
    }
  }
  grabPlaylistItems = () => {
    try {
      fetch('https://sharebert.com/grabdirect.php', {method: 'GET'})
      .then(response => response.json())
        .then(responseData => {
          //console.log(responseData[0]);
          for (var i = 0; i < responseData.length; i++) {
            PLAYLIST.push(new PlaylistItem('','https://sharebert.com/medias/'+responseData[i],true));
          }
          //console.log(PLAYLIST);
        })
        .done();
    } catch (error) {

    }
  }
  checkUpdatePoints = () => {
    try {
      fetch(
        'https://sharebert.com/s/RetrievePointsWeb.php?uemail=' +
        userEmail2,
        { method: 'GET' }
      )
        .then(response => response.json())
        .then(responseData => {
          var test = responseData['Points'];
          userPoints = test;
          this.saveNewPoints();
          this.onSubmitEdit('Login');
        })
        .done();
    } catch (error) {

    }
  };

  _handleFinalFacebookLogin = async () => {
    if (doubleclick) {
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
            .catch(() => { });
          break;
        }
        case 'cancel': {
          Alert.alert('Cancelled!', 'Login was cancelled!');
          break;
        }
        default: {
          Alert.alert('Oops!', 'Login failed!');
          //Alert.alert('facebook', JSON.stringify(type));

          console.log(type + "facebook");
        }
      }
    } catch (e) {
      Alert.alert('Oops!', 'Login failed!');
      //Alert.alert('facebook', JSON.stringify(e));

      console.log(e + "facebook");
    }
  };

  checkPoints = () => {
    try {
      if (userEmail2 != '') {
        fetch(
          'https://sharebert.com/s/ReturnLoginToServerWeb.php?uemail=' +
          userEmail2 +
          '&uname=' +
          name2,
          { method: 'GET' }
        )
          .then(() => {
            fetch(
              'https://sharebert.com/s/RetrievePointsWeb2.php?uemail=' +
              userEmail2,
              { method: 'GET' }
            )
              .then(response => response.json())
              .then(responseData => {
                userID = responseData[0]['id'];
                userPoints = responseData[0]['Points'];
                this.saveFile();
                this.onSubmitEdit('Login');
              })
              .done();
          })
          .done();

      }
      else {
        Alert.alert("no Email");
      }
    } catch (error) {
      //this.onSubmitEdit('Login');
      Alert.alert(error);
      this.checkUpdatePoints();
    }
  };
  render() {
    return (
      <View>
        <Image
          resizeMode={'cover'}
          resizeMethod={'resize'}
          style={styles.button}
          source={require('./assets/sign_in_background.png')}
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
            <Image
              resizeMode="contain"
              style={styles.button4}
              source={require('./later.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.debugAnalyticmsg()}
            style={styles.debugButton}>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  loging: {
    position: "absolute",
    bottom: 150,
    width: 250,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',

  },
  loginf: {
    position: "absolute",
    bottom: 100,
    width: 250,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  later: {
    position: "absolute",
    bottom: 50,
    width: 250,
    height: 50,
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
    color: '#0d2754',
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  button2: {
    flex: 1,
    width: 250,
    height: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button3: {
    flex: 1,
    width: 250,
    height: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button4: {
    flex: 1,
    width: 150,
    height: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  debugButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
});

export function getToken(code, type = 'web') {
  const redirectUri = (type === 'movil') ? null : 'postmessage';
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (!err) {
        resolve(tokens);
      } else {
        reject(err);
      }
    });
  });
}
export { userEmail2 };
export { name2 };
export { uri2 };
export { userPoints };
export { userID };
export default LoginScreen;
