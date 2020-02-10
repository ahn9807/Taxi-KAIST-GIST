import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyA9QcquwcUiD-zyocWd5we_PnMZkYxFsZI",
    authDomain: "taekseung-a118b.firebaseapp.com",
    databaseURL: "https://taekseung-a118b.firebaseio.com",
    projectId: "taekseung-a118b",
    storageBucket: "taekseung-a118b.appspot.com",
    messagingSenderId: "403135563286",
    appId: "1:403135563286:web:0d11453e8dbbb1c9d1d737",
    measurementId: "G-GN5FML8G0H"
}

const Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase