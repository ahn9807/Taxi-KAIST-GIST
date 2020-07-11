import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, Alert, ImageBackground } from "react-native";
import firebase from 'firebase'
import 'firebase/firestore'
import { Header, Icon, Button, Text } from "react-native-elements";

export default class EmailAuthScreen extends Component {
    constructor(props) {
        super(props)

    }

    onLogout = () => {
        firebase.auth().signOut()
        AsyncStorage.setItem("@loggedInUserID:uid", '')
        AsyncStorage.setItem("@loggedInUserID:email", '')
        AsyncStorage.setItem("@loggedInUserID:password", '')
        AsyncStorage.setItem("@loggedInUserID:emailAuthed", JSON.stringify(false))
        this.props.navigation.navigate('Welcome')
    }

    emailSend = () => {
        console.log(15323)
        var currentUser = firebase.auth().currentUser;
        firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get()
            .then(function (user) {

                if(currentUser.email.includes("@"+user.data().origin+".ac.kr")){
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
            <ImageBackground
                source={require('../../../images/testBackLogin.jpg')}
                style={{ width: '100%', height: '100%'}}
                resizeMode='cover'
            >
                <Header
                    leftComponent={<Button type='clear' onPress={this.onLogout} icon={<Icon name='keyboard-arrow-left' color='white'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'white', fontWeight:'bold'}}>이메일 인증</Text>}
                    containerStyle={{backgroundColor:'transparent'}}
                />
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text h4 style={{color: 'white', marginTop: 15, textAlign: 'justify', margin: 40}}>
                            {'이메일 인증이 필요합니다'}
                        </Text>
                        <Text h5 style={{color: 'white', marginTop: 15, textAlign: 'center'}}>
                            {'기입하신 이메일로 메일이 발송됩니다. \n발송된 메일에 첨부된 Email 인증 버튼을 눌러\n인증을 완료해 주세요.'}
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                            title="인증 메일 전송"
                            onPress={this.emailSend}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 5, marginTop: 5}}
                        />
                        <Button 
                            title="인증 완료"
                            onPress={this.verify}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 5, marginTop: 5}}
                        />
                        <Button 
                            title="로그아웃"
                            onPress={this.onLogout}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 5, marginTop: 5}}
                        />
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        height: '60%',
    },
    footerContainer: {
        height: '10%',
        justifyContent: 'flex-end'
    },
    selectCollegeContainer: {
        width: '100%',
        backgroundColor: '#fff5'
    },
});  