import React from  'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { createStore, applyMiddleware } from 'redux'
import { StyleSheet, Platform } from 'react-native';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import appReducers from './src/reducers/Index'

import FindAuthScreen from "./src/screens/FindAuthScreen";
import SignupScreen from "./src/screens/SignupScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen'
import MessengerLobbyScreen from './src/screens/MessengerLobbyScreen'
import EmailAuthScreen from './src/screens/EmailAuthScreen'
import ReservationScreen from './src/screens/ReservationScreen'

import ChatRoomScreen from './src/screens/ChatRoomScreen'
import { SafeAreaProvider } from 'react-native-safe-area-view';

const Stack = createStackNavigator()
const Tab = createMaterialBottomTabNavigator()
const TopTab = createMaterialTopTabNavigator()
const Chat = createStackNavigator()

const AuthNavigator = () => (
    <Stack.Navigator headerMode='none' initialRouteName='Welcome'>
        <Stack.Screen name='FindAuth' component={FindAuthScreen}/>
        <Stack.Screen name='Signup' component={SignupScreen}/>
        <Stack.Screen name='Welcome' component={WelcomeScreen}/>
        <Stack.Screen name='EmailAuth' component={EmailAuthScreen}/>
    </Stack.Navigator>
)

const MainTabNavigatorIOS = () => (
  <Tab.Navigator 
    initialRouteName='Home'
    activeColor='red'
    labelStyle={{fontSize:12}}
    style={{ backgroundColor: 'tomato'}}
  >
    <Tab.Screen name='Home' component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='home' color={color} size={size} />
        )
      }}
    />
    <Tab.Screen name='ChatNavigator' component={ChatNavigator}
      options={{
        tabBarLabel: 'Messeger Lobby',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='message-text-outline' color={color} size={size} />
        )
      }}
    />
    <Tab.Screen name='Setting' component={SettingScreen}
      options={{
        tabBarLabel: 'Setting',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='settings-outline' color={color} size={size} />
        )
      }}
    />
  </Tab.Navigator>
)

const MainTabNavigatorAndroid = () => (
  <TopTab.Navigator
    initialRouteName='Home'
    tabBarPosition="bottom"
    style={{backgroundColor: 'tomato'}}
  >
    <TopTab.Screen name='Home' component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='home' color={color} size={size} />
        )
      }}
    />
    <TopTab.Screen name='ChatNavigator' component={ChatNavigator}
      options={{
        tabBarLabel: 'Messeger Lobby',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='message-text-outline' color={color} size={size} />
        )
      }}
    />
    <TopTab.Screen name='Setting' component={SettingScreen}
      options={{
        tabBarLabel: 'Setting',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='settings-outline' color={color} size={size} />
        )
      }}
    />
  </TopTab.Navigator>
)

const MainTabNavigator = Platform.select({
  ios: MainTabNavigatorIOS,
  android: MainTabNavigatorAndroid,
})

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
