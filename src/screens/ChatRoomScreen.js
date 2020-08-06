import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";
import firebase from 'firebase'
import { Header , Button, Icon, Text, Tooltip, Divider} from 'react-native-elements'
import 'firebase/firestore'
import Fire from '../config/Firebase'
import * as Reservation from "../Networking/Reservation"
// import PopoverTooltip from 'react-native-popover-tooltip';
// import ReactNativeTooltipMenu from 'react-native-tooltip-menu';

export default class ChatRoomScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      roomname: '', 

      // tabBarVisible: false,
    }
  
    // console.log(this.props.route)


  }
 


  static navigationOptions = ({ props }) => ({
    title: (props.navigation.state.params || {}).name,
    
  }
  );

  componentDidMount() {

    this.on(message => {
      // console.log(message);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    })


  }

  componentWillMount() {
    this.off();
  }

  get user() {
    // const { navigation } = this.props;
    const username = this.props.navigation
      .dangerouslyGetState()
      .routes
      .find(v => v.name === 'ChatRoom')
      .params
      .username;

    
    const avatarUri = this.props.navigation
      .dangerouslyGetState()
      .routes
      .find(v => v.name === 'ChatRoom')
      .params
      .avatarUri;


    if(avatarUri==undefined){
      return{
        name: username,
        _id: this.uid(),
        avatar: "https://firebasestorage.googleapis.com/v0/b/taekseung-a118b.appspot.com/o/image%2FprofileImages%2FQbFfEvhPhpOvxAxDlA9k5BXgk6t2?alt=media&token=87f0106b-cf9a-416b-886b-3e8a66e898ea"
      }
    }
    else{
      return {
        name: username,
        _id: this.uid(),
        avatar: avatarUri
      }
    }

  }

  refm() {
    const roomname = this.props.navigation
      .dangerouslyGetState()
      .routes
      .find(v => v.name === 'ChatRoom')
      .params.roomname;

    const chatId = this.props.navigation
      .dangerouslyGetState()
      .routes
      .find(v => v.name === 'ChatRoom')
      .params.chatId;



    console.log(roomname)
    this.setState({ roomname: roomname })
    return firebase.firestore().collection('ChatRooms')
      .doc(chatId).collection('messages');
  }

  uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  off() {
    this.refm().onSnapshot(function () {
      console.log("off")
    });
  }

  on = callback => this.refm().orderBy('createdAt', 'asc').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        callback(this.parse(change.doc))
      }
    })
  });

  parse = message => {
    const { createdAt, text, user } = message.data();
    const { id: _id } = message; //무슨 의미지...
    return { _id, createdAt: createdAt, text, user }
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = { text, user, createdAt: Date() };
      //new date로 하면 안된다. giftedchat에서 요구하는게 그런듯....
      // console.log(message)
      this.append(message)
    }
  };


  append = message => this.refm().add(message)

  handleOnOpenMenu=()=> {
    console.log(this.state.roomname)
  } 

  handleBackPress = () => {
    this.props.navigation.navigate('ChatNavigator')
  }

  leaveReservation = () => {

    const chatId = this.props.navigation
    .dangerouslyGetState()
    .routes
    .find(v => v.name === 'ChatRoom')
    .params
    .chatId;

    const fullName=this.props.navigation
    .dangerouslyGetState()
    .routes
    .find(v => v.name === 'ChatRoom')
    .params
    .fullName;


    Reservation.removeReservationById(chatId, fullName).then(function(){
      
      setTimeout(()=> {this.props.navigation.navigate('ChatNavigator')}, 300)
       // 리얼 개야매코드 이러면 안되는데 ㅠㅠㅠㅠㅠㅠㅠ 
       //아마 navigate할때 바로 안돌려져서 한거일듯. 

    }.bind(this)
    );
}

  render() {
    return (
      <View style={styles.chat}>
        <Header
          containerStyle={{ backgroundColor: '#fffa', borderBottomColor: 'transparent' }}
          leftComponent={<Button type='clear' icon={<Icon name='keyboard-arrow-left' color='black' onPress={this.handleBackPress}></Icon>}></Button>}
          rightComponent={
            <Tooltip
              // style={styles.tooltip}
              backgroundColor={'#fff'}
              width={100}
              height={100}
              containerStyle={styles.tooltip}
              popover={
                <View style={{width: '100%'}}> 
                  <TouchableOpacity style={styles.menuComponent}
                    onPress={()=> {this.leaveReservation()}}
                  >
                    <Text style={{color: '#000', textAlign: 'center', fontWeight:'bold', fontSize: 16}}> 방 나가기 </Text>
                  </TouchableOpacity>
                  <Divider/>
                  <TouchableOpacity style={styles.menuComponent}>
                    <Text style={{color: '#000', textAlign: 'center', fontWeight:'bold', fontSize: 16}}> 신고하기 </Text>
                  </TouchableOpacity>
                </View>
              }>
              <Icon name='menu' color='black'  ></Icon>
            </Tooltip>
          }

          centerComponent={{ text: this.state.roomname, style: { color: 'black', fontWeight: 'bold' } }}
        />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.send}
          user={this.user}
          renderUsernameOnMessage={true}
          showUserAvatar={true}
          // renderTime={(props)=> props.currentMessage.createdAt.toDate()}
        ></GiftedChat>
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0} />
      </View>
    )
  }


}
const styles = StyleSheet.create({
  chat: {
    flex: 1
  },
  tooltip:{
    backgroundColor: '#FFFFFF',
  
  },
  menuComponent:{
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 50
  }
});

function n(n){
  return n > 9 ? "" + n: "0" + n;
}

function FormattedDate(date) {
  var d = new Date(date)
  var h = d.getHours()
  var m = d.getMinutes()

  return '' + h + ':' + n(m)
}
