import React, { useState, useRef, Component } from "react";
import { Text, View, Button, AsyncStorage, StatusBar, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { BaseRouter } from "@react-navigation/native";
import firebase from '../config/Firebase'
import MapView, { Marker } from 'react-native-maps';
import findRegionByName from '../Region/Regions'
import * as Reservation from '../Networking/Reservation'
import SearchInput from "../components/SearchInput";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Markers, { removeDupulicatedMarkers } from '../components/Markers'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Badge, Overlay } from "react-native-elements";
import Details from "../components/Details";

var reservationInfo

// this.props.route.params 에는 유저의 정보가 들어가 있음
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialRegionName: 'KAIST',
            region: findRegionByName('KAIST'),
            isLoading: true,
            destination: null,
            location: null,
            focusedOnSource: false,
            reservationInfo: {
                target: '마법부',
            },
        }

        Reservation.setRegion(this.state.initialRegionName)
        Reservation.fetchReservationData().then(function(doc) {
            this.setState({
                isLoading: false,
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
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                title: data.structured_formatting.main_text,
            },
            location: {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }
        })
        this._mapView.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        })
    }

    handleOnBackPress = () => {
        this.setState({
            destination: null,
        })
    }

    handleOnLocationRightButtonSelected = () => {
        var focusedOnSource = !this.state.focusedOnSource
        this.setState({
            focusedOnSource: focusedOnSource
        })
    }

    handleOnPinPressed = (marker) => {
        reservationInfo = {
            target: marker.title
        }
    }

    handleOnPinCalloutPressed = () => {
        console.log('sdf')
        this.setState({
            reservationInfo: {
                target: reservationInfo.target
            }
        })
        this._panel.show()
    }

    handleOnReservationPressed = () => {
        this.props.navigation.navigate('Reservation')
    }

    render() {
        if(this.state.isLoading == false) {
            if(this.state.focusedOnSource) {
                return(
                    <View style={styles.container}>
                        <MapView style={styles.mapStyle} 
                            initialRegion={this.state.region.initialRegion}
                            showsCompass={false}
                            ref={c=>this._mapView = c}
                        >
                            <Markers 
                                markers={this.state.region.defaultMarkers} 
                                pinColor='orange' description='추천 출발 지점 / 클릭해서 예약하기'
                                calloutPressedCallback={this.handleOnPinCalloutPressed}
                                pinPressedCallback={(this.handleOnPinPressed)}
                            />
                            <Markers 
                                markers={removeDupulicatedMarkers(Reservation.getMarkerBySource('KAIST'), this.state.region.defaultMarkers)} 
                                pinColor ='blue' description='카이스트로 출발 / 클릭해서 예약하기'
                                calloutPressedCallback={this.handleOnPinCalloutPressed}
                                pinPressedCallback={this.handleOnPinPressed}
                            />
                            {this.state.destination != null && 
                                <Marker
                                    coordinate={this.state.location}
                                    title={this.state.destination.title}
                                    description='선택한 위치 / 클릭해서 예약하기'
                                    onCalloutPress={()=>this.handleOnPinCalloutPressed()}
                                    onPress={()=>this.handleOnPinPressed(this.state.destination)}>
                                </Marker>
                            }
                        </MapView>
                        <SearchInput onLocationSelected={this.handleOnLocationSelected} 
                        rightButtonCallback={this.handleOnLocationRightButtonSelected} 
                        focusedOnSource={this.state.focusedOnSource}/>
                        <SlidingUpPanel 
                            ref={c=> this._panel = c}
                            backdropOpacity={0.5}
                            friction={0.7}
                        >
                            <Details target={this.state.reservationInfo.target} 
                                description={[this.state.reservationInfo.target+'->'+this.state.initialRegionName]}
                                reservationButton={this.handleOnReservationPressed}
                            />
                        </SlidingUpPanel>
                    </View>
                )
            } else {
                return(
                    <View style={styles.container}>
                        <MapView style={styles.mapStyle} 
                            initialRegion={this.state.region.initialRegion}
                            showsCompass={false}
                        >
                            <Markers 
                                markers={this.state.region.defaultMarkers} 
                                pinColor='orange' description='추천 도착 지점 / 클릭해서 예약하기' 
                                calloutPressedCallback={this.handleOnPinCalloutPressed}
                                pinPressedCallback={this.handleOnPinPressed}
                            />
                            <Markers 
                                markers={removeDupulicatedMarkers(Reservation.getMarkerByDest('KAIST'), this.state.region.defaultMarkers)}
                                pinColor ='blue' description='카이스트에서 도착 / 클릭해서 예약하기'
                                calloutPressedCallback={this.handleOnPinCalloutPressed}
                                pinPressedCallback={this.handleOnPinPressed}
                            />
                            {this.state.destination != null && 
                                <Marker
                                    coordinate={this.state.location}
                                    title={this.state.destination.title}
                                    description='선택한 위치 / 클릭해서 예약하기'
                                    onCalloutPress={()=>this.handleOnPinCalloutPressed()}
                                    onPress={()=>this.handleOnPinPressed(this.state.destination)}>
                                </Marker>
                            }
                        </MapView>
                        <SearchInput onLocationSelected={this.handleOnLocationSelected} 
                        rightButtonCallback={this.handleOnLocationRightButtonSelected}
                        focusedOnSource={this.state.focusedOnSource}/>
                        <SlidingUpPanel 
                            ref={c=> this._panel = c}
                            backdropOpacity={0.5}
                            friction={0.7}
                        >
                            <Details target={this.state.reservationInfo.target} 
                                description={[this.state.initialRegionName+'->'+this.state.reservationInfo.target]}
                                reservationButton={this.handleOnReservationPressed}
                            />
                        </SlidingUpPanel>
                    </View>
                )
            }
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