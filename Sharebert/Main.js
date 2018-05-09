import { AppLoading } from 'expo';
import React from 'react';
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
    return this.state.assetsLoaded ? <Game /> : <AppLoading />;
  }
}
export default Main;