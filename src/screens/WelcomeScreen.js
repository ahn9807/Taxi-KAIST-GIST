import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import firebase from 'firebase'
import 'firebase/firestore'
import SlidingUpPanel from "rn-sliding-up-panel";
import Details from "../components/Details";

export default class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
            // 계속 spinner가 돌아서 comment 처리 함
            // spinner 주는 방법을 좀 다르게 해야 한다.
        }
        console.log("trylogin")
        this.tryToLoginFirst()
    }

    render() {
        console.log("welcome")
        if(this.state.isLoading == true) {
            return(
                <View>
                    <ActivityIndicator
                        style={styles.spinner}
                        size='large'
                    />
                </View>
            )
        } else 
        {
            return(
                <View style={styles.container}>
                    <Text>
                        Welcome Page
                    </Text>
                    <Button title="Login"
                            onPress={()=>{this.props.navigation.navigate('Login')}}>
                    </Button>
                    <Button title='Signup'
                            onPress={()=>{this.props.navigation.navigate('Signup')}}>
                    </Button>
                </View>
            )
        }
    }

    async tryToLoginFirst() {
        const email = await AsyncStorage.getItem("@loggedInUserID:email")
        const password = await AsyncStorage.getItem('@loggedInUserID:password')
        const id = await AsyncStorage.getItem('@loggedInUserID:uid')
        const emailVerified= await AsyncStorage.getItem('@loggedInUserID:emailVerified') 
        if(
            id != null &&
            id.length > 0 &&
            password != null &&
            password.length > 0
        ) {
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then(response => {
                    user_uid = response.user.uid
                    const { navigation } = this.props
                    firebase.firestore()
                        .collection('users')
                        .doc(id)
                        .get()
                        .then(function(user) {
                            if(user.exists) {
                                if(user.data().emailVerified){
                                    navigation.navigate('Main', user.data())
                                }
                                else{
                                    navigation.navigate('EmailAuth', user.data())
                                }
                            }
                        })
                        .catch(function(err) {
                            alert(err.message)
                            this.setState({
                                isLoading: false
                            })
                        })
                }).catch(err => {
                    alert(err.message)
                    this.setState({
                        isLoading: false
                    })
                })
        } else {
            this.setState({
                isLoading: false
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    spinner: {
        marginTop: 200
    }
})