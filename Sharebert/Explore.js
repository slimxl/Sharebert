import React, { Component } from 'react';
import Swiper from 'react-native-deck-swiper'; // Version can be specified in package.json
import SideMenu from 'react-native-side-menu'; // Version can be specified in package.json
import Image2 from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import Menu from './Menu';
import {
  StyleSheet,
  AsyncStorage,
  Dimensions,
  Picker,
  View,
  FlatList,
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
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Constants } from 'expo';
const { width } = 10;
var userPoints = 0;
var userID = 0;
var toofast = false;
var datasize = 0;
var searchcount = 0;
var brand = '';
var search = false;
var likes = [];
var uri = '';
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
      <View style={styless.container}>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(this.props.navigation.navigate('Explore', {
              id: userID,
              points: userPoints,
            }));
          }}>

          <Image style={styless.header} />
          <Text style={styless.headertext}>
            Tap to Explore
              </Text>
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={styless.button}
          source={require('./Logo.png')}
        />
        <TouchableOpacity
          onPress={() => {
            //this.props.navigation.dispatch(backAction); //navigate to explore

            this.props.navigation.dispatch(this.props.navigation.navigate('Explore', {
              id: userID,
              points: userPoints,
            }));
          }}>
          <Image
            style={styless.hamburger}
            source={require('./purplemenuicon.png')}
          />
        </TouchableOpacity>

        <Text style={styless.title}>
          Things You Like
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
                <Text style={styless.text}>{item.Title}</Text>
                <Image
                  resizeMode={'contain'}
                  style={styless.image}
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
class Explore extends Component {
  constructor(props) {
    super(props);
    userID = this.props.navigation.state.params.id;
    userPoints = this.props.navigation.state.params.points;
    uri = this.props.navigation.state.params.uri;
    this.getOldLikes();
    this.state = {
      cards: ['1', '2', '3'],
      isOpen: false,
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

  }

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
    console.log(this.state.cardNum + 2 >= this.state.dataset.length);
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

  clearFile = async () => {
    try {
      await AsyncStorage.removeItem('@MySuperStore:name');
      await AsyncStorage.removeItem('@MySuperStore:email');
      await AsyncStorage.removeItem('@MySuperStore:uri2');
      await AsyncStorage.removeItem('@MySuperStore:points');
      await AsyncStorage.removeItem('@MySuperStore:id');

      this.props.navigation.navigate('LoginScreen', {
        loggedbool2: false,
        id: 0,
        points: 0,
      });
    } catch (error) {
      // Error saving data
    }
  }


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
        this.clearFile();

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
    Keyboard.dismiss();
    if (this.state.inputValue.toString() === '') {
      Alert.alert("Blank Search!");
      Keyboard.dismiss();
      return;
    }
    fetch(
      'https://sharebert.com/APISEARCH.php?keyword=' +
      this.state.inputValue.toString() +
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
            cardVerticalMargin={125}
            onTapCardDeadZone={100}
            renderCard={this.renderCard}
            onSwipedAll={this.onSwipedAllCards}
            showSecondCard={false}
            backgroundColor={'white'}
            marginTop={50}
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
          <TouchableOpacity onPress={this.shareApp}>
            <TouchableOpacity onPress={this.shareApp}>
              <Image
                resizeMode="contain"
                style={styles.button}
                source={require('./Logo.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isOpen: true,
              });
            }}>
            <Image
              style={styles.hamburger}
              source={require('./purplemenuicon.png')}
            />

          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.onSubmitEdit}
            style={{ flexDirection: 'row' }}>
            <Image
              style={styles.search}
              source={require('./assets/icons/search-icon2.png')}
            />
          </TouchableOpacity>
          <TextInput
            textAlign="left"
            onSubmitEditing={this.onSubmitEdit}
            value={this.state.inputValue}
            autoFocus={false}
            onFocus={() => {
              this.setState({
                inputValue: "",
              });
            }}
            onChangeText={this._handleTextChange}
            placeholderTextColor={'#4c515b'}
            style={{
              width: 120,
              height: 44,
              padding: 8,
              marginTop: -40,
              marginLeft: 215,
            }}
          />
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              indicatorStyle={'black'}
              backgroundColor={'white'}
              marginTop={-10}
              height={80}
            >
              {<TouchableOpacity onPress={() => this.props.navigation.navigate('Brands', {
                id: userID,
                points: userPoints,
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
              <TouchableOpacity onPress={() => this.catGrab('travel')}>
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

          <TouchableOpacity onPress={this.swipeRight}>
            <Image
              style={styles.button2}
            />
          </TouchableOpacity>

        </View>
      );
    } catch (error) {
      console.error(error);
    }
  }
}
var userPoints = 0;
var userID = 0;
var like;
var like2;


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
      <View style={rewards.container}>
        <Image style={rewards.header} />
        <Image
          resizeMode="contain"
          style={rewards.button}
          source={require('./Logo.png')}
        />
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(backAction);
          }}>
          <Image
            style={rewards.hamburger}
            source={require('./purplemenuicon.png')}
          />

        </TouchableOpacity>
        <Text style={rewards.title}>
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
                <Text style={rewards.text}>{item.Title}</Text>
                <Text style={rewards.text2}>{item.Cost} Points</Text>
                <Image
                  style={rewards.image}
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
var loggedin = 'Log Out'
var userID =  0;
var userPoints = 0;
var user = {};
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
    this.fetchData();
    this.state = {
      isOpen: false,
      selectedItem: 'Shipping',
      userPoints: userPoints,
      name: '',
      phone : '',
      email: '',
      address: '',
      state: '',
      city: '',
      stateIndex: '',
      zip: '',
      language: 0,
    };
    if(userID===0)
    {
      loggedin = 'Log In';
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
   if(userID !=0)
   {
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
             this.setState({
               name: user.Name,
               phone : user.Phone,
               email:  user.Email,
               address: user.Address,
               city: user.City,
               state: user.State,
               stateIndex:  user.StateIndex,
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
              +userID +'&'+
              'uname='+user.Name +'&'+
              'uem='+user.Email +'&'+
              'uadd='+user.Address +'&'+
              'ucit='+user.City +'&'+
              'ustate='+user.State +'&'+
              'upost='+user.Zip +'&'+
              'upho='+user.Phone +'&'+
              'uind='+user.StateIndex,
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
  
  goBack  = () =>{
     this.props.navigation.pop();
  };
  saveForm = () =>{
    if(this.state.email==='')
    {
      Alert.alert('No Email!','Try Again!');
      return;
    }
    if(userID != 0)
    {
    Alert.alert("User Data Confirmation",
    +userID + " \n"
    +user.Name +" \n"
    +user.Phone + " \n"
    +user.Email +" \n"
    +user.Address + " \n"
    +user.State + " \n"
    +user.Zip + " \n",
    [
    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    {text: 'OK', onPress: () => this.sendData()},
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

  clearLikes = async() =>{
    await AsyncStorage.removeItem('@MySuperStore:Likes'+userID);
    Alert.alert("Likes Cleared!");
    const value = await AsyncStorage.getItem('@MySuperStore:Likes'+userID);
    console.log('likes'+ value);
    this.forceUpdate();
  };

  render() {
    return (
        <View style={shipping.container}>
          <Image style={shipping.bg} />
          <TouchableOpacity>
            <TouchableOpacity onPress={this.shareApp}>
              <Image
                resizeMode="contain"
                style={shipping.button}
                source={require('./Logo.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={this.goBack}>
            <Image
              style={shipping.hamburger}
              source={require('./purplemenuicon.png')}
            />
          </TouchableOpacity>

          <ScrollView vertical={true}>
            <Text style={shipping.paragraph}>
              Name
            </Text>
            <TextInput
              textAlign="left"
              onSubmitEditing={this.onSubmitEdit}
              value={this.state.name}
              onChangeText={(text) => {
                user.Name = text;
                this.setState({name: text})}}
              placeholderTextColor={'#4c515b'}
              style={{
                fontSize: 20,
                backgroundColor: '#d9dbdd',
                width: Dimensions.get('window').width - 40,
                height: 44,
                padding: 8,
                marginTop: 0,
                marginLeft: 20,
              }}
            />
            <Text style={shipping.paragraph}>
              Phone
            </Text>
            <TextInput
              textAlign="left"
              onSubmitEditing={this.onSubmitEdit}
              value={this.state.phone}
              onChangeText={(text) => {
                user.Phone = text;
                this.setState({phone: text})}}
              placeholderTextColor={'#4c515b'}
              style={{
                fontSize: 20,
                backgroundColor: '#d9dbdd',
                width: Dimensions.get('window').width - 40,
                height: 44,
                padding: 8,
                marginTop: 0,
                marginLeft: 20,
              }}
            />
            <Text style={shipping.paragraph}>
              Email
            </Text>
            <TextInput
              textAlign="left"
              onSubmitEditing={this.onSubmitEdit}
              value={this.state.email}
              onChangeText={(text) => {
                user.Email = text;
                this.setState({email: text})}}
              placeholderTextColor={'#4c515b'}
              style={{
                fontSize: 20,
                backgroundColor: '#d9dbdd',
                width: Dimensions.get('window').width - 40,
                height: 44,
                padding: 8,
                marginTop: 0,
                marginLeft: 20,
              }}
            />
            <Text style={shipping.paragraph}>
              Address
            </Text>
            <TextInput
              textAlign="left"
              onSubmitEditing={this.onSubmitEdit}
              value={this.state.address}
              onChangeText={(text) => {
                user.Address = text;
                this.setState({address: text})}}
              placeholderTextColor={'#4c515b'}
              style={{
                fontSize: 20,
                backgroundColor: '#d9dbdd',
                width: Dimensions.get('window').width - 40,
                height: 44,
                padding: 8,
                marginTop: 0,
                marginLeft: 20,
              }}
            />
            <Text style={shipping.paragraph}>
              City
            </Text>
            <TextInput
              textAlign="left"
              onSubmitEditing={this.onSubmitEdit}
              value={this.state.city}
              onChangeText={(text) => {
                user.City = text;
                this.setState({city: text})}}
              placeholderTextColor={'#4c515b'}
              style={{
                fontSize: 20,
                backgroundColor: '#d9dbdd',
                width: Dimensions.get('window').width - 40,
                height: 44,
                padding: 8,
                marginTop: 0,
                marginLeft: 20,
              }}
            />
            <Text style={shipping.paragraph}>
              State
            </Text>
            <Picker
              style={{ marginTop: -25 }}
              selectedValue={this.state.state}
              onValueChange={(itemValue, itemIndex) =>
                {user['State'] = itemValue;
                user['StateIndex'] = itemIndex;
                this.setState({ state: itemValue })}}>
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

            <Text style={shipping.paragraph}>
              Postal Code
            </Text>
            <TextInput
              textAlign="left"
              onSubmitEditing={this.onSubmitEdit}
              value={this.state.zip}
              onChangeText={(text) => {
                user.Zip = text;
                this.setState({zip: text})}}
              placeholderTextColor={'#4c515b'}
              style={{
                fontSize: 20,
                backgroundColor: '#d9dbdd',
                width: Dimensions.get('window').width - 40,
                height: 44,
                padding: 8,
                marginTop: 0,
                marginLeft: 20,
              }}
            />
            <TouchableOpacity onPress={this.saveForm}>
            <Text style={shipping.paragraph2}>
              SAVE 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Linking.openURL('https://sharebert.com/privacy-policy/');}}>
            <Text style={shipping.paragraph2}>
              Privacy Policy 
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>{
            this.clearFile();
          }}>
            <Text style={shipping.paragraph2}>
              {loggedin}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={this.clearLikes}>
            <Text style={shipping.paragraph2}>
              Clear Likes 
            </Text>
          </TouchableOpacity>
            
          </ScrollView>
          
          <Text style={shipping.text}>
          We do not sell, trade, or otherwise share your personal information with any other company or agency. By submitting your information, you agree to have your name, address, phone number, and email stored on our secured servers.
          </Text>

        </View>
    );
  }
}

const shipping = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  button: {
    width: 100,
    height: 30,
    marginTop: -40,
    marginLeft: 50,
    backgroundColor: 'transparent',
    padding: 20,
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
  },
  image: {
    width,
    flex: 3,
  },
  hamburger: {
    width: 30,
    height: 23,
    marginLeft: 10,
    marginTop: -33,
    backgroundColor: 'transparent',
    padding: 0,
  },
  bg: {
    height: 190,
    width: '100%',
    marginTop: -150,
    backgroundColor: '#dee6ee',
  },
});

const rewards = StyleSheet.create({
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
    flex: 1,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#f2efef',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  icon: {
    width: 35,
    height: 30,
    backgroundColor: "transparent"
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
    width: 100,
    height: 30,
    marginTop: -35,
    marginLeft: 60,
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
  hamburger: {
    width: 30,
    height: 23,
    marginLeft: 10,
    marginTop: -33,
    backgroundColor: 'transparent',
    padding: 0,
  },
  search: {
    width: 20,
    height: 20,
    marginLeft: 185,
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

  footer: {
    height: 190,
    width: '100%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#dee6ee',
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
  tabBar: {
    backgroundColor: '#dee6ee',
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
const styless = StyleSheet.create({
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
  title: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff2eff',
    marginTop: -15,
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
      fontSize: 17,
      marginTop: -32,
      marginLeft: 130,
      backgroundColor: 'transparent',
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
export default TabNavigator({
  Likes: {
    screen: Likes,
    navigationOptions: ({ navigation }) => ({
      title: "Likes",
      tabBarIcon: () => (
        <Image
          source={require('./assets/footer/likes.png')}
          style={styles.icon}
        />
      )
    })
  },
  Explore: {
    screen: Explore,
    navigationOptions: ({ navigation }) => ({
      title: "Explore",
      tabBarIcon: () => (
        <Image
          source={require('./assets/footer/explore.png')}
          style={styles.icon}
        />
      )
    })
  },
  Rewards: {
    screen: Rewards,
    navigationOptions: ({ navigation }) => ({
      title: "Rewards",
      tabBarIcon: () => (
        <Image
          source={require('./assets/footer/rewards.png')}
          style={styles.icon}
        />
      )
    })
  },
  Shipping: {
    screen: Shipping,
    navigationOptions: ({ navigation }) => ({
      title: "Shipping",
      tabBarIcon: () => (
        <Image
          source={{uri:uri}}
          style={styles.icon}
        />
      )
    })
  },
},
  {
    tabBarOptions: {
      activeTintColor: '#ff2eff',

      style: styles.tabBar,
    }
  }
);
export { likes };

