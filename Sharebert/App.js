import React from 'react';
import { StackNavigator,NavigationActions } from 'react-navigation'; // 1.0.3
import Explore from './Explore';
import LoginScreen from './LoginScreen';
import Shipping from './Shipping';
import Rewards from './Rewards';
import Likes from './Likes';
import Brands from './Brands';
export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const AppNavigator = StackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
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
        header: true,
        gesturesEnabled: true,
      }),
    },

    Brands: {
      screen: Brands,
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
