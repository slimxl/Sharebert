import React from 'react';
import {
  StyleSheet, View, Text, Alert,
  TouchableWithoutFeedback, Image, Platform, Dimensions, FlatList, ScrollView
} from 'react-native';
import { Constants } from 'expo';
import { NavigationActions } from 'react-navigation';
import Files from './Files';
import * as THREE from 'three'; // 0.88.0
import Expo from 'expo';
import { Group, Node, Sprite, SpriteView } from '../GameKit';

const SPEED = 1.6;
const GRAVITY = 1100;
const FLAP = 320;
const SPAWN_RATE = 2600;
const SPAWN_RATE_COIN = 3000;
const OPENING = 350;
const GROUND_HEIGHT = 112;
const MAXJUMPS = 1;

const PIPEWIDTH = 25;
const PIPEHEIGHT_MAX = 100;
const PIPEHEIGHT_MIN = 25

var doublejumpint = 0;
var userID;
var userPoints;
var uri2;

var ScoreSend = false;
var retry = false;
var showScores = false;

export default class Game extends React.Component {
  constructor(){
    super();
    console.disableYellowBox = true;
  }
  scale = 1;
  pipes = new Group();
  coins = new Group();
  deadCoins = [];
  deadPipeTops = [];
  deadPipeBottoms = [];

  gameStarted = false;
  gameOver = false;
  velocity = 0;
  
  state = {
    score: 'Get Ready!',
    HS: [],
  };
  
  componentWillMount() {
    THREE.suppressExpoWarnings(true);
    /// Audio is currently broken in snack :/
    this.setupAudio();
  }

  setupAudio = async () => {
    /* @(Evan Bacon)
      Here we define how audio should work in our app.
    */
    Expo.Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    /* @(Evan Bacon)
      Now we parse the preloaded audio assets and create a helper object for playing sounds.
    */
    this.audio = {};
    Object.keys(Files.audio).map(async key => {
      const res = Files.audio[key];
      const { sound } = await Expo.Audio.Sound.create(res);
      await sound.setStatusAsync({
        volume: 1,
      });
      this.audio[key] = async () => {
        try {
          await sound.setPositionAsync(0);
          await sound.playAsync();
        } catch (error) {
          console.warn('sound error', { error });
          // An error occurred!
        }
      };
    });
  };

  /// Sprites
  setupPlayer = async () => {
    const size = {
      width: 26 * this.scale,
      height: 26 * this.scale,
    };

    /* @(Evan Bacon)
      This is where we define the properties of our sprite sheet.
      We have an image that is 108x26, and this image has 3 birds on it.
      We divide the width by the number of sprites and in our case this gives us 36x26.
      Notice that we also define how many sprites there are vertically, horizontally, and in total.
      Finally we define the duration of each sprite frame.
    */
    const sprite = new Sprite();
    await sprite.setup({
      image: Files.sprites.bird,
      tilesHoriz: 3,
      tilesVert: 1,
      numTiles: 3,
      tileDispDuration: 75,
      size,
    });

    this.player = new Node({
      sprite,
    });
    this.scene.add(this.player);

    console.log(this.props.state.id);
  };

  setupGround = async () => {
    const { scene } = this;
    const size = {
      width: scene.size.width,
      height: scene.size.width * 0.333333333,
    };
    this.groundNode = new Group();

    /* @(Evan Bacon)
      Notice that we build two copies of the ground.
      This is because texture wrapping isn't supported yet (Canvas is required)
      Once one floor goes off screen we place it to the back and that creates our floor loop!
    */
    const node = await this.setupStaticNode({
      image: Files.sprites.ground,
      size,
      name: 'ground',
    });

    const nodeB = await this.setupStaticNode({
      image: Files.sprites.ground,
      size,
      name: 'ground',
    });
    nodeB.x = size.width;

    this.groundNode.add(node);
    this.groundNode.add(nodeB);

    this.groundNode.position.y =
      (scene.size.height + (size.height - GROUND_HEIGHT)) * -0.5;

    this.groundNode.top = this.groundNode.position.y + size.height / 2;

    this.groundNode.position.z = 0.01;
    scene.add(this.groundNode);
  };

  setupBackground = async () => {
    const { scene } = this;
    const { size } = scene;
    const bg = await this.setupStaticNode({
      image: Files.sprites.bg,
      size,
      name: 'bg',
    });

    scene.add(bg);
  };

  setupPipe = async ({ key, y }) => {
    const size = { width: PIPEWIDTH, height: Math.floor(Math.random() * PIPEHEIGHT_MAX + 1) + PIPEHEIGHT_MIN };

    const tbs = {
      top: Files.sprites.pipe_top,
      bottom: Files.sprites.pipe_bottom,
    };
    const pipe = await this.setupStaticNode({
      image: tbs[key],
      size,
      name: key,
    });
    pipe.y = y;

    return pipe;
  };

  setupCoin = async ({ key, y }) => {
    const size = { width: 25, height: 25 };

    const tbs1 = {
      top: Files.sprites.coin,
      bottom: Files.sprites.coin,
    };
    const coin = await this.setupStaticNode({
      image: tbs1[key],
      size,
      name: key,
    });
    coin.y = y;

    return coin;
  };

  setupStaticNode = async ({ image, size, name, scale }) => {
    scale = scale || this.scale;
    // @(Evan Bacon): Initialize empty sprite element
    const sprite = new Sprite();

    // @(Evan Bacon): Setup static sprite
    await sprite.setup({
      image,
      size: {
        width: size.width * scale,
        height: size.height * scale,
      },
    });

    // @(Evan Bacon): Build node with sprite
    const node = new Node({
      sprite,
    });
    node.name = name;
    return node;
  };

  spawnCoin = async (openPos) => {
    
    let coinY = Math.floor(Math.random() * -49) -50  //INSERT RANDOM NUMBER HERE

    console.log(coinY);
    let coinKey = 'bottom';
    let coin;

    const end = this.scene.bounds.right + 26;
    if (this.deadCoins.length > 0 && coinKey === 'top') {
      coin = this.deadCoins.pop().revive();
      coin.reset(end, coinY);
    } else if (this.deadCoins.length > 0 && coinKey === 'bottom') {
      coin = this.deadCoins.pop().revive();
      coin.reset(end, coinY);
    } else {
      coin = await this.setupCoin({
        scene: this.scene,
        y: coinY,
        key: coinKey,
      });
      coin.x = end;

      this.coins.add(coin);
    }
    coin.velocity = -SPEED;
    return coin;
  };

  spawnCoins = () => {
    this.coins.forEachAlive(coin => {
      //@(Evan Bacon) If any pipes are off screen then we want to flag them as "dead" so we can recycle them!
      if (coin.size && coin.x + coin.size.width < this.scene.bounds.left) {
        if (coin.name === 'top') {
          this.deadCoins.push(coin.kill());
        }
        if (coin.name === 'bottom') {
          this.deadCoins.push(coin.kill());
        }
      }
    });

    //@(Evan Bacon) Get a random spot for the center of the two pipes.

    const coinY =
      this.scene.size.height * .5;
    //this.scene.size.height 
    //  2 +
    //(Math.random() - 0.5) * this.scene.size.height * 0.2;
    //@(Evan Bacon) Spawn both pipes around this point.
    //this.spawnPipe(pipeY);
    this.spawnCoin(coinY);
  };

  spawnPipe = async (openPos, flipped) => {
    let pipeY;
    if (flipped) {
      pipeY = Math.floor(openPos - OPENING / 2 - 320);
    } else {
      pipeY = Math.floor(openPos + OPENING / 2);
    }
    let pipeKey = flipped ? 'bottom' : 'top';
    let pipe;

    const end = this.scene.bounds.right + 26;
    if (this.deadPipeTops.length > 0 && pipeKey === 'top') {
      pipe = this.deadPipeTops.pop().revive();
      pipe.reset(end, pipeY);
    } else if (this.deadPipeBottoms.length > 0 && pipeKey === 'bottom') {
      pipe = this.deadPipeBottoms.pop().revive();
      pipe.reset(end, pipeY);
    } else {
      pipe = await this.setupPipe({
        scene: this.scene,
        y: pipeY,
        key: pipeKey,
      });
      pipe.x = end;

      this.pipes.add(pipe);
    }
    pipe.velocity = -SPEED;
    return pipe;
  };

  spawnPipes = () => {
    this.pipes.forEachAlive(pipe => {
      //@(Evan Bacon) If any pipes are off screen then we want to flag them as "dead" so we can recycle them!
      if (pipe.size && pipe.x + pipe.size.width < this.scene.bounds.left) {
        if (pipe.name === 'top') {
          this.deadPipeTops.push(pipe.kill());
        }
        if (pipe.name === 'bottom') {
          this.deadPipeBottoms.push(pipe.kill());
        }
      }
    });

    //@(Evan Bacon) Get a random spot for the center of the two pipes.
    const pipeY =
      this.scene.size.height * .7;
    // 2 +
    //(Math.random() - 0.5) * this.scene.size.height * 0.2;
    //@(Evan Bacon) Spawn both pipes around this point.
    //this.spawnPipe(pipeY);
    this.spawnPipe(pipeY, true);
  };

  resetJump = () => {
    doublejumpint = 0;
  }
  tap = () => {
    // @(Evan Bacon) on the first tap we start the game
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.setState({
        score: 0,
      })
      // @(Evan Bacon) here we build a timer to spawn pipes
      this.pillarInterval = setInterval(this.spawnPipes, SPAWN_RATE);
      this.pillarInterval2 = setInterval(this.spawnCoins, SPAWN_RATE_COIN);
    }

    if (!this.gameOver) {
      // @(Evan Bacon) These are in-game taps for making the bird flap

      if (doublejumpint < MAXJUMPS) {
        this.velocity = FLAP;
        doublejumpint += 1;
      }

      //this.audio.wing();
    } else {
      // @(Evan Bacon) This is an end-game tap to reset the game
      // fetch(
      //   'https://sharebert.com/s/DBAwardPoints.php?uid=' +
      //   '2417' +
      //   '&type=2',
      //   { method: 'GET' }
      // )
      //   .then(response2 => response2.json())
      //   .then(responseData2 => {
      //       Alert.alert('You earned 5 points!', "Keep swiping to earn more!");

      //       userPoints = responseData2['Points'];
      //   })
      //   .done();

      //if (!ScoreSend && retry) {
      //  this.reset();
      //}
      //if (ScoreSend) {
      //  this.sendScore();


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
      showScores = true;
    }
  };

  //@(Evan Bacon) Update the state with the new score so our React component knows to update... Then play cool noise!
  addScore = () => {
    this.setState({ score: this.state.score + 1 });
    //this.audio.point();
  };

  //@(Evan Bacon) stop the pipe spawning and play that fresh slapping sound.
  setGameOver = () => {
    this.gameOver = true;
    clearInterval(this.pillarInterval);
    clearInterval(this.pillarInterval2);

    //this.audio.hit();
  };

  //@(Evan Bacon) This is the clean state before each game.
  reset = () => {
    this.gameStarted = false;
    this.gameOver = false;
    this.resetJump();
    this.setState({ score: 'Get Ready!' });
    showScores = false;
    reset = false;
    sendScore = false;

    this.player.reset(this.scene.size.width * -0.3, 0);
    this.player.angle = 0;
    this.pipes.removeAll();
    this.coins.removeAll();
  };

  onSetup = async ({ scene }) => {
    this.scene = scene;
    this.scene.add(this.coins);
    this.scene.add(this.pipes);
    await this.setupBackground();
    await this.setupGround();
    await this.setupPlayer();

    this.reset();
  };

  sendScore = () => {
    fetch(
      'https://sharebert.com/s/SetDailyScore.php?score=' + this.state.score +
      '&ui=' +
      +this.props.state.params.id,
      { method: 'GET' }
    ).done();
  };

  updateGame = delta => {
    if (this.gameStarted) {

      const target = this.groundNode.top + 20; //offset so its just above the ground

      if (this.player.y > target) {
        this.velocity -= GRAVITY * delta;
      }

      if (!this.gameOver) {
        const playerBox = new THREE.Box3().setFromObject(this.player);

        //@(Evan Bacon) Here we iterate over all of the active pipes and move them to the left.
        this.pipes.forEachAlive(pipe => {
          pipe.x += pipe.velocity;
          const pipeBox = new THREE.Box3().setFromObject(pipe);

          //@(Evan Bacon) We check if the user collided with any of the pipes.
          if (pipeBox.intersectsBox(playerBox)) {
            this.setGameOver();
          }

          //@(Evan Bacon) We check to see if a user has passed a pipe, if so then we update the score!
          if (
            pipe.name === 'bottom' &&
            !pipe.passed &&
            pipe.x < this.player.x
          ) {
            pipe.passed = true;
            this.addScore();
          }
        });

        this.coins.forEachAlive(coin => {
          coin.x += coin.velocity;
          const coinBox = new THREE.Box3().setFromObject(coin);

          //@(Evan Bacon) We check if the user collided with any of the pipes.
          if (coinBox.intersectsBox(playerBox)) {
            //this.setGameOver();
            if (!coin.passed) {
              this.addScore();
              coin.passed = true;
              coin.kill();
            }
          }
        });


        //@(Evan Bacon) Here we set the player rotation (in radians). Notice how we clamp it with min/max.
        // if (this.player.y >= target) {
        //   this.player.angle = Math.min(
        //     Math.PI / 4,
        //     Math.max(-Math.PI / 2, (FLAP + this.velocity) / FLAP)
        //   );
        //   this.player.update(delta);
        // }

        this.player.update(delta);
        //@(Evan Bacon) Check to see if the user's y position is lower than the floor, if so then we end the game.
        // if (this.player.y <= target) {
        //   this.setGameOver();
        // }
        //@(Evan Bacon) Update the player sprite animation.

      }

      //@(Evan Bacon) If the game is over than let the player continue to fall until they hit the floor.
      if (this.player.y <= target) {
        //this.player.angle = -Math.PI / 2;
        this.player.y = target;
        this.resetJump();
      }

      // this.velocity = 0;

      this.player.y += this.velocity * delta;

    } else {
      //@(Evan Bacon) This is the dope bobbing bird animation before we start. Notice the cool use of Math.cos
      this.player.update(delta);
      this.player.y = 8 * Math.cos(Date.now() / 200);
      this.player.angle = 0;

    }

    //@(Evan Bacon) This is where we do the floor looping animation
    if (!this.gameOver) {
      this.groundNode.children.map((node, index) => {
        node.x -= SPEED;
        //@(Evan Bacon) If the floor component is off screen then get the next item and move it behind that.
        if (node.x < this.scene.size.width * -1) {
          let nextIndex = index + 1;
          if (nextIndex === this.groundNode.children.length) {
            nextIndex = 0;
          }
          const nextNode = this.groundNode.children[nextIndex];
          node.x = nextNode.x + this.scene.size.width - 1.55;
        }
      });
    }

  };


  renderScore = () => (
    <Text
      style={{
        textAlign: 'center',
        fontSize: 64,
        position: 'absolute',
        left: 0,
        right: 0,
        color: '#f427f3',
        top: 64,
        backgroundColor: 'transparent',
      }}>
      {this.state.score}
    </Text>
  );

  render() {
    //@(Evan Bacon) This is a dope SpriteView based on SpriteKit that surfaces touches, render, and setup!
    return (
      <View style={styles.container}>
        <SpriteView
          touchDown={() => this.tap()}
          touchMoved={() => { }}
          touchUp={() => { }}
          update={this.updateGame}
          onSetup={this.onSetup}
        />
        {this.renderScore()}
        <TouchableWithoutFeedback
          onPress={() => {
            clearInterval(this.pillarInterval);
            clearInterval(this.pillarInterval2);
            this.props.goBack();
          }}>
          <Image
            style={styles.hamburger}
            resizeMode='contain'
            source={require('../assets/arrow_w.png')}
          />
        </TouchableWithoutFeedback>
        {(showScores == true) ?
          <View>
            <Text style = {styles.text3}>
            Daily Scores
            </Text>
          <ScrollView style = {styles.scrollview}>
          <FlatList backgroundColor={'transparent'}
            style={styles.likesviewscroll}
            data={this.state.HS}
            keyExtractor={(item, index) => index}
            renderItem={this._renderItem}
          />
          </ScrollView>
          </View>
          :
          <View>
          </View>
        }

        {(this.gameOver == true)
          ?
          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.sendScore();
              }}>
              <View style = {styles.send}>
              <Text
                style={styles.text2}>
                Send Score
            </Text>
            </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.reset();
              }}>
              <View style = {styles.retry}>
              <Text
                style={styles.text2}>
                Retry
            </Text>
            </View>
            </TouchableWithoutFeedback>
          </View>
          :
          <View>
          </View>
        }
      </View>
    );
  }

  _renderItem = data => {
    const item = data.item;
    var imageURL2 = ""
    try {
      var scoretext = item.User + ": " + item.Score;
      return (
        <View style = {styles.score}>
          <Text numberOfLines={2} style={styles.text}>{scoretext}</Text>
        </View>
      );
    } catch (error) {

    }
  };
}
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
    width: 400,
    textAlign: 'left',
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
    marginLeft: Dimensions.get('window').width * .5-100,
    backgroundColor: 'transparent',
  },
  send: {
    marginTop: -120,
    marginLeft: Dimensions.get('window').width * .5-100,
    width: 200,
    backgroundColor: 'transparent',
  },
  retry: {
    marginTop: -160,
    marginLeft: Dimensions.get('window').width * .5-100,
    width: 200,
    backgroundColor: 'transparent',
  },
  score: {
    marginTop: 0,
    marginLeft: Dimensions.get('window').width * .5-135,
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