import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import SettingListView from "../../components/SettingListView";

const sections = [
    {
      data: [
        {
          title: '기본 산뜻 테마',
          subTitle:'현재 사용중인 테마',
          hideChevron: true,
          icon: 'ios-home',
          backgroundColor: '#8E8E93',
        },
      ],
    },
    
    // Space at the bottom
    { data: [] },
  ];


export default class SS_Theme extends Component {
    render() {
        return(
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>테마</Text>}
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