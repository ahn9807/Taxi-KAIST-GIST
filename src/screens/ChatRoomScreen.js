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
    Fire.shared.on(message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    })

    const { navigation } = this.props
    console.log("why?")
    console.log(navigation)



  }

  componentWillMount() {
    Fire.off();
  }

  get user() {
    // const { navigation } = this.props;
    const username = this.props.navigation
      .dangerouslyGetState()
      .routes
      .find(v => v.name === 'ChatRoom')
      .params
      .name;

    return {
      name: username,
      _id: Fire.uid
    }
  }

  render() {
    return (
      <View style={styles.chat}>
        <GiftedChat
          messages={this.state.messages}
          onSend={Fire.shared.send}
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
