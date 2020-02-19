import React, { Component } from "react";
import { StyleSheet, View, Text, Button, AsyncStorage } from "react-native";
import firebase from 'firebase'

export default class SettingScreen extends Component {
    onLogout = () => {
        firebase.auth().signOut()
        AsyncStorage.setItem("@loggedInUserID:uid", '')
        AsyncStorage.setItem("@loggedInUserID:email", '')
        AsyncStorage.setItem("@loggedInUserID:password", '')
        this.props.navigation.navigate('Welcome')
    }

    onChnageID = () => {

    }

    render() {
        return(
            <View style={styles.container}>
                <Text>
                    Setting Screen
                </Text>
                <Button title= "logout" onPress={this.onLogout}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        justifyContent: 'center',  
        alignItems: 'center'  
    },  
});  