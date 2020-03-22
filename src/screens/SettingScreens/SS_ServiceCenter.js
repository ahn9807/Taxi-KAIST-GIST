import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import SettingListView from "../../components/SettingListView";

const sections = [
    {
        data: [
            {
              title: '기타문의 사항은 아래 메일로 부탁드립니다.',
              subTitle:'taekseungfirebase@gmail.com',
              hideChevron: true,
              icon: 'ios-alert',
              backgroundColor: '#8E8E93',
            },
          ],
    },
    {
      data: [
        {
          title: '상대방이 약속장소에 오지 않았어요',
          hideChevron: true,
          icon: 'ios-home',
          backgroundColor: '#8E8E93',
          content: '상대방이 말도 없이 택시팟에서 빠진경우, 혹은 약속장소에 나타나지 않을 경우, 그 분을 위해서 기다리실 의무는 없습니다. \n\n약속장소에 나오지 않으신 분은 위약금으로 소정의 택시비가 부과됩니다.'
        },
        {
            title: '같이 동승하신 분이 이상할까봐 걱정되요.',
            hideChevron: true,
            icon: 'ios-home',
            backgroundColor: '#8E8E93',
            content: '저희 어플은 같은 학교나 직장을 가진 분들에 한하여 택시를 잡아드립니다. 조금은 안심이 되지 않을까요?'
        },
        {
            title: '동승자가 정산을 하지 않습니다.',
            hideChevron: true,
            icon: 'ios-home',
            backgroundColor: '#8E8E93',
            content: '모든 동승자는 택시비를 지출하신 분이 지출내역을 정산탭에 입력한 뒤, 하루 이내에 정산을 완료하여야 합니다. 만약 정산이 되지 않은 경우, 나머지 금액은 저희측에서 일단 부담합니다. \n\n그러나 정산을 완료하시지 않으신 분은 일주일 안에 정산을 완료하셔야 합니다.'
          },
          {
            title: '누가 택시비를 내죠?',
            hideChevron: true,
            icon: 'ios-home',
            backgroundColor: '#8E8E93',
            content: '택시비를 지불하는 사람에 대한 일정한 기준은 없습니다. 택시비를 지출하신 분은, 내 택시방의 정산 메뉴를 이용하여 택시비를 등록해주시기 바랍니다.'
        },
        {
            title: '어플에 문제가 있는 것 같아요',
            hideChevron: true,
            icon: 'ios-home',
            backgroundColor: '#8E8E93',
            content: '버그 신고는 ahn9807@gmail.com 혹은 ruddnr@kaist.ac.kr 로 신고해 주시기 바랍니다. \n\n최초 신고자에게는 정도에 따라 소정의 (1000원) 포인트가 지급되며, 택시비로 지출하실 수 있습니다.'
        },
      ],
    },
    
    // Space at the bottom
    { data: [] },
  ];


export default class SS_ServiceCenter extends Component {
    render() {
        return(
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>고객센터</Text>}
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