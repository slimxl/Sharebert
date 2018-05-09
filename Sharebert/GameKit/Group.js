import Expo from 'expo';
import React from 'react';
import { THREE } from 'expo-three' // 2.1.1

import "expo-asset-utils"; // 0.0.0
import "three"; // Supported builtin module
import "react-native-console-time-polyfill"; // 0.0.6
import "text-encoding"; // 0.6.4
import "xmldom-qsa"; // 1.0.3

export default class Group extends THREE.Group {
  constructor({ ...props }) {
    super(props);
  }

  removeAll = () => {
    while (this.children.length) {
      this.remove(this.children[0]);
    }
  };

  forEachAlive = (callback, callbackContext, args) => {
    this.traverse(function(node) {
      if (node.alive) {
        callback(node);
      }
    });
  };
}