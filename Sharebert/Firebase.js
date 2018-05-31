import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyAsDk-rSOnmzGzyEQt8lAQVFzdYB0DVdM0",
    authDomain: "sharebert-4222b.firebaseapp.com",
    databaseURL: "https://sharebert-4222b.firebaseio.com",
    storageBucket: "sharebert-4222b.appspot.com"
  };

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();