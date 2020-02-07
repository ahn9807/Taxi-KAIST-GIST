import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true
        }
    }

    render() {
        return(
            <View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    spinner: {
        marginTop: 200
    }
})