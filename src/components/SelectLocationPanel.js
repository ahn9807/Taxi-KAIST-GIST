import React, { useState } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Card, Icon, SearchBar, ListItem, Divider } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { disableExpoCliLogging } from 'expo/build/logs/Logs';

const query = {
    key: 'AIzaSyDFND1fH5Cs8laIZKQ_UbUb0nL0gVx_OQ0',
    language: 'ko',
};


const SelectLocationPanel = ({ locationList, onTouchClose, callback }) => {
    const [searchFocused, setSearchFocused] = useState(false)

    return (
        <View style={styles.container}>
            <Divider></Divider>
            <TouchableOpacity
                style={styles.downslideContainer}
                onPress={() => { onTouchClose() }}
            >
                <Icon
                    name='angle-down'
                    type='font-awesome'
                />
            </TouchableOpacity>
            <GooglePlacesAutocomplete
                textInputProps={{
                    onFocus: () => {
                        setSearchFocused(true);
                    },
                    onBlur: () => {
                        setSearchFocused(false);
                    },
                    autoCapitalize: 'none',
                    autoCorrect: false,
                }}
                onPress={ (data, details = null) => {
                    callback(data.structured_formatting.main_text)
                }}
                placeholder='추가 장소 검색'
                query={query}
                autoFocus={false}
                minLength={2}
                renderDescription={row => {
                    if (row.terms[1] == undefined) {
                        return row.structured_formatting.main_text
                    }
                    return row.terms[1].value + ' ' + row.structured_formatting.main_text
                }}
                listViewDisplayed={searchFocused}
                fetchDetails={true}
                debounce={200}
                enablePoweredByContainer={false}
            />
            {!searchFocused &&
                <ScrollView style={styles.listviewContainer}>
                    {
                        locationList.map((l, i) => (
                            <ListItem
                                key={i}
                                title={l.title}
                                bottomDivider
                                onPress={() => { callback(l.title) }}
                            />
                        ))
                    }
                </ScrollView>
            }
        </View>
    )
}

export default SelectLocationPanel;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        height: 350,
        width: '100%',
        backgroundColor: 'white',
    },
    downSlideContainer: {
        flex: 1,
        alignItems: 'center',
    },
    listviewContainer: {
        paddingTop: 45,
    },
})