import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, ListItem } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import firebase from 'firebase'
import 'firebase/firestore'
import * as Messenger from '../Networking/Messenger'
// })

export default class MessengerLobbyScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            roomname: 'room',
            makename: '',
            chatList: []
        };

        firebase.firestore() //분명히 state 관리를 통해 이 코드를 쓰지 않을 수 있을 것. 고쳐야함
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(function (user) {
                // console.log(user.data().displayName)
                this.setState({ username: user.data().displayName })
                console.log("test")
                // console.log(this.state.name)


            }.bind(this)
            );

        Messenger.setRegion('KAIST')
        Messenger.fetchReservationData().then(function (res, err) {
            this.setState({ chatList: Messenger.getChatRoomName() })
        }.bind(this)
        )

    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.chatList != nextState.chatList;
    }

    componentDidMount() { //여기에 해주는게 맞나?

    }

    GoChat = () => {
        console.log(this.state.chatList)
        console.log("gochat")
        // console.log(this.state.name)
        const { navigation } = this.props

        navigation.navigate('ChatRoom', {
            username: this.state.username,
            roomname: this.state.roomname
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.chatList}>
                    {
                        this.state.chatList.map((l, i) => (
                            <ListItem
                                key={i}
                                title={'  ' + FormattedDate(l.startTime) + ' 부터' + '          ' + FormattedDate(l.endTime) + ' 까지'}
                                rightIcon={{ name: 'chevron-right' }}
                                bottomDivider
                                badge={{ value: ' ' + l.users.length + ' ' }}
                                onPress={()=>this.GoChat(l)}
                            />
                        ))
                    }
                </View>
                <View style={styles.con}>

                    <Text>
                        Messenger Lobby Screen
                </Text>
                    <Button title="Go Chat" onPress={this.GoChat} style={{ marginTop: 30 }} >
                    </Button>
                </View>
            </View>

        )
        //name 언제 가져오는가?
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center'
    },
    chatList: {
        flex: 2,
        justifyContent: 'center'
    },
    con: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function FormattedDate(date) {
    var d = new Date(date)
    var h = d.getHours()
    var m = d.getMinutes()

    return '' + h + ':' + m
}