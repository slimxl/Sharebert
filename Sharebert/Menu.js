import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Alert,
} from 'react-native';

import { name2 } from './LoginScreen';
import { uri2 } from './LoginScreen';
const window = Dimensions.get('window');
var logged = 'Log In';
var uri = uri2;
var name = name2;
const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#f427f3',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 17,
    fontWeight: '300',
    paddingTop: 10,
  },
});

export default function Menu({ onItemSelected }) {
  uri = uri2;
  name = name2;
  if(name != 'Not Logged In')
  {
    logged = 'Log Out';
  }
  else
  {
    logged = "Log In";
  }
  return (
    <ScrollView scrollsToTop={false} style={styles.menu}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri }} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <Text onPress={() => onItemSelected('Explore')} style={styles.item}>
        Explore
      </Text>

      <Text onPress={() => onItemSelected('Likes')} style={styles.item}>
        Likes
      </Text>

      <Text onPress={() => onItemSelected('Rewards')} style={styles.item}>
        Rewards
      </Text>

      <Text onPress={() => onItemSelected('Shipping')} style={styles.item}>
        Prize Profile
      </Text>

      <Text
        onPress={() => onItemSelected('Privacy Policies')}
        style={styles.item}>
        Privacy Policies
      </Text>

       <Text
        onPress={() => onItemSelected('Logout')}
        style={styles.item}>
        {logged}
      </Text>

    </ScrollView>
  );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};
