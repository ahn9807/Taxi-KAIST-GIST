import React, { useState, useRef, Component } from "react";
import { Text, View, Button, AsyncStorage, StatusBar, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { BaseRouter } from "@react-navigation/native";
import firebase from '../config/Firebase'
import MapView, { Marker, Overlay } from 'react-native-maps';
import findRegionByName from '../config/Regions'
import * as Reservation from '../Networking/Reservation'
import SearchInput from "../components/SearchInput";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

Reservation.setRegion('GIST')
var onLocationSelected

// this.props.route.params 에는 유저의 정보가 들어가 있음
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            region: findRegionByName('GIST'),
            isLoading: true,
            destination: null,
            location: null,
        }
        Reservation.setRegion('GIST')
        Reservation.fetchReservationData('GIST').then(function(doc) {
            this.setState({
                isLoading: false
            })
        }.bind(this))
    }

    handleOnLocationSelected = (data, { geometry }) => {
        console.log(data.structured_formatting.main_text)
        const {
            location: { lat: latitude, lng: longitude },
        } = geometry
        this.setState({
            destination: {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                title: data.structured_formatting.main_text,
            }
        })
    }

    handleOnBackPress = () => {
        this.setState({
            destination: null,
        })
    }

    render() {
        if(this.state.isLoading == false) {
            Reservation.getReservationBySource('GIST')
            return(
                <View style={styles.container}>
                    <MapView style={styles.mapStyle} region={this.state.destination}>
                        {this.state.region.markers.map(marker => {
                            return(
                            <Marker
                            key={marker.title}
                            coordinate={marker.latlng}
                            title={marker.title}
                            description={'s:'+ Reservation.getReservationBySource(marker.title).length.toString() + ' d:' + Reservation.getReservationByDest(marker.title).length.toString()}
                            >
                                <Text>
                                    Debug pin
                                </Text>
                            </Marker>
                            )
                        })}
                    </MapView>
                    <SearchInput onLocationSelected={this.handleOnLocationSelected}/>
                </View>
            )
        } else {
            return(
                <View>
                    <ActivityIndicator
                        style={styles.spinner}
                        size='large'
                    />
                </View>
            )
        }
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
    },
    overlay: {
        position: 'absolute',
    },  
    spinner: {
        marginTop: 200
    }
})