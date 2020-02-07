import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";

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
                <View style={styles.container}>
                    <ActivityIndicator
                        style={styles.spinner}
                        size='large'
                    />
                    <Text>
                        Auto Login Failed
                    </Text>
                </View>
            )
        } else {
            return(
                <View style={styles.container}>
                    <Text>
                        Welcome Page
                    </Text>
                    <Button title="Login To Click"/>
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