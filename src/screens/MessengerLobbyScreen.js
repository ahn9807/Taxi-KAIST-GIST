import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, InteractionManager, KeyboardAvoidingView,
        ActivityIndicator } from "react-native";
import { Button, ListItem, Icon, ButtonGroup, Header } from "react-native-elements";
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
            avatarUri: '', //이거 userinfo랑 합쳐도 된다.
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
            calculationIdList: [], 
            disabled: false,
            chatPreview:[]
        };
 
        firebase.firestore() 
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(function (user) {
                // console.log(user.data().displayName)
                this.setState({ username: user.data().displayName,
                                avatarUri: user.data().profileUri,
                                userInfo: user.data() })

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
            // this.previewLoad()
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

    previewLoad=() =>{
        console.log("reviewvir")
        var rooms = []
        console.log(this.state.availableChatList)
        // Messenger.subscribeData(this.state.availableChatList).then(
        this.setState({
            chatPreview: Messenger.subscribeData(this.state.availableChatList)
        })
        // )


        console.log("preview")
        console.log(this.state.chatPreview)

    }

    componentWillMount(){

        // this.navigationWillFocusListener.remove()
        // Messenger.unSubscribeData(this.state.availableChatList);
    }

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
            avatarUri: this.state.avatarUri,
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
    
    messengerLobbyMenu(){

    }

    renderItem = ({ item, index }) => (

        //간격 수정요함
        <View style={[{flex: 1, justifyContent: 'center'}, index%2==0 ? { marginTop: 10 } : { marginTop: 10 } ]}> 
            <View style={styles.elem}>
                <ListItem
                    // key={i}
                    style={styles.chatList}
                    subtitle={<Text style={{color: '#0078CD'}}>{' ' + FormattedDate(item.startTime) + ' ~ ' + FormattedDate(item.endTime)}</Text>}
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
                            containerStyle={{paddingLeft: 20, width: 90}}
                            buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                            onPress={()=> {}}
                        />    
                            :
                            <Button 
                            type='outline'
                            title='정산 하기'
                            titleStyle={{fontSize: 15, fontWeight: '500'}}
                            // disabled={true}
                            containerStyle={{paddingLeft: 20, width: 90}}
                            buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                            onPress={()=> {this.calculationOnPress(item)}}
                        />   

                        }

                    </View>

                    : null
                }
            </View>
        </View>
    )




    render() {
        return (
      
                <View style={styles.container}>
                    
                    <Header
                        placement='left'
                        containerStyle={{backgroundColor:'#fffa', borderBottomColor: 'transparent'}}
                        // leftComponent={<Button type='clear' icon={<Icon name='keyboard-arrow-left' color='black' onPress={this.handleBackPress}></Icon>}></Button>}
                        rightComponent={<Button type='clear' titleStyle={{color:'black'}} icon={<Icon name='menu' type='feather' color='black' onPress={this.messengerLobbyMenu}></Icon>}></Button>}
                        leftComponent={{ text: ' 내 택시 팟', style: {color: 'black', fontWeight:'bold', fontSize: 23, }}}
                    />


                    <ScrollView style={{ marginTop: 30 }}>


                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, marginBottom: 1 }}>
                            {"  정산 중인 택시팟 목록"}
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
                            {"    정산 중인 팟이 없네용"}
                            </Text>
                            :
                            <FlatList
                            style={styles.flatlist}
                            data={this.state.calculationChatList}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}

                        />
                        }
                    
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, marginTop: 30, marginBottom: 1 }}>
                          {"  탑승 예정 택시팟 목록"} 
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
                             {"    탑승 예정 택시팟이 없네용"}   
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
{/* 
                <Button type='clear'
                    
                    icon={<Icon name='cached'
                        color='#5d5d5d'
                        onPress={this.handleReloadPress}>
                    </Icon>}>

                </Button> */}

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
                    {/* <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0}/> */}
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
        // justifyContent: 'center'
        // borderRadius: 3,
        // borderColor: '#0FBCFF'

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