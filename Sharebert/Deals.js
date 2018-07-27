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
    WebView,
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
    }

    showEmptyListView = () => {

        return (
            <View style={styles.card}>

                <Image
                    resizeMode="contain"
                    style={styles.imageload}

                    source={require('./assets/loading4.gif')}
                />
            </View>
        )
    };
    renderLoadingView() {
        return (

            <View style={styles.giveawaycenterview}>

                <Image
                    resizeMode="contain"
                    style={styles.imageload}
                    renderLoading={this.renderLoadingView} startInLoadingState={true}
                    source={require('./assets/loading4.gif')}
                />
            </View>
        );
    }
    render() {
        return (
            <View style={styles.container}>

                <Image style={styles.dividerTop} source={require('./assets/likesbg.png')} />
                <Image style={styles.header} />
                <Text style={styles.text2}>
                    {userPoints + '\n'}
                </Text>
                <Text style={styles.pointsText}>
                    Points
                </Text>
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
                <WebView
                    ref={'webview'}
                    source={{ uri: 'https://sharebert.com/shop/deals/' }}
                    style={{ marginTop: 15 }}
                    
                    onNavigationStateChange={(event) => {
                        if (event.url !== 'https://sharebert.com/shop/deals/') {
                            this.refs['webview'].stopLoading();
                            Linking.openURL(event.url);
                        }
                    }}
                />

            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...Platform.select({
            ios: {
                marginTop: Constants.statusBarHeight,
                backgroundColor: 'transparent',

            },
            android: {
                marginTop: Constants.statusBarHeight,
                backgroundColor: '#dee6ee',
            },
        }),

        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    imageload: {
        width: 128,
        height: 128,
        marginTop: Dimensions.get('window').width / 2,

    },
    giveawaycenterview: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
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
    text2: {
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
                height: 100,
                backgroundColor: 'transparent',

            },
        }),

    },
    text: {
        textAlign: 'left',
        fontSize: 12,
        marginTop: 40,
        marginLeft: 110,
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
