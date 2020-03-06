import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import SettingListView from "../../components/SettingListView";

const ORANGE = '#FF9500';
const BLUE = '#007AFF';
const GREEN = '#4CD964';
const RED = '#FF3B30';
const GREY = '#8E8E93';
const PURPLE = '#5856D6';
const TEAL_BLUE = '#5AC8FA';

const sections = [
  {
    data: [
      {
        title: '이름',
        rightTitle: '택시승강장',
        hideChevron: true,
      },
      {
        title: '버전',
        rightTitle: 'beta 1.0.0',
        hideChevron: true,
      },
    ],
  },
  {
    data: [
      {
        title: '상호',
        rightTitle: '택승',
        hideChevron: true,
      },
      {
        title: '개발자',
        subTitle: '안준호 ahn9807@gmail.com \n남경욱 경욱@kaist.ac.kr',
        hideChevron: true,
      },
      {
        title: '대표 이메일',
        subTitle: 'taekseungfirebase@gmail.com',
        hideChevron: true,
      },
    ],
  },
  // Space at the bottom
  { data: [] },
];


export default class SS_Information extends Component {
    render() {
        return(
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>택승 정보</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <SettingListView sections={sections}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
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