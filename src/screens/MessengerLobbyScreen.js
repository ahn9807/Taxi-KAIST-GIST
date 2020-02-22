import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, ListItem } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import firebase from 'firebase'
import 'firebase/firestore'
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
                    this.setState({username: user.data().displayName})  
                    console.log("test")
                    // console.log(this.state.name)
                  
                    
                }.bind(this)
            );
    }


    state = {
        username: '',
        roomname:'room',
        makename: '',
        chatList:[]
    };

    componentDidMount(){ //여기에 해주는게 맞나?
        let chatList=[]
        firebase.firestore()
                .collection('ChatRooms')
                .get()
                .then(function(doc){
                    console.log("ctrms")
                    roomNames= doc
                    roomNames.forEach(doc =>{
                        json=doc.data()
                        console.log(json)
                        // 방 이름을 빼서 저장. reservationdata와 같이 관리 될거니 일단 삭제는 x.
                        if(json.member.includes(firebase.auth().currentUser.uid)){
                            console.log(json.roomname)
                            chatList.push(json.roomname)
                        }
                    })
                    this.setState({chatList: chatList})
                })
    }

    GoChat = () =>{
        console.log("gochat")
        // console.log(this.state.name)
        const { navigation } = this.props
        
        navigation.navigate('ChatRoom', {username: this.state.username,
                                        roomname: this.state.roomname}) 
                                        
    }
    
    //채팅방을 만들어보아요
    // 방 이름, 멤버에 대한 정보를 넣었는데, 후에 reservation screen에서 이를 해줄 것
    // 이를 채팅방 데이터와 어떻게 합칠지 잘 생각해보아야 함.
    MakeChat = () =>{
        const { makeName } = this.state
        let member=[ (firebase.auth().currentUser || {}).uid ]
        const data={
                roomname: makeName,
                member: member
        }

        firebase.firestore().collection('ChatRooms')
                            .doc(makeName)
                            .set(data)

        // firebase.firestore().doc('UserRooms')
        //                     .collection(member)
        //                     .doc('rooms')
        //                     .get()
        //                     .then(function(doc){

        //                     })
                    
    }

    





    render() {
        return(
            <View style={styles.container}>
                {
                    this.state.chatList.map((l, i) =>(
                        <ListItem
                            key={i}
                            title={l.name}
                            subtitle="chatroom init version"
                            bottomDivider
                            />
                    ))
                }
                <Text >
                    Messenger Lobby Screen
                </Text>
                <Button title="Go Chat" onPress={this.GoChat} style={{ marginTop: 30 }} >
                </Button>
                <Text style={{ marginTop: 30 }}>
                    ChatRoom Name
                </Text>
                <TextInput 
                style={{ marginTop: 30 }}
                    placeholder='chat name'
                    onChangeText={text => this.setState({ makeName: text })}
                    value={this.state.makeName}
                    style={{ marginTop: 30 }}
                />

                <Button title="Make Chat " onPress={this.MakeChat } style={{ marginTop: 30 }}> </Button>
                
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