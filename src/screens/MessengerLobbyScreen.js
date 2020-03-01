import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList } from "react-native";
import { Button, ListItem, Icon, ButtonGroup } from "react-native-elements";
import { TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";
import firebase from 'firebase'
import 'firebase/firestore'
import * as Messenger from '../Networking/Messenger'
import Modal from "react-native-modal"
import * as Reservation from "../Networking/Reservation"
import { NavigationEvents } from 'react-navigation';

export default class MessengerLobbyScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            roomname: 'room',
            makename: '',
            availableChatList: [],
            calculationChatList: [], //두 개로 분리했는데 하나의 jsonobject 형태로 짜도 됨. 추후 논의 
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
            this.setState({
                availableChatList: Messenger.getAvailableChatRoomName(),
                calculationChatList: Messenger.getCalculationChatRoomName()
            })
        }.bind(this)
        )


    }

    // shouldComponentUpdate(nextProps, nextState) { //고쳐야
    //     return this.state.chatList != nextState.chatList;
    // }


    handleReloadPress = () => { //arrow func로 해야 에러 안나는 이유?
        // console.log("reload")
        console.log(this.state.availableChatList)
        console.log(this.state.calculationChatList)
        Messenger.setRegion('KAIST')
        Messenger.fetchReservationData().then(function (res, err) {
            this.setState({
                availableChatList: Messenger.getAvailableChatRoomName(),
                calculationChatList: Messenger.getCalculationChatRoomName()
            })
        }.bind(this)
        )
    }


    componentDidMount() {
        console.log("와싸")

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

    openModal = (data) => {
        console.log("tm")
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            modalChatId: data.id,
            modalChatName: data.title
        });
    }

    closeModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    leaveReservation = () => {
        
        Reservation.removeReservationById(this.state.modalChatId)
        if(availbleChatList.includes(this.state.modalChatId)){
            temp = this.state.availableChatList
            const index = temp.findIndex(v => v.id === this.state.modalChatId)
            if (index != undefined) {
                temp.splice(index, 1);
            }
            this.setState({ availableChatList: temp })
    
        }else{
            temp = this.state.calculationChatList
            const index = temp.findIndex(v => v.id === this.state.modalChatId)
            if (index != undefined) {
                temp.splice(index, 1);
            }
            this.setState({ calculationChatList: temp })
    
        }

        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <View>
        <ListItem
            // key={i}
            subtitle={'  ' + FormattedDate(item.startTime) + ' ~ ' + FormattedDate(item.endTime)}
            title={' ' + item.source + ' -> ' + item.dest + ' '}
            rightIcon={{ name: 'chevron-right' }}
            bottomDivider
            badge={{ value: ' ' + item.users.length + ' ' }}
            onPress={() => this.GoChat(item.id)}
            onLongPress={() => this.openModal({
                title: '  ' + FormattedDate(item.startTime) + ' 부터' + '          ' + FormattedDate(item.endTime) + ' 까지',
                id: item.id
            })}

        />
        <Button title='정산하기'></Button>
        </View>

    )





    render() {
        return (


            <View style={styles.container}>

                <FlatList
                        data={this.state.availableChatList}
                    keyExtractor={this.keyExtractor}
            
                    renderItem={this.renderItem}
                />

                {/* 
                <NavigationEvents
                    onDidFocus={()=> {this.handleReloadPress}}
                /> */}
                <ScrollView style={{marginTop: 100}}>
                    <View style={styles.chatList}>

                    <Text>
                        정산 중인 택시팟 목록
                    </Text>
                        {
                            this.state.calculationChatList.map((l, i) => (

                                <ListItem
                                    key={i}
                                    subtitle={'  ' + FormattedDate(l.startTime) + ' ~ ' + FormattedDate(l.endTime)}
                                    title={' ' + l.source + ' -> ' + l.dest + ' '}
                                    rightIcon={{ name: 'chevron-right' }}
                                    bottomDivider
                                    badge={{ value: ' ' + l.users.length + ' ' }}
                                    onPress={() => this.GoChat(l.id)}
                                    onLongPress={() => this.openModal({
                                        title: '  ' + FormattedDate(l.startTime) + ' 부터' + '          ' + FormattedDate(l.endTime) + ' 까지',
                                        id: l.id
                                    })}

                                >
                                </ListItem>
                            ))
                        }  
                        <Text>
                            탑승 예정 택시팟 목록
                    </Text>

                        {
                            this.state.availableChatList.map((l, i) => (

                                <ListItem
                                    key={i}
                                    subtitle={'  ' + FormattedDate(l.startTime) + ' ~ ' + FormattedDate(l.endTime)}
                                    title={' ' + l.source + ' -> ' + l.dest + ' '}
                                    rightIcon={{ name: 'chevron-right' }}
                                    bottomDivider
                                    badge={{ value: ' ' + l.users.length + ' ' }}
                                    onPress={() => this.GoChat(l.id)}
                                    onLongPress={() => this.openModal({
                                        title: '  ' + FormattedDate(l.startTime) + ' 부터' + '          ' + FormattedDate(l.endTime) + ' 까지',
                                        id: l.id
                                    })}
                                    // buttonGroup={
                                    //     <View>
                                    //     <ButtonGroup
                                    //         buttons={['정산하기']}
                                    //         />
                                    //         </View>
                                    // }
                                    // render={<Button title='fff'>우와오아와</Button>} 
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
                </ScrollView>

                <Button type='clear'

                    icon={<Icon name='cached'
                        color='#5d5d5d'
                        onPress={this.handleReloadPress}>
                    </Icon>}>

                </Button>

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
    var f = new Date(date)
    var d = f.getDate()
    var h = f.getHours()
    var m = f.getMinutes()

    return d + '일 ' + h + ':' + m
}