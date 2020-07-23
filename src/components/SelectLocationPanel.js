import React from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Card, Icon, SearchBar, ListItem, Divider } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SelectLocationPanel = ({locationList, onTouchClose, callback}) => {
    return(
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.downslideContainer}
                onPress = {() => {onTouchClose()}}
            >
                <Icon
                    name='angle-down'
                    type='font-awesome'
                />
            </TouchableOpacity>
            <Divider></Divider>
            <ScrollView style={styles.listviewContainer}>
                {
                    locationList.map((l, i) => (
                        <ListItem
                            key={i}
                            title={l.title}
                            bottomDivider
                            onPress = {()=>{callback(l.title)}}
                        />
                    ))
                }
            </ScrollView>
        </View>
    )
}

export default SelectLocationPanel;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        height: 200,
        width: '100%',
        backgroundColor: 'white',
    },
    downSlideContainer: {
        flex : 1,
        alignItems: 'center',
    },
    searchBarContainer: {
        flex : 1,
        alignItems: 'center',
    },
    listviewContainer: {

    },
})