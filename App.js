import React from  'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { createStore, applyMiddleware } from 'redux'
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import appReducers from './src/reducers/Index'

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen'
import MessangerLobbyScreen from './src/screens/MessangerLobbyScreen'
import EmailAuthScreen from './src/screens/EmailAuthScreen'
import ReservationScreen from './src/screens/ReservationScreen'

const Stack = createStackNavigator()
const Tab = createMaterialBottomTabNavigator()

const AuthNavigator = () => (
    <Stack.Navigator headerMode='none' initialRouteName='Welcome'>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='Signup' component={SignupScreen}/>
        <Stack.Screen name='Welcome' component={WelcomeScreen}/>
        <Stack.Screen name='EmailAuth' component={EmailAuthScreen}/>
    </Stack.Navigator>
)

const MainTabNavigator = () => (
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
    <Tab.Screen name='MessangerLobby' component={MessangerLobbyScreen}
      options={{
        tabBarLabel: 'Messager Lobby',
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

function AppNavigator() {
    return(
        <NavigationContainer>
            <Stack.Navigator headerMode='none' initialRouteName='Auth'>
                <Stack.Screen name='Auth' component={AuthNavigator} options={{gesturesEnabled: 'false'}}/>
                <Stack.Screen name='Main' component={MainTabNavigator} options={{gesturesEnabled: 'false'}}/>
                <Stack.Screen name='Reservation' component={ReservationScreen} options={{gestureEnabled: 'false'}}/>
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
