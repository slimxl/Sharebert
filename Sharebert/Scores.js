import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
    AsyncStorage,
    Dimensions,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    StyleSheet,
    Linking,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    FlatList,
    Share,
    Platform,
} from 'react-native';

import { Constants } from 'expo';
const backAction = NavigationActions.back({
    key: null
});
var userPoints = 0;
var userID = 0;
var uri2 = '';
var score = 0;

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

class Scores extends Component {
    constructor(props) {
        super(props);
        userID = this.props.navigation.state.params.id;
        userPoints = this.props.navigation.state.params.points;
        uri2 = this.props.navigation.state.params.uri;
        likes = this.props.navigation.state.params.like;
        score = this.props.navigation.state.params.userScore;
        this.state = {
            inputValue: 'Search',
            trendinglist: [],
            userPoints: userPoints,
            trendData: [],
            frontTitle: '',
            HS: [],
        }
        this.getScores();
    }
    _renderItem = data => {
        const item = data.item;
        var imageURL2 = ""
        try {
            var scoretext = item.User + ": " + item.Score;
            return (
                <View style={styles.score}>
                    <Text numberOfLines={2} style={styles.text}>{scoretext}</Text>
                </View>
            );
        } catch (error) {

        }
    };
    updateData = (points) => {
        userPoints = points;
        this.setState({
            userPoints: userPoints,
        });
        //some other stuff
    };

    sendScore = () => {
        console.log("ID: " + userID);

        fetch(
            'https://sharebert.com/s/SetDailyScore.php?score=' + score +
            '&ui=' +
            +userID,
            { method: 'GET' }
        ).done();
        this.props.navigation.navigate('Explore', {
            id: userID,
            points: userPoints,
            uri: uri2,
          });
    };

    getScores = () => {
        fetch('https://sharebert.com/s/Checkscore.php', { method: 'GET' })
            .then(response => response.json())
            .then(responseData => {
                var data2 = []
                for (var i = 0; i < responseData.length; i++) {
                    var obj = {};

                    obj['User'] = responseData[i]['User_Name'];
                    obj['Score'] = responseData[i]['DailyScore'];
                    data2.push(obj);
                }
                //var reversed = data2.reverse(); 
                this.setState({
                    HS: data2,
                })
            })
            .done();
    }



    render() {
        return (
            <View style={styles.container}>

                <Image style={styles.dividerTop} source={require('./assets/likesbg.png')} />



                <Image
                    resizeMode="contain"
                    style={styles.button}
                    source={require('./assets/icons/logoicon.png')}
                />

                <Text style={styles.title}>
                    Daily Highscores
                </Text>




                <ImageBackground
                    source={require('./like_background.png')}
                    style={{ width: '100%', height: '100%' }}>
                    <Text style={styles.title2}>
                        My Score: {score}
                    </Text>
                    <View style={styles.likesviewscroll}>
                        <FlatList backgroundColor={'transparent'}
                            style={styles.likesviewscroll}
                            data={this.state.HS}
                            keyExtractor={(item, index) => index}
                            renderItem={this._renderItem}
                        />
                    </View>

                    <TouchableWithoutFeedback
                    onPress={() =>
                        this.sendScore()

                    }>
                        <View style={{
                        position: 'absolute',
                        bottom: 150,
                        left: Dimensions.get('window').width * .5 - 50,
                    }}>
                        <Text style={styles.title2}>
                            Send Score
                            </Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    onPress={() =>
                        this.props.navigation.push('Main', {
                            id: userID,
                            points: userPoints,
                            uri: uri2,
                        })
                    }>
                        <View style={{
                        position: 'absolute',
                        bottom: 100,
                        left: Dimensions.get('window').width * .5 - 50,
                    }}>
                        <Text style={styles.title2}>
                            Retry
                            </Text>
                    </View>
                </TouchableWithoutFeedback>

                </ImageBackground>
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
    text: {
        textAlign: 'center',
        fontSize: 30,
        backgroundColor: 'transparent',
    },
    text2: {
        width: 200,
        textAlign: 'center',
        fontSize: 30,
        backgroundColor: 'transparent',
    },
    text3: {
        width: 200,
        textAlign: 'center',
        marginTop: 150,
        fontSize: 30,
        marginLeft: Dimensions.get('window').width * .5 - 100,
        backgroundColor: 'transparent',
    },
    send: {
        marginTop: -120,
        marginLeft: Dimensions.get('window').width * .5 - 100,
        width: 200,
        backgroundColor: 'transparent',
    },
    retry: {
        marginTop: -160,
        marginLeft: Dimensions.get('window').width * .5 - 100,
        width: 200,
        backgroundColor: 'transparent',
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
    header: {
        ...Platform.select({
            ios: {
                marginTop: 0,
                width: '100%',
                height: 140,
                backgroundColor: 'transparent',
            },
            android: {
                position: 'absolute',
                marginTop: 0,
                width: '100%',
                height: 150,
                backgroundColor: 'transparent',
            },
        }),

    },
    score: {
        marginTop: 0,
        //marginLeft: Dimensions.get('window').width * .5,
        width: 400,
        backgroundColor: 'transparent',
    },
    likesviewscroll: {
        ...Platform.select({
            ios: {
                width: '100%',
                height: '80%',
            },
            android: {
                width: '100%',
                height: '80%',
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
                marginTop: 65,
                marginBottom: 0,
                paddingBottom: 6,
                backgroundColor: 'transparent',
            },
            android: {
                fontFamily: "MontserratLight",
                fontSize: 18,
                textAlign: 'center',
                color: 'white',
                marginTop: 65,
                marginBottom: 0,
                paddingBottom: 6,
                backgroundColor: 'transparent',
            },
        }),
    },
    title2: {
        fontFamily: "MontserratLight",
        fontSize: 30,
        textAlign: 'center',
        color: 'black',
        marginTop: 65,
        marginBottom: 0,
        paddingBottom: 6,
        backgroundColor: 'transparent',
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
    scrollview: {
        backgroundColor: 'rgba(242, 198, 242, 0.6)',
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.4,
        marginLeft: Dimensions.get('window').width * 0.1,
        marginTop: Dimensions.get('window').height * 0.1,
        marginBottom: Dimensions.get('window').height * 0.25,
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
});
export default Scores;
