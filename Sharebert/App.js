import React from 'react';
import { StackNavigator,NavigationActions } from 'react-navigation'; // 1.0.3
import Explore from './Explore';
import LoginScreen from './LoginScreen';
import Shipping from './Shipping';
import Rewards from './Rewards';
import Likes from './Likes';
import Brands from './Brands';
import Travel from './Travel';
import Search from './Search';
import Deals from './Deals';
import Grocery from './Grocery';
import Scores from './Scores';
import Game from './game/Game';
import Main from './Main';

var notif = false;
export default class App extends React.Component {
  constructor(props)
  {
    super(props);
    console.log(props.exp.notification)
    if(props.exp.notification!==undefined)
    {
      notif = true;
    }
   
  }
  render() {
    
    return <AppNavigator screenProps={notif}/>;
  }
}

const AppNavigator = StackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
      screenProps: {a: true },
      navigationOptions: ({ navigation }) => ({
        header: false,
        gesturesEnabled: false,
      }),
    },
    Shipping: {
      screen: Shipping,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },

    Rewards: {
      screen: Rewards,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },

    Likes: {
      screen: Likes,
      navigationOptions: ({ navigation }) => ({
        header: false,
        gesturesEnabled: false,
      }),
    },

    Brands: {
      screen: Brands,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Travel: {
      screen: Travel,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Grocery: {
      screen: Grocery,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Search: {
      screen: Search,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Deals: {
      screen: Deals,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Scores: {
      screen: Scores,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Main: {
      screen: Main,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Game: {
      screen: Game,
      navigationOptions: ({ navigation }) => ({
        header: true,
        gesturesEnabled: true,
      }),
    },
    Explore: {
      screen: Explore,
      navigationOptions: ({ navigation }) => ({
        header: false,
        gesturesEnabled: false,
      }),
    },
  },
  { headerMode: 'screen' }
);
