import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import { AsyncStorage } from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore'

var notification_token = null


export async function LocalNotification(time, title, body) {
    const sound = await AsyncStorage.getItem("@settings:notificationSound", false)
    const localNotificationMessage = {
        title: title,
        body: body,
    }

    const schedulingOptions = {
        time: time,
        sound: sound,
    }

    //Notifications.scheduleLocalNotificationAsync(
    //    localNotificationMessage, schedulingOptions
    //)
}

export async function sendPushNotification(expoPushToken) {
  console.log('push notification sended')
  
  const message = {
    to: notification_token,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { data: 'goes here' },
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function AskPermission() {
    console.log("Ask Permission")
if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    AsyncStorage.setItem("@notification:token", token)
    firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .set({ notification_token: token }, { merge: true })
    notification_token = token
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('default', {
      name: 'default',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
    });
  }
  
}