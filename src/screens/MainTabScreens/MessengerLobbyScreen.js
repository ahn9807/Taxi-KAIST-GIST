import React, { PureComponent } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity, InteractionManager, KeyboardAvoidingView,
        ActivityIndicator, 
        Platform} from "react-native";
import { Button, ListItem, Icon, ButtonGroup, Header, Divider } from "react-native-elements";
import firebase from 'firebase'
import 'firebase/firestore'
import * as Messenger from '../../Networking/Messenger'
import Modal from "react-native-modal"
import * as Reservation from "../../Networking/Reservation"
import * as Calculation from "../../Networking/Calculation"

import { NavigationEvents } from 'react-navigation';
import MakeCalculationDetail from "../../components/MakeCalculationDetail"
import SlidingUpPanel from 'rn-sliding-up-panel'
import CalculationDetail from "../../components/CalculationDetail";


export default class MessengerLobbyScreen extends PureComponent {
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
            calculationChatList: [], 
            isModalVisible: false,
            modalChatId: '',
            modalChatName: '',
            modalChatTime:'',
            calculationInfo: {
                users: []
            },
            userInfo:{
                accountBank: "",
                accountNum: ""
            },
            calculationIdList: [], 
            disabled: false,
            chatPreview:[],

            hostList: [],
            sendList: [],
            isLoadingHost: true,
            isLoadingSend: true,
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

    handleReloadPress = () => { 

        this.setState({
            isLoadingCalculation: true,
            isLoadingChat: true,
            isLoadingHost: true,
            isLoadingSend: true,
            toRefresh: true
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
                isLoadingCalculation: false,
                hostList: Calculation.searchCalculationHostByUId(firebase.auth().currentUser.uid),
                sendList: Calculation.searchCalculationSendByUId(firebase.auth().currentUser.uid),
                isLoadingSend: false,
                isLoadingHost: false
            })
        }.bind(this))
        
    }

    
    handleReloadHost = () => { 

        this.setState({
            isLoadingCalculation: true,
            // isLoadingChat: true,
            isLoadingHost: true,
            // isLoadingSend: true,
            toRefresh: true
        })
        
        Messenger.setRegion('KAIST')
        Messenger.fetchReservationData().then(function (res, err) {
            this.setState({
                calculationChatList: Messenger.getCalculationChatRoomName(),
            })
            // this.previewLoad()
        }.bind(this)
        )
        Calculation.fetchCalculationData().then(function(res, err){
            this.setState({
                calculationIdList: Calculation.searchCalculationIdsByUId(firebase.auth().currentUser.uid),
                isLoadingCalculation: false,
                hostList: Calculation.searchCalculationHostByUId(firebase.auth().currentUser.uid),
                isLoadingHost: false
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
            fullname: this.state.userInfo.fullName
        })

    }

    openModal = (data) => {
        console.log("tm")
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            modalChatId: data.id,
            modalChatName: data.title,
            modalChatTime: data.time
        });
    }

    closeModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    leaveReservation = () => {
        Reservation.removeReservationById(this.state.modalChatId, this.state.userInfo.fullName).then(
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
        // console.log("???")
        InteractionManager.runAfterInteractions(() => {
            this.setState({ calculationInfo: item })
            
        }).done(function (res) {
            console.log(item.users.length)
            if (item.users.length > 1) { //나중에 1로 고치면됨.
                this._panel.show()
            } else {
                alert("두 명 이상 타야 정산이 가능합니다.")
            }
        }.bind(this)
        )
    }
    
    onCalculation=()=>{
        console.log("oncalculation")
        this.setState({isLoadingCalculation: true,
                    isLoadingHost:true
        })
        
        Calculation.fetchCalculationData().then(function(res, err){
            this.setState({
                calculationIdList: Calculation.searchCalculationIdsByUId(firebase.auth().currentUser.uid),
                isLoadingCalculation: false,
                hostList: Calculation.searchCalculationHostByUId(firebase.auth().currentUser.uid),
                isLoadingHost: false
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
        <View style={[{flex: 1, justifyContent: 'center'}]}> 
            <View style={styles.elem}>
                <ListItem
                    // key={i}
                    style={styles.chatList}
                    subtitle={<Text style={{color: '#0078CD'}}>{' ' + FormattedDate(item.startTime) + ' ~ ' + FormattedDate(item.endTime)}</Text>}
                    title={' ' + item.source + ' ➤ ' + item.dest + ' ' + Messenger.getUnreadMessage(item.id, firebase.auth().currentUser.uid)}
                    // rightIcon={{ name: 'chevron-right' }}
                    //bottomDivider
                    badge={{ value: ' ' + item.users.length + ' ' }}
                    onPress={() => {this.GoChat(item.id, ' ' + item.source + ' ➤ ' + item.dest + ' ')}}
                    onLongPress={() => this.openModal({
                        title: ' ' + item.source + ' ➤ ' + item.dest + ' ',
                        time: '  ' + FormattedDate(item.startTime) + ' 부터' + '  ' + FormattedDate(item.endTime) + ' 까지',
                        id: item.id
                    })}
                />

                {item.endTime < Date.now() ?
                        // 정산 상태, 채팅방 인원에 따라 style 변경 해줄거임!
                    <View style={{backgroundColor: "#FFF", position:'absolute', top: '30%', right:'2.5%'}}>
                        {
                            item.completed?
                            <Button 
                            type='outline'
                            title='정산완료'
                            titleStyle={{fontSize: 15, fontWeight: '500'}}
                            disabled={true}
                            containerStyle={{paddingLeft: 20, width: 90}}
                            buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                            onPress={()=> {}}
                            />
                            :

                            this.state.calculationIdList.includes(item.id)
                            ?
                            <Button 
                            type='outline'
                            title='정산중'
                            titleStyle={{fontSize: 15, fontWeight: '500'}}
                            disabled={true}
                            containerStyle={{paddingLeft: 20, width: 90}}
                            buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                            onPress={()=> {}}
                        />    
                            :
                            <Button 
                            type='outline'
                            title='정산하기'
                            titleStyle={{fontSize: 15, fontWeight: '500'}}
                            disabled={false}
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
                    {
                    // this.state.isLoadingChat || this.state.isLoadingCalculation ? 
                    //     <View style={{flex:1, alignItems:'center', marginTop: 200}}>
                    //         <ActivityIndicator size='large'/>
                    //     </View>
                    //     :
                        <ScrollView>
                            <CalculationDetail 
                                hostList= {this.state.hostList}
                                sendList= {this.state.sendList}
                                isLoadingSend= {this.state.isLoadingSend}
                                isLoadingHost= {this.state.isLoadingHost}
                                handleReloadPress={this.handleReloadPress}
                                handleReloadHost={this.handleReloadHost}
                            />

                            <View style={{flex:1, backgroundColor:'white'}}>
                                <Divider></Divider>
                                <Text style={{ color: '#333', fontWeight:'bold', fontSize: 15, marginTop: 5, marginBottom: 5, marginLeft: 8}}>
                                    {"  탑승 예정"}
                                </Text>
                                <Divider></Divider>

                            </View>
                            {!this.state.isLoadingChat  ?
                                <FlatList
                                style={styles.flatlist}
                                data={this.state.availableChatList}
                                keyExtractor={this.keyExtractor}
                                renderItem={this.renderItem}
                                />
                                :
                                <View>
                                    <ActivityIndicator size='large'/>

                                </View>
                            }

                            <View style={{flex:1, backgroundColor:'white'}}>
                                <Divider></Divider>
                                <Text style={{ color: '#333', fontWeight:'bold', fontSize: 15, marginTop: 5, marginBottom: 5, marginLeft: 8}}>
                                    {"  탑승 완료"}
                                </Text>
                                <Divider></Divider>

                            </View>
                            {!this.state.isLoadingCalculation?
                                <FlatList
                                style={styles.flatlist}
                                data={this.state.calculationChatList}
                                keyExtractor={this.keyExtractor}
                                renderItem={this.renderItem}
                                />
                                :
                                <View>
                                    <ActivityIndicator size='large'/>

                                </View>
                            }
                        
                

                        </ScrollView>
                    }
                    <Modal isVisible={this.state.isModalVisible} backdropOpacity={0.2}
                    >
                        <TouchableOpacity style={styles.modalContainer}
                            onPressOut={() => {this.closeModal}} //아직 나가기 안함
                        >
                                <Text style={{fontSize: 25, fontWeight: '500', marginBottom: 20}}>
                                {this.state.modalChatName} 
                                </Text>
                            <Text style={{fontSize: 15, fontWeight: '500', marginBottom: 40}}>
                                {this.state.modalChatTime} 
                                </Text>

                            <Button title="정보 수정"
                                buttonStyle={styles.modalButton}
                                containerStyle={{width: 100}}
                                > </Button>
                            <Button title="팟 나가기"
                                buttonStyle={styles.modalButton} 
                                onPress={this.leaveReservation}
                                containerStyle={{width: 100}}
                                ></Button>
                            <Button title="닫기" 
                            buttonStyle={styles.modalButton} 
                            onPress={this.closeModal} 
                            containerStyle={{width: 100}}/>
                        </TouchableOpacity>
                    </Modal>      

                <SlidingUpPanel
                    ref={c => this._panel = c}
                    backdropOpacity={0.5}
                    friction={Platform.OS=='android'?  0.1 : 0.7}
                    allowDragging={Platform.OS == 'android' ? false : true}
                    
                >

                    <MakeCalculationDetail
                        calculationInfo={this.state.calculationInfo}
                        userInfo={this.state.userInfo}
                        offSlidingPanel={()=> this.offSlidingPanel()}
                        onSubmit={this.onCalculation}
                        handleReloadPress={this.handleReloadPress}
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
    },
    modalContainer:{
        // width: '70%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20
    },
    modalButton:{
        // width: '70%',
        marginBottom: 20,
        backgroundColor: '#29AEEC',
        borderRadius: 3

    }


});

function n(n){
    return n > 9 ? "" + n: "0" + n;
}


function FormattedDate(date) {
    var f = new Date(date)
    var d = f.getDate()
    var h = f.getHours()
    var m = f.getMinutes()

    return d + '일 ' + n(h) + ':' + n(m)
}