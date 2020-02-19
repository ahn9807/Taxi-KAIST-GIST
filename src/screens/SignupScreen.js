import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, TextInput, Text, Button, View, Picker } from "react-native";
import firebase from '../config/Firebase'
import 'firebase/firestore'

export default class SignupScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            displayName: '',
            email: '',
            password: '',
            emailVerified: false,
            origin: 'kaist' //기본
        }
    }

    componentDidMount() {

    }

    // componentWillMount() {

    // }

    onRegister = () => {
        const { email, password } = this.state
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => {
                const { navigation } = this.props
                const { displayName, email, emailVerified, origin } = this.state
                const data = {
                    email: email,
                    displayName: displayName,
                    emailVerified: emailVerified,
                    appIdentifire: 'test app',
                    origin: origin 
                }
                console.log(1313)
                console.log(origin)
                user_uid = response.user.uid
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .set(data)
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .get()
                    .then(function (user) {
                        alert('success to signup')
                        navigation.navigate('Login')
                    }).catch(function (err) {
                        alert(ferr.message)
                    })
            }).catch(function (err) {
                alert(err.message)
            })
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <ActivityIndicator
                    style={styles.spinner}
                    size='large'
                />
            )
        }
        return (
            <View style={styles.container}>
                <Text>
                    create new account
                </Text>
                <TextInput
                    placeholder='full name'
                    onChangeText={text => this.setState({ displayName: text })}
                    value={this.state.displayName}
                    style={{ marginTop: 30 }}
                />
                <TextInput
                    placeholder='email'
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                    style={{ marginTop: 30 }}
                />



                <TextInput
                    placeholder='Password'
                    onChangeText={text => this.setState({ password: text })}
                    value={this.state.password}
                    secureTextEntry={true}
                    style={{ marginTop: 30 }}
                />
                <View>
                    <Text style={{ marginTop: 30 }}> 학교 입력</Text>
                    <Picker selectedValue={this.state.origin}
                        onValueChange={origin => this.setState({ origin: origin })}
                        style={{height: 50, width: 200}}
                    >
                        {/* <Picker.Item label="선택해주세요" value=""/> */}
                        <Picker.Item label="KAIST" value="kaist"/>
                        <Picker.Item label="GIST" value="gist"/>
                        
                    </Picker>
                    {/* <Text >{this.state.origin} </Text> */}


                </View>

                <Button title="Sign Up"
                    onPress={() => this.onRegister()}>
                    style={{ marginTop: 30 }}
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