import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, DatePickerIOS, ImageBackground } from "react-native";
import { Header, Button, Icon, ListItem, Card, Divider, Overlay } from "react-native-elements";
import * as Reservation from '../Networking/Reservation'
import SlidingUpPanel from "rn-sliding-up-panel";
import Details from "../components/Details";
import DateTimePicker from 'react-native-modal-datetime-picker'

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
            today: Date.now(),
            selectedItem: {
                startTime: 0,
                endTime: 0,
            },
            makeNewReservation: false,
            selectedDate: new Date(),
            showTimePicker: false,
            selectedStartTime: new Date(),
            selectedEndTime: new Date(),
            focusOnStart: true,
        }
        Reservation.setRegion(this.state.regionName)
        Reservation.fetchReservationData().then(function(res, err) {
            console.log(Reservation.getReservationByDest(this.state.targetName))
            console.log(Reservation.getReservationBySource(this.state.targetName))
            if(this.state.targetToRegion) {
                this.state.listItem = Reservation.getReservationBySource(this.state.targetName)
            } else {
                this.state.listItem = Reservation.getReservationByDest(this.state.targetName)
            }
            this.setState({
                isLoading: false,
            })
        }.bind(this))

    }
    
    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.listItem != nextState.listItem;
    // }
    // 2/23: 이 코드 넣으면 계속 loading

    handleBackPress = () => {
        this.props.navigation.navigate('Home')
    }

    handleReloadPress = () => {
        this.setState({
            isLoading:true
        })
        Reservation.fetchReservationData().then(function(res, err) {
            console.log(Reservation.getReservationBySource(this.state.targetName))
            console.log(Reservation.getReservationByDest(this.state.targetName))
            if(this.state.targetToRegion) {
                console.log('focus On Source')
                this.setState({
                    listItem: Reservation.getReservationBySource(this.state.targetName)
                })
            } else {
                console.log('Not focus On Source')
                this.setState({
                    listItem: Reservation.getReservationByDest(this.state.targetName)
                })
            }
            this.setState({
                isLoading:false
            })
        }.bind(this))
    }

    handleOnMakeNewReservation = () => {
        this.setState({
            makeNewReservation: true
        })
        console.log('new')
    }

    handleOnSelectExistReservation = (item) => {
        this.setState({
            selectedItem: item
        })
        this._panelExist.show()
        console.log('exist')
        console.log(item)
    }

    handleOnEnterExistReservation = () => {
        console.log('가입시도중')
        Reservation.makeReservation(
            this.state.selectedItem
        ).then(function(res,err) {
            if(res == false) {
                console.log('failed')
            } else {
                console.log('success')
                this.handleReloadPress()
            }
        })
    }

    componentDidMount() {
        this._panelExist.hide()
    }

    render() {
        return(
            <ImageBackground
                source={require('../../images/testBackReservation.jpg')}
                style={{ width: '100%', height: '100%'}}
                resizeMode='cover'
            >
                <View style={styles.container}>
                    <Header
                        containerStyle={{backgroundColor:'transparent'}}
                        leftComponent={<Button type='clear' icon={<Icon name='keyboard-arrow-left' color='#5d5d5d' onPress={this.handleBackPress}></Icon>}></Button>}
                        rightComponent={<Button type='clear' icon={<Icon name='cached' color='#5d5d5d' onPress={this.handleReloadPress}></Icon>}></Button>}
                        centerComponent={{ text: '택시 예약 조회 및 만들기', style: {color: '#5d5d5d', fontWeight:'bold'}}}
                    />
                    <View 
                        style={{justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Text>
                            {this.state.targetToRegion ? this.state.targetName+' -> '+this.state.regionName : this.state.regionName + ' -> ' + this.state.targetName}
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Button title="이전날" onPress={()=> {this.setState({ today: new Date(-86400000 + +new Date(this.state.today))})}}>

                            </Button>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={{fontWeight: 'bold'}}>
                                    {new Date(this.state.today).toString().slice(0,16)}
                                </Text>
                                <Text>
                                    {new Date(this.state.today).toString().slice(0,4)}
                                </Text>
                            </View>
                            <Button title="다음날" onPress={()=> {this.setState({ today: new Date(86400000 + +new Date(this.state.today))})}}>
                                
                            </Button>
                        </View>
                    </View>
                    <View 
                        style={styles.indexContainer}
                    >
                        <Text style={{fontWeight:'bold', fontSize: 15}}>
                            {'예정 출발 시간' + '          ' + '최대 출발 시간'}
                        </Text>
                        <Text style={{fontWeight:'bold', fontSize: 15}}>
                            {'탑승객     '}
                        </Text>
                    </View>
                    <Divider></Divider>
                    {this.state.isLoading == true && 
                        <ActivityIndicator size='large' style={{marginTop: 200}}/>
                    }
                    <ScrollView style={styles.ScrollViewContainer}>
                        <Button title={'+ 새로 만들기'} style={{padding:5}} onPress={this.handleOnMakeNewReservation}/>
                        <Divider></Divider>
                        {this.state.isLoading == false &&
                            this.state.listItem.map((l ,i) => (
                                <ListItem  
                                    key={i}
                                    title={'  ' + FormattedDate(l.startTime) + ' 부터' + '          ' + FormattedDate(l.endTime) + ' 까지'}
                                    rightIcon={{name:'chevron-right'}}
                                    bottomDivider
                                    badge={{value: ' '+l.users.length + ' '}}
                                    onPress={()=>this.handleOnSelectExistReservation(l)}
                                />
                            ))
                        }
                    </ScrollView>
                    <SlidingUpPanel 
                        ref={c=> this._panelExist = c}
                        backdropOpacity={0.5}
                        friction={0.7}
                    >
                        <Details 
                            title={'예약 하기'}
                            target={this.state.targetName} 
                            description={[FormattedDate(this.state.selectedItem.startTime) + ' 부터',FormattedDate(this.state.selectedItem.endTime) + ' 까지']}
                            reservationButton={this.handleOnEnterExistReservation}
                        />
                    </SlidingUpPanel>
                    <Overlay
                        visible={this.state.makeNewReservation}    
                    >
                        <Text>
                            {this.state.targetToRegion ? this.state.targetName+' -> '+this.state.regionName : this.state.regionName + ' -> ' + this.state.targetName}
                        </Text>
                        <Button title='터치해서 예정 출발 시간' onPress={()=>{this.setState({ showTimePicker: true, focusOnStart: true})}}/>
                        <Text>
                            {this.state.selectedStartTime.toString()}
                        </Text>
                        <Button title='터치해서 예정 도착 시간' onPress={()=>{this.setState({ showTimePicker: true, focusOnStart: false})}}/>
                        <Text>
                            {this.state.selectedEndTime.toString()}
                        </Text>
                        <Button title="예약 하기" onPress={()=>{
                            if(this.state.selectedStartTime > this.state.selectedEndTime) {
                                alert('시작 시간은 종료 시간을 넘을 수 없습니다.')
                            } else {
                                if(!this.state.targetToRegion) {
                                    Reservation.makeReservation({
                                        source: this.state.regionName, 
                                        dest: this.state.targetName,
                                        startTime: this.state.selectedStartTime.getTime(),
                                        endTime: this.state.selectedEndTime.getTime(),
                                        marker: this.state.currentMarker,
                                    })
                                    console.log(this.state.currentMarker)
                                } else {
                                    Reservation.makeReservation({
                                        source: this.state.targetName, 
                                        dest: this.state.regionName,
                                        startTime: this.state.selectedStartTime.getTime(),
                                        endTime: this.state.selectedEndTime.getTime(),
                                        marker: this.state.currentMarker,
                                    })
                                    console.log(this.state.currentMarker)
                                }
                            }
                        }}/>
                        <Button title="나가기" onPress={()=>this.setState({ makeNewReservation: false })}/>
                        <DateTimePicker
                        isVisible={this.state.showTimePicker}
                        mode='time'
                        onCancel={()=>this.setState({ showTimePicker: false })}
                        onConfirm={(date)=>{
                                if(this.state.focusOnStart) {
                                    this.setState({
                                        selectedStartTime: date,
                                        showTimePicker: false,
                                    })
                                } else {
                                    this.setState({
                                        selectedEndTime: date,
                                        showTimePicker: false,
                                    })
                                }
                            }
                        }
                    />
                    </Overlay>
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
    indexContainer: {
        width: '100%',
        margin: 0,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mainCardContainer: {
        width: '100%',
        margin: 0,
    },
    makeReservationCardContainer: {
        margin:0,
        paddingBottom: 25,
    },
    ScrollViewContainer: {

    }
})

function FormattedDate(date) {
    var d = new Date(date)
    var h = d.getHours()
    var m = d.getMinutes()

    return ''+h+':'+m
}