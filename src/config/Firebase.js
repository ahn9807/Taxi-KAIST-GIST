import firebase from 'firebase';
import 'firebase/firestore'

class Fire {
    constructor() {
        this.firebaseConfig();
        this.observeAuth();
    }

    firebaseConfig = () =>
        firebase.initializeApp({
            apiKey: "AIzaSyA9QcquwcUiD-zyocWd5we_PnMZkYxFsZI",
            authDomain: "taekseung-a118b.firebaseapp.com",
            databaseURL: "https://taekseung-a118b.firebaseio.com",
            projectId: "taekseung-a118b",
            storageBucket: "taekseung-a118b.appspot.com",
            messagingSenderId: "403135563286",
            appId: "1:403135563286:web:0d11453e8dbbb1c9d1d737",
            measurementId: "G-GN5FML8G0H"
        });

    observeAuth = () =>
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        // sign anonymous 하지 않아도 됨.
        // if (!user) {
        //     try {
        //         // 4.
        //         firebase.auth().signInAnonymously();
        //     } catch ({ message }) {
        //         alert(message);
        //     }
        // }
    }; 

    static get ref(){
        return firebase.firestore().collection('messages');
    }

    static get uid(){
        return (firebase.auth().currentUser || {} ).uid;
    }

    static off(){
        Fire.ref.onSnapshot(function(){
            console.log("off")
        })
    }

    on= callback => Fire.ref.orderBy('createdAt', 'asc').onSnapshot(snapshot=>{
        snapshot.docChanges().forEach(change=>{
            if(change.type === 'added'){
                callback(this.parse(change.doc))
            }
        })
    });

    parse= message => {
        const {createdAt, text, user}= message.data();
        const {id: _id}= message; //무슨 의미지...
        
        return {_id, createdAt: Date(createdAt), text, user}
    }

    send= messages =>{
        for(let i=0; i<messages.length;i++){
            const {text, user}= messages[i];
            const message= {text, user, createdAt: new Date()};
            this.append(message)
        }
    };

    append=message => Fire.ref.add(message)

}
Fire.shared = new Fire();
export default Fire