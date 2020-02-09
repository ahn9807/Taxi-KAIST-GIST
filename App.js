import React from  'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import appReducers from './src/reducers/Index'

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator()

const AuthNavigator = () => (
    <Stack.Navigator headerMode='none' initialRouteName='Welcome'>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='Signup' component={SignupScreen}/>
        <Stack.Screen name='Welcome' component={WelcomeScreen}/>
    </Stack.Navigator>
)

function AppNavigator() {
    return(
        <NavigationContainer>
            <Stack.Navigator headerMode='none' initialRouteName='Auth'>
                <Stack.Screen name='Auth' component={AuthNavigator}/>
                <Stack.Screen name='Home' component={HomeScreen}/>
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
