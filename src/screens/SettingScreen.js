import React from 'react';
import { View, StyleSheet, SectionList } from 'react-native';

import { ListItem, Divider, SearchBar, Header, Button, Text, Icon } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

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
        title: '공지사항',
        icon: 'ios-megaphone',
        backgroundColor: ORANGE,
        navigation: 'Announcement',
      },
      {
        title: '도움말',
        backgroundColor: BLUE,
        icon: 'ios-help-circle',
        navigation: 'Help',
      },
      {
        title: '택승 정보',
        backgroundColor: GREEN,
        icon: 'ios-information-circle',
        navigation: 'Information',
      },
    ],
  },
  {
    data: [
      {
        title: '프로필',
        icon: 'md-person',
        backgroundColor: RED,
        navigation: 'Profile',
      },
      {
        title: '계정',
        backgroundColor: GREY,
        icon: 'ios-switch',
        navigation: 'Account',
        navigation: 'Account',
      },
      {
        title: '계좌 정보',
        backgroundColor: PURPLE,
        icon: 'ios-wallet',
        navigation: 'Wallet',
      },
    ],
  },
  {
    data: [
      {
        title: '알림',
        icon: 'ios-notifications',
        backgroundColor: GREY,
        navigation: 'Notice',
      },
      {
        title: '대화',
        backgroundColor: BLUE,
        icon: 'ios-text',
        navigation: 'Messenger',
      },
      {
        title: '이용내역',
        backgroundColor: TEAL_BLUE,
        icon: 'logo-buffer',
        navigation: 'History',
      },
      {
        title: '테마',
        backgroundColor: RED,
        icon: 'ios-brush',
        navigation: 'Theme',
      },
      {
        title: '기타',
        backgroundColor: RED,
        icon: 'ios-more',
        navigation: 'ETC',
      },
    ],
    },
    {
        data: [
          {
            title: '고객센터/문의',
            icon: 'ios-headset',
            backgroundColor: BLUE,
            navigation: 'ServiceCenter',
          },
        ]
    },
  // Space at the bottom
  { data: [] },
];

export default class SettingScreen extends React.PureComponent {
  renderItem = ({
    item: { title, backgroundColor, icon, rightTitle, hideChevron, checkbox, navigation },
  }) => (
    <ListItem
      containerStyle={{ paddingVertical: 8 }}
      switch={checkbox && { value: true }}
      key={title}
      chevron={!hideChevron}
      rightTitle={rightTitle}
      onPress={()=>{this.props.navigation.push(navigation)}}
      leftIcon={{
        type: 'ionicon',
        name: icon,
        size: 20,
        color: 'white',
        containerStyle: {
          backgroundColor,
          width: 28,
          height: 28,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
      title={title}
    />
  );

  renderSectionHeader = () => <View style={styles.headerSection} />;

  ItemSeparatorComponent = () => (
    <View style={styles.separatorComponent}>
      <Divider style={styles.separator} />
    </View>
  );

  keyExtractor = (item, index) => index;

  render() {
    return (
        <View style={{flex: 1}}>
            <Header
                centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>설정</Text>}
                containerStyle={{backgroundColor:'white'}}
            />
            <Divider></Divider>
            <View style={styles.container}>
                <SectionList
                    keyExtractor={this.keyExtractor}
                    contentContainerStyle={styles.containerStyle}
                    sections={sections}
                    renderItem={this.renderItem}
                    renderSectionHeader={this.renderSectionHeader}
                    ItemSeparatorComponent={this.ItemSeparatorComponent}
                    SectionSeparatorComponent={Divider}
                />
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  separatorComponent: {
    backgroundColor: 'white',
  },
  separator: {
    marginLeft: 58,
  },
  headerSection: {
    height: 30,
  },
});
