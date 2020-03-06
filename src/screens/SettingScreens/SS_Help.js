import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import SettingListView from "../../components/SettingListView";

const sections = [
    {
        data: [
            {
                title:'택시는 어떻게 찾나요?',
                content:'택시찾기->\n핀클릭->\n조회하기->\n+ 버튼 클릭 혹은 기존 택시 클릭으로 예약합니다',
                accordion: true
            },
            {
                title:'택시는 어떻게 찾나요?',
                content:'택시찾기->\n핀클릭->\n조회하기->\n+ 버튼 클릭 혹은 기존 택시 클릭으로 예약합니다',
                accordion: true
            },
        ]
    }

]

export default class SS_Help extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            sections: null,
        }
    }

    render() {
        return(
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>도움말</Text>}
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