import React, { Component } from "react";
import { Text, View, Button, AsyncStorage } from "react-native";
import { BaseRouter } from "@react-navigation/native";
import firebase from '../config/Firebase'

// this.props.route.params 에는 유저의 정보가 들어가 있음

export default class HomeScreen extends Component {
    onLogout = () => {
        firebase.auth().signOut()
        AsyncStorage.setItem("@loggedInUserID:uid", '')
        AsyncStorage.setItem("@loggedInUserID:email", '')
        AsyncStorage.setItem("@loggedInUserID:password", '')
        this.props.navigation.navigate('Welcome')
    }

    render() {
        return(
            <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                <Text>
                    {this.props.route.params.fullname}
                </Text>
                <Button title="Logout" onPress={this.onLogout}>

                </Button>
            </View>
        )
    }
}