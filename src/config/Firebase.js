import firebase from 'firebase'

const firebaseConfig = {
        apiKey: "AIzaSyBIIYJPSVLoYxobnuW4zMbcEAaqiAiB-Ik",
        authDomain: "test-e85bb.firebaseapp.com",
        databaseURL: "https://test-e85bb.firebaseio.com",
        projectId: "test-e85bb",
        storageBucket: "test-e85bb.appspot.com",
        messagingSenderId: "568118411483",
        appId: "1:568118411483:web:440ab6aa0f29ca694b4cfe"
}

const Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase