import React from  'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Platform } from 'react-native';

import FindAuthScreen from "./src/screens/FindAuthScreen";
import SignupScreen from "./src/screens/SignupScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen'
import MessengerLobbyScreen from './src/screens/MessengerLobbyScreen'
import EmailAuthScreen from './src/screens/EmailAuthScreen'
import ReservationScreen from './src/screens/ReservationScreen'
import CalculationScreen from './src/screens/CalculationScreen'

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

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Chat = createStackNavigator()
const Setting = createStackNavigator()

const SettingNavigator = () => (
  <Setting.Navigator headerMode='none' initialRouteName='SettingScreen'>
    <Stack.Screen name='SettingScreen' component={SettingScreen}/>
    <Stack.Screen name='Announcement' component={SS_Announcement}/>
    <Stack.Screen name='Account' component={SS_Account}/>
    <Stack.Screen name='ETC' component={SS_ETC}/>
    <Stack.Screen name='Help' component={SS_Help}/>
    <Stack.Screen name='History' component={SS_History}/>
    <Stack.Screen name='Information' component={SS_Information}/>
    <Stack.Screen name='Messenger' component={SS_Messenger}/>
    <Stack.Screen name='Profile' component={SS_Profile}/>
    <Stack.Screen name='ServiceCenter' component={SS_ServiceCenter}/>
    <Stack.Screen name='Theme' component={SS_Theme}/>
    <Stack.Screen name='Wallet' component={SS_Wallet}/>
    <Stack.Screen name='Notice' component={SS_Notice}/>
  </Setting.Navigator>
)

const AuthNavigator = () => (
    <Stack.Navigator headerMode='none' initialRouteName='Welcome'>
        <Stack.Screen name='FindAuth' component={FindAuthScreen}/>
        <Stack.Screen name='Signup' component={SignupScreen}/>
        <Stack.Screen name='Welcome' component={WelcomeScreen}/>
        <Stack.Screen name='EmailAuth' component={EmailAuthScreen}/>
    </Stack.Navigator>
)


const MainTabNavigator = () => (
  <Tab.Navigator 
    initialRouteName='Home'
    tabBarOptions={{
      keyboardHidesTabBar: false,
      activeBackgroundColor: '#eeea'
    }}
  >
    <Tab.Screen name='Home' component={HomeScreen}
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
          <MaterialCommunityIcons name='message-text-outline' color={color} size={size} />
        )
      }}
    />
    <Tab.Screen name='Calculation' component={CalculationScreen}
      options={{
        tabBarLabel: '정산하기',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='cash-multiple' color={color} size={size} />
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

const ChatNavigator =()=>(
  <Chat.Navigator headerMode='none' initialRouteName='MessengerLobby'>
    <Chat.Screen name='MessengerLobby' component={MessengerLobbyScreen}/>
    <Chat.Screen name='ChatRoom' component={ChatRoomScreen}/>
  </Chat.Navigator>
)




function AppNavigator() {
    return(
        <NavigationContainer>
            <Stack.Navigator headerMode='none' initialRouteName='Auth'>
                <Stack.Screen name='Auth' component={AuthNavigator} options={{gesturesEnabled: false}}/>
                <Stack.Screen name='Main' component={MainTabNavigator} options={{gesturesEnabled: false}}/>
                <Stack.Screen name='Reservation' component={ReservationScreen} options={{gestureEnabled: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

//const middleware = applyMiddleware(thunkMiddleware)
//const store = createStore(appReducers, middleware)

export default function App() {
  return (
    <AppNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
