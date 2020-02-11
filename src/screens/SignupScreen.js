import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, TextInput, Text, Button, View } from "react-native";
import firebase from '../config/Firebase'
import 'firebase/firestore'

export default class SignupScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            fullname: '',
            email: '',
            password: '',
        }
    }

    onRegister = () => {
        const { email, password } = this.state
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => {
                const { navigation } = this.props
                const { fullname , email } = this.state
                const data = {
                    email: email,
                    fullname: fullname,
                    appIdentifire: 'test app',
                }
                user_uid = response.user.uid
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .set(data)
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .get()
                    .then(function(user) {
                        this.props.navigation.navigate('Login')
                        alert('success to signup')
                    }).catch(function(err) {
                        alert(err.message)
                    })
            }).catch(function(err) {
                alert(err.message)
            })
    }

    render() {
        if(this.state.isLoading == true) {
            return(
                <ActivityIndicator
                    style={styles.spinner}
                    size='large'
                />
            )
        } 
        return(
            <View style={styles.container}>
                <Text>
                    create new account
                </Text>
                <TextInput
                    placeholder='full name'
                    onChangeText={text => this.setState({ fullname: text })}
                    value={this.state.fullname}
                />
                <TextInput
                    placeholder='email'
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                />
                <TextInput
                    placeholder='Password'
                    onChangeText={text => this.setState({ password: text })}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                <Button title="Sign Up"
                        onPress={() => this.onRegister()}>
                </Button>
            </View>
        )
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