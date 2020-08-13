import React, { useState } from 'react'
import firebase from 'firebase'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Platform, View } from 'react-native';

import FindAuthScreen from "./src/screens/AuthScreens/FindAuthScreen";
import SignupScreen from "./src/screens/AuthScreens/SignupScreen";
import WelcomeScreen from "./src/screens/AuthScreens/WelcomeScreen";
import HomeScreen from './src/screens/MainTabScreens/HomeScreen';
import NewHomeScreen from './src/screens/MainTabScreens/NewHomeScreen';
import MakeReservation from './src/screens/MainTabScreens/MakeReservation';

import SettingScreen from './src/screens/SettingScreen'
import MessengerLobbyScreen from './src/screens/MainTabScreens/MessengerLobbyScreen'
import EmailAuthScreen from './src/screens/AuthScreens/EmailAuthScreen'
import ReservationScreen from './src/screens/ReservationScreen'
import CalculationDetail from './src/components/CalculationDetail'

import ChatRoomScreen from './src/screens/ChatRoomScreen'
import { SafeAreaProvider } from 'react-native-safe-area-view';
import SS_Account from './src/screens/SettingScreens/SS_Account';
import SS_Announcement from './src/screens/SettingScreens/SS_Announcement';
import SS_ETC from './src/screens/SettingScreens/SS_ETC';
import SS_Help from './src/screens/SettingScreens/SS_Help';
import SS_History from './src/screens/SettingScreens/SS_History';
import SS_Information from './src/screens/SettingScreens/SS_Information';
import SS_Messenger from './src/screens/SettingScreens/SS_Messenger';
import SS_Profile from './src/screens/SettingScreens/SS_Profile';
import SS_ServiceCenter from './src/screens/SettingScreens/SS_ServiceCenter';
import SS_Theme from './src/screens/SettingScreens/SS_Theme';
import SS_Wallet from './src/screens/SettingScreens/SS_Wallet';
import SS_Notice from './src/screens/SettingScreens/SS_Notice';
import { Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { Notifications } from 'expo';


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Chat = createStackNavigator()
const Setting = createStackNavigator()
const Home = createStackNavigator()

const SettingNavigator = () => (
  <Setting.Navigator headerMode='none' initialRouteName='SettingScreen'>
    <Stack.Screen name='SettingScreen' component={SettingScreen} />
    <Stack.Screen name='Announcement' component={SS_Announcement} />
    <Stack.Screen name='Account' component={SS_Account} />
    <Stack.Screen name='ETC' component={SS_ETC} />
    <Stack.Screen name='Help' component={SS_Help} />
    <Stack.Screen name='History' component={SS_History} />
    <Stack.Screen name='Information' component={SS_Information} />
    <Stack.Screen name='Messenger' component={SS_Messenger} />
    <Stack.Screen name='Profile' component={SS_Profile} />
    <Stack.Screen name='ServiceCenter' component={SS_ServiceCenter} />
    <Stack.Screen name='Theme' component={SS_Theme} />
    <Stack.Screen name='Wallet' component={SS_Wallet} />
    <Stack.Screen name='Notice' component={SS_Notice} />
  </Setting.Navigator>
)

const AuthNavigator = () => (
  <Stack.Navigator headerMode='none' initialRouteName='Welcome'>
    <Stack.Screen name='FindAuth' component={FindAuthScreen} />
    <Stack.Screen name='Signup' component={SignupScreen} />
    <Stack.Screen name='Welcome' component={WelcomeScreen} />
    <Stack.Screen name='EmailAuth' component={EmailAuthScreen} />
  </Stack.Navigator>
)

// Home <-> newhome
const MainTabNavigator = (badgeNumber) => (
  <Tab.Navigator
    initialRouteName='Home'
    tabBarOptions={{
      keyboardHidesTabBar: false,
      activeBackgroundColor: '#eeea'
    }}
  >

    <Tab.Screen name='Home' component={HomeNavigator}
      options={{
        tabBarLabel: '택시 찾기',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='home' color={color} size={size} />
        )
      }}
    />
    <Tab.Screen name='ChatNavigator' component={ChatNavigator}
      options={{
        tabBarLabel: '내 택시방',
        tabBarIcon: ({ color, size }) => (
          <View>
            <MaterialCommunityIcons name='message-text-outline' color={color} size={size} />
            {badgeNumber != 0 &&
              <Badge
                status="success"
                value={'n'}
                containerStyle={{ position: 'absolute', top: -3, right: -10 }}
              />}
          </View>

        )
      }}
    />
    <Tab.Screen name='Setting' component={SettingNavigator}
      options={{
        tabBarLabel: '설정',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='settings-outline' color={color} size={size} />
        )
      }}
    />
  </Tab.Navigator>
)

const HomeNavigator = () => (
  <Home.Navigator headerMode='none' initialRouteName='NewHome'>
    <Home.Screen name='NewHome' component={NewHomeScreen} />
    <Home.Screen name='MakeReservation' component={MakeReservation} />
  </Home.Navigator>
)

//일단 채팅을 앱으로 뺐다.... 좋은 코드는 아니지만 탭네이게이터 안의 스택네이게이터에서 탭을 컨트롤 하는 방법 찾아봐야. 
const ChatNavigator = () => (
  <Chat.Navigator headerMode='none' initialRouteName='MessengerLobby'  >
    <Chat.Screen name='MessengerLobby' component={MessengerLobbyScreen} />


  </Chat.Navigator>
)

function AppNavigator() {
  //now don't use message alarm
  const [badgeNumber, setBadgeNumber] = useState(0)
  // firebase.auth().onAuthStateChanged(function (user) {
  // var user=firebase.auth().currentUser;
  // if (user) {
  Notifications.addListener(()=> {
    setBadgeNumber(1)
  })
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='none' initialRouteName='Auth'>
        <Stack.Screen name='Auth' component={AuthNavigator} options={{ gesturesEnabled: false }} />
        <Stack.Screen name='Main' component={() => MainTabNavigator(badgeNumber)} options={{ gesturesEnabled: false }} />
        <Stack.Screen name='Reservation' component={ReservationScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name='ChatRoom' component={ChatRoomScreen} options={{ gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
// }
// else {
//   return (
//     <NavigationContainer >
//       {
//         <Stack.Navigator headerMode='none'>
//           <Stack.Screen name='Auth' component={AuthNavigator} options={{ gesturesEnabled: false }} />
//         </Stack.Navigator>
//       }
//     </NavigationContainer>
//   )
// }



//const middleware = applyMiddleware(thunkMiddleware)
//const store = createStore(appReducers, middleware)
export default function App() {
  return (
    // <AppComponent/>
    <AppNavigator />

  );
}

export function setBadgeNumber(num) {
  setBadgeNumber(num)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
