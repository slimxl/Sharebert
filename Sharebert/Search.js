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
var refresh = false;
var likes = [];

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
        _flatList = null,
            userID = this.props.navigation.state.params.id;
        userPoints = this.props.navigation.state.params.points;
        uri2 = this.props.navigation.state.params.uri;
        likes = this.props.navigation.state.params.like;
        this.state = {
            inputValue: 'Search',
            trendinglist: [],
            userPoints: userPoints,
            trendData: [],
            frontTitle: '',
        }
        //https://biosystematic-addit.000webhostapp.com/Trending/Trending.php
        this.grabFrontPage();
        fetch(
            'https://sharebert.com/s/Trending.php',
            { method: 'GET' }
        )
            .then(response => response.json())
            .then(responseData => {
                var data2 = [];
                var count = responseData.length;

                console.log(responseData.length);
                for (var i = 0; i < responseData.length; i++) {
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


        // this._setFlatList = flatList => {
        //     this._flatList = flatList;
        //     console.log(flatList + "This is the ref passed in");
        //     console.log(this._flatList + "This is the saved reference");
        //   };

        this.showBars = () => {
            //console.log(this._flatList + "This is the ref being used");
            if (this.refs.flatlist) {
                this.refs.flatlist.flashScrollIndicators();
            }
        }

        setInterval(this.showBars, 300);

    }

    _renderItem = data => {
        const item = data.item;
        return (
            <View style={styles.item}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.goBack();
                    this.props.navigation.state.params.goSearch(item.term);

                }}>
                    {!item.image_url
                        ? <View style={styles.itemImage}>
                            <Text>No image</Text>
                        </View>
                        :
                        <View>

                            <Image
                                source={{
                                    uri: item.image_url
                                }}
                                resizeMode={'cover'}
                                resizeMethod={'resize'}
                                backgroundColor='transparent'
                                style={styles.itemImage}
                            />
                            <Text style={{
                                textAlign: 'center',
                            }}>
                                {item.term}
                            </Text>
                        </View>
                    }
                </TouchableOpacity>

                <Text numberOfLines={3} style={styles.itemTitle}>
                    {item.title}
                </Text>
            </View>
        );
    };
    updateData = (points) => {
        userPoints = points;
        this.setState({
            userPoints: userPoints,
        });
        //some other stuff
    };
    _onPress(item) {
        console.log('RESET>?');
        this.props.navigation.goBack();
        this.props.navigation.state.params.goSearch(item.term);
    }
    resetTo(route) {
        //console.log(likes);
        this.props.navigation.navigate(route, {
            id: userID,
            points: userPoints,
            uri: uri2,
            like: likes,
            updateData: this.updateData,
            goSearch: this.goSearch,
            clearLikes: this.clearLikes,
            saveLikesto: this.saveLikesto,

        })
    }

    onSubmitEdit = () => {
        Keyboard.dismiss();
        if (this.state.inputValue === '' || this.state.inputValue === null) {
            Alert.alert("Empty Search! Try again!")
            return;
        }
        this.props.navigation.goBack();
        this.props.navigation.state.params.goSearch(this.state.inputValue);
    };

    _handleTextChange = inputValue => {
        this.setState({ inputValue });
    };

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
                console.log(this.state.trendData);
            })
            .done();
    }

    render() {
        return (
            <View style={styles.container}>

                <Image
                    source={require('./assets/searchheader.png')}
                    style={styles.header} />


                <TouchableWithoutFeedback
                    onPress={() => {
                        // this.props.navigation.navigate('Explore', {
                        //     id: userID,
                        //     points: userPoints,
                        //     uri: uri2,
                        // })
                        this.props.navigation.goBack();
                        this.props.navigation.state.params.updateData(userPoints);
                    }}>
                    <Image
                        style={styles.hamburger}
                        resizeMode='contain'
                        source={require('./assets/arrow_w.png')}
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
                    underlineColorAndroid={'transparent'}
                    onFocus={() => {
                        this.setState({
                            inputValue: "",
                        });
                    }}

                    selectionColor='white'
                    onChangeText={this._handleTextChange}
                    placeholderTextColor='white'
                    style={styles.searchText}
                />
                {/* <Text style={styles.title}>
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
                /> */}


                <View style={styles.TrendText2}>
                    <Image style={{ width: Dimensions.get('window').width, height: 50, marginTop: 5, marginBottom: -110 }} resizeMode={"contain"} source={require('./assets/title_header.png')} />
                    <Text style={styles.TrendText}>{this.state.frontTitle}</Text>
                </View>



                <FlatList
                    //ref={this._setFlatList}
                    ref='flatlist'
                    showsVerticalScrollIndicator={true}
                    style={{
                        marginTop: -55, marginBottom: 60,
                        paddingBottom: 30
                    }}

                    data={this.state.trendData}
                    keyExtractor={(item, index) => index}
                    renderItem={this._renderItem}
                    getItemLayout={this._getItemLayout}
                    numColumns={numColumns}
                />

                <View style={styles.footer}>
                    <Image style={styles.footer} />

                    <TouchableWithoutFeedback style={styles.footerItem}
                        // onPress={() => this.props.navigation.navigate('Explore', {
                        //   id: userID,
                        //   points: userPoints,
                        // })}
                        onPress={() => {
                            this.props.navigation.goBack();
                            this.props.navigation.state.params.updateData(userPoints);
                        }}

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
                marginTop: 8,
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
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        borderRadius: 5,
        borderColor: 'transparent',
        marginBottom: 0,


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
    TrendText2:
    {
        marginTop: 10,
        marginBottom: '30%',
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
    footer: {
        height: 40,
        width: '100%',
        position: "absolute",
        bottom: 0,
        backgroundColor: '#1288f5',
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
                fontSize: 30,
                color:'white',

            },
            android: {
                position: 'absolute',
                height: 44,
                width: Dimensions.get('window').width - 120,
                marginLeft: 90,
                textDecorationLine: "none",
                fontSize: 30,
                color:'white',

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
export default Search;
