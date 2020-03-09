import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, InteractionManager, KeyboardAvoidingView,
        ActivityIndicator } from "react-native";
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
            isLoadingChat: true,
            isLoadingCalculation: true,
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

                // console.log(this.state.name)
            }.bind(this)
            );

        this.handleReloadPress()

   }

    handleReloadPress = () => { //arrow func로 해야 에러 안나는 이유?

        this.setState({
            isLoadingCalculation: true,
            isLoadingChat: true
        })
        
        Messenger.setRegion('KAIST')
        Messenger.fetchReservationData().then(function (res, err) {
            this.setState({
                availableChatList: Messenger.getAvailableChatRoomName(),
                calculationChatList: Messenger.getCalculationChatRoomName(),
                isLoadingChat: false
            })
        }.bind(this)
        )



        Calculation.fetchCalculationData().then(function(res, err){
            this.setState({
                calculationIdList: Calculation.searchCalculationIdsByUId(firebase.auth().currentUser.uid),
                isLoadingCalculation: false
            })
        }.bind(this))
    }


    componentDidMount() {
        console.log("와싸")
        this.onLoad();
    }

    // componentWillMount(){
    //     // this.navigationWillFocusListener.remove()
    //     this.onLoad()
    // }

    onLoad = () => {
        console.log("onload")
        this.props.navigation.addListener('focus', () => {
          this.handleReloadPress();
        });
      };

    GoChat = (id, roomname) => {
        console.log(id)
        console.log("gochat")
   
        const { navigation } = this.props



        navigation.navigate('ChatRoom', {
            chatId: id,
            username: this.state.username,
            roomname: roomname,
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
                this.handleReloadPress()
            }.bind(this)
            )
         
        )
    
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    keyExtractor = (item, index) => index.toString()

    calculationOnPress = (item) => {

        InteractionManager.runAfterInteractions(() => {
            this.setState({ calculationInfo: item })
        }).done(function (res) {
            console.log(item.users.length)
            if (item.users.length > 0) { //나중에 1로 고치면됨.
                this._panel.show()
            } else {
                alert("두 명 이상 타야 정산이 가능합니다.")
            }
        }.bind(this)
        )
    }
    
    onCalculation=()=>{
        console.log("oncalculation")
        this.setState({isLoadingCalculation: true})
        
        Calculation.fetchCalculationData().then(function(res, err){
            this.setState({
                calculationIdList: Calculation.searchCalculationIdsByUId(firebase.auth().currentUser.uid),
                isLoadingCalculation: false
            })
        }.bind(this))
    }

    offSlidingPanel=()=>{
        console.log("hide")
        this._panel.hide()
    }

    
    renderItem = ({ item, index }) => (

        //간격 수정요함
        <View style={[{flex: 1, justifyContent: 'center'}, index%2==0 ? { marginTop: 10 } : { marginTop: 10 } ]}> 
            <View style={styles.elem}>
                <ListItem
                    // key={i}
                    style={styles.chatList}
                    subtitle={'  ' + FormattedDate(item.startTime) + ' ~ ' + FormattedDate(item.endTime)}
                    title={' ' + item.source + ' ➤ ' + item.dest + ' '}
                    // rightIcon={{ name: 'chevron-right' }}
                    // bottomDivider
                    badge={{ value: ' ' + item.users.length + ' ' }}
                    onPress={() => this.GoChat(item.id, ' ' + item.source + ' ➤ ' + item.dest + ' ')}
                    onLongPress={() => this.openModal({
                        title: '  ' + FormattedDate(item.startTime) + ' 부터' + '          ' + FormattedDate(item.endTime) + ' 까지',
                        id: item.id
                    })}

                />

                {item.endTime < Date.now() ?
                
                        // 정산 상태, 채팅방 인원에 따라 style 변경 해줄거임!
                    <View style={{backgroundColor: "#FFF", position:'absolute', top: '30%', right:'2.5%'}}>
                        {
                            this.state.calculationIdList.includes(item.id)
                            ?
                            <Button 
                            type='outline'
                            title='정산 중'
                            titleStyle={{fontSize: 15, fontWeight: '500'}}
                            disabled={true}
                            containerStyle={{paddingLeft: 20}}
                            buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                            onPress={()=> {}}
                        />    
                            :
                            <Button 
                            type='outline'
                            title='정산 하기'
                            titleStyle={{fontSize: 15, fontWeight: '500'}}
                            // disabled={true}
                            containerStyle={{paddingLeft: 20}}
                            buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                            onPress={()=> {this.calculationOnPress(item)}}
                        />   

                        }

                    </View>


                    // <TouchableOpacity style={this.state.calculationIdList.includes(item.id)?
                    //     styles.buttonDisabled : styles.button}

                    //     onPress={() => this.calculationOnPress(item)}
                    //     disabled={this.state.calculationIdList.includes(item.id)}
                    // >
                    //     {
                    //         this.state.calculationIdList.includes(item.id)
                    //             ? 
                    //             <Text> 정산 중</Text>
                    //             :
                    //             <Text> 정산하기 </Text>

                    //     }
                    // </TouchableOpacity>
                    : null
                }
            </View>
        </View>
    )

    render() {
        // console.log(this.state.calculationList.includes({c}))
        return (
      
                <View style={styles.container}>


                    {/* 
                <NavigationEvents
                    onDidFocus={()=> {this.handleReloadPress}}
                /> */}

                    {/* <NavigationEvents
                    onWillFocus={() => { this.handleReloadPress
                        //Call whatever logic or dispatch redux actions and update the screen!
                    }}
                /> */}
                    <ScrollView style={{ marginTop: 100 }}>


                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                            정산 중인 택시팟 목록
                        </Text>
                        {this.state.isLoadingChat || this.state.isLoadingCalculation ?
                            <View>
                                <ActivityIndicator
                                    style={styles.spinner}
                                    size='large'
                                />
                            </View>
                            :
                            !this.state.calculationChatList.length ?
                            <Text>
                            정산 중인 팟이 없네용
                            </Text>
                            :
                            <FlatList
                            data={this.state.calculationChatList}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}

                        />
                        }
                    
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                            탑승 예정 택시팟 목록
                        </Text>
                        {this.state.isLoadingChat?
                        <View>
                                <ActivityIndicator
                                    style={styles.spinner}
                                    size='large'
                                />
                        </View>
                        :
                        !this.state.availableChatList.length ?
                            <Text>
                                탑승 예정 택시팟이 없네용
                        </Text>
                            :
                            <FlatList
                                data={this.state.availableChatList}
                                keyExtractor={this.keyExtractor}
                                renderItem={this.renderItem}
                            />
                        }
          
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
                        onSubmit={this.onCalculation}
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