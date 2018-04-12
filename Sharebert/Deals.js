import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
    AsyncStorage,
    Dimensions,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StyleSheet,
    Linking,
    Keyboard,
    Alert,
    FlatList,
    Share,
    Platform,
} from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import { Constants } from 'expo';
const backAction = NavigationActions.back({
    key: null
});
var userPoints = 0;
var userID = 0;
var uri2 = '';
var datafeed = [];
// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;
// const SCREEN_HEIGHT = width < height ? height : width;
const isSmallDevice = SCREEN_WIDTH <= 414;
const numColumns = isSmallDevice ? 2 : 3;
// item size
const PRODUCT_ITEM_HEIGHT = 175;
const PRODUCT_ITEM_OFFSET = 5;
const PRODUCT_ITEM_MARGIN = PRODUCT_ITEM_OFFSET * 2;
class Deals extends Component {
    constructor(props) {
        super(props);
        userID = this.props.navigation.state.params.id;
        userPoints = this.props.navigation.state.params.points;
        uri2 = this.props.navigation.state.params.uri;
        this.state = {
            inputValue: 'Search',
            trendinglist: [],
        }
        //https://biosystematic-addit.000webhostapp.com/Trending/Trending.php
        fetch('https://sharebert.com/feed/?post_type=deals')
            .then((response) => response.text())
            .then((responseData) => rssParser.parse(responseData))
            .then((rss) => {
                var data2 = [];
                console.log(rss.items.length);
                //console.log(rss.items[0]['description']);
                for (var i = 0; i < rss.items.length; i++) {
                    var obj = {};
                    obj['link'] = rss.items[i]['links'][0]['url'];
                    var linkfull = rss.items[i]['description'];
                    obj['link'] = linkfull.substr(linkfull.indexOf('<p>') + 3, linkfull.indexOf('</p>') - 3);
                    obj['title'] = rss.items[i].title;
                    obj['name'] = rss.items[i].title.substr(0, rss.items[i].title.indexOf('posted') - 1);
                    obj['title'] = rss.items[i].title.substr(rss.items[i].title.indexOf('posted') + 7);
                    console.log(obj.title);
                    data2.push(obj);
                }
                this.setState({
                    trendinglist: data2,
                })
            });


    }
    getNews() {
        var url = "https://sharebert.com/feed/?post_type=deals"
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                const doc = new DOMParser().parseFromString(responseText, "text/xml");
                var item = doc.getElementsByTagName('item');

                for (i = 0; i < item.length; i++) {

                    var title = item[i].getElementsByTagName('title');
                    console.log(title[0]);

                }

            })
            .catch((error) => {
                console.log('Error fetching the feed: ', error);
            });
    }
    _onPress(item) {
        try {
            Linking.openURL(item.link);
        } catch (error) {
            console.error(error);
        }
    }
    onSubmitEdit = () => {
        Keyboard.dismiss();
        this.props.navigation.navigate('Explore', {
            id: userID,
            points: userPoints,
            uri: uri2,
            search: this.state.inputValue
        })
    };

    _handleTextChange = inputValue => {
        this.setState({ inputValue });
    };


    showEmptyListView = () => {

        return(
            <View style={styles.card}>
      
                <Image
                  resizeMode="contain"
                  style={styles.imageload}
      
                  source={require('./assets/loading3.gif')}
                />
              </View>
            )
    };
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.dispatch(backAction);
                    }}>
                    <Image style={styles.header} />
                </TouchableOpacity>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.navigation.dispatch(backAction);
                    }}>
                    <Image
                        resizeMode='contain'
                        style={styles.hamburger}
                        source={require('./assets/arrow.png')}
                    />

                </TouchableWithoutFeedback>
                <Image
                    resizeMode="contain"
                    style={styles.button}
                    source={require('./Logo.png')}
                />
                <Text style={styles.title}>
                    Daily Deals
                </Text>
                <Image style={styles.footer} />

                <FlatList
                    style={{
                        marginTop: 0, marginBottom: 60,
                        paddingBottom: 30
                    }}
                    data={this.state.trendinglist}
                    ListEmptyComponent={this.showEmptyListView()}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, separators }) => (
                        <TouchableOpacity
                            onPress={() => this._onPress(item)}
                            onShowUnderlay={separators.highlight}
                            onHideUnderlay={separators.unhighlight}>
                            <View style={{ backgroundColor: 'white' }}>

                                <Text style={styles.text}>

                                    <Text style={{ fontWeight: 'bold', fontSize: 13 }}> {item.name} </Text>
                                    <Text >posted</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 13 }}> {item.title} </Text>

                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />



                <TouchableOpacity style={styles.footerItem}
                    onPress={() => this.props.navigation.navigate('Explore', {
                        id: userID,
                        points: userPoints,
                        uri: uri2,
                    })}>
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
    }
}
const colors = {
    snow: 'white',
    darkPurple: '#140034',
    placeholder: '#eee',
};

const styles = StyleSheet.create({
    container: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: 'white',
    },
    dividerTop:
        {
            width: Dimensions.get('window').width,
            height: 3,
            backgroundColor: '#dee6ee',
        },
    hamburger: {
        ...Platform.select({
            ios: {
                width: 30,
                height: 23,
                marginLeft: 10,
                marginTop: -32,
                backgroundColor: 'transparent',
                padding: 0,
            },
            android: {
                position: 'absolute',
                marginTop: 5,
                marginLeft: -5,
                height: 25,
                width: 70,
            },
        }),
    },

    title: {
        ...Platform.select({
            ios: {
                fontFamily: "Montserrat",
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#0d2754',
                marginTop: 20,
                marginBottom: 0,
                paddingBottom: 6,
                backgroundColor: 'white',
            },
            android: {
                fontFamily: "Montserrat",
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#0d2754',
                marginTop: 60,
                marginBottom: 0,
                paddingBottom: 6,
                backgroundColor: 'white',
            },
        }),
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 0,
    },
    listContainer: {
        flex: 1,
        padding: PRODUCT_ITEM_OFFSET,
    },
    itemImage: {
        width: (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
            PRODUCT_ITEM_MARGIN,
        height: 125,
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 3,
        width: (SCREEN_WIDTH - PRODUCT_ITEM_MARGIN) / numColumns -
            PRODUCT_ITEM_MARGIN,
        height: PRODUCT_ITEM_HEIGHT,
        flexDirection: 'column',
        backgroundColor: colors.snow,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },

    button: {
        ...Platform.select({
            ios: {
                width: 100,
                height: 70,
                marginTop: -45,
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
        marginLeft: 30,
        color: '#0d2754',
        backgroundColor: 'transparent',
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
    imageload: {
        width,
        marginLeft: Dimensions.get('window').width / 70,
        marginTop: Dimensions.get('window').height / 4.5,

        flex: 1,
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
    searchText: {
        width: Dimensions.get('window').width / 1.5,
        height: 44,
        padding: 8,
        marginTop: -40,
        marginLeft: 65,
    },
    search: {
        width: 20,
        height: 20,
        marginLeft: 45,
        marginTop: -30,
        backgroundColor: 'transparent',
        padding: 0,
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
});
export default Deals;
