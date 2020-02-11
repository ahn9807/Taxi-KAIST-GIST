import React, { Component } from "react";
import { StyleSheet, View, Text, Button, AsyncStorage, Alert } from "react-native";
import firebase from 'firebase'
import 'firebase/firestore'

export default class EmailAuthScreen extends Component {
    constructor(props) {
        super(props)

    }

    onLogout = () => {
        firebase.auth().signOut()
        AsyncStorage.setItem("@loggedInUserID:uid", '')
        AsyncStorage.setItem("@loggedInUserID:email", '')
        AsyncStorage.setItem("@loggedInUserID:password", '')
        AsyncStorage.setItem("@loggedInUserID:emailAuthed", false)
        this.props.navigation.navigate('Welcome')
    }

    emailSend = () => {
        // console.log(15323)
        var currentUser = firebase.auth().currentUser;
        firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get()
            .then(function (user) {

                if(currentUser.email.includes("@"+user.data().origin+".ac.kr")){ //대학 한정
                    currentUser.sendEmailVerification().then(function () {
                        alert("이메일의 인증 링크를 눌러주세요")
                    }).catch(function (err) {
                        console.log(err.code);
                    })
                }
                else{
                    alert(user.data().origin+" 이메일이 확인되지 않았습니다")
                }       
            });

    }

    verify = () => {
        // console.log(11)
        const { navigation } = this.props
        firebase.auth().currentUser.reload()
            .then(() => {
                var currentUser = firebase.auth().currentUser;
                // console.log(currentUser)
                if (currentUser.emailVerified) {
                    // console.log("succeed")
                    firebase.firestore()
                        .collection('users')
                        .doc(user_uid)
                        .update(
                            {
                                emailVerified: true
                                // db update
                            })
                    AsyncStorage.setItem("@loggedInUserID:emailAuthed", true)

                    navigation.navigate('Main')
                    // console.log("44")
                }else{
                    alert("인증을 해주세요")
                }
            });

    }

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Email Verify Screen
                </Text>
                <Button title="EmailSend" onPress={this.emailSend}>
                </Button>
                <Button title="Logout" onPress={this.onLogout}>
                </Button>
                <Button title="Complete Verification" onPress={this.verify}>
                </Button>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});  