import React from 'react';
import { View, StyleSheet, SectionList, ActivityIndicator } from 'react-native';

import { ListItem, Divider, SearchBar, Header, Button, Text, Icon, Image } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Accordion } from 'native-base';

import HTML from 'react-native-render-html'

const ORANGE = '#FF9500';
const BLUE = '#007AFF';
const GREEN = '#4CD964';
const RED = '#FF3B30';
const GREY = '#8E8E93';
const PURPLE = '#5856D6';
const TEAL_BLUE = '#5AC8FA';

const defaultProps = {
    sections : [
        {
            data: [
              {
                title: '상호',
                rightTitle: '자네 이걸 어떻게 들어왔니?',
                subTitle: '깜찍준호',
                backgroundColor: BLUE,
                navigation: 'ServiceCenter',
              },
              {
                  title:'아이콘',
                  icon:'ios-more',
                  backgroundColor: 'lightblue',
              }
            ]
        },
      // Space at the bottom
      { data: [] },
    ],
}

export default class SettingListView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            accordionMode: false,
        }
    }
    renderItem = ({
        item: { title, backgroundColor, icon, rightTitle, hideChevron, checkbox, navigation, subTitle, content, imageUri},
    }) => {
        if(content) {
            this.setState({
                accordionMode: true,
            })
            return (
                <Accordion 
                    dataArray={[{title:title, content: content }]} 
                    headerStyle={{backgroundColor: 'white', borderColor: 'transparent', borderWidth: 0}}
                    contentStyle={{backgroundColor: 'white', borderColor: 'transparent', borderWidth: 0}}
                    renderHeader={(item, expanded)=>
                        <ListItem
                            containerStyle={{ paddingVertical: 8 }}
                            switch={checkbox && { value: true }}
                            key={title}
                            chevron={{name:'keyboard-arrow-down', type: 'materialicons', size: 30}}
                            rightTitle={rightTitle}
                            subtitle={subTitle}
                            subtitleStyle={{color: GREY, paddingTop: 8}}
                            title={title}
                        />
                    }
                    renderContent={(item)=>{
                        return(
                            <View style={{backgroundColor:'white'}}>
                                {(imageUri != undefined) && 
                                    <Image 
                                        source={{ uri: imageUri}}
                                        style={{ width: '100%', height: 300}}
                                        PlaceholderContent={<ActivityIndicator />}
                                        resizeMode='contain'
                                    />
                                }
                                <Text style={{color: 'black', paddingVertical: 20, paddingHorizontal: 10, fontWeight: '500'}}>
                                    {item.content}
                                </Text>
                            </View>
                        )
                    }}
                />
            )
        }
        if(icon != undefined) {
            return (
                <ListItem
                    containerStyle={{ paddingVertical: 8 }}
                    switch={checkbox && { value: true }}
                    key={title}
                    chevron={!hideChevron}
                    rightTitle={rightTitle}
                    subtitle={subTitle}
                    subtitleStyle={{color: GREY, paddingTop: 8}}
                    onPress={()=>{navigation && this.props.navigation.push(navigation)}}
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
            )
        }
        else {
            return (
                <ListItem
                    containerStyle={{ paddingVertical: 12 }}
                    switch={checkbox && { value: true }}
                    key={title}
                    subtitle={subTitle}
                    subtitleStyle={{color: GREY, paddingTop: 8}}
                    chevron={!hideChevron}
                    rightTitle={rightTitle}
                    onPress={()=>{navigation && this.props.navigation.push(navigation)}}
                    title={title}
                />
            )
        }

    };
        
    renderSectionHeader = () => <View style={styles.headerSection} />;

    ItemSeparatorComponent = () => (
        <View style={styles.separatorComponent}>
            <Divider style={styles.separator} />
        </View>
    );
    
    keyExtractor = (item, index) => index;

    render() {
    return (
            <View style={styles.container}>
                    <View style={styles.container}>
                        <SectionList
                            keyExtractor={this.keyExtractor}
                            contentContainerStyle={styles.containerStyle}
                            sections={this.props.sections}
                            renderItem={this.renderItem}
                            renderSectionHeader={this.renderSectionHeader}
                            ItemSeparatorComponent={!this.state.accordionMode && this.ItemSeparatorComponent}
                            SectionSeparatorComponent={Divider}
                        />
                </View>
            </View>
        );
    }
}
            
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    separatorComponent: {
        backgroundColor: 'white',
    },
    separator: {
        marginLeft: 28,
    },
    headerSection: {
        height: 15,
    },
});
