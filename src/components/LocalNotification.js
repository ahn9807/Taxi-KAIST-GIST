import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import { AsyncStorage } from 'react-native';

export async function SaveNotificationSettings(enable, sound) {

}

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

    Notifications.scheduleLocalNotificationAsync(
        localNotificationMessage, schedulingOptions
    )
}

export async function AskPermission() {
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS)

    if(Constants.isDevice && result.status == 'granted') {
        console.log('NOtification permissions granted.')
    }

    Notifications.addListener(()=>(console.log('알람이 도착하였습니다')))
}