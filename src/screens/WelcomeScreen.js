import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import firebase from 'firebase'
import 'firebase/firestore'

export default class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true
        }
        this.tryToLoginFirst()
    }

    render() {
        if(this.state.isLoading == true) {
            return(
                <View>
                    <ActivityIndicator
                        style={styles.spinner}
                        size='large'
                    />
                </View>
            )
        } else {
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
        const email = await AsyncStorage.getItem("@loggedInUserID:key")
        const password = await AsyncStorage.getItem('@loggedInUserID:password')
        const id = await AsyncStorage.getItem('@loggedInUserID:id')
        if(
            id != null &&
            id.length > 0 &&
            password != null &&
            password.length > 0
        ) {
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const { navigation } = this.props
                    firebase.firestore()
                        .collection('users')
                        .doc(id)
                        .get()
                        .then(function(doc) {
                            var user = {
                                id: id,
                                email: email,
                                fullname: doc.fullname,
                            }
                            if(doc.exists) {
                                navigation.navigate('Home', user)
                            }
                        })
                        .catch(function(err) {
                            alert(err.message)
                        })
                    this.state.isLoading = false
                }).catch(err => {
                    alert(err.message)
                })
            this.setState({
                isLoading: true
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