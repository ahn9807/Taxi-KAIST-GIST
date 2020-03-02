import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView, DatePickerIOS, ImageBackground, TouchableOpacity } from "react-native";
import { Header, Button, Icon, ListItem, Card, Divider, Overlay, Text, Badge, Avatar } from "react-native-elements";
import * as Reservation from '../Networking/Reservation'
import SlidingUpPanel from "rn-sliding-up-panel";
import Details from "../components/Details";
import DateTimePicker from 'react-native-modal-datetime-picker'
import ReservationDetails from "../components/ReservationDetails";

var week = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일']

export default class ReservationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            currentMarker: this.props.route.params.marker,
            targetToRegion: this.props.route.params.targetToRegion,
            regionName: this.props.route.params.regionName,
            targetName: this.props.route.params.targetName,
            listItem: null,
            today: this.props.route.params.today,
            selectedItem: {
                startTime: 0,
                endTime: 0,
            },
            makeNewReservation: false,
            showTimePicker: false,
            selectedStartTime: null,
            selectedEndTime: null,
            focusOnStart: true,
            showDatePicker: false,
        }
        Reservation.setRegion(this.state.regionName)
        Reservation.fetchReservationData().then(function(res, err) {
            if(this.state.targetToRegion) {
                this.state.listItem = Reservation.getReservationByDateAndSource(this.props.route.params.today, this.state.targetName)
            } else {
                this.state.listItem = Reservation.getReservationByDateAndDest(this.props.route.params.today, this.state.targetName)
            }
            this.setState({
                isLoading: false,
            })
        }.bind(this))

    }

    handleBackPress = () => {
        this.props.navigation.navigate('Home')
    }

    handleReloadPress = () => {
        this.setState({
            isLoading:true
        })
        Reservation.fetchReservationData().then(function(res, err) {
            console.log('today:' + new Date(this.state.today).toString())
            if(this.state.targetToRegion) {
                this.setState({
                    listItem: Reservation.getReservationByDateAndSource(this.state.today, this.state.targetName)
                })
            } else {
                this.setState({
                    listItem: Reservation.getReservationByDateAndDest(this.state.today, this.state.targetName)
                })
            }
            this.setState({
                isLoading:false
            })
        }.bind(this))
    }

    handleOnMakeReservation = () => {
        if(this.state.selectedStartTime > this.state.selectedEndTime) {
            alert('시작 시간은 종료 시간을 넘을 수 없습니다.')
        } else {
            if(!this.state.targetToRegion) {
                Reservation.makeReservation({
                source: this.state.regionName, 
                dest: this.state.targetName,
                startTime: this.state.selectedStartTime,
                endTime: this.state.selectedEndTime,
                marker: this.state.currentMarker,
            }).then(function(res,err) {
                if(res == false) {
                    console.log('failed')
                } else {
                    console.log('success')
                    this.handleReloadPress()
                }
            }.bind(this))
            } else {
                Reservation.makeReservation({
                    source: this.state.targetName, 
                    dest: this.state.regionName,
                    startTime: this.state.selectedStartTime,
                    endTime: this.state.selectedEndTime,
                    marker: this.state.currentMarker,
                }).then(function(res,err) {
                    if(res == false) {
                        console.log('failed')
                    } else {
                        console.log('success')
                        this.handleReloadPress()
                    }
                }.bind(this))
            }
        }
    }

    handleOnOpenNewReservation = () => {
        this.setState({
            selectedStartTime: null,
            selectedEndTime: null,
        })
        this._panelExist.show()
    }

    handleOnSelectExistReservation = (item) => {
        this.setState({
            selectedStartTime: item.startTime,
            selectedEndTime: item.endTime,
        })
        this._panelExist.show()
    }

    setListItem = (date) => {
        if(this.state.targetToRegion) {
            this.setState({
                listItem: Reservation.getReservationByDateAndDest(date, this.state.targetName)
            })
        } else {
            this.setState({
                listItem: Reservation.getReservationByDateAndSource(date, this.state.targetName)
            })
        }
    }

    componentDidMount() {
        this._panelExist.hide()
    }

    render() {
        return(
            <ImageBackground
                source={require('../../images/testReservationBack.png')}
                style={{ width: '100%', height: '100%'}}
                resizeMode='cover'
            >
                <View style={styles.container}>
                    <Header
                        containerStyle={{backgroundColor:'#fffa', borderBottomColor: 'transparent'}}
                        leftComponent={<Button type='clear' icon={<Icon name='keyboard-arrow-left' color='black' onPress={this.handleBackPress}></Icon>}></Button>}
                        rightComponent={<Button type='clear' titleStyle={{color:'black'}} icon={<Icon name='plus' type='feather' color='black' onPress={this.handleOnOpenNewReservation}></Icon>}></Button>}
                        centerComponent={{ text: '택시 조회 및 예약', style: {color: 'black', fontWeight:'bold'}}}
                    />
                    <View style={styles.titleContainer}>
                        <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold'}}>
                            {!this.state.targetToRegion ? this.state.regionName + ' ➤ ' + this.state.targetName : this.state.targetName + ' ➤ ' + this.state.regionName}
                        </Text>
                    </View>
                    <Divider style={{height: 1}}></Divider>
                    <View  style={styles.topContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems:'center'}}>
                            <Button 
                                type='outline'
                                title='이전날'
                                titleStyle={{fontSize: 15, fontWeight: '500'}}
                                disabled={new Date(this.state.today).getDate() == new Date().getDate()}
                                containerStyle={{paddingLeft: 20}}
                                buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                                onPress={()=> {this.setState({ today: new Date(-86400000 + +new Date(this.state.today))}); this.handleReloadPress();}}
                            />
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <TouchableOpacity onPress={()=>this.setState({ showDatePicker: true })}>
                                    <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold'}}>
                                        {new Date(this.state.today).getFullYear() + '년 ' + (new Date(this.state.today).getMonth() + 1) + '월 ' + new Date(this.state.today).getDate() + '일'}
                                    </Text>
                                    <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold', paddingTop: 2}}>
                                        {week[new Date(this.state.today).getDay()]}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Button 
                                type='outline'
                                title='다음날'
                                titleStyle={{fontSize: 15, fontWeight: '500'}}
                                containerStyle={{paddingRight: 20}}
                                buttonStyle={{borderRadius: 30, padding: 3, borderWidth: 2}}
                                onPress={()=> {this.setState({ today: new Date(86400000 + +new Date(this.state.today))}); this.handleReloadPress();}}
                            />
                        </View>
                    </View>
                    <Divider style={{height: 1}}></Divider>
                    <View style={styles.middleContainer}>
                        <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold', paddingTop: 2, flex: 1}}>
                            {'출발 시작 시간'}
                        </Text>
                        <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold', paddingTop: 2, flex: 1}}>
                            {'출발 마감 시간'}
                        </Text>
                        <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold', paddingTop: 2, flex: 1}}>
                            {'탑승 인원'}
                        </Text>
                    </View>
                    {this.state.isLoading == true && 
                        <ActivityIndicator size='large' style={{marginTop: 100}}/>
                    }
                    <ScrollView style={styles.ScrollViewContainer}>
                        {this.state.isLoading == false &&
                            this.state.listItem.map((l ,i) => (
                                <TouchableOpacity onPress={()=>this.handleOnSelectExistReservation(l)} key={i}>
                                    <Divider style={{width:'100%', alignSelf:'center', height: 1}}></Divider>
                                    <View style={styles.listContainer}>
                                        <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold', paddingTop: 2, flex: 1}}>
                                            {'🚕 ' + FormattedDate(l.startTime, true)}
                                        </Text>
                                        <Text h5 style={{color: 'black', textAlign: 'center', fontWeight:'bold', paddingTop: 2, flex: 1}}>
                                            {'🚓 ' + FormattedDate(l.endTime, true)}
                                        </Text>
                                        <Badge 
                                            containerStyle={{flex: 1, borderColor: 'transparent'}}
                                            value={' '+l.users.length+' / 4 '}
                                            status={l.users.length == 4 ? 'warning' : 'success'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                    <SlidingUpPanel 
                        ref={c=> this._panelExist = c}
                        backdropOpacity={0.5}
                        friction={0.7}
                        allowDragging={Platform.OS == 'android' ? false : true}
                    >
                        <ReservationDetails
                            startTime={this.state.selectedStartTime}
                            endTime={this.state.selectedEndTime}
                            bottomButtonCallback={this.handleOnMakeReservation}
                            startTimeButton={()=>{this.setState({ showTimePicker: true, focusOnStart: true})}}
                            endTimeButton={()=>{this.setState({ showTimePicker: true, focusOnStart: false})}}
                        />
                    </SlidingUpPanel>
                    <DateTimePicker
                        isVisible={this.state.showTimePicker}
                        mode='time'
                        locale='ko_KR'
                        onCancel={()=>this.setState({ showTimePicker: false })}
                        onConfirm={(date)=>{
                                if(this.state.focusOnStart) {
                                    this.setState({
                                        selectedStartTime: new Date(this.state.today).setHours(0,0,0,0) + (date.getHours() * 1000 * 60 * 60 + date.getMinutes() * 1000 * 60),
                                        showTimePicker: false,
                                    })
                                } else {
                                    this.setState({
                                        selectedEndTime: new Date(this.state.today).setHours(0,0,0,0) + (date.getHours() * 1000 * 60 * 60 + date.getMinutes() * 1000 * 60),
                                        showTimePicker: false,
                                    })
                                }
                            }
                        }
                    />
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        mode='date'
                        onCancel={()=>this.setState({ showDatePicker: false })}
                        locale='ko_KR'
                        onConfirm={(date)=>{
                                this.setState({
                                    today: date,
                                    showDatePicker: false,
                                })
                            }
                        }
                    />
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        flex: 1,
    },
    titleContainer: {
        width: '100%', 
        height: 30, 
        backgroundColor: '#fffa', 
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:'center',
    },
    topContainer: {
        backgroundColor:'#fffa', 
        paddingTop: 10,
        paddingBottom: 10,
    },
    middleContainer: {
        width: '100%', 
        height: 30, 
        backgroundColor: '#fffa', 
        flexDirection:'row', 
        alignItems:'center',
    },
    listContainer: {
        width: '100%', 
        height: 50, 
        backgroundColor: '#fffa', 
        flexDirection:'row', 
        alignItems:'center',
        borderRadius: 5,
    },
    ScrollViewContainer: {

    },
    pricingCardContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        position: 'absolute',
        flex: 1,
    },
    HorizontalListContainer: {
        width: '100%',
        height: 20,
        backgroundColor: 'white',
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
    },
    slidingUpContainer: {
        width: '100%',
        justifyContent: 'flex-end',
        flex: 1,
    },
})

function FormattedDate(date, line = false) {
    var d = new Date(date)
    var h = d.getHours()
    var m = d.getMinutes()
    var cvt = 12
    var str = '오전'

    if(h >= 12) {
        str='오후'
    }

    if(h == 12) {
        cvt = 12
    } else {
        cvt = h % 12
    }
    
    if(line ==false) {
        return str + '\n' + cvt + ':' + m
    } else {
        return str + ' ' + cvt + ':' + m
    }

}