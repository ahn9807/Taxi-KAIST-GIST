import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";
import firebase from 'firebase'
import 'firebase/firestore'
import Fire from '../config/Firebase'


export default class ChatRoomScreen extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    messages: [],
  }

  static navigationOptions = ({ props }) => {
    // title: (props.navigation.state.params || {}).name,
  };

  componentDidMount() {
    console.log("did")
    this.on(message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    })

    const { navigation } = this.props
    console.log("why?")
    console.log(navigation)

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
      .find(v => v.name === 'ChatRoom')
      .params
      .roomname;


    return firebase.firestore().collection('ChatRooms')
      .doc(roomname).collection('messages');
    //roomname 확인해주어야 함.
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

    return { _id, createdAt: Date(createdAt), text, user }
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = { text, user, createdAt: new Date() };
      this.append(message)
    }
  };


  append = message => this.refm().add(message)


  render() {
    return (
      <View style={styles.chat}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.send}
          user={this.user}
        ></GiftedChat>
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={80} />
      </View>
    )
  }


}
const styles = StyleSheet.create({
  chat: {
    flex: 1
  }
});
