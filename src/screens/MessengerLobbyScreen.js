import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, ListItem, ButtonGroup } from "react-native-elements";
import { TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";
import firebase from 'firebase'
import 'firebase/firestore'
import * as Messenger from '../Networking/Messenger'
import Modal from "react-native-modal"
import * as Reservation from "../Networking/Reservation"

export default class MessengerLobbyScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            roomname: 'room',
            makename: '',
            chatList: [],
            isModalVisible: false,
            modalChatId: '',
            modalChatName: ''
        };
        // this.longPress = this.longPress.bind(this)

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

    // shouldComponentUpdate(nextProps, nextState) { //고쳐야
    //     return this.state.chatList != nextState.chatList;
    // }

    componentDidMount() {

    }

    GoChat = (id) => {
        console.log(id)
        console.log("gochat")
        // console.log(this.state.name)
        const { navigation } = this.props

        navigation.navigate('ChatRoom', {
            username: this.state.username,
            roomname: id
        })

    }

    openModal=(data)=> {
        console.log("tm")
        this.setState({ isModalVisible: !this.state.isModalVisible,
                        modalChatId: data.id,
                        modalChatName: data.title
        });
    }

    closeModal=()=>{
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    leaveReservation=()=>{

        Reservation.removeReservation(this.state.modalChatId, firebase.auth().currentUser.uid)
        temp=this.state.chatList
        const index= temp.findIndex(v => v.id === this.state.modalChatId)
        if(index!= undefined){
            temp.splice(index, 1);
        }
        this.setState({chatList: temp})
    }


    render() {
        return (
            <View style={styles.container}>
                 
                <View style={styles.chatList}>
                    <Text>
                            내 택시팟 목록
                    </Text>
                    {
                        this.state.chatList.map((l, i) => (

                            <ListItem
                                key={i}
                                title={'  ' + FormattedDate(l.startTime) + ' 부터' + '          ' + FormattedDate(l.endTime) + ' 까지'}
                                rightIcon={{ name: 'chevron-right' }}
                                bottomDivider
                                badge={{ value: ' ' + l.users.length + ' ' }}
                                onPress={() => this.GoChat(l.id)}
                                onLongPress={() => this.openModal({
                                    title:'  ' + FormattedDate(l.startTime) + ' 부터' + '          ' + FormattedDate(l.endTime) + ' 까지',
                                    id: l.id
                                })}
                            >

                            </ListItem>
                        ))
                    }

                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={{ flex: 1 }}>
                            <Text>  {this.state.modalChatName} </Text>
                            <Button title="수정"> </Button>
                            <Button title="방 나가기" onPress={this.leaveReservation}></Button>
                            <Button title="닫기" onPress={this.closeModal} />
                        </View>
                    </Modal>

                </View>
                <View style={styles.con}>

                    <Text>
                        Messenger Lobby Screen
                    </Text>
                </View>
            </View>

        )
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