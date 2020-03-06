import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import SettingListView from "../../components/SettingListView";

const sections = [
    {
      data: [
        {
          title: '알림 기능은 구현중 입니다',
          subTitle:'베타 버전은 알림 기능이 제한됩니다',
          hideChevron: true,
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