import { AppLoading } from 'expo';
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import arrayFromObject from './game/arrayFromObject';
import cacheAssetsAsync from './game/cacheAssetsAsync';
import Files from './game/Files';
import Game from './game/Game';

/* @(Evan Bacon)
  This is the base class. 
  Here we preload the assets and present the Game.
*/

class Main extends React.Component {
  state = { assetsLoaded: false };

  componentWillMount() {
    this.loadAssetsAsync();
  }

  loadAssetsAsync = async () => {
    try {
      await cacheAssetsAsync({
        files: arrayFromObject(Files),
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: app.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ assetsLoaded: true });
    }
  };

  render() {
    if (this.state.assetsLoaded) {
      return (
          <Game {...this.props.navigation} />
      );
    }
    else {
      return (
        <AppLoading />
      );
    }
  }
}
const styles = StyleSheet.create({
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
export default Main;