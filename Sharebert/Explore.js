import React, { Component } from 'react';
import Swiper from 'react-native-deck-swiper'; // Version can be specified in package.json
import SideMenu from 'react-native-side-menu'; // Version can be specified in package.json
import Image2 from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Menu from './Menu';
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
  Share,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Constants } from 'expo';
//import { uri2 } from './LoginScreen';
const { width } = 10;
var userPoints = 0;
var userID = 0;
var animationz = true;
var toofast = false;
var datasize = 0;
var searchcount = 0;
var brand = '';
var search = false;
var searchterm = '';
var randomPROFILEIMAGE = []; //TO BE REMOVED
var animationBool = false;
var likes = [];
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
      isSwipingBack: false,
      cardIndex: 0,
      cardNum: 0,
      cat: false,
      category: '',
      title: '',
      jsonData: '',
      responseData: '',
      url: 'https://s3.amazonaws.com/sbsupersharebert-us-east-03942032794023/wp-content/uploads/2017/06/19160520/Sharebert_Logo.png',
      data: [],
      dataset: [],
      inputValue: 'Search',
      color: "#ff2eff",
    };
    if (this.props.navigation.state.params.brands != undefined) {
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
          dataset: data2,
          cat: false,
        });
      })
      .done();
    }
    else if(this.props.navigation.state.params.search !=undefined)
    {
      searchterm = this.props.navigation.state.params.search;
      console.log('yay');
      fetch(
        'https://sharebert.com/APISEARCH.php?keyword=' +
        searchterm +
        '&page=1',
        { method: 'GET' }
      )
        .then(response => response.json())
        .then(responseData => {
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
            category: 'All',
            cat: false,
          });
        })
        .done();
    }
    else if (brand === '') {
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
          data2 = shuffle(data2);
          this.setState({
            cardNum: this.state.cardNum,
            url: data2[this.state.cardNum].ImageURL,
            title: data2[this.state.cardNum].Title,
            dataset: data2,
            cat: false,
          });
        })
        .done();
    }
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
      'https://s3.amazonaws.com/sbsupersharebert-us-east-03942032794023/wp-content/uploads/2017/06/19160520/Sharebert_Logo.png'
    ) {
      return (
        <View style={styles.card}>
          <Text style={styles.text}>{this.state.title}</Text>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={{
              uri: this.state.url,
            }}
          />
          <ActivityIndicator size="small" />
        </View>

      );
    } else {
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
      'https://s3.amazonaws.com/sbsupersharebert-us-east-03942032794023/wp-content/uploads/2017/06/19160520/Sharebert_Logo.png'
    ) {
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
              message: 'Look at this : \n' +
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
                    Alert.alert('POINTS OBTAINED', "Thanks for Sharing!" + userPoints);
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
      'https://s3.amazonaws.com/sbsupersharebert-us-east-03942032794023/wp-content/uploads/2017/06/19160520/Sharebert_Logo.png'
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
        'https://s3.amazonaws.com/sbsupersharebert-us-east-03942032794023/wp-content/uploads/2017/06/19160520/Sharebert_Logo.png'
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
              cat: false,
            });
          })
          .done();
      }
      else if ((search === true && this.state.cardNum >= (searchcount - 5)) || (this.state.cardNum > 30 && search === true)) {
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
              dataset: data2,
              category: '',
              cat: false,
            });
          })
          .done();
      }
      this.setState({
        cardNum: this.state.cardNum + 1,
        url: this.state.dataset[this.state.cardNum].ImageURL,
        title: this.state.dataset[this.state.cardNum].Title,
      });

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
                Alert.alert('POINTS OBTAINED', "Nice Swiping!");

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
    brand = '';
    var data2 = [];
    if(category==='Travel')
    {
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
          fetch(
            'https://sharebert.com/APISEARCH.php?keyword=' +
            category +
            '&page=1',
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
            dataset: data2,
            category: 'All',
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
      'https://s3.amazonaws.com/sbsupersharebert-us-east-03942032794023/wp-content/uploads/2017/06/19160520/Sharebert_Logo.png'
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
              url: 'https://itunes.apple.com/us/app/sharebert/id1351955303?mt=8',
            },
            android: {
              message: 'Look at this : \n' +
                'https://itunes.apple.com/us/app/sharebert/id1351955303?mt=8',
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
                'https://itunes.apple.com/us/app/sharebert/id1351955303?mt=8',
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
    fetch(
      'https://sharebert.com/APISEARCH.php?keyword=' +
      searchterm +
      '&page=1',
      { method: 'GET' }
    )
      .then(response => response.json())
      .then(responseData => {
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
          category: 'All',
          cat: false,
        });
      })
      .done();
  };

  _handleTextChange = inputValue => {
    this.setState({ inputValue });
  };

  getNewUser = () => {
    var RandomNumber = Math.floor(Math.random() * 18) + 1;
    if (randoUsersLikes.length > 0&&this.refs.animatedTextref) {
      this.setState({
        
        UserStringLike: randoUsersLikes[RandomNumber].User_Name + " liked " + randoUsersLikes[RandomNumber].Title,
        randomPROFILEIMAGEstring: randomPROFILEIMAGE[RandomNumber],
      });
      console.log(this.state.randomPROFILEIMAGEstring);
    }
    console.log(this.state.UserStringLike);
    animationBool = false;
  }

  render() {

    try {
      return (
        <View style={styles.container}>
          <Swiper
            style={styles.swiper}
            ref={swiper => {
              this.swiper = swiper;
            }}
            onTapCard={this.openURL}
            disableTopSwipe={true}
            disableBottomSwipe={true}
            infinite={true}
            onSwiped={this.onSwiped}
            onSwipedRight={this.onSwipedRight}
            cards={this.state.cards}
            cardIndex={this.state.cardIndex}
            cardVerticalMargin={100}
            onTapCardDeadZone={100}
            renderCard={this.renderCard}
            onSwipedAll={this.onSwipedAllCards}
            showSecondCard={false}
            backgroundColor={'white'}
            marginTop={40}
            overlayLabels={{
              bottom: {
                title: 'BLEAH',
                swipeColor: '#9262C2',
                backgroundOpacity: '0.75',
                fontColor: '#FFF',
              },
              left: {
                title: 'NOPE',
                swipeColor: '#FF6C6C',
                backgroundOpacity: '0.75',
                fontColor: '#FFF',
              },
              right: {
                title: 'LIKE',
                swipeColor: '#4CCC93',
                backgroundOpacity: '0.75',
                fontColor: '#FFF',
              },
              top: {
                title: 'SUPER LIKE',
                swipeColor: '#4EB8B7',
                backgroundOpacity: '0.75',
                fontColor: '#FFF',
              },
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
          />
          <Image style={styles.bg} />
          <Text style={styles.text2}>
            {userPoints + '\n'}
          </Text>
          <Text style={styles.pointsText}>
            Points
              </Text>
          <TouchableOpacity >
            <TouchableOpacity onPress={this.shareApp}>
              <Image
                resizeMode="contain"
                style={styles.button}
                source={require('./Logo.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Search', {
              id: userID,
              points: userPoints,
              uri: uri2,
            })}
            style={{ flexDirection: 'row' }}>
            <Image
              style={styles.search}
              source={require('./assets/icons/search-icon2.png')}
            />
          </TouchableOpacity>
          
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              indicatorStyle={'black'}
              backgroundColor={'white'}
              marginTop={-5}
              height={75}
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
                <Text style={styles.label}>
                  All
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => this.catGrab('Girl')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/girls.jpg')}
                />
                <Text style={styles.label}>
                  Girls
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('health')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/health.jpg')}
                />
                <Text style={styles.label}>
                  Health
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Home')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/home.jpg')}
                />
                <Text style={styles.label}>
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Kindle')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/kindle.jpg')}
                />
                <Text style={styles.label}>
                  Kindle
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('men')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/men.jpg')}
                />
                <Text style={styles.label}>
                  Men
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Misc')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/misc.jpg')}
                />
                <Text style={styles.label}>
                  Misc
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('lawn')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/outdoors.jpg')}
                />
                <Text style={styles.labelShort}>
                  Outdoor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Shoes')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/shoes.jpg')}
                />
                <Text style={styles.label}>
                  Shoes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Sport')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/sports.jpg')}
                />
                <Text style={styles.label}>
                  Sports
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Sunglasses')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/sunglasses.jpg')}
                />
                <Text style={styles.labelShort}>
                  Sunglasses
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Toy')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/toys.jpg')}
                />
                <Text style={styles.label}>
                  Toys
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Travel')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/travel.jpg')}
                />
                <Text style={styles.label}>
                  Travel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Watches')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/watches.jpg')}
                />
                <Text style={styles.labelShort}>
                  Watches
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.catGrab('Women')}>
                <Image
                  style={styles.catbar}
                  source={require('./Assett/women.jpg')}
                />
                <Text style={styles.label}>
                  Women
                </Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Brands', {
                id: userID,
                points: userPoints,
              })}>
              
                <Image
                  style={styles.catbar}
                  source={require('./Assett/brands.jpg')}
                />
                <Text style={styles.label}>
                  Brands
                </Text>
              </TouchableOpacity> */}
            </ScrollView>
          </View>
          {/* <TouchableOpacity style={styles.footerItem} onPress={this.shareURL}>
            <Image style={styles.footerShare} resizeMode={"contain"} source={require('./sharebutton.png')} />
            <Text style={styles.footerShareText}>
              <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12, }}>
                Share{' '}
              </Text>
              to earn free points!
                  </Text>
          </TouchableOpacity> */}
          <TouchableOpacity disabled={true} style={styles.footerItem}>
            <Animatable.Image ref='animatedTextref' animation={animationz ? 'bounceInLeft' : 'fadeOut'} iterationCount='infinite' delay={300} duration={16000} easing='ease-in-out-back' style={styles.footerLikes} resizeMode={"contain"} source={{ uri: this.state.randomPROFILEIMAGEstring }}></Animatable.Image>
            <Animatable.Text ref='animatedTextref' animation={animationz ? 'bounceInLeft' : 'fadeOut'} iterationCount='infinite' delay={300} duration={16000} easing='ease-in-out-back' style={styles.footerLikeText} numberOfLines={2} ref={this.handleTextRef}>{this.state.UserStringLike}</Animatable.Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}  onPress={this.shareURL}>
           <Image style={styles.footerShare} resizeMode={"contain"} source={require('./sharebutton.png')} />
            <Text style={styles.footerShareText}>
              <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12, }}>
                Share{' '}
              </Text>
              to earn free points!
                  </Text>
                  
          </TouchableOpacity>
          
          <Image style={styles.footer} />

          <TouchableOpacity style={styles.footerItem}
          // onPress={() => this.props.navigation.navigate('Explore', {
          //   id: userID,
          //   points: userPoints,
          // })}
          >
            <Image style={styles.exploreBut} resizeMode={"contain"} source={require('./assets/menu/explore.png')}>

            </Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem}
            onPress={() => this.props.navigation.navigate('Likes', {
              id: userID,
              points: userPoints,
              uri: uri2,
            })}>
            <Image style={styles.likesBut} resizeMode={"contain"} source={require('./assets/menu/likes.png')}>

            </Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerRewards}
            onPress={() => this.props.navigation.navigate('Rewards', {
              id: userID,
              points: userPoints,
              uri: uri2,
            })}>
            <Image style={styles.rewardsBut} resizeMode={"contain"} source={require('./assets/menu/rewards.png')}>

            </Image>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerProfile}
            onPress={() => this.props.navigation.navigate('Shipping', {
              id: userID,
              points: userPoints,
              uri: uri2,
            })}>
            <Image style={styles.profileBut} resizeMode={"contain"} source={{ uri: uri2 }}>

            </Image>
          </TouchableOpacity>
        </View>
      );
    } catch (error) {
      console.error(error);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#F5FCFF',
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
    marginRight: 10,
    marginTop: -40,
    textAlign: 'right',
    fontSize: 15,
    color: '#f427f3',
    backgroundColor: 'transparent',
  },
  pointsText: {
    marginRight: 10,
    marginTop: -20,
    textAlign: 'right',
    fontSize: 15,
    color: '#863fba',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'transparent',
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
  button: {
    width: Dimensions.get('window').width,
    height: 30,
    marginTop: -35,
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
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
  search: {
    width: 25,
    height: 20,
    marginLeft: 10,
    marginTop: -30,
    backgroundColor: 'transparent',
    padding: 0,
  },

  bg: {
    height: 190,
    width: '100%',
    marginTop: -150,
    backgroundColor: '#dee6ee',
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
    marginBottom: -20,
    marginLeft: Dimensions.get('window').width / 4,
  },
  footerShareText: {
    height: 30,
    width: 200,
    bottom: 0,
    backgroundColor: 'transparent',
    marginBottom: 85,
    marginLeft: Dimensions.get('window').width / 2.8,
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
