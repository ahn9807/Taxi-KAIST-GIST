import React, { Component } from "react";
import { ImageBackground, StyleSheet, View, AsyncStorage } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import SettingListView from "../../components/SettingListView";
import { Switch } from "react-native";

const sections = [
    {
      data: [
        {
          icon:'ios-notifications',
          backgroundColor: '#007AFF',
          title: '알림 허용',
          hideChevron: true,
          checkbox: true,
        },
        {
            icon:'md-volume-high',
            backgroundColor: '#4CD964',
            title: '사운드',
            hideChevron: true,
            checkbox: true,
        },
      ],
    },
    
    // Space at the bottom
    { data: [] },
  ];


export default class SS_Notice extends Component {
    render() {
        return(
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>알림</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <Divider></Divider>
                <SettingListView sections={sections}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        height: '50%',
    },
    footerContainer: {
        height: '10%',
        justifyContent: 'flex-end'
    },
})