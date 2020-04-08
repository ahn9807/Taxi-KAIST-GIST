import React, { useState, useRef, Component } from "react";
import {
    Text,
    View,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    Dimensions,
    Alert,
    ActivityIndicator,
    InteractionManager,
    Platform,
    BackHandler,
    Animated
} from "react-native";
import { BaseRouter } from "@react-navigation/native";
import firebase from '../config/Firebase'
import MapView, { Marker } from 'react-native-maps';
import findRegionByName from '../Region/Regions'
import * as Reservation from '../Networking/Reservation'
import SearchInput from "../components/SearchInput";
import SearchCopy from "../components/SearchCopy";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Markers, { removeDupulicatedMarkers } from '../components/Markers'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Badge, Overlay, Button, Avatar } from "react-native-elements";
import Details from "../components/Details";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "react-native-modal-datetime-picker";
import FormattedDate from "../tools/FormattedDate";
// import Toast from "readc-native-simple-toast";

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
            targetToRegion: false,
            reservationInfo: {
                target: '마법부',
            },
            showDatePicker: false,
            selectedTime: new Date(),
            detailsNumber: 0,
            backClickCount: 0
        }


        Reservation.setRegion(this.state.initialRegionName)
        Reservation.fetchReservationData().then(function(doc) {
            this.setState({
                isLoading: false,
            })
        }.bind(this)).catch(function(err) {
            alert(err.message)
        })
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }
    
    componentWillUnmount() {
        this.exitApp = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }
    
    handleBackButton = () => {
        if (this.exitApp == undefined || !this.exitApp) {
            this.exitApp = true;
            console.log("한번 더 누르시면 종료")
        // ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            this.timeout = setTimeout(
                () => {
                    this.exitApp = false;
                },
                2000    // 2초
            );
        } else {
            clearTimeout(this.timeout);

            BackHandler.exitApp();  // 앱 종료
        }
        return true;

    };


    handleOnLocationSelected = (data, { geometry }) => {
        console.log(data.structured_formatting.main_text)
        const {
            location: { lat: latitude, lng: longitude },
        } = geometry
        this.setState({
            destination: {
                latlng: {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
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

    handleOnLocationChanged = () => {
        var focusedOnSource = !this.state.targetToRegion
        this.setState({
            targetToRegion: focusedOnSource
        })
    }

    handleOnPinPressed = (marker) => {
        reservationInfo = {
            target: marker.title,
            marker: marker,
        }
    }

    handleOnPinCalloutPressed = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                reservationInfo: {
                    target: reservationInfo.target,
                    marker: reservationInfo.marker
                },
            })
        }).done(function(res) {
            this._panel.show()

            InteractionManager.runAfterInteractions(() =>{
                if(this.state.targetToRegion) {
                    this.setState({
                        detailsNumber: Reservation.getReservationByDateAndSource(this.state.selectedTime.getTime(), reservationInfo.target).length
                    })
                } else {
                    this.setState({
                        detailsNumber: Reservation.getReservationByDateAndDest(this.state.selectedTime.getTime(), reservationInfo.target).length
                    })
                }

            })
        }.bind(this))
    }

    handleOnReservationPressed = () => {
        if(this.state.reservationInfo.target == '마법부') {
            alert('머글은 마법부에 가지 못합니다.')
            return
        }
        setTimeout(() => {
            this.props.navigation.navigate('Reservation',{
                targetToRegion: this.state.targetToRegion,
                regionName: this.state.initialRegionName,
                targetName: this.state.reservationInfo.target,
                marker: this.state.reservationInfo.marker,
                today: this.state.selectedTime,
            })
        })
    }

    render() {

        if(this.state.isLoading == false) {
            if(this.state.targetToRegion) {
                return(
                    <View style={styles.container}>
                        <MapView style={styles.mapStyle} 
                            initialRegion={this.state.region.initialRegion}
                            showsCompass={false}
                            ref={c=>this._mapView = c}
                        >
                            <Markers 
                                markers={this.state.region.defaultMarkers} 
                                pinColor='#007AFF' description='추천 출발 지점 / 클릭해서 예약하기'
                                calloutPressedCallback={this.handleOnPinCalloutPressed}
                                pinPressedCallback={(this.handleOnPinPressed)}
                            />
                            <Markers 
                                markers={removeDupulicatedMarkers(Reservation.getMarkerByDest('KAIST'), this.state.region.defaultMarkers)} 
                                pinColor ='#29AEEC' description='카이스트로 출발 / 클릭해서 예약하기'
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
                        <SearchInput 
                            onLocationSelected={this.handleOnLocationSelected} 
                            focusedOnSource={this.state.targetToRegion}
                            rightButtonCallback={this.handleOnLocationChanged}
                        />
                  
                        <SlidingUpPanel 
                            ref={c=> this._panel = c}
                            backdropOpacity={0.5}
                            friction={0.7}
                            allowDragging={Platform.OS == 'android' ? false : true}
                        >
                            <Details 
                                title={'조회하기'}
                                selectedDate = {this.state.selectedTime}
                                dateCallback={()=>{this.setState({showDatePicker: true})}}
                                source={this.state.reservationInfo.target}
                                dest={this.state.initialRegionName}
                                reservationButton={this.handleOnReservationPressed}
                                reservationInfo={this.state.detailsNumber}
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
                            ref={c=>this._mapView = c}
                        >
                            <Markers 
                                markers={this.state.region.defaultMarkers} 
                                pinColor='#007AFF' description='추천 도착 지점 / 클릭해서 예약하기' 
                                calloutPressedCallback={this.handleOnPinCalloutPressed}
                                pinPressedCallback={this.handleOnPinPressed}
                            />
                            <Markers 
                                markers={removeDupulicatedMarkers(Reservation.getMarkerBySource('KAIST'), this.state.region.defaultMarkers)}
                                pinColor ='#29AEEC' description='카이스트에서 도착 / 클릭해서 예약하기'
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
                        {/* <View style={styles.sdContainer}>
                            <View>
                                <Avatar
                                    rounded
                                    icon={{ name: 'flight-takeoff', color: 'black' }}
                                    overlayContainerStyle={{ backgroundColor: 'white' }}
                                />
                            </View>
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500', fontSize: 25 }}>
                                출발: KAIST
                            </Text>
                        </View> */}
                        <SearchInput 
                            onLocationSelected={this.handleOnLocationSelected} 
                            focusedOnSource={this.state.targetToRegion}
                            rightButtonCallback={this.handleOnLocationChanged}
                        />
                        {/* <SearchCopy 
                            onLocationSelected={this.handleOnLocationSelected} 
                            focusedOnSource={this.state.targetToRegion}
                            rightButtonCallback={this.handleOnLocationChanged}
                        /> */}
                        

                        <Text> d?</Text>
                        
                        <SlidingUpPanel 
                            ref={c=> this._panel = c}
                            backdropOpacity={0.5}
                            friction={0.7}
                            allowDragging={Platform.OS == 'android' ? false : true}
                        >
                            <Details 
                                title={'조회하기'}
                                selectedDate = {this.state.selectedTime}
                                dateCallback={()=>{this.setState({showDatePicker: true})}}
                                source={this.state.initialRegionName}
                                dest={this.state.reservationInfo.target}
                                reservationButton={this.handleOnReservationPressed}
                                reservationInfo={this.state.detailsNumber}
                            />
                        </SlidingUpPanel>
                        <DateTimePicker
                            isVisible={this.state.showDatePicker}
                            mode='date'
                            onCancel={()=>this.setState({ showDatePicker: false })}
                            locale='ko_KR'
                            onConfirm={(date)=>{
                                    this.setState({
                                        selectedTime: date,
                                        showDatePicker: false,
                                        detailsNumber: this.state.targetToRegion ?
                                            Reservation.getReservationByDateAndSource(date, this.state.reservationInfo.target).length :
                                            Reservation.getReservationByDateAndDest(date, this.state.reservationInfo.target).length
                                    })
                                }
                            }
                        />
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
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    spinner: {
        marginTop: 200
    },
    sdContainer: {
        flexDirection:'row', 
        justifyContent:'flex-start', 
        alignItems: 'center', 
        width: '90%',
        backgroundColor:'lightgrey', 
        borderRadius: 5, 
        padding: 5,
        marginLeft: 50,
        marginRight: 50, 
        marginBottom: 2,
    }

})