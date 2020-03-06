import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";
import firebase from 'firebase'
import { Header , Button, Icon} from 'react-native-elements'
import 'firebase/firestore'
import Fire from '../config/Firebase'


export default class ChatRoomScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      roomname: this.props.route.params.id,
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

    return {
      username: username,
      _id: this.uid()
    }
  }

  refm() {
    const roomname = this.props.navigation
      .dangerouslyGetState()
      .routes
      .find(v => v.name==='ChatRoom')
      .params.roomname;

    console.log(roomname)
    this.setState({roomname: roomname})
    return firebase.firestore().collection('ChatRooms')
      .doc(roomname).collection('messages');
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
      console.log(message)
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

  render() {
    return (
      <View style={styles.chat}>
        <Header
          containerStyle={{ backgroundColor: '#fffa', borderBottomColor: 'transparent' }}
          leftComponent={<Button type='clear' icon={<Icon name='keyboard-arrow-left' color='black' onPress={this.handleBackPress}></Icon>}></Button>}
          rightComponent={<Button type='clear' titleStyle={{ color: 'black' }} icon={<Icon name='menu' type='feather' color='black' onPress={this.handleOnOpenMenu}></Icon>}></Button>}
          centerComponent={{ text: this.state.roomname, style: { color: 'black', fontWeight: 'bold' } }}
        />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.send}
          user={this.user}

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
  }
});

function FormattedDate(date) {
  var d = new Date(date)
  var h = d.getHours()
  var m = d.getMinutes()

  return '' + h + ':' + m
}