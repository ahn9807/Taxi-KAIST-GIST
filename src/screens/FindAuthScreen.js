import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View, AsyncStorage, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import firebase from 'firebase'
import 'firebase/firestore'
import { Text } from "react-native-elements";

export default class FindAuthScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    비밀 번호 찾기 
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    spinner: {
        marginTop: 200
    }
})