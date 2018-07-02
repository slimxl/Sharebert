import React, { Component } from 'react';
import Swiper from 'react-native-deck-swiper'; // Version can be specified in package.json
import SideMenu from 'react-native-side-menu'; // Version can be specified in package.json
import Image2 from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Menu from './Menu';
import LoadingView from 'rn-loading-view';
import AwesomeAlert from 'react-native-awesome-alerts';
import Notification from 'react-native-in-app-notification';
import ImageSlider from 'react-native-image-slider';
import Firebase from './Firebase';
import {
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  Linking,
  Keyboard,
  ImageBackground,
  Share,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  FlatList,
  AppState,
  WebView,
} from 'react-native';
import { Constants, Notifications } from 'expo';
//import { uri2 } from './LoginScreen';
var userPoints = 0;
var userID = 0;
var animationz = false;
var toofast = false;
var datasize = 0;
var searchcount = 0;
var refresh = false;
var brand = '';
var search = false;
var searchterm = '';
var randomPROFILEIMAGE = []; //TO BE REMOVED
var animationBool = false;
var goBack = true;
var emptycard = true;
var likes = [];
var likes3 = [];
var RandomQ = Math.floor(Math.random() * 15) + 0;

var questionBank = ["What's your favorite movie?",
  "What's your favorite TV show?",
  "What do you want to be when you grow up?",
  "What's the best game you've played recently?",
  "What football team are you rooting for?",
  "What's your favorite hockey team?",
  "Who do you want to win the world series?",
  "What's your favorite color?",
  "What type of phone do you have?",
  "What's your favorite hobby?",
  "What's your favorite book?",
  "Who's your favorite political candidate?",
  "Who's your favorite celebrity?",
  "Who's your favorite TV star?",
  "What's something you need in your life?",
  "What video game console do you play?",
  "Who's your favorite artist?"]
var uri2 = '';
var randoUsersLikes = [];
var tutorial = true;

const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;
// const SCREEN_HEIGHT = width < height ? height : width;
const isSmallDevice = SCREEN_WIDTH <= 414;
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
const numColumns = isSmallDevice ? 2 : 3;
// item size
const PRODUCT_ITEM_HEIGHT = 175;
const PRODUCT_ITEM_OFFSET = 5;
const PRODUCT_ITEM_MARGIN = PRODUCT_ITEM_OFFSET * 2;



class Explore extends Component {
  constructor(props) {
    super(props);
    //console.log(this.props.navigation.state.params);
    console.disableYellowBox = true;


    userID = this.props.navigation.state.params.id;

    try {
      userPoints = this.props.navigation.state.params.points;
    }
    catch (error) {
      userPoints = 0;
    }
    uri2 = this.props.navigation.state.params.uri;
    console.log(props);

    this.getOldLikes();
    this.state = {
      cards: ['1', '2', '3'],
      isOpen: false,
      randomPROFILEIMAGEstring: 'http://www.lowisko.online-pl.com/index_html_files/0.png',
      UserStringLike: '',
      selectedItem: 'Explore',
      swipedAllCards: false,
      swipeDirection: '',
      userPoints: userPoints,
      frontTitle: '',
      disable: true,
      notification: [],
      isSwipingBack: false,
      cardIndex: 0,
      appState: AppState.currentState,
      showAlert: false,
      cardNum: 0,
      cat: false,
      category: '',
      title: '',
      jsonData: '',
      responseData: '',
      url: 'https://i.imgur.com/JaG8ovv.gif',
      data: [],
      dataset: [],
      inputValue: 'My Answer!',
      color: "#ff2eff",
      trendData: [],
      testDat: [],
    };

    this.getSearches();

    //console.log(userPoints);
    if (userPoints > 100) {
      tutorial = false;
      //console.log(userPoints);
    }

    if (this.props.navigation.state.params.brands != undefined) {
      emptycard = false;
      console.log('Grabbed brands - New Explore');
      brand = this.props.navigation.state.params.brands;
      fetch('https://sharebert.com/s/Brands.php?brand=' + brand + '&page=10', { method: 'GET' })
        .then(response => response.json())
        .then(responseData => {
          var data2 = [];
          for (var i = 0; i < Object.keys(responseData).length; i++) {
            var obj = {};
            obj['ASIN'] = responseData[i]['ASIN'];
            obj['Title'] = responseData[i]['Title'];
            obj['URL'] = responseData[i]['URL'];
            obj['ImageURL'] = responseData[i]['ImageURL'];
            obj['Retailer'] = responseData[i]['Website'];
            if (brand === 'Amazon') {
              obj['Retailer'] = 'Amazon';
            }
            data2.push(obj);
          }
          toofast = false;
          search = false;
          data2 = shuffle(data2);


          this.setState({
            cardNum: this.state.cardNum,
            url: data2[this.state.cardNum].ImageURL,
            title: data2[this.state.cardNum].Title,
            disable: false,
            dataset: data2,
            cat: false,
          });
        })
        .done();
    }
    else if (this.props.navigation.state.params.search != undefined) {

      console.log('Grabbed Search - New Explore');
      searchterm = this.props.navigation.state.params.search;
      fetch(
        'https://sharebert.com/s/APISEARCH.php?keyword=' +
        searchterm +
        '&page=1',
        { method: 'GET' }
      )
        .then(response => response.json())
        .then(responseData => {
          var data2 = [];
          for (var i = 0; i < Object.keys(responseData['Amazon']).length; i++) {
            var obj = {};
            obj['ASIN'] = responseData['Amazon'][i][0];
            obj['Title'] = responseData['Amazon'][i][1];
            obj['URL'] = responseData['Amazon'][i][3];
            obj['ImageURL'] = responseData['Amazon'][i][4];
            obj['Retailer'] = 'Amazon';
            data2.push(obj);
          }
          search = true;

          fetch(
            'https://sharebert.com/s/search.php?cat=' +
            searchterm +
            '&page=10',
            { method: 'GET' }
          )
            .then(response2 => response2.json())
            .then(responseData2 => {
              //console.log(Object.keys(responseData2['Amazon']).length);
              // if (Object.keys(responseData['Amazon']).length === undefined||Object.keys(responseData['Amazon']).length===0) {
              //   Alert.alert("No Results Found");
              //   emptycard = true;
              //   this.grabFrontPage();
              //   return;
              // }
              // else {
              emptycard = false;
              var count = Object.keys(responseData2['Amazon']).length;
              if (count != 0) {
                for (var i = 0; i < count; i++) {
                  var obj = {};
                  obj['ASIN'] = responseData2['Amazon'][i]['ASIN'];
                  obj['Title'] = responseData2['Amazon'][i]['Title'];
                  obj['URL'] = responseData2['Amazon'][i]['URL'];
                  obj['ImageURL'] = responseData2['Amazon'][i]['ImageURL'];
                  obj['Retailer'] = 'Amazon';
                  data2.push(obj);
                }
              }
              count = Object.keys(responseData2['Others']).length;
              if (count != 0) {
                for (var i = 0; i < count; i++) {
                  var obj2 = {};
                  obj2['ASIN'] = responseData2['Others'][i]['ASIN'];
                  obj2['Title'] = responseData2['Others'][i]['Title'];
                  obj2['URL'] = responseData2['Others'][i]['URL'];
                  obj2['ImageURL'] = responseData2['Others'][i]['ImageURL'];
                  obj2['Retailer'] = responseData2['Others'][i]['Website'];
                  data2.push(obj2);
                }
              }
              if (data2.length > 0) {
                search = true;
                datasize = data2.length;
                searchcount = datasize;
                emptycard = false;
                if (userID != 0) {
                  fetch(
                    'http://biosystematic-addit.000webhostapp.com/s/SendSearch.php?term=' +
                    searchterm +
                    '&imageurl=' + data2[0].ImageURL,
                    { method: 'GET' }
                  ).done();
                }
                data2 = shuffle(data2);
                console.log(data2.length);
                this.setState({
                  cardNum: 0,
                  dataset: data2,
                  url: data2[this.state.cardNum].ImageURL,
                  title: data2[this.state.cardNum].Title,
                  disable: false,
                  category: 'All',
                  cat: false,
                });
              }
              else {
                Alert.alert("No Results Found!", 'Try Again!');
                emptycard = true;
                this.grabFrontPage();
                return;
              }



            })
          //}
        })
        .done();
    }
    else {
      emptycard = true;
      this.grabFrontPage();
    }
    if (userID != 0 || userID != undefined || userID != null) {

      this.checkUpdatePoints();
    }


  }
  getSearches = () => {
    fetch('http://biosystematic-addit.000webhostapp.com/s/GetSearch.php', { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {
        var data2 = [];
        for (var i = 0; i < Object.keys(responseData).length; i++) {
          var obj = {};
          obj['Term'] = responseData[i]['Term'];
          obj['ImageUrl'] = responseData[i]['ImageUrl'];
          data2.push(obj);
        }

        this.setState({
          testDat: data2,
        });
        this.forceUpdate();
      })
      .done();
  }
  _getItemLayout = (data, index) => {
    const productHeight = PRODUCT_ITEM_HEIGHT + PRODUCT_ITEM_MARGIN;
    return {
      length: productHeight,
      offset: productHeight * index,
      index,
    };
  };

  _keyExtractor = item => {
    return item.code_group;
  };

  _renderItem = data => {
    const item = data.item;

    // if (item.term == 'VIDEO') {
    //   return (
    //     <View style={styles.item}>
    //       <View style={{ height: '100%',borderRadius:40 }}>
    //         <WebView
    //           style={styles.listContainer3}
    //           javaScriptEnabled={true}
    //           automaticallyAdjustContentInsets={true}
    //           fullScreen={true}
    //           scrollEnabled={false}
    //           domStorageEnabled={true}
    //           allowsInlineMediaPlayback={true}
    //           mediaPlaybackRequiresUserAction={false}
    //           //source={{ html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="http://www.youtube.com/embed/videoseries?list=PLDAt_4uwQO2LJnZZ7ZKQpEZBqWxYVZu_x&html5=1&rel=0&autoplay=1&showinfo=0&controls=0" frameborder="0" allow="autoplay" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}} 
    //           source={{ uri: 'http://www.youtube.com/embed/videoseries?list=PL6iEoxtSeBGYuh7IdQ-C-SYr25LV7S8NU&html5=1&rel=0&autoplay=1&showinfo=0&controls=0&loop=1&fullscreen=1' }}
    //         //source = {{uri:'https://www.youtube.com/embed/L4dz3gSuR8E?html5=1&rel=0&autoplay=1&showinfo=0&controls=0&loop=1&playlist=L4dz3gSuR8E'}}
    //         //source={{ uri: 'https://sharebert.com/videos/' }}
    //         />
    //       </View>
    //     </View>
    //   );
    // }
    // else
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => {
          searchterm = item.term;
          emptycard = false;
          this.setState({
            url: 'https://i.imgur.com/JaG8ovv.gif'
          })
          this.onSubmitEdit();
        }}>
          {!item.image_url
            ? <View style={styles.itemImage}>
              <Text>No image</Text>
            </View>
            : <Image
              source={{
                uri: item.image_url
              }}
              resizeMode={'cover'}
              resizeMethod={'resize'}
              backgroundColor='transparent'
              style={styles.itemImage}
            />}
        </TouchableOpacity>

        <Text numberOfLines={3} style={styles.itemTitle}>
          {item.title}
        </Text>
      </View>
    );
  };

  grabFrontPage = () => {
    console.log('refresh trending');
    fetch('https://sharebert.com/s/Frontpage2.php', { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {
        var data2 = [];
        var temptitle = '';
        for (var i = 0; i < responseData.length; i++) {
          var obj = {};
          if (responseData[i]['id'] === '1') {
            temptitle = responseData[i]['term'];
          }
          else {
            obj['term'] = responseData[i]['term'];
            obj['image_url'] = responseData[i]['ImageURL'];
            data2.push(obj);
          }

        }
        data2 = shuffle(data2);
        while (data2.length != 4) {
          data2.pop();
        }
        this.setState({
          trendData: data2,
          url: 'https://i.imgur.com/qnHscIM.png',
          frontTitle: temptitle,
          // cardNum: this.state.cardNum,
          // url: data2[this.state.cardNum].ImageURL,
          // title: data2[this.state.cardNum].Title,
          // dataset: data2,
          // cat: false,
        });
        //console.log(this.state.trendData);
      })
      .done();

  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  componentWillMount() {
    register();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.forceUpdate();
    }
    this.setState({ appState: nextAppState });
  }

  _handleNotification = (notification) => {
    this.setState({ notification: notification });
    if (this.state.appState.match(/inactive|background/)) {
      this.resetTo('Likes');
    }
    // console.log(notification.data.data['ASIN']);
    // if(notification.data.data['ASIN']!== undefined)
    // {
    //   fetch('https://sharebert.com/s/SearchASIN.php?ASIN='+notification.data.data['ASIN'], { method: 'GET' })
    //         .then(response => response.json())
    //         .then(responseData => {
    //           var data2 = [];
    //             var obj = {};
    //             obj['ASIN'] = responseData[0]['ASIN'];
    //             obj['Title'] = responseData[0]['Title'];
    //             obj['URL'] = responseData[0]['URL'];
    //             obj['ImageURL'] = responseData[0]['ImageURL'];
    //             obj['Retailer'] = responseData[0]['Website'];
    //             data2.push(obj);
    //           console.log(data2);
    //           toofast = false;
    //           search = false;
    //           emptycard=false;
    //           this.setState({
    //             cardNum: 0,
    //             dataset: data2,
    //             url: data2.ImageURL,
    //             title: data2.Title,
    //             category: '',
    //             disable: false,
    //             cat: false,
    //           });
    //         })
    //         .done();
    // }

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
  frontPageClick = term => {

    searchterm = term;
    this.onSubmitEdit;

  }
  grabRandoLikes = async () => {
    var data2 = [];
    var RandomNumber = Math.floor(Math.random() * 18) + 1;
    fetch('https://sharebert.com/s/UserLikes.php?page=5', { method: 'GET' })
      .then(response => response.json())
      .then(responseData => {
        for (var i = 0; i < 20; i++) {
          var obj2 = {};
          obj2['User_Name'] = responseData['Users'][i]['User_Name'];
          obj2['ASIN'] = responseData['Products'][i]['ASIN'];
          obj2['Title'] = responseData['Products'][i]['Title'];
          obj2['URL'] = responseData['Products'][i]['URL'];
          obj2['ImageURL'] = responseData['Products'][i]['ImageURL'];
          obj2['Retailer'] = responseData['Products'][i]['Website'];
          data2.push(obj2);
          randoUsersLikes = data2;

        }
        this.setState({
          randomPROFILEIMAGEstring: randomPROFILEIMAGE[RandomNumber],
          UserStringLike: randoUsersLikes[0].User_Name + " liked " + randoUsersLikes[0].Title,
        });
      })
      .done();


  };
  renderCard = () => {
    if (
      this.state.url ===
      'https://i.imgur.com/qnHscIM.png'
    ) {
      /*
      return (
        <View style={styles.card}>
          <Text style={styles.TrendText}>{this.state.frontTitle}</Text>
          <FlatList
          style={styles.listContainer}
          data={this.state.trendData}
          keyExtractor={(item, index) => index}
          renderItem={this._renderItem}
          getItemLayout={this._getItemLayout}
          numColumns={numColumns}
        />
        </View>
      );
      */
    } else if (
      this.state.url ===
      'https://i.imgur.com/JaG8ovv.gif'
    ) {
      return (
        <View style={styles.card}>

          <Image2
            resizeMode="contain"
            style={styles.imageload}

            source={require('./assets/loading3.gif')}
          />
        </View>
      )
    }
    else {
      var imageURL2 = this.state.dataset[this.state.cardNum].ImageURL;
      if (imageURL2 !== null || imageURL2 === undefined) {
        if (this.state.dataset[this.state.cardNum].ImageURL.includes('tillys')) {

          imageURL2 = imageURL2.substring(0, imageURL2.indexOf('?'));


        }
        var retailfinal = '';
        if (this.state.dataset[this.state.cardNum].Retailer === 'shopDisney') {
          retailfinal = 'Paid Partnership with Disney';
        }
        else {
          retailfinal = this.state.dataset[this.state.cardNum].Retailer
        }
        var finaltitle = trunc(this.state.dataset[this.state.cardNum].Title)
        try {
          return (
            <View style={styles.card}>

              <Image2
                resizeMode="contain"
                indicator={ProgressBar}
                indicatorProps={{
                  color: '#ff2eff',
                  unfilledColor: 'rgba(200, 200, 200, 0.2)'
                }}
                style={styles.image}

                source={{
                  uri: imageURL2,
                }}
              />
              <Text numberOfLines={1} style={styles.text}>
                {finaltitle}
              </Text>
              <Text style={styles.retail2}>
                (Tap for Price)
            </Text>
              <Text style={styles.retail}>
                Sold by <Text style={{ color: '#858a8f' }}>{retailfinal}</Text>
              </Text>
            </View>
          );
        }
        catch (error) {
          console.log(error);
        }
      }
    }

  };

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true,
    });
  };

  shareURL = () => {
    if (
      this.state.url ===
      'https://i.imgur.com/qnHscIM.png' || this.state.url ===
      'https://i.imgur.com/JaG8ovv.gif'
    ) {
      this.shareApp();
      return;
    }
    try {
      Share.share(
        {
          ...Platform.select({
            ios: {
              url: this.state.dataset[this.state.cardNum].URL,
            },
            android: {
              message:
                this.state.dataset[this.state.cardNum].URL,
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
                this.state.dataset[this.state.cardNum].Title,
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
                'https://sharebert.com/s/DBAwardPoints.php?uid=' +
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
                        title: 'You earned 5 points!',
                        message: 'Share another product to earn more!',
                        icon: { uri: 'https://i.imgur.com/ITg9EvJ.png' },
                        onPress: () => this.showAlert(),
                      });
                    }
                    else {
                      this.showAlert();
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


  };
  swipeBack = () => {
    if (!this.state.isSwipingBack) {
      this.setIsSwipingBack(true, () => {
        this.swiper.swipeBack(() => {
          this.setIsSwipingBack(false);
        });
      });
    }
  };

  checkUpdatePoints = () => {
    try {
      if (userID === 0) {
        return;
      }
      fetch(
        'https://sharebert.com/s/RetrievePointsWeb.php?uid=' +
        userID,
        { method: 'GET' }
      )
        .then(response => response.json())
        .then(responseData => {
          var test = responseData['Points'];
          userPoints = test;
          this.forceUpdate();
        })
        .done();
    }
    catch (error) {
      console.error(error);
    }


  };

  setIsSwipingBack = (isSwipingBack, cb) => {
    this.setState(
      {
        isSwipingBack: isSwipingBack,
      },
      cb
    );
  };

  updateData = (points) => {
    userPoints = points;
    this.forceUpdate();
  };

  clearLikes = async () => {
    await AsyncStorage.removeItem('@MySuperStore:Likes' + userID);
    if (userID !== 0) {
      Firebase.database().ref('users/' + userID + "/likes").set({

      });
      this.getOldLikes();
    }

  }

  saveLikesto = async () => {
    if (userID !== 0) {
      const likesave = await AsyncStorage.getItem('@MySuperStore:Likes' + userID);
      var like2 = JSON.parse(likesave);
      if (like2 !== undefined || like2 !== null) {
        for (var i = 0; i < like2.length; i++) {
          Firebase.database().ref('users/' + userID + '/likes/').push({
            ASIN: sanitize(like2[i].ASIN),
            ImageURL: like2[i].ImageURL,
            Retailer: like2[i].Retailer,
            Title: sanitize(like2[i].Title),
            URL: like2[i].URL
          });
        }
        this.getOldLikes();
        await AsyncStorage.removeItem('@MySuperStore:Likes' + userID);
      }

    }


  }
  printURL = () => {
    Alert.alert('TEST', this.state.url);
  };

  openURL = () => {
    if (
      this.state.url ===
      'https://i.imgur.com/qnHscIM.png' || this.state.url === 'https://i.imgur.com/JaG8ovv.gif'
    ) {
      return;
    }
    try {
      Linking.openURL(this.state.dataset[this.state.cardNum].URL);
    } catch (error) {
      console.error(error);
    }
  };

  onSwiped = () => {
    try {
      if (
        this.state.url ===
        'https://i.imgur.com/qnHscIM.png' || this.state.url === 'https://i.imgur.com/JaG8ovv.gif'
      ) {
        return;
      }
      if (this.state.dataset.length <= this.state.cardNum + 1) {
        this.setState({
          disable: true,
          url: 'https://i.imgur.com/JaG8ovv.gif',
        })
        if (brand !== "" && (this.state.cardNum + 1 >= this.state.dataset.length)) {
          console.log('brand reset')
          fetch('https://sharebert.com/s/Brands.php?brand=' + brand + '&page=5', { method: 'GET' })
            .then(response => response.json())
            .then(responseData => {
              var data2 = [];
              for (var i = 0; i < Object.keys(responseData).length; i++) {
                var obj = {};
                obj['ASIN'] = responseData[i]['ASIN'];
                obj['Title'] = responseData[i]['Title'];
                obj['URL'] = responseData[i]['URL'];
                obj['ImageURL'] = responseData[i]['ImageURL'];
                obj['Retailer'] = responseData[i]['Website'];
                data2.push(obj);
              }
              toofast = false;
              search = false;
              data2 = shuffle(data2);
              this.setState({
                cardNum: 0,
                dataset: data2,
                url: this.state.dataset[this.state.cardNum].ImageURL,
                title: this.state.dataset[this.state.cardNum].Title,
                category: '',
                disable: false,
                cat: false,
              });
            })
            .done();
        }
        else if (search === true && (this.state.cardNum + 1 >= this.state.dataset.length)) {
          this.onSubmitEdit();
        }
        else if (
          this.state.cat &&
          this.state.category != 'All' &&
          (this.state.cardNum + 1) >= this.state.dataset.length) {
          console.log('reset cat');
          this.catGrab(this.state.category);
        }
        else if ((this.state.cardNum + 1 >= this.state.dataset.length) && search === false && this.state.cat === false) {
          console.log('Search was reset');
          fetch('https://sharebert.com/s/login9test.php?page=5', { method: 'GET' })
            .then(response => response.json())
            .then(responseData => {
              var data2 = [];
              for (var i = 0; i < Object.keys(responseData['Amazon']).length; i++) {
                var obj = {};
                obj['ASIN'] = responseData['Amazon'][i]['ASIN'];
                obj['Title'] = responseData['Amazon'][i]['Title'];
                obj['URL'] = responseData['Amazon'][i]['URL'];
                obj['ImageURL'] = responseData['Amazon'][i]['ImageURL'];
                obj['Retailer'] = "Amazon";
                data2.push(obj);
              }
              for (var i = 0; i < Object.keys(responseData['Others']).length; i++) {
                var obj2 = {};
                obj2['ASIN'] = responseData['Others'][i]['ASIN'];
                obj2['Title'] = responseData['Others'][i]['Title'];
                obj2['URL'] = responseData['Others'][i]['URL'];
                obj2['ImageURL'] = responseData['Others'][i]['ImageURL'];
                obj2['Retailer'] = responseData['Others'][i]['Website'];

                data2.push(obj2);

              }
              toofast = false;
              search = false;
              data2 = shuffle(data2);
              this.setState({
                cardNum: 0,
                disable: false,
                dataset: data2,
                url: this.state.dataset[this.state.cardNum].ImageURL,
                title: this.state.dataset[this.state.cardNum].Title,
                category: '',
                cat: false,
              });
            })
            .done();
        }
      }

      if (this.state.dataset.length > this.state.cardNum + 1) {
        this.setState({
          cardNum: this.state.cardNum + 1,
          url: this.state.dataset[this.state.cardNum].ImageURL,
          title: this.state.dataset[this.state.cardNum].Title,
        });
        try {
          if (Math.floor(Math.random() * (250 - 1) + 1) <= 2 && userID != 0) {
            fetch(
              'https://sharebert.com/s/DBAwardPoints.php?uid=' +
              userID +
              '&type=2',
              { method: 'GET' }
            )
              .then(response2 => response2.json())
              .then(responseData2 => {
                if (responseData2['Points'] != userPoints) {
                  Alert.alert('You earned 5 points!', "Keep swiping to earn more!");

                  userPoints = responseData2['Points'];

                  this.forceUpdate();
                }
              })
              .done();
          }
        } catch (error) {
          console.error(error);
        }

        try {
          if (Math.floor(Math.random() * (250 - 1) + 1) <= 100 && userID != 0) {
            Alert.alert(
              'Heres a chance to earn more points! ', "",
              [
                {
                  text: 'Skip',
                  onPress: () => { },
                  style: 'cancel',
                },
                {
                  text: 'Play',
                  onPress: () => {
                    this.resetTo('Main');
                  },
                },
              ],
              { cancelable: false }
            );
          }
        } catch (error) {
          console.error(error);
        }

      }


    } catch (error) {
      console.error(error);
    }
  };

  catGrab = category => {

    this.setState({
      url: 'https://i.imgur.com/JaG8ovv.gif',
      disable: true,
    });


    emptycard = false;
    brand = '';
    if (category === 'Travel') {
      //console.log(category);
      this.props.navigation.push('Travel', {
        id: userID,
        points: userPoints,
        uri: uri2,
      });
    }

    else if (category === 'groceries') {
      //console.log(category);
      this.props.navigation.push('Grocery', {
        id: userID,
        points: userPoints,
        uri: uri2,
      });
    }
    var data2 = [];

    if (category != 'All') {
      fetch(
        'https://sharebert.com/s/Categoriesios2.php?page=5&cat=' +
        category,
        { method: 'GET' }
      )
        .then(response => response.json())
        .then(responseData => {
          console.log('Grabbing Cat: ' + category);

          try {
            for (var i = 0; i < Object.keys(responseData['Amazon']).length; i++) {
              var obj = {};
              obj['ASIN'] = responseData['Amazon'][i]['ASIN'];
              obj['Title'] = responseData['Amazon'][i]['Title'];
              obj['URL'] = responseData['Amazon'][i]['URL'];
              obj['ImageURL'] = responseData['Amazon'][i]['ImageURL'];
              obj['Retailer'] = 'Amazon';
              data2.push(obj);
            }

            for (var i = 0; i < Object.keys(responseData['Others']).length; i++) {
              var obj2 = {};
              obj2['ASIN'] = responseData['Others'][i]['ASIN'];
              obj2['Title'] = responseData['Others'][i]['Title'];
              obj2['URL'] = responseData['Others'][i]['URL'];
              obj2['ImageURL'] = responseData['Others'][i]['ImageURL'];
              obj2['Retailer'] = responseData['Others'][i]['Website'];
              data2.push(obj2);
            }
          } catch (error) {
            console.error(error);
          }


          toofast = false;

          data2 = shuffle(data2);

          var RandomNumber2 = Math.floor(Math.random() * 10) + 1
          fetch(
            'https://sharebert.com/s/APISEARCH.php?keyword=' +
            category +
            '&page=' + RandomNumber2,
            { method: 'GET' }
          )
            .then(response2 => response2.json())
            .then(responseData2 => {
              var count = responseData2['Amazon'][0][7];
              datasize = count;
              searchcount = datasize;
              //console.log(searchcount);
              for (var i = 0; i < count; i++) {
                var obj = {};
                obj['ASIN'] = responseData2['Amazon'][i][0];
                obj['Title'] = responseData2['Amazon'][i][1];
                obj['URL'] = responseData2['Amazon'][i][3];
                obj['ImageURL'] = responseData2['Amazon'][i][4];
                obj['Retailer'] = 'Amazon';
                data2.push(obj);
              }

              data2 = shuffle(data2);
              this.setState({
                cardNum: 0,
                url: data2[this.state.cardNum].ImageURL,
                title: data2[this.state.cardNum].Title,
                dataset: data2,
                cat: true,
                disable: false,
                category: category,
              });
              console.log('Data2 size:' + data2.length);

            })
            .done();

        })
        .done();
    } else {
      fetch('https://sharebert.com/s/login9test.php?page=5', { method: 'GET' })
        .then(response => response.json())
        .then(responseData => {
          for (var i = 0; i < Object.keys(responseData['Amazon']).length; i++) {
            var obj = {};
            obj['ASIN'] = responseData['Amazon'][i]['ASIN'];
            obj['Title'] = responseData['Amazon'][i]['Title'];
            obj['URL'] = responseData['Amazon'][i]['URL'];
            obj['ImageURL'] = responseData['Amazon'][i]['ImageURL'];
            obj['Retailer'] = "Amazon";
            data2.push(obj);
          }
          for (var i = 0; i < Object.keys(responseData['Others']).length; i++) {
            var obj2 = {};
            obj2['ASIN'] = responseData['Others'][i]['ASIN'];
            obj2['Title'] = responseData['Others'][i]['Title'];
            obj2['URL'] = responseData['Others'][i]['URL'];
            obj2['ImageURL'] = responseData['Others'][i]['ImageURL'];
            obj2['Retailer'] = responseData['Others'][i]['Website'];

            data2.push(obj2);

          }
          // console.log(data2.length);
          toofast = false;
          data2 = shuffle(data2);
          this.setState({
            cardNum: 0,
            url: data2[this.state.cardNum].ImageURL,
            title: data2[this.state.cardNum].Title,
            dataset: data2,
            category: 'All',
            disable: false,
            cat: false,
          });
        })
        .done();
    }


  };

  swipeLeft = () => {
    if (brand !== '' && this.state.cardNum > 16) {
      Alert.alert("Hold On!", "Swiping Too Fast!");
      toofast = true;
    }
    if ((this.state.cardNum + 8 >= this.state.dataset.length) || toofast) {
      Alert.alert("Hold On!", "Swiping Too Fast!");
      toofast = true;
    }
    else {
      toofast = false;
      this.swiper.swipeLeft();
    }
  };

  swipeRight = () => {
    if (brand !== '' && this.state.cardNum > 16) {
      Alert.alert("Hold On!", "Swiping Too Fast!");
      toofast = true;
    }
    if ((this.state.cardNum + 8 >= this.state.dataset.length) || toofast) {
      Alert.alert("Hold On!", "Swiping Too Fast! ");
      toofast = true;
    }
    else {
      toofast = false;
      this.swiper.swipeRight();
    }
  };

  onSwipedRight = () => {
    if (
      this.state.url !==
      'https://i.imgur.com/qnHscIM.png' || this.state.url !== 'https://i.imgur.com/JaG8ovv.gif'
    ) {
      if (this.state.dataset.length === 1) {
        var newTitle = sanitize(this.state.dataset[0].Title);
        if (userID !== 0) {
          Firebase.database().ref('users/' + userID + '/likes/').push({
            ASIN: sanitize(this.state.dataset[0].ASIN),
            ImageURL: this.state.dataset[0].ImageURL,
            Retailer: this.state.dataset[0].Retailer,
            Title: newTitle,
            URL: this.state.dataset[0].URL
          });

          //likes3.push(this.state.dataset[this.state.cardNum - 1]);
          //this.saveLike();
          var imageURL2 = this.state.dataset[0].ImageURL;
          if (this.state.dataset[0].ImageURL.includes('tillys')) {

            imageURL2 = imageURL2.substring(0, imageURL2.indexOf('?'));


          }
          this.notificationLike.show({
            title: trunc(this.state.dataset[0].Title),
            message: 'Saved to your likes list!',
            icon: { uri: imageURL2 },
            onPress: () => this.resetTo('Likes')
          });
          this.getOldLikes();
        }
      }
      else if (this.state.dataset[this.state.cardNum - 1].Title !== null) {

        var newTitle = sanitize(this.state.dataset[this.state.cardNum - 1].Title);
        if (userID !== 0) {
          Firebase.database().ref('users/' + userID + '/likes/').push({
            ASIN: sanitize(this.state.dataset[this.state.cardNum - 1].ASIN),
            ImageURL: this.state.dataset[this.state.cardNum - 1].ImageURL,
            Retailer: this.state.dataset[this.state.cardNum - 1].Retailer,
            Title: newTitle,
            URL: this.state.dataset[this.state.cardNum - 1].URL
          });

          //likes3.push(this.state.dataset[this.state.cardNum - 1]);
          //this.saveLike();
          var imageURL2 = this.state.dataset[this.state.cardNum - 1].ImageURL
          if (this.state.dataset[this.state.cardNum - 1].ImageURL.includes('tillys')) {

            imageURL2 = imageURL2.substring(0, imageURL2.indexOf('?'));


          }
          this.notificationLike.show({
            title: trunc(this.state.dataset[this.state.cardNum - 1].Title),
            message: 'Saved to your likes list!',
            icon: { uri: imageURL2 },
            onPress: () => this.resetTo('Likes')
          });
          this.getOldLikes();
        }


      }


    }
  };

  shareApp() {
    try {
      Share.share(
        {
          ...Platform.select({
            ios: {
              url: 'https://sharebert.com/download',
            },
            android: {
              message: 'Look at this : \n' +
                'https://sharebert.com/download',
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
                'https://sharebert.com/download',
            },
          }),
        }
      ).then(({ action, activityType }) => {
        if (action === Share.dismissedAction) {
          Alert.alert("Hey!", "Don't Forget, You Get Points for Sharing The App!");
        }
        else {
          try {
            if (userID != 0) {
              fetch(
                'https://sharebert.com/s/DBAwardPoints.php?uid=' +
                userID +
                '&type=3',
                { method: 'GET' }
              )
                .then(response2 => response2.json())
                .then(responseData2 => {
                  if (responseData2['Points'] != userPoints) {

                    userPoints = responseData2['Points'];

                    Alert.alert('You earned 35 points!', "Share the app weekly to earn more!");
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

  saveFile = async () => {

    try {
      await AsyncStorage.setItem('@MySuperStore:key', this.state.dataset[this.state.cardNum - 1].Retailer);
    } catch (error) {
      // Error saving data
    }

  }
  getLikes = () => {
    var res;
    try {
      if (userID !== 0 || userID !== undefined) {
        var ref = Firebase.database().ref('users/' + userID + "/likes/");
        ref.once('value')
          .then(function (snapshot) {
            if (snapshot.val() !== null) {
              var obj = snapshot.val();
              res = Object.keys(obj)
                // iterate over them and generate the array
                .map(function (k) {
                  // generate the array element 
                  return obj[k];
                });
              if (res !== null || res !== undefined) {

                likes = res.reverse();

              }
            }
            else {
              likes = [];
            }
          });

      }

      //this.forceUpdate();
    } catch (error) {
      // Error retrieving data
    }

  };

  getOldLikes = () => {

    this.saveLikesto();

    var res;
    try {
      if (userID !== 0 || userID !== undefined) {
        var ref = Firebase.database().ref('users/' + userID + "/likes/");
        ref.once('value')
          .then(snapshot => {
            if (snapshot.val() !== null) {
              var obj = snapshot.val();
              res = Object.keys(obj)
                // iterate over them and generate the array
                .map(function (k) {
                  // generate the array element 
                  return obj[k];
                });
              if (res !== null || res !== undefined) {

                likes = res.reverse();
                if (this.props.screenProps) {
                  console.log("GOT NOTIF ON STARTUP");
                  if (goBack) {
                    goBack = false;
                    this.resetTo("Likes");
                  }
                }
              }
            }
            else {
              likes = [];
            }
          });

      }

      //this.forceUpdate();
    } catch (error) {
      // Error retrieving data
    }

  };

  saveLike = async () => {
    try {

      if (userID !== undefined || userID !== 0) {
        await AsyncStorage.setItem('@MySuperStore:Likes' + userID, JSON.stringify(likes3));
      }
      else {
        await AsyncStorage.setItem('@MySuperStore:Likes', JSON.stringify(likes3));
      }
      const likesave = await AsyncStorage.getItem('@MySuperStore:Likes' + userID);

    } catch (error) {
      // Error saving data
      Alert.alert("Error saving likes!");
    }

  }
  onSubmitEdit = () => {
    console.log('Search was refreshed');
    Keyboard.dismiss();
    if (searchterm === undefined || searchterm === ' ' || searchterm === '') {
      Alert.alert("Empty Search!", 'Try Again!');
      return;
    }
    console.log(searchterm);
    fetch(
      'https://sharebert.com/s/APISEARCH.php?keyword=' +
      searchterm +
      '&page=1',
      { method: 'GET' }
    )
      .then(response => response.json())
      .then(responseData => {
        //console.log(Object.keys(responseData['Amazon']).length);
        // if (Object.keys(responseData['Amazon']).length === undefined || Object.keys(responseData['Amazon']).length === 0) {
        //   Alert.alert("No Results Found");
        //   emptycard = true;
        //   this.grabFrontPage();
        //   return;
        // }
        //else {
        var data2 = [];
        //var count = responseData['Amazon'][0][7];
        //datasize = count;
        //searchcount = datasize;
        console.log("API COUNT: " + Object.keys(responseData['Amazon']).length);
        for (var i = 0; i < Object.keys(responseData['Amazon']).length; i++) {
          var obj = {};
          obj['ASIN'] = responseData['Amazon'][i][0];
          obj['Title'] = responseData['Amazon'][i][1];
          obj['URL'] = responseData['Amazon'][i][3];
          obj['ImageURL'] = responseData['Amazon'][i][4];
          obj['Retailer'] = 'Amazon';
          data2.push(obj);
        }
        search = true;

        fetch(
          'https://sharebert.com/s/search.php?cat=' +
          searchterm +
          '&page=10',
          { method: 'GET' }
        )
          .then(response2 => response2.json())
          .then(responseData2 => {
            // if (Object.keys(responseData['Amazon']).length === undefined||Object.keys(responseData['Amazon']).length===0) {
            //   Alert.alert("No Results Found");
            //   emptycard = true;
            //   this.grabFrontPage();
            //   return;
            // }
            // else {
            emptycard = false;
            var count = Object.keys(responseData2['Amazon']).length;
            var catcount = count;
            if (count != 0) {
              for (var i = 0; i < count; i++) {
                var obj = {};
                obj['ASIN'] = responseData2['Amazon'][i]['ASIN'];
                obj['Title'] = responseData2['Amazon'][i]['Title'];
                obj['URL'] = responseData2['Amazon'][i]['URL'];
                obj['ImageURL'] = responseData2['Amazon'][i]['ImageURL'];
                obj['Retailer'] = 'Amazon';
                data2.push(obj);
              }
            }
            count = Object.keys(responseData2['Others']).length;
            catcount += count;
            console.log('CatCount: ' + catcount);
            if (count != 0) {
              for (var i = 0; i < count; i++) {
                var obj2 = {};
                obj2['ASIN'] = responseData2['Others'][i]['ASIN'];
                obj2['Title'] = responseData2['Others'][i]['Title'];
                obj2['URL'] = responseData2['Others'][i]['URL'];
                obj2['ImageURL'] = responseData2['Others'][i]['ImageURL'];
                obj2['Retailer'] = responseData2['Others'][i]['Website'];
                data2.push(obj2);
              }
            }
            if (data2.length > 0) {
              search = true;
              datasize = data2.length;
              searchcount = datasize;
              emptycard = false;
              data2 = shuffle(data2);
              console.log("total:" + data2.length);
              this.setState({
                cardNum: 0,
                dataset: data2,
                url: data2[this.state.cardNum].ImageURL,
                title: data2[this.state.cardNum].Title,
                disable: false,
                category: 'All',
                cat: false,
              });
            }
            else {
              Alert.alert("No Results Found!", 'Try Again!');
              emptycard = true;
              this.grabFrontPage();
              return;
            }


          }).done();
        //}
      }).done();
  };

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

  _handleTextChange = inputValue => {
    this.setState({ inputValue });
  };

  _renderItem2 = data => {
    const item = data.item;
    const baseSize = 12
    var newSize = 12;
    var marginTop = 4;
    if (item.Term.length > baseSize) {
      var diff = baseSize / (item.Term.length);
      newSize = diff * baseSize;
      marginTop = 6
    }
    const fontSize = Math.min(baseSize, newSize);
    console.log(item.Term + '-Fontsize: ' + fontSize + " -length:" + item.Term.length);
    return (
      <View>
        <TouchableOpacity onPress={() => {
          searchterm = item.Term;
          emptycard = false;
          this.setState({
            url: 'https://i.imgur.com/JaG8ovv.gif'
          })
          this.onSubmitEdit();
        }}>
          <View style={styles.catbars3}>
            <Image
              style={styles.catbars2}
              source={{
                uri: item.ImageUrl,
              }}
            />

          </View>
          <Text style={{
            marginTop: marginTop,
            textAlign: 'center',
            opacity: .69,
            fontSize: fontSize,
            fontFamily: "Montserrat",
          }}
            adjustsFontSizeToFit={true}
            numberOfLines={1}>

            {item.Term.toUpperCase()}
          </Text>
        </TouchableOpacity>

      </View>
    );
  }
  _keyExtractor = (item, index) => index;
  _renderFooter = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}
      >
        <TouchableOpacity onPress={() => this.props.navigation.push('Brands', {
          id: userID,
          points: userPoints,
          uri: uri2,
        })}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/brands.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('Travel')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/travel.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('groceries')}>
          <Image
            style={styles.catbar}
            source={require('./assets/Category/groceries.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.push('Deals', {
          id: userID,
          points: userPoints,
          uri: uri2,
        })}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/deals_v2.png')}
          />

        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('womens')}>
          <Image
            style={styles.catbar}
            source={require('./assets/Category/womens.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('men')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/mens.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('girls')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/girls.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('boys')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/boys.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('baby')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/baby.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('pet')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/pet.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('gift')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/gifts.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.catGrab('All')}>
          <Image
            style={styles.catbars}
            source={require('./assets/Category/random.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  getNewUser = () => {
    var RandomNumber = Math.floor(Math.random() * 18) + 1;
    if (randoUsersLikes.length > 0 && this.refs.animatedTextref) {
      this.setState({
        showAlert: false,
        UserStringLike: randoUsersLikes[RandomNumber].User_Name + " liked " + randoUsersLikes[RandomNumber].Title,
        randomPROFILEIMAGEstring: randomPROFILEIMAGE[RandomNumber],
      });
      console.log(this.state.randomPROFILEIMAGEstring);
    }
    console.log(this.state.UserStringLike);
    animationBool = false;
  }
  resetTo(route) {

    this.props.navigation.push(route, {
      id: userID,
      points: userPoints,
      uri: uri2,
      like: likes,
      notification: false,
      updateData: this.updateData,
      clearLikes: this.clearLikes,
      saveLikesto: this.saveLikesto,
    })
  }

  render() {
    const { showAlert } = this.state;
    const images = [
      require('./assets/tutorial/1.png'),
      require('./assets/tutorial/2.png'),
      require('./assets/tutorial/3.png'),
    ];
    try {
      if (tutorial) {
        return (
          <View style={styles.container}>
            <TouchableWithoutFeedback
              onPress={() => {
                tutorial = false
                this.forceUpdate();
              }}
            >
              <Image
                style={styles.hamburger}
                resizeMode='contain'
                source={require('./assets/icons/close.png')}
              />
            </TouchableWithoutFeedback>

            <ImageSlider
              autoPlayWithInterval={5000}
              images={images}

            />



          </View>

        );
      }
      else {
        return (
          <ImageBackground
            source={require('./like_background.png')}
            style={styles.container}>


            <Swiper
              ref={swiper => {
                this.swiper = swiper
              }}
              onSwiped={this.onSwiped}
              onTapCard={this.openURL}
              disableTopSwipe={true}
              disableBottomSwipe={this.state.disable}
              disableLeftSwipe={this.state.disable}
              disableRightSwipe={this.state.disable}
              onSwipedRight={this.onSwipedRight}
              infinite={true}
              cards={this.state.cards}
              cardIndex={this.state.cardIndex}
              renderCard={this.renderCard}
              onSwipedAll={this.onSwipedAllCards}
              stackSize={1}
              marginTop={40}
              cardVerticalMargin={110}
              showSecondCard={false}
              backgroundColor={'transparent'}
              overlayLabels={{
                bottom: {
                  title: 'REPORT BAD PRODUCT',
                  style: {
                    label: {
                      backgroundColor: 'black',
                      borderColor: 'black',
                      color: 'white',
                      borderWidth: 1
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                },
                left: {
                  title: 'NOPE',
                  style: {
                    label: {
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      color: 'red',
                      borderWidth: 1
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: -30
                    }
                  }
                },
                right: {
                  title: 'LIKE',
                  style: {
                    label: {
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      color: '#ff2eff',
                      borderWidth: 1
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: 30
                    }
                  }
                },
                top: {
                  title: 'SUPER LIKE',
                  style: {
                    label: {
                      backgroundColor: 'black',
                      borderColor: 'black',
                      color: 'white',
                      borderWidth: 1
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                }
              }}
              animateOverlayLabelsOpacity
              animateCardOpacity
            >
            </Swiper>

            <Image style={styles.bg} />


            <TouchableWithoutFeedback
              onPress={this.shareApp}
              style={styles.search2}>
              <Image
                resizeMode='contain'
                style={styles.search2}
                source={require('./assets/empty2.png')}
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={this.shareApp}
              style={styles.button}>
              <Image
                resizeMode='contain'
                style={styles.button}
                source={require('./assets/headercream.png')}
              />
            </TouchableWithoutFeedback>

            <Text style={styles.text2}>
              {userPoints + '\n'}
            </Text>
            <Text style={styles.pointsText}>
              Points
                </Text>

            <TouchableWithoutFeedback
              onPress={() => this.resetTo('Search')}
              style={styles.search}>
              <Image
                resizeMode='contain'
                style={styles.search}
                source={require('./assets/icons/search-icon2.png')}
              />
            </TouchableWithoutFeedback>

            <View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                indicatorStyle={'black'}
                backgroundColor={'white'}
                style={styles.scrollbar}
                data={this.state.testDat}
                keyExtractor={(item, index) => index}
                ListFooterComponent={this._renderFooter}
                renderItem={this._renderItem2}
              />
            </View>

            {emptycard
              ?
              <View style={styles.TrendText2}>
                <Image style={{ width: Dimensions.get('window').width, height: 50, marginTop: 10, marginBottom: -110 }} resizeMode={"contain"} source={require('./assets/title_header.png')} />
                <Text style={styles.TrendText}>{this.state.frontTitle}</Text>
              </View>
              :
              <View />
            }
            {emptycard ?
              <View style={{ marginTop: -60, height: '80%',width:deviceWidth }}>
                <WebView
                  style={styles.listContainer3}
                  javaScriptEnabled={true}
                  automaticallyAdjustContentInsets={true}
                  fullScreen={false}
                  scalesPageToFit={true}
                  scrollEnabled={false}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  //source={{ html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="http://www.youtube.com/embed/videoseries?list=PLDAt_4uwQO2LJnZZ7ZKQpEZBqWxYVZu_x&html5=1&rel=0&autoplay=1&showinfo=0&controls=0" frameborder="0" allow="autoplay" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}} 
                  //source={{ uri: 'http://www.youtube.com/embed/videoseries?list=PL6iEoxtSeBGYuh7IdQ-C-SYr25LV7S8NU&html5=1&rel=0&autoplay=1&showinfo=0&controls=0&loop=1&fullscreen=1' }}
                  //source = {{uri:'https://www.youtube.com/embed/L4dz3gSuR8E?html5=1&rel=0&autoplay=1&showinfo=0&controls=0&loop=1&playlist=L4dz3gSuR8E'}}
                  //source={{ uri: 'https://sharebert.com/videos/' }}
                  source={{ uri: 'https://sharebert.com/media/test4.html' }}
                />
              </View>
              :
              <View />}



            {/* {emptycard
              ?
              <View style={styles.TrendText2}>
                <Image style={{ width: Dimensions.get('window').width, height: 50, marginTop: 10, marginBottom: -110 }} resizeMode={"contain"} source={require('./assets/title_header.png')} />
                <Text style={styles.TrendText}>{this.state.frontTitle}</Text>
              </View>
              :
              <View />
            }
            {emptycard
              ?
              <View style={styles.listContainer}>
                <FlatList
                  style={styles.listContainer2}
                  refreshing={refresh}
                  onRefresh={() => {
                    refresh = true;
                    this.grabFrontPage();
                    refresh = false;
                  }}
                  data={this.state.trendData}
                  keyExtractor={(item, index) => index}
                  renderItem={this._renderItem}
                  getItemLayout={this._getItemLayout}
                  numColumns={numColumns}
                />
              </View>
              :
              <View />
            } */}


            {
              emptycard
                ?
                <View style={{ overflow: "visible", position: 'absolute', bottom: 0 }}>
                  <TouchableOpacity style={styles.footerItem3} onPress={this.shareURL}>
                    <Image style={styles.footerShare} resizeMode={"contain"} source={require('./assets/share1.png')} />
                  </TouchableOpacity>
                </View>
                :
                <View style={{ overflow: "visible", position: 'absolute', bottom: 0 }}>
                  <TouchableOpacity style={styles.footerItem4} onPress={this.shareURL}>
                    <Image style={styles.footerShare2} resizeMode={"contain"} source={require('./assets/share2.png')} />
                  </TouchableOpacity>
                </View>
            }


            <View style={styles.footer}>
              <Image style={styles.footer} />

              <TouchableWithoutFeedback style={styles.footerItem}
              // onPress={() => this.props.navigation.navigate('Explore', {
              //   id: userID,
              //   points: userPoints,
              // })}
              >
                <Image style={styles.exploreBut} resizeMode={"contain"} hitSlop={{ top: 12, left: 36, bottom: 0, right: 0 }}
                  source={require('./assets/menu/explore.png')}>

                </Image>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback style={styles.footerItem} hitSlop={{ top: 12, left: 36, bottom: 0, right: 0 }}
                onPress={() => this.resetTo('Rewards')}>
                <Image style={styles.likesBut} resizeMode={"contain"} source={require('./assets/menu/rewards.png')}>

                </Image>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback style={styles.footerRewards} hitSlop={{ top: 12, left: 36, bottom: 0, right: 0 }}
                onPress={() => this.resetTo('Likes')}>
                <Image style={styles.rewardsBut} resizeMode={"contain"} source={require('./assets/menu/likes.png')}>

                </Image>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback style={styles.footerProfile} hitSlop={{ top: 12, left: 36, bottom: 0, right: 0 }}
                onPress={() => this.resetTo('Shipping')}>
                <Image style={styles.profileBut} resizeMode={"contain"} source={{ uri: uri2 }}>

                </Image>
              </TouchableWithoutFeedback>
            </View>
            <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title="You earned 5 points!"
              message="Share another product to earn more!"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={true}
              showCancelButton={false}
              showConfirmButton={true}
              overlayStyle={styles.container2}
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
            {
              (Platform.OS === 'android')
                ?
                <Notification
                  ref={(ref) => { this.notification = ref; }}
                  backgroundColour='#1288f5'
                />
                :
                <View />
            }
            <Notification
              ref={(ref) => { this.notificationLike = ref; }}
              closeInterval={2000}
            />
          </ImageBackground>
        );
      }

    } catch (error) {
      console.error(error);
    }

  }
}

const colors = {
  snow: 'white',
  darkPurple: '#140034',
  placeholder: '#eee',
};

const styles = StyleSheet.create({

  container: {
    ...Platform.select({
      ios: {
        marginTop: Constants.statusBarHeight,
        height: 100,
        flex: 1,
        //backgroundColor: '#F5FCFF',
      },
      android: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#dee6ee',

      },
    }),
  },
  container3: {
    ...Platform.select({
      ios: {
        marginTop: Constants.statusBarHeight,
        height: 100,
        flex: 1,
        marginTop: 0,
        backgroundColor: 'transparent',
        //backgroundColor: '#F5FCFF',
      },
      android: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#dee6ee',

      },
    }),
  },
  container2: {
    height: Dimensions.get('window').height + Constants.statusBarHeight,
    width: Dimensions.get('window').width,
  },
  swiper: {
    paddingTop: Constants.statusBarHeight,
  },
  card: {
    flex: 0.9,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f2efef',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  card2: {
    flex: 0.9,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#f2efef',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  listContainer:
  {
    backgroundColor: 'transparent',
    height: deviceHeight - 300,
    marginTop: -70,
  },
  listContainer2:
  {
    backgroundColor: 'transparent',
    height: deviceHeight,
    marginTop: 10,
  },
  listContainer3:
  {
    backgroundColor: 'transparent',
    height: '70%',
    width: deviceWidth,
    marginTop: 10,
  },

  text2: {
    ...Platform.select({
      ios: {
        marginRight: 10,
        marginTop: -45,
        textAlign: 'right',
        fontSize: 15,
        color: 'white',
        backgroundColor: 'transparent',
      },
      android: {
        marginRight: 10,
        marginTop: 0,
        textAlign: 'right',
        fontSize: 15,
        color: 'white',
        backgroundColor: 'transparent',

      },
    }),

  },
  heart:
  {
    width: Dimensions.get('window').width,
    height: 30,
    paddingTop: 30,
    marginTop: 60,
    marginBottom: 26,
    backgroundColor: 'transparent',

  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff2eff',
    marginTop: -26,
    marginLeft: 5,
    marginBottom: 0,
    paddingBottom: 6,
    backgroundColor: 'transparent',
  },
  title2:
  {
    fontFamily: "Montserrat",
    fontSize: 12,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 6,
    backgroundColor: 'transparent',
  },
  pointsText: {
    ...Platform.select({
      ios: {
        marginRight: 10,
        marginTop: -20,
        textAlign: 'right',
        fontSize: 15,
        marginBottom: 13,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
      android: {
        marginRight: 10,
        marginTop: -5,
        marginBottom: 10,
        textAlign: 'right',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',

      },
    }),

  },
  scrollbar: {
    ...Platform.select({
      ios: {
        marginTop: -5,
        height: 77,
      },
      android: {
        marginTop: -5,
        height: 77,
        width: '100%',
      },
    }),
  },
  text: {
    fontFamily: "MontserratBold",
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffa21c',
    backgroundColor: 'transparent',
    marginTop: 8,
    marginBottom: 8,
  },
  inputQuestion:
  {
    marginTop: Dimensions.get('window').height / 8,
    //fontFamily: "Montserrat",
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '100',
    backgroundColor: 'transparent',
  },
  inputQuestion2:
  {
    marginTop: Dimensions.get('window').height / 30,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#A9A9A9',
    marginLeft: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 2,
    ...Platform.select({
      ios: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
      },
      android: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
      }
    }
    ),

  },
  retail: {
    textAlign: 'center',
    fontSize: 12,
    color: '#858a8f',
    fontFamily: 'MontserratBold',
    backgroundColor: 'transparent',
  },
  retail2: {
    textAlign: 'center',
    fontSize: 10,
    color: '#858a8f',
    fontFamily: 'MontserratLight',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    borderRadius: 10,
    flex: 1,
  },
  imageload: {
    width: '100%',
    marginLeft: Dimensions.get('window').width / 3.5,
    marginTop: Dimensions.get('window').height / 5.2,
    backgroundColor: 'transparent',
    flex: 1,
  },
  TrendText: {
    ...Platform.select({
      ios: {
        fontFamily: 'MontserratBoldItalic',
        width: Dimensions.get('window').width,
        height: 30,
        width: '100%',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 20,
        marginLeft: Dimensions.get('window').width / 20,
        marginTop: 20,
        marginBottom: -40,
        color: '#ffffff',

      },
      android:
      {
        fontFamily: 'MontserratBoldItalic',
        width: Dimensions.get('window').width,
        height: 30,
        width: '100%',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 20,
        marginLeft: Dimensions.get('window').width / 20,
        marginTop: 20,
        marginBottom: -40,
        color: '#ffffff',

      }
    }),

  },
  TrendText2:
  {
    marginTop: 10,
    marginBottom: '30%',
  },
  Trend1: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 4,
    position: 'absolute',
    left: 0,
    bottom: 0,
    flex: 1,
    borderRadius: 12,
    marginLeft: Dimensions.get('window').width / 10,
    marginBottom: Dimensions.get('window').height / 5,
  },
  Trend2: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 4,
    position: 'absolute',
    right: 0,
    bottom: 0,
    flex: 1,
    borderRadius: 12,
    marginRight: Dimensions.get('window').width / 10,
    marginBottom: Dimensions.get('window').height / 5,
  },
  Trend3: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 4,
    position: 'absolute',
    left: 0,
    bottom: -15,
    flex: 1,
    borderRadius: 12,
    marginLeft: Dimensions.get('window').width / 10,
    marginBottom: Dimensions.get('window').height / 40,
  },
  Trend4: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 4,
    position: 'absolute',
    right: 0,
    bottom: -15,
    flex: 1,
    borderRadius: 12,
    marginRight: Dimensions.get('window').width / 10,
    marginBottom: Dimensions.get('window').height / 40,

  },
  logobutton: {
    ...Platform.select({
      ios: {

      },
      android: {
        position: 'absolute',
        marginTop: 5,
        marginLeft: 5,
        height: 28,
        width: 40,
      },
    }),
  },

  button: {
    ...Platform.select({
      ios: {

        marginTop: -40,
        width: '100%',
        height: 50,
        marginBottom: 5,
        //marginLeft: Dimensions.get('window').width / 2.6,
        backgroundColor: 'transparent',
      },
      android: {
        position: 'absolute',
        width: '100%',
        marginTop: -1,
        //marginLeft: (Dimensions.get('window').width * .5) - 45,
        height: 50,
        flexDirection: 'row',
      },
    }),
  },
  button2: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    padding: 30,
    marginBottom: 20,
  },
  button3: {
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
    padding: 20,
    marginBottom: 20,
  },
  search2: {
    ...Platform.select({
      ios: {
        width: 0,
        height: 0,
      },
      android: {
        position: 'absolute',
        height: 45,
        backgroundColor: '#dee6ee',
        width: Dimensions.get('window').width,
      },
    }),

  },
  search: {
    ...Platform.select({
      ios: {
        width: 28,
        height: 40,
        marginLeft: 10,
        marginTop: -50,
        marginBottom: 12,
        backgroundColor: 'transparent',
        padding: 0,
      },
      android: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: 5,
        height: 28,
        width: 40,
      },
    }),

  },

  bg: {
    ...Platform.select({
      ios: {
        height: 190,
        width: '100%',
        marginTop: -150,
        backgroundColor: '#dee6ee',
      },
      android: {
        height: 40,
        width: '100%',
        position: "absolute",
        top: 0,
        backgroundColor: '#dee6ee',
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
  hamburger: {

    width: 25,
    height: 24,
    marginTop: 5,
    marginLeft: Dimensions.get('window').width / 1.1,
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
  header: {
    ...Platform.select({
      ios: {
      },
      android: {
        height: 40,
        width: '100%',
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: '#dee6ee',
      },
    }),
  },
  footer: {
    height: 40,
    width: '100%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#1288f5',
  },
  footerItem3:
  {
    bottom: Dimensions.get('window').height * .09,

    height: 75,
  },
  footerItem4:
  {
    position: 'absolute',
    bottom: Dimensions.get('window').height * .09,

    height: 75,
  },
  footerItem: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * .25,
  },
  footerItem2: {
    position: "absolute",
    bottom: 0,
    height: 30,
    backgroundColor: 'transparent',
  },
  footerTicker: {
    position: "absolute",
    bottom: 0,
    marginBottom: 5,
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
  footerLikeText: {
    height: 30,
    width: 220,
    fontWeight: 'bold',
    bottom: 0,
    backgroundColor: 'transparent',
    marginBottom: 40,
    marginLeft: Dimensions.get('window').width / 3.2,
    color: '#747475',
    fontSize: 10,
  },
  footerShare: {
    height: 95,
    width: 250,
    overflow: 'visible',
    //offset the margin by half of window width so image is always centered
    //make up for the left-aligned image by subtracting half the image width
    marginLeft: Dimensions.get('window').width * .50 - 125,
  },
  footerShare2: {
    height: 95,
    width: 250,
    overflow: 'visible',
    marginBottom: 100,
    //offset the margin by half of window width so image is always centered
    //make up for the left-aligned image by subtracting half the image width
    marginLeft: Dimensions.get('window').width * .50 - 125,
  },
  extraComponentContainer: {
    // fakes overflow but requires more markup
    backgroundColor: "transparent",
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 20,
    position: "relative"
  },
  footerShareText: {
    height: 30,
    width: 200,
    bottom: 0,
    backgroundColor: 'transparent',
    marginBottom: 65,
    marginLeft: Dimensions.get('window').width / 2.22,
    color: '#747475',
    fontSize: 12,
  },

  catbar: {
    width: 60,
    height: 88,
    marginLeft: 13,
    marginRight: 13,
    //backgroundColor: 'rgba(52, 52, 52, 0.8)',
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },
  catbars: {
    width: 60,
    height: 60,
    marginLeft: 13,
    marginRight: 13,
    marginTop: 13,
    //backgroundColor: 'rgba(52, 52, 52, 0.8)',
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },
  catbars2: {
    width: 40,
    height: 40,
    marginRight:2,
    borderRadius: 120,
    //backgroundColor: 'rgba(52, 52, 52, 0.8)',
    backgroundColor: 'transparent',
    resizeMode: 'cover',
  },
  catbars3: {
    width: 45,
    height: 45,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 13,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#1288f5',
    //backgroundColor: '#fff'
  },
  catbartext:
  {
    marginTop: 4,
    textAlign: 'center',
    opacity: .69,
    fontSize: 12,
    fontFamily: "Montserrat",
  },
  label: {
    width: 50,
    height: 25,
    textAlign: 'center',
    marginLeft: 13,
  },
  labelShort: {
    width: 78,
    height: 25,
  },

  itemImage: {
    width: (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
      PRODUCT_ITEM_MARGIN,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 5,
    borderColor: 'transparent',



  },
  itemTitle: {
    flex: 1,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
    }),
    margin: PRODUCT_ITEM_OFFSET * 2,
  },
  item: {
    margin: PRODUCT_ITEM_OFFSET,
    overflow: 'hidden',
    width: (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
      PRODUCT_ITEM_MARGIN,
    height: PRODUCT_ITEM_HEIGHT,
    flexDirection: 'column',
    borderRadius: 5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      android: {
        elevation: 0,
      },
    }),
  },
});
async function register() {
  const { status } = await Expo.Permissions.askAsync(Expo.Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    Alert.alert("You need to enable permissions in settings");
    return;
  }


  const token = await Expo.Notifications.getExpoPushTokenAsync();
  console.log(status, token)
  // if (userID !== 0) {
  //   Firebase.database().ref('users/' + userID + "/token").set({
  //     token: token,
  //   });
  // }
  try {
    fetch('https://sharebert.com/s/SendToken.php?token=' + token + '&ui=' + userID, { method: 'GET' })
  }
  catch (error) {
    console.error(error);
  }


};
function sanitize(text) {
  text = text.replace(/\./g, '');
  text = text.replace(/\#/g, '');
  text = text.replace(/\$/g, '');
  text = text.replace(/[\[\]']+/g, '')
  return text;
}
function trunc(text) {
  if (text.includes('   ')) {
    text = text.substr(0, text.indexOf('   '));
  }

  return text.length > 30 ? `${text.substr(0, 30)}...` : text;
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
export default Explore;
export { likes };
