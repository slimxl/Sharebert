import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation'
import {
    AsyncStorage,
    Dimensions,
    View,
    Text,
    TextInput,
    TouchableOpacity,
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

class Search extends Component {
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

        fetch(
            'https://biosystematic-addit.000webhostapp.com/Trending/Trending.php',
            { method: 'GET' }
        )
            .then(response => response.json())
            .then(responseData => {
                var data2 = [];
                var count = responseData[0][0];
                console.log(count);
                for (var i = 0; i < count; i++) {
                    var obj = {};
                    obj['id'] = responseData[i]['id'];
                    obj['Term'] = responseData[i]['Term'];
                    data2.push(obj);
                }
                this.setState({
                    trendinglist: data2,
                });
                console.log(this.state.trendinglist);
            })
            .done();


    }
    _onPress(item) {
        this.props.navigation.navigate('Explore', {
            id: userID,
            points: userPoints,
            uri: uri2,
            search: item.Term,
        })
    }
    onSubmitEdit = () => {
        Keyboard.dismiss();
        if (this.state.inputValue === '' || this.state.inputValue === null) {
            Alert.alert("Empty Search! Try again!")
            return;
        }
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
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity>
                    <Image style={styles.header} />
                </TouchableOpacity>

                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.navigation.navigate('Explore', {
                            id: userID,
                            points: userPoints,
                            uri: uri2,
                        })
                    }}>
                    <Image
                        style={styles.hamburger}
                        resizeMode='contain'
                        source={require('./assets/arrow.png')}
                    />

                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    onPress={() => this.onSubmitEdit()}
                    style={{ flexDirection: 'row' }}>
                    <Image
                        style={styles.search}
                        source={require('./assets/icons/search-icon2.png')}
                    />
                </TouchableWithoutFeedback>
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
                    style={styles.searchText}
                />
                <Text style={styles.title}>
                    Trending
                </Text>
                <Image style={styles.footer} />

                <FlatList
                    style={{
                        marginTop: 15, marginBottom: 60,
                        paddingBottom: 30
                    }}
                    data={this.state.trendinglist}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, separators }) => (
                        <TouchableOpacity
                            onPress={() => this._onPress(item)}
                            onShowUnderlay={separators.highlight}
                            onHideUnderlay={separators.unhighlight}>
                            <View style={{ backgroundColor: 'white' }}>
                                <Text style={styles.text}>{item.Term}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

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
    hamburger: {
        ...Platform.select({
            ios: {
                width: 30,
                height: 20,
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
                textAlign: 'left',
                marginLeft: 30,
                color: '#0d2754',
                marginTop: 25,
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
        marginLeft: 30,
        marginBottom: 30,
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
        ...Platform.select({
            ios: {
                width: Dimensions.get('window').width / 1.5,
                height: 44,
                padding: 8,
                marginTop: -30,
                marginLeft: 70,
            },
            android: {
              position: 'absolute',
              height: 44,
              width: Dimensions.get('window').width-95,
              marginLeft: 90,
              textDecorationLine: "none",
              
            },
          }),
        
    },
    search: {
        ...Platform.select({
            ios: {
                width: 20,
                height: 20,
                marginLeft: 50,
                marginTop: -20,
                backgroundColor: 'transparent',
                padding: 0,
            },
            android: {
                position: 'absolute',
                marginTop: 10,
                marginLeft: 60,
                height: 20,
                width: 20,
              },
          }),
 
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
export default Search;
