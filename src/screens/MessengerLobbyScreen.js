import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import firebase from 'firebase'
// import {ChatRoom} from './ChatRoomScreen'
// const navigator = createStackNavigator({
    
// })

export default class MessengerLobbyScreen extends Component {
    constructor(props){
        super(props)
        firebase.firestore() //분명히 state 관리를 통해 이 코드를 쓰지 않을 수 있을 것. 고쳐야함
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then(function(user){
                    // console.log(user.data().displayName)
                    this.setState({name: user.data().displayName})  
                    console.log("test")
                    // console.log(this.state.name)
                  
                    
                }.bind(this)
            );

    }

    state = {
        name: ''
    };

    GoChat = () =>{
        console.log("gochat")
        console.log(this.state.name)
        const { navigation } = this.props
        
        navigation.navigate('ChatRoom', {name: this.state.name})     
    } 

    render() {
        return(
            <View style={styles.container}>
                <Text>
                    Messenger Lobby Screen
                </Text>
                <Button title="Go Chat" onPress={this.GoChat}> 
                </Button>
                
            </View>
        )
        //name 언제 가져오는가?
    }
}

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        justifyContent: 'center',  
        alignItems: 'center'  
    },  
});  