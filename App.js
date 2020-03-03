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

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Chat = createStackNavigator()

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
      keyboardHidesTabBar: true,
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
    <Tab.Screen name='Setting' component={SettingScreen}
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
