import React, { Component } from "react";
import { Text, View, Button, AsyncStorage, StatusBar, StyleSheet, Dimensions, Alert } from "react-native";
import { BaseRouter } from "@react-navigation/native";
import firebase from '../config/Firebase'
import MapView, { Marker } from 'react-native-maps';
import findRegionByName from '../config/Regions'

// this.props.route.params 에는 유저의 정보가 들어가 있음
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            region: findRegionByName('GIST'),
        }
    }


    render() {
        return(
            <View style={styles.container}>
                <MapView style={styles.mapStyle} region={this.state.region.initialRegion}>
                {this.state.region.markers.map(marker => (
                    <Marker
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}
                    />
                ))}
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})