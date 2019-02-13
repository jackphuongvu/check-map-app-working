import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDODwlsHWyw193sS_rgsgxjRu6UPshYoGE",
  authDomain: "wedrive-1527435684187.firebaseapp.com",
  databaseURL: "https://wedrive-1527435684187.firebaseio.com",
  projectId: "wedrive-1527435684187",
  storageBucket: "wedrive-1527435684187.appspot.com",
  messagingSenderId: "521411552255"
};

firebase.initializeApp(firebaseConfig);

export default firebase;