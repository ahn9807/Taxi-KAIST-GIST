import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, InteractionManager, KeyboardAvoidingView } from "react-native";
import { Button, ListItem, Icon, ButtonGroup } from "react-native-elements";
import firebase from 'firebase'
import 'firebase/firestore'
import * as Messenger from '../Networking/Messenger'
import Modal from "react-native-modal"
import * as Reservation from "../Networking/Reservation"
import * as Calculation from "../Networking/Calculation"

import { NavigationEvents } from 'react-navigation';
import CalculationDetail from "../components/CalculationDetail"
import SlidingUpPanel from 'rn-sliding-up-panel'


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
            modalChatName: '',
            calculationInfo: {
                users: []
            },
            userInfo:{
                accountBank: "",
                accountNum: ""
            },
            calculationIdList: [], //이건 진짜 정산중인 방. 이름 다시 지어야 할 듯.
            disabled: false
        };
        // this.longPress = this.longPress.bind(this)
        // this.calculationOnPress=this.calculationOnPress.bind(this)

        firebase.firestore() //분명히 state 관리를 통해 이 코드를 쓰지 않을 수 있을 것. 고쳐야함
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(function (user) {
                // console.log(user.data().displayName)
                this.setState({ username: user.data().displayName,
                                userInfo: user.data() })
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
        
        // 여기서 정산 리스트를 뽑아야 하는가.... 성능 문제 ㄴ?
        Calculation.fetchCalculationData().then(function(res, err){
            this.setState({
                calculationIdList: Calculation.searchCalculationIdsByUId(firebase.auth().currentUser.uid)
            })
        }.bind(this))
        

    }

    // shouldComponentUpdate(nextProps, nextState) { //고쳐야
    //     return this.state.chatList != nextState.chatList;
    // }


    handleReloadPress = () => { //arrow func로 해야 에러 안나는 이유?
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
        
        Reservation.removeReservationById(this.state.modalChatId).then(
            Messenger.fetchReservationData().then(function (res, err) {
                this.setState({
                    availableChatList: Messenger.getAvailableChatRoomName(),
                    calculationChatList: Messenger.getCalculationChatRoomName()
                })
            }.bind(this)
            )
        )

        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    keyExtractor = (item, index) => index.toString()

    calculationOnPress = (item) => {

        // console.log("sdgeeh")

        InteractionManager.runAfterInteractions(() => {
            this.setState({ calculationInfo: item })
        }).done(function (res) {
            console.log("fasd")
            console.log(item.users.length)
            if (item.users.length > 0) { //나중에 1로 고치면됨.
                this._panel.show()
            } else {
                console.log("두 명 이상 타야 정산이 가능합니다.")
            }
        }.bind(this)
        )
    }

    offSlidingPanel=()=>{
        console.log("hide")
        this._panel.hide()
    }


    renderItem = ({ item }) => (

        
        <View style={styles.flatList}>
            <View style={styles.elem}>
                <ListItem
                    // key={i}
                    style={styles.chatList}
                    subtitle={'  ' + FormattedDate(item.startTime) + ' ~ ' + FormattedDate(item.endTime)}
                    title={' ' + item.source + ' -> ' + item.dest + ' '}
                    // rightIcon={{ name: 'chevron-right' }}
                    bottomDivider
                    badge={{ value: ' ' + item.users.length + ' ' }}
                    onPress={() => this.GoChat(item.id)}
                    onLongPress={() => this.openModal({
                        title: '  ' + FormattedDate(item.startTime) + ' 부터' + '          ' + FormattedDate(item.endTime) + ' 까지',
                        id: item.id
                    })}

                />

                {item.endTime < Date.now() ?
                
                        // 정산 상태, 채팅방 인원에 따라 style 변경 해줄거임!
                    <TouchableOpacity style={this.state.calculationIdList.includes(item.id)?
                        styles.buttonDisabled : styles.button}

                        onPress={() => this.calculationOnPress(item)}
                        disabled={this.state.calculationIdList.includes(item.id)}
                    >
                        {
                            this.state.calculationIdList.includes(item.id)
                                ? 
                                <Text> 정산 중</Text>
                                :
                                <Text> 정산하기 </Text>

                        }
                    </TouchableOpacity>
                    : null
                }
            </View>
        </View>
    )

    render() {
        console.log("434")
        // console.log(this.state.calculationList.includes({c}))
        return (

            <View style={styles.container}>


                {/* 
                <NavigationEvents
                    onDidFocus={()=> {this.handleReloadPress}}
                /> */}
                <ScrollView style={{ marginTop: 100 }}>


                    <Text>
                        정산 중인 택시팟 목록
                    </Text>
                    <FlatList
                        data={this.state.calculationChatList}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />

                    <Text>
                        탑승 예정 택시팟 목록
                    </Text>
                        <FlatList
                            data={this.state.availableChatList}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                        />
          
                        <Modal isVisible={this.state.isModalVisible}>
                            <View style={{ flex: 1 }}>
                                <Text>  {this.state.modalChatName} </Text>
                                <Button title="수정"> </Button>
                                <Button title="방 나가기" onPress={this.leaveReservation}></Button>
                                <Button title="닫기" onPress={this.closeModal} />
                            </View>
                        </Modal>



                </ScrollView>

                <Button type='clear'
                    
                    icon={<Icon name='cached'
                        color='#5d5d5d'
                        onPress={this.handleReloadPress}>
                    </Icon>}>

                </Button>

                <SlidingUpPanel
                    ref={c => this._panel = c}
                    backdropOpacity={0.5}
                    friction={0.7}
                    allowDragging={Platform.OS == 'android' ? false : true}

                >

                    <CalculationDetail
                        calculationInfo={this.state.calculationInfo}
                        userInfo={this.state.userInfo}
                        offSlidingPanel={this.offSlidingPanel}
                    />
                    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={30}/>
                </SlidingUpPanel>

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
    flatlist:{
        flex:1, 
        // flexDirection: 'row',
        justifyContent: 'center'

    },

    elem:{
        flex:1, 
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    chatList: {
        flex: 4,
        justifyContent: 'center'

    },
    button:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue'

    },
    buttonDisabled:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey'
    }


});

function FormattedDate(date) {
    var f = new Date(date)
    var d = f.getDate()
    var h = f.getHours()
    var m = f.getMinutes()

    return d + '일 ' + h + ':' + m
}