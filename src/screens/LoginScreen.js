import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View, AsyncStorage, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import firebase from 'firebase'
import 'firebase/firestore'

export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            email: '',
            password: '',
        }
    }

    onPressLogin = () => {
        const {email, password} = this.state
        if(email.length <= 0 || password.length <= 0) {
            alert('Please fill out the required fields')
            return
        }
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                const { navigation } = this.props
                user_uid = response.user.uid
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .get()
                    .then(function(user) {
                        if(user.exists) {
                            AsyncStorage.setItem("@loggedInUserID:id", user_uid);
                            AsyncStorage.setItem("@loggedInUserID:key", email);
                            AsyncStorage.setItem("@loggedInUserID:password", password);
                            //성공할 경우 화면 전환
                            alert('Success to Login')
                        } else {
                            alert('User does not exist. Please try again')
                        }
                    }).catch(function(err) {
                        alert(err.message)
                    })
            }).catch(function(err) {
                alert(err.message)
            })
    }

    render() {
        return(
            <View style={styles.container}>
                <TextInput
                    placeholder='Email'
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                />
                <TextInput
                    placeholder='Password'
                    onChangeText={text => this.setState({ password: text })}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                <Button
                    title='Login'
                    onPress={() => this.onPressLogin()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: "center"
      },
    spinner: {
        marginTop: 200
    }
})