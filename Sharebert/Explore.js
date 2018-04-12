import React, { Component } from 'react';
import Swiper from 'react-native-deck-swiper'; // Version can be specified in package.json
import SideMenu from 'react-native-side-menu'; // Version can be specified in package.json
import Image2 from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Menu from './Menu';
import LoadingView from 'rn-loading-view';
import AwesomeAlert from 'react-native-awesome-alerts';
import Notification from 'react-native-in-app-notification';
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
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Constants } from 'expo';
//import { uri2 } from './LoginScreen';
const { width } = 10;
var userPoints = 0;
var userID = 0;
var animationz = false;
var toofast = false;
var datasize = 0;
var searchcount = 0;
var brand = '';
var search = false;
var searchterm = '';
var randomPROFILEIMAGE = []; //TO BE REMOVED
var animationBool = false;
var emptycard = true;
var likes = [];
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
class Explore extends Component {
  constructor(props) {
    super(props);

    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    uri2 = this.props.navigation.state.params.uri;
    this.getOldLikes();
    this.state = {
      cards: ['1', '2', '3'],
      isOpen: false,
      randomPROFILEIMAGEstring: 'http://www.lowisko.online-pl.com/index_html_files/0.png',
      UserStringLike: '',
      selectedItem: 'Explore',
      swipedAllCards: false,
      swipeDirection: '',
      disable: true,
      isSwipingBack: false,
      cardIndex: 0,
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
    };
    if (this.props.navigation.state.params.brands != undefined) {
      emptycard = false;
      brand = this.props.navigation.state.params.brands;
      fetch('https://sharebert.com/Brands.php?brand=' + brand + '&page=10', { method: 'GET' })
        .then(response => response.json())
        .then(responseData => {
          var data2 = [];
          for (var i = 0; i < 20; i++) {
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

      searchterm = this.props.navigation.state.params.search;
      fetch(
        'https://biosystematic-addit.000webhostapp.com/APISEARCH.php?keyword=' +
        searchterm +
        '&page=1',
        { method: 'GET' }
      )
        .then(response => response.json())
        .then(responseData => {
          console.log(Object.keys(responseData['Amazon']).length);
          if (Object.keys(responseData['Amazon']).length === undefined||Object.keys(responseData['Amazon']).length===0) {
            Alert.alert("No Results Found");
            emptycard = true;
            return;
          }
          else {
            emptycard = false;
            var data2 = [];
            var count = responseData['Amazon'][0][7];
            datasize = count;
            searchcount = datasize;
            console.log(searchcount);
            for (var i = 0; i < count; i++) {
              var obj = {};
              obj['ASIN'] = responseData['Amazon'][i][0];
              obj['Title'] = responseData['Amazon'][i][1];
              obj['URL'] = responseData['Amazon'][i][3];
              obj['ImageURL'] = responseData['Amazon'][i][4];
              obj['Retailer'] = 'Amazon';
              data2.push(obj);
            }
            search = true;
            data2 = shuffle(data2);
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
        })
        .done();
    }
    else {
      emptycard = true;
      this.grabFrontPage();
    }
    // else {
    //   fetch('https://sharebert.com/login9.php?page=5', { method: 'GET' })
    //   .then(response => response.json())
    //     .then(responseData => {
    //       var data2 = [];
    //       for (var i = 0; i < 20; i++) {
    //         var obj = {};
    //         obj['ASIN'] = responseData['Amazon'][i]['ASIN'];
    //         obj['Title'] = responseData['Amazon'][i]['Title'];
    //         obj['URL'] = responseData['Amazon'][i]['URL'];
    //         obj['ImageURL'] = responseData['Amazon'][i]['ImageURL'];
    //         obj['Retailer'] = "Amazon";

    //         var obj2 = {};
    //         obj2['ASIN'] = responseData['Others'][i]['ASIN'];
    //         obj2['Title'] = responseData['Others'][i]['Title'];
    //         obj2['URL'] = responseData['Others'][i]['URL'];
    //         obj2['ImageURL'] = responseData['Others'][i]['ImageURL'];
    //         obj2['Retailer'] = responseData['Others'][i]['Website'];

    //         data2.push(obj);
    //         data2.push(obj2);
    //       }
    //       data2 = shuffle(data2);
    //       this.setState({
    //         cardNum: this.state.cardNum,
    //         url: data2[this.state.cardNum].ImageURL,
    //         title: data2[this.state.cardNum].Title,
    //         dataset: data2,
    //         cat: false,
    //       });
    //     })
    //     .done();
    // }
    if (userID != 0 || userID != undefined || userID != null) {

      this.checkUpdatePoints();
    }
    for (var i = 0; i < 25; i++) {
      var RandomNumber = Math.floor(Math.random() * (10000 - 5)) + 4;
      imgUrl = "http://graph.facebook.com/v2.5/" + RandomNumber + "/picture?height=200&height=200";
      randomPROFILEIMAGE.push(imgUrl);
    }
    this.grabRandoLikes();
    this.getNewUser();
    setInterval(this.getNewUser, 17000);//every 17 seconds

  }

  grabFrontPage = () => {
    fetch('https://biosystematic-addit.000webhostapp.com/Frontpage/Frontpage.php', { method: 'GET' })
      .then(response => response.json())
        .then(responseData => {
          var data2 = [];
          for (var i = 0; i < responseData.length; i++) {
            var obj = {};
            obj['term'] = responseData[i]['term'];
            obj['ImageURL'] = responseData[i]['ImageURL'];
            data2.push(obj);
          }
          data2 = shuffle(data2);
          
          this.setState({
            trendData: data2,
            url: 'https://i.imgur.com/qnHscIM.png',
            // cardNum: this.state.cardNum,
            // url: data2[this.state.cardNum].ImageURL,
            // title: data2[this.state.cardNum].Title,
            // dataset: data2,
            // cat: false,
          });
          console.log(this.state.trendData);
        })
        .done();
  }


  componentWillMount() {
    register();
  }
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
  frontPageClick = term =>{

    searchterm=term;
    this.onSubmitEdit;

  }
  grabRandoLikes = async () => {
    var data2 = [];
    var RandomNumber = Math.floor(Math.random() * 18) + 1;
    fetch('https://biosystematic-addit.000webhostapp.com/UserLikes.php?page=5', { method: 'GET' })
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
      return (
        <View style={styles.card}>
          <Text style={styles.TrendText}>Today's Hot Picks</Text>
          <TouchableWithoutFeedback style={styles.Trend1}
          onPress={()=>{
            searchterm = this.state.trendData[0].term;
            this.onSubmitEdit();
          }}>
          <Image
            resizeMode="contain"
            style={styles.Trend1}
            source={{
              uri: this.state.trendData[0].ImageURL,
            }}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.Trend2}
          onPress={()=>{
            searchterm = this.state.trendData[1].term;
            this.onSubmitEdit();
          }}>
          <Image
            resizeMode="contain"
            style={styles.Trend2}
            source={{
              uri: this.state.trendData[1].ImageURL,
            }}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.Trend3}
          onPress={()=>{
            searchterm = this.state.trendData[2].term;
            this.onSubmitEdit();
          }}>
          <Image
            resizeMode="contain"
            style={styles.Trend3}
            source={{
              uri: this.state.trendData[2].ImageURL,
            }}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.Trend4}
          onPress={()=>{
            searchterm = this.state.trendData[3].term;
            this.onSubmitEdit();
          }}>
          <Image
            resizeMode="contain"
            style={styles.Trend4}
            source={{
              uri: this.state.trendData[3].ImageURL,
            }}
            />
          </TouchableWithoutFeedback>
        </View>

      );
    } else if (
      this.state.url ===
      'https://i.imgur.com/JaG8ovv.gif'
    ) {
      return (
        <View style={styles.card}>

          <Image2
            resizeMode="contain"
            indicator={ProgressBar}
            indicatorProps={{
              color: '#ff2eff',
              unfilledColor: 'rgba(200, 200, 200, 0.2)'
            }}
            style={styles.imageload}

            source={require('./assets/loading3.gif')}
          />
        </View>
      )
    }
    else {
      var imageURL2 = this.state.dataset[this.state.cardNum].ImageURL;
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
          <Text numberOfLines={2} style={styles.text}>
            {this.state.dataset[this.state.cardNum].Title}
          </Text>
          <Text style={styles.retail}>
            From <Text style={{ color: '#ff2eff' }}>{retailfinal}</Text>
          </Text>
        </View>
      );
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
      'https://i.imgur.com/qnHscIM.png'
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
        'https://sharebert.com/RetrievePointsWeb.php?uid=' +
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
        'https://i.imgur.com/qnHscIM.png'
      ) {
        return;
      }
      if (brand !== "" && (this.state.cardNum + 11 >= this.state.dataset.length)) {
        console.log('brand reset')
        fetch('https://sharebert.com/Brands.php?brand=' + brand + '&page=5', { method: 'GET' })
          .then(response => response.json())
          .then(responseData => {
            var data2 = [];
            for (var i = 0; i < 20; i++) {
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
              category: '',
              disable: false,
              cat: false,
            });
          })
          .done();
      }
      else if ((search === true && this.state.cardNum+1 >= (searchcount)) || (this.state.cardNum > 30 && search === true)) {
        this.onSubmitEdit();
      }
      else if (
        this.state.cat &&
        this.state.category != 'All' &&
        (this.state.cardNum + 10) >= this.state.dataset.length) {
        console.log('reset cat');
        this.catGrab(this.state.category);
      }
      else if ((this.state.cardNum + 10 >= this.state.dataset.length) && search === false && this.state.cat === false) {
        console.log('Search was reset');
        fetch('https://sharebert.com/login9.php?page=5', { method: 'GET' })
          .then(response => response.json())
          .then(responseData => {
            var data2 = [];
            for (var i = 0; i < 20; i++) {
              var obj = {};
              obj['ASIN'] = responseData['Amazon'][i]['ASIN'];
              obj['Title'] = responseData['Amazon'][i]['Title'];
              obj['URL'] = responseData['Amazon'][i]['URL'];
              obj['ImageURL'] = responseData['Amazon'][i]['ImageURL'];
              obj['Retailer'] = "Amazon";

              var obj2 = {};
              obj2['ASIN'] = responseData['Others'][i]['ASIN'];
              obj2['Title'] = responseData['Others'][i]['Title'];
              obj2['URL'] = responseData['Others'][i]['URL'];
              obj2['ImageURL'] = responseData['Others'][i]['ImageURL'];
              obj2['Retailer'] = responseData['Others'][i]['Website'];
              data2.push(obj);
              data2.push(obj2);
            }
            toofast = false;
            search = false;
            data2 = shuffle(data2);
            this.setState({
              cardNum: 0,
              disable: false,
              dataset: data2,
              category: '',
              cat: false,
            });
          })
          .done();
      }
      if(this.state.dataset.length>this.state.cardNum+1)
      {
        this.setState({
          cardNum: this.state.cardNum + 1,
          url: this.state.dataset[this.state.cardNum].ImageURL,
          title: this.state.dataset[this.state.cardNum].Title,
        });
      }
      

      try {
        if (Math.floor(Math.random() * (250 - 1) + 1) <= 2 && userID != 0) {
          fetch(
            'https://sharebert.com/DBAwardPoints.php?uid=' +
            userID +
            '&type=2',
            { method: 'GET' }
          )
            .then(response2 => response2.json())
            .then(responseData2 => {
              if (responseData2['Points'] != userPoints) {
                Alert.alert('You Earned Points', "Keep swiping to earn more!");

                userPoints = responseData2['Points'];
                this.forceUpdate();
              }
            })
            .done();
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };





  catGrab = category => {

    this.setState({
      url: 'https://i.imgur.com/JaG8ovv.gif',
    });

    emptycard = false;
    brand = '';
    var data2 = [];
    if (category === 'Travel') {
      console.log(category);
      this.props.navigation.navigate('Travel', {
        id: userID,
        points: userPoints,
        uri: uri2,
      });
    }

    if (category != 'All') {
      fetch(
        'https://sharebert.com/Categoriesios.php?page=5&cat=' +
        category,
        { method: 'GET' }
      )
        .then(response => response.json())
        .then(responseData => {
          console.log('Grabbing Cat');
          for (var i = 0; i < 20; i++) {
            try {
              var obj = {};
              obj['ASIN'] = responseData['Amazon'][i]['ASIN'];
              obj['Title'] = responseData['Amazon'][i]['Title'];
              obj['URL'] = responseData['Amazon'][i]['URL'];
              obj['ImageURL'] = responseData['Amazon'][i]['ImageURL'];
              obj['Retailer'] = 'Amazon';
              var obj2 = {};
              obj2['ASIN'] = responseData['Others'][i]['ASIN'];
              obj2['Title'] = responseData['Others'][i]['Title'];
              obj2['URL'] = responseData['Others'][i]['URL'];
              obj2['ImageURL'] = responseData['Others'][i]['ImageURL'];
              obj2['Retailer'] = responseData['Others'][i]['Website'];
              if (obj['ASIN'] === obj2['ASIN']) {
                data2.push(obj2);
              } else {
                data2.push(obj);
                data2.push(obj2);
              }
            } catch (error) {
              console.log(error);
            }
          }
          toofast = false;

          data2 = shuffle(data2);
          var RandomNumber2 = Math.floor(Math.random() * 10) + 1
          fetch(
            'https://biosystematic-addit.000webhostapp.com/APISEARCH.php?keyword=' +
            category +
            '&page=' + RandomNumber2,
            { method: 'GET' }
          )
            .then(response => response.json())
            .then(responseData => {
              var count = responseData['Amazon'][0][7];
              datasize = count;
              searchcount = datasize;
              console.log(data2.length);
              console.log(searchcount);
              for (var i = 0; i < count; i++) {
                var obj = {};
                obj['ASIN'] = responseData['Amazon'][i][0];
                obj['Title'] = responseData['Amazon'][i][1];
                obj['URL'] = responseData['Amazon'][i][3];
                obj['ImageURL'] = responseData['Amazon'][i][4];
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
              console.log(this.state.dataset.length);
            })
            .done();

        })
        .done();
    } else {
      fetch('https://sharebert.com/login9.php?page=5', { method: 'GET' })
        .then(response => response.json())
        .then(responseData => {
          for (var i = 0; i < 20; i++) {
            var obj = {};
            obj['ASIN'] = responseData['Amazon'][i]['ASIN'];
            obj['Title'] = responseData['Amazon'][i]['Title'];
            obj['URL'] = responseData['Amazon'][i]['URL'];
            obj['ImageURL'] = responseData['Amazon'][i]['ImageURL'];
            obj['Retailer'] = "Amazon";

            var obj2 = {};
            obj2['ASIN'] = responseData['Others'][i]['ASIN'];
            obj2['Title'] = responseData['Others'][i]['Title'];
            obj2['URL'] = responseData['Others'][i]['URL'];
            obj2['ImageURL'] = responseData['Others'][i]['ImageURL'];
            obj2['Retailer'] = responseData['Others'][i]['Website'];

            data2.push(obj);
            data2.push(obj2);

          }
          console.log(data2.length);
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
      this.state.url !=
      'https://i.imgur.com/qnHscIM.png'
    ) {
      if (this.state.dataset[this.state.cardNum - 1].Title !== null) {
        likes.push(this.state.dataset[this.state.cardNum - 1]);
        this.saveLike();
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
                'https://sharebert.com/DBAwardPoints.php?uid=' +
                userID +
                '&type=3',
                { method: 'GET' }
              )
                .then(response2 => response2.json())
                .then(responseData2 => {
                  if (responseData2['Points'] != userPoints) {

                    userPoints = responseData2['Points'];
                    Alert.alert('POINTS OBTAINED', "Thanks for Sharing The App!");

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
  saveLike = async () => {
    try {

      if (userID !== undefined || userID !== 0) {
        await AsyncStorage.setItem('@MySuperStore:Likes' + userID, JSON.stringify(likes));
      }
      else {
        await AsyncStorage.setItem('@MySuperStore:Likes', JSON.stringify(likes));
      }
      const likesave = await AsyncStorage.getItem('@MySuperStore:Likes' + userID);
    } catch (error) {
      // Error saving data
      Alert.alert("Error saving likes!");
    }

  }

  // clearFile = async () => {
  //   try {
  //     await AsyncStorage.removeItem('@MySuperStore:name');
  //     await AsyncStorage.removeItem('@MySuperStore:email');
  //     await AsyncStorage.removeItem('@MySuperStore:uri2');
  //     await AsyncStorage.removeItem('@MySuperStore:points');
  //     await AsyncStorage.removeItem('@MySuperStore:id');

  //     this.props.navigation.navigate('LoginScreen', {
  //       loggedbool2: false,
  //       id: 0,
  //       points: 0,
  //     });
  //   } catch (error) {
  //     // Error saving data
  //   }
  // }


  onMenuItemSelected = item => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });

    if (item === 'Shipping') {
      this.props.navigation.navigate('Shipping', {
        id: userID,
        points: userPoints,
      });
    } else if (item === 'Likes') {
      this.props.navigation.navigate('Likes', {
        id: userID,
        points: userPoints,
      });
    } else if (item === 'Rewards') {
      this.props.navigation.navigate('Rewards', {
        id: userID,
        points: userPoints,
      });
    } else if (item === 'Privacy Policies') {
      try {
        Linking.openURL('https://sharebert.com/privacy-policy/');
      } catch (error) {
        console.error(error);
      }
    } else if (item === 'Logout') {
      try {
        //this.clearFile();

      } catch (error) {
        console.error(error);
      }
    }
  };

  getOldLikes = async (type) => {
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

        likes = JSON.parse(likesave);
      }
      else {
      }
      this.forceUpdate();
    } catch (error) {
      // Error retrieving data
    }
  };

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onSubmitEdit = () => {
    console.log('Search was refreshed');
    Keyboard.dismiss();
    if(searchterm===undefined||searchterm===' '||searchterm==='')
    {
      Alert.alert("Empty Search!",'Try Again!');
      return;
    }
    console.log(searchterm);
    fetch(
      'https://biosystematic-addit.000webhostapp.com/APISEARCH.php?keyword=' +
      searchterm +
      '&page=1',
      { method: 'GET' }
    )
      .then(response => response.json())
      .then(responseData => {
        var data2 = [];
        console.log(Object.keys(responseData['Amazon']).length)
        if (Object.keys(responseData['Amazon']).length === undefined||Object.keys(responseData['Amazon']).length===0) {
          Alert.alert("No Results Found");
          return;
        }
        emptycard = false;
        var count = responseData['Amazon'][0][7];
        datasize = count;
        searchcount = datasize;

        console.log(searchcount);
        for (var i = 0; i < count; i++) {
          var obj = {};
          obj['ASIN'] = responseData['Amazon'][i][0];
          obj['Title'] = responseData['Amazon'][i][1];
          obj['URL'] = responseData['Amazon'][i][3];
          obj['ImageURL'] = responseData['Amazon'][i][4];
          obj['Retailer'] = 'Amazon';
          data2.push(obj);
        }
        search = true;
        data2 = shuffle(data2);
        this.setState({
          cardNum: 0,
          dataset: data2,
          category: 'All',
          cat: false,
          url: data2[this.state.cardNum].ImageURL,
          title: data2[this.state.cardNum].Title,
          disable: false,
        });
      })
      .done();
  };

  _handleTextChange = inputValue => {
    this.setState({ inputValue });
  };

  getNewUser = () => {
    var RandomNumber = Math.floor(Math.random() * 18) + 1;
    if (randoUsersLikes.length > 0 && this.refs.animatedTextref) {
      this.setState({

        UserStringLike: randoUsersLikes[RandomNumber].User_Name + " liked " + randoUsersLikes[RandomNumber].Title,
        randomPROFILEIMAGEstring: randomPROFILEIMAGE[RandomNumber],
      });
      console.log(this.state.randomPROFILEIMAGEstring);
    }
    console.log(this.state.UserStringLike);
    animationBool = false;
  }
  resetTo(route) {
    this.props.navigation.pop(0)
    this.props.navigation.navigate(route, {
      id: userID,
      points: userPoints,
      uri: uri2,
    })
  }

  render() {
    const { showAlert } = this.state;
    try {
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


          <Text style={styles.text2}>
            {userPoints + '\n'}
          </Text>
          <Text style={styles.pointsText}>
            Points
              </Text>


          <TouchableWithoutFeedback
            onPress={this.shareApp}
            style={styles.button}>
            <Image
              resizeMode='contain'
              style={styles.button}
              source={require('./Logo.png')}
            />
          </TouchableWithoutFeedback>

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
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              indicatorStyle={'black'}
              backgroundColor={'white'}
              style={styles.scrollbar}
            >
              {<TouchableOpacity onPress={() => this.props.navigation.navigate('Brands', {
                id: userID,
                points: userPoints,
                uri: uri2,
              })}>
                <Image
                  style={styles.catbars}
                  source={require('./assets/Category/brands.png')}
                />
              </TouchableOpacity>}
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Deals', {
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
              <TouchableOpacity onPress={() => this.catGrab('groceries')}>
                <Image
                  style={styles.catbar}
                  source={require('./assets/Category/groceries.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Travel')}>
                <Image
                  style={styles.catbars}
                  source={require('./assets/Category/travel.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('All')}>
                <Image
                  style={styles.catbars}
                  source={require('./assets/Category/random.png')}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <TouchableOpacity disabled={true} style={styles.footerTicker}>
            <Animatable.Image ref='animatedTextref' animation={animationz ? 'fadeIn' : 'fadeOut'} iterationCount='infinite' delay={300} duration={16000} easing='ease-in-out-back' style={styles.footerLikes} resizeMode={"contain"} source={{ uri: this.state.randomPROFILEIMAGEstring }}></Animatable.Image>
            <Animatable.Text ref='animatedTextref' animation={animationz ? 'fadeIn' : 'fadeOut'} iterationCount='infinite' delay={300} duration={16000} easing='ease-in-out-back' style={styles.footerLikeText} numberOfLines={1} ref={this.handleTextRef}>{this.state.UserStringLike}</Animatable.Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={this.shareURL}>
            <Image style={styles.footerShare} resizeMode={"contain"} source={require('./sharebutton.png')} />
            <Text style={styles.footerShareText}>
              <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12, }}>
                Share{' '}
              </Text>
            </Text>

          </TouchableOpacity>

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
              onPress={() => this.resetTo('Likes')}>
              <Image style={styles.likesBut} resizeMode={"contain"} source={require('./assets/menu/likes.png')}>

              </Image>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback style={styles.footerRewards} hitSlop={{ top: 12, left: 36, bottom: 0, right: 0 }}
              onPress={() => this.resetTo('Rewards')}>
              <Image style={styles.rewardsBut} resizeMode={"contain"} source={require('./assets/menu/rewards.png')}>

              </Image>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback style={styles.footerProfile} hitSlop={{ top: 12, left: 36, bottom: 0, right: 0 }}
              onPress={() =>this.resetTo('Shipping')}>
              <Image style={styles.profileBut} resizeMode={"contain"} source={{ uri: uri2 }}>

              </Image>
            </TouchableWithoutFeedback>
          </View>
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
        </ImageBackground>
      );
    } catch (error) {
      console.error(error);
    }
  }
}

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
  swiper: {
    paddingTop: Constants.statusBarHeight,
  },
  card: {
    flex: 0.9,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#f2efef',
    justifyContent: 'center',
    backgroundColor: 'white',
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
        marginTop: 0,
        textAlign: 'right',
        fontSize: 15,
        color: '#f427f3',
        backgroundColor: 'transparent',
        elevation: 100,
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
        color: '#863fba',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
      android: {
        marginRight: 10,
        marginTop: -5,
        marginBottom: 10,
        textAlign: 'right',
        fontSize: 15,
        color: '#863fba',
        fontWeight: 'bold',
        backgroundColor: 'transparent',

      },
    }),

  },
  scrollbar: {
    ...Platform.select({
      ios: {
        marginTop: -5,
        height: 75,
      },
      android: {
        marginTop: -5,
        height: 75,
      },
    }),
  },
  text: {
    fontFamily: "Montserrat",
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
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
    fontSize: 15,
    color: 'black',
    backgroundColor: 'transparent',
  },
  retail2: {
    textAlign: 'center',
    fontSize: 15,
    color: 'black',
    backgroundColor: 'transparent',
  },
  image: {
    width,
    flex: 3,
  },
  imageload: {
    width,
    marginLeft: Dimensions.get('window').width / 3.5,
    marginTop: Dimensions.get('window').height / 5.2,

    flex: 1,
  },
  TrendText: {
    fontFamily: 'Montserrat',
    width: Dimensions.get('window').width,
    height: 150,
    position: 'absolute',
    textAlign: 'center',
    fontSize: 25,
    bottom: 0,
    left: 0,
    marginLeft: -20,
    flex: 1,
    marginBottom: Dimensions.get('window').width / 2,
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
    marginBottom: Dimensions.get('window').height/ 5,
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
    marginBottom: Dimensions.get('window').height/ 5,
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
    marginBottom: Dimensions.get('window').height/ 40,
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
    marginBottom: Dimensions.get('window').height/ 40,

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
        width: 90,
        height: 30,
        marginTop: -35,
        marginLeft: Dimensions.get('window').width / 2.6,
        backgroundColor: 'transparent',
        padding: 20,
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
        marginTop: -40,
        backgroundColor: 'transparent',
        padding: 0,
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
    height: 30,
    borderRadius: 12,
    width: 30,
    bottom: 0,
    backgroundColor: 'transparent',
    marginBottom: 2,
    marginLeft: Dimensions.get('window').width / 2.2,
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
});
async function register() {
  const { status } = await Expo.Permissions.askAsync(Expo.Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    Alert.alert("You need to enable permissions in settings");
    return;
  }

  const token = await Expo.Notifications.getExpoPushTokenAsync();
  console.log(status, token)
  try {
    fetch('https://biosystematic-addit.000webhostapp.com/SendToken.php?token=' + token + '&ui=' + userID, { method: 'GET' })
  }
  catch (error) {
    console.error(error);
  }


};
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
