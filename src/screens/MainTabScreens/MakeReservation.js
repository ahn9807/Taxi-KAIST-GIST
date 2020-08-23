import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
} from "react-native"
import { Button, Icon, Header, Input } from "react-native-elements";
import { color } from 'react-native-reanimated';
import SelectLocationPanel from '../../components/SelectLocationPanel'
import SlidingUpPanel from 'rn-sliding-up-panel';
import findRegionByName from '../../Region/Regions';
import KAIST from '../../Region/KAIST';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Reservation from '../../Networking/Reservation'
import firebase from 'firebase'
import 'firebase/firestore'
import DigitalTimePicker from "react-native-24h-timepicker"


export default class MakeReservation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialRegionName: 'KAIST',
            departure: '',
            destination: '',
            panelMode: 'departure',
            pickerMode: 'start',
            showDatePicker: false,
            showTimePicker: false,
            date: new Date(),
            startTime: 0,
            endTime: 0,
            comment: null,
            userInfo:null,


        }
        firebase.firestore() 
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(function (user) {
            // console.log(user.data().displayName)
            this.setState({ 
                // username: user.data().displayName,
                            // avatarUri: user.data().profileUri,
                            userInfo: user.data()
                         }, ()=>{})

        }.bind(this)
        );
    }

    departureClickCallback = () => {
        console.log("set")
        this.setState({ panelMode: 'departure' })
        this._location_panel.show();
    }

    destinationClickCallback = () => {
        this.setState({ panelMode: 'destination' })
        this._location_panel.show();
    }

    dateClickCallback = () => {
        this.setState({ showDatePicker: true })
    }

    startTimeClickCallback = () => {
        this.setState({ pickerMode: 'start' })
        if(Platform.OS=='android'){
            this.startTimeButton();
        }else{
            this.setState({ showTimePicker: true })
        }
    }

    endTimeClickCallback = () => {
        this.setState({ pickerMode: 'end' })
        if(Platform.OS=='android'){
            this.endTimeButton();
        }else{
            this.setState({ showTimePicker: true })
        }
    }


    makeReservationCallback = () => {
        if (this.state.endTime == null || this.state.startTime == null) {
            alert('시작 시간 및 종료 시간을 입력해 주세요')
        }
        else if(this.state.startTime < new Date().getTime()){
            alert('출발 시간이 너무 이릅니다!')
        }
        else if (this.state.startTime > this.state.endTime) {
            alert('시작 시간은 종료 시간을 넘을 수 없습니다.')
        } else if(this.state.departure == '') {
            alert('출발지를 선택해 주세요')
        } else if(this.state.destination == '') {
            alert('도착지를 선택해 주세요')
        }
        else {
            Reservation.makeReservation({
                source: this.state.departure,
                dest: this.state.destination,

                startTime: this.state.startTime,
                endTime: this.state.endTime,
                marker: findRegionByName(this.state.initialRegionName).defaultMarkers.find((s) => { return s.title == this.state.initialRegionName }),
                comment: this.state.comment,
                fullName: this.state.userInfo.fullName

            }).then(function (res, err) {
                if (res == false) {
                    console.log('failed')
                } else {
                    //LocalNotification(this.state.selectedEndTime - (1000 * 60 * 30), '택승', '택시타기 30분 전입니다')
                    //LocalNotification(this.state.selectedEndTime - (1000 * 60 * 10), '택승', '택시타기 10분 전입니다!!\n나갈 준비 해주세요~')
                    //LocalNotification(this.state.selectedEndTime - (1000 * 60 * 5), '택승', '택시타기 5분 전입니다!!')
                    console.log('success')
                    this.props.navigation.navigate('NewHome')

                    //navigate 기능 구현해야함. 
                    //this.handleReloadPress()
                }
            }.bind(this))
        }
    }

    onCancelDigital() {
        this.DigitalTimePicker.close();
      }
     
    onConfirmDigital(hour, minute) {
        this.setState({ time: `${hour}:${minute}` });
        if(this.state.pickerMode=='start'){
            if(this.state.endTime==''){
                this.setState({
                    startTime: new Date(this.state.date).setHours(0,0,0,0) + (hour * 1000 * 60 * 60 + minute * 1000 * 60),
                    endTime:  new Date(this.state.date).setHours(0,0,0,0) + (hour * 1000 * 60 * 60 + (minute+20) * 1000 * 60)
                })    
            }else{
                this.setState({
                    startTime: new Date(this.state.date).setHours(0,0,0,0) + (hour * 1000 * 60 * 60 + minute * 1000 * 60),
                })        
            }
        }else{
            this.setState({
                endTime: new Date(this.state.date).setHours(0,0,0,0) + (hour * 1000 * 60 * 60 + minute * 1000 * 60),
            }) 
        }
        this.DigitalTimePicker.close();
    }

    startTimeButton(){
        this.setState({pickerMode: 'start'})
        this.DigitalTimePicker.open()
    }

    endTimeButton(){
        this.setState({pickerMode: 'end'})
        this.DigitalTimePicker.open()

    }



    render() {
        return (
            <View style={styles.container}>
                <Header
                    placement='left'
                    containerStyle={{ backgroundColor: '#fffa', borderBottomColor: 'transparent' }}
                    rightComponent={<Button type='clear' titleStyle={{ color: 'black' }}
                        icon={<Icon name='menu' type='feather' color='black' onPress={() => { }}></Icon>} />}
                    leftComponent={{ text: '택시 팟 만들기', style: { color: 'black', fontWeight: 'bold', fontSize: 23, } }}
                />
                <View style={styles.subcontainer}>
                    <View style={styles.locationInput}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.locationDetailInput}
                            onPress={() => this.departureClickCallback()}
                        >
                            <Text style={styles.titleText}>
                                출발지
                            </Text>
                            <Text style={styles.inputText}>
                                {this.state.departure}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ width: 30 }}>
                            <Icon
                                name='chevrons-right'
                                type='feather'
                                color='black'
                                size={32}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.locationDetailInput}
                            onPress={() => this.destinationClickCallback()}
                        >
                            <Text style={styles.titleText}>
                                도착지
                            </Text>
                            <Text style={styles.inputText}>
                                {this.state.destination}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Text> ??? </Text> */}
                    <View style={{ marginTop: '5%', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.dateInput}
                            onPress={() => this.dateClickCallback()}

                        >
                            <Text style={styles.titleText}>
                                출발 날짜
                            </Text>
                            <Text style={styles.inputText}>
                                {FormattedDate(this.state.date)}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{alignItems:'center', marginTop: '2%' }}>
                        <Text style={{fontWeight:'bold', color: '#747474'}}>
                            출발 가능 시간
                        </Text>
                    </View>

                    <View style={styles.timeInput}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.locationDetailInput}
                            onPress={() => this.startTimeClickCallback()}

                        >
                            {/* <Text style={styles.titleText}>
                                출발 시간
                            </Text> */}
                            <Text style={styles.inputTimeText}>
                                {this.state.startTime!=0 ?
                                    FormattedTime(this.state.startTime)
                                    :
                                    "언제부터"
                                }
                            </Text>
                        </TouchableOpacity>

                        <View style={{ width: '8%' }}>
                            <Icon
                                name='compare-arrows'
                                type='material'
                                color='black'
                                size={30}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.locationDetailInput}
                            onPress={() => this.endTimeClickCallback()}
                        >
                            {/* <Text style={styles.titleText}>
                                도착 시간
                            </Text> */}
                            <Text style={styles.inputTimeText}>
                                {this.state.endTime!=0 ?
                                    FormattedTime(this.state.endTime)
                                    :
                                    "언제까지"
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.commentInput}>
                        <Input
                            placeholder='ex) 17시 기차에요~'
                            autoCompleteType='off'
                            onChangeText={text => this.setState({ charge: text })}
                            value={this.state.comment}
                            inputStyle={{ color: 'black' }}
                            label={'설명'}
                            returnKeyType='done'
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={40}
                        />

                    </View>

                    <View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.create}
                            onPress={() => this.makeReservationCallback()}
                        >
                            <Text style={styles.createReservationText}>
                                택시 팟 만들기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <SlidingUpPanel
                    ref={c => this._location_panel = c}
                    backdropOpacity={0}
                    allowDragging={false}
                    friction={0.5}
                >
                    <SelectLocationPanel
                        onTouchClose={() => this._location_panel.hide()}
                        locationList={findRegionByName(this.state.initialRegionName).defaultMarkers}
                        callback={(s) => { this.setState(this.state.panelMode == 'departure' ?
                         { departure: s, destination: this.state.initialRegionName } : { destination: s, departure: this.state.initialRegionName })
                        this._location_panel.hide()
                        }}
                    />
                </SlidingUpPanel>
                <DateTimePicker
                    isVisible={this.state.showDatePicker}
                    mode='date'
                    onCancel={() => this.setState({ showDatePicker: false })}
                    locale='ko_KR'
                    onConfirm={(date) => {
                        this.setState({
                            date: date,
                            showDatePicker: false,
                        })
                    }
                    }
                />
                <DateTimePicker
                    isVisible={this.state.showTimePicker}
                    mode='time'
                    locale='ko_KR'
                    onCancel={() => this.setState({ showTimePicker: false })}
                    onConfirm={(date) => {
                        if (this.state.pickerMode == 'start') {
                            this.setState({
                                startTime: new Date(this.state.date).setHours(0,0,0,0) + (date.getHours() * 1000 * 60 * 60 + date.getMinutes() * 1000 * 60),
                                showTimePicker: false,

                            })

                        } else {
                            this.setState({
                                endTime: new Date(this.state.date).setHours(0,0,0,0) + (date.getHours() * 1000 * 60 * 60 + date.getMinutes() * 1000 * 60),
                                showTimePicker: false,
                            })
                        }
                    }
                    }
                />
                <DigitalTimePicker
                    ref={ref => {
                        this.DigitalTimePicker = ref;
                    }}
                    onCancel={() => this.onCancelDigital()}
                    onConfirm={(hour, minute) => this.onConfirmDigital(hour, minute)}
                    textCancel="취소"
                    textConfirm="확인"
                    hourUnit=" 시"
                    minuteUnit=" 분"
                    minuteInterval={5}
                    itemStyle={styles.digitalTimePicker}

                    // selected hour 일단 안했는데 로직 세울수는 있을 것 같다. 
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subcontainer: {
        flex: 1,
    },
    locationInput: {
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeInput: {
        marginTop: '1%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationDetailInput: {
        backgroundColor: '#D5D8DC',
        width: '36%',
        height: 80,
        // justifyContent:'center',
        // alignItems:'center'
    },
    dateInput: {
        backgroundColor: '#D5D8DC',
        width: '80%',
        height: 70,
        justifyContent:'center'
    },
    commentInput: {
        marginTop: '7%',
        marginBottom: '5%',
        width: '80%',
        marginLeft: '10%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputText: {
        color: '#555',
        fontSize: 20,
        flex: 1,
        alignSelf: 'center',
        
        // justifyContent:'center'
    },
    inputTimeText: {
        color: '#555',
        fontSize: 20,
        flex: 1,
        alignSelf: 'center',
        textAlignVertical:'center'
        // justifyContent:'center'
    },
    titleText: {
        color: 'white',
        fontSize: 20,
    },
    create: {
        // flexDirection:'column',
        // textAlign:'center',
        // marginTop: '10%', 
        marginLeft: '10%',
        width: '80%',
        height: 50,
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0078CD',
        borderRadius: 20
    },
    createReservationText: {
        fontSize: 23,
        fontWeight: '500',
        color: '#FFF'
    },
    digitalTimePicker:{
        alignItems:'center'
    }
})

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

function FormattedTime(date, line = false) {
    var d = new Date(date)
    var h = d.getHours()
    var m = d.getMinutes()
    var cvt = 12
    var str = '오전'

    if (h >= 12) {
        str = '오후'
    }

    if (h == 12) {
        cvt = 12
    } else {
        cvt = h % 12
    }

    if (line == false) {
        return str + '\n' + cvt + ':' + n(m)
    } else {
        return str + ' ' + cvt + ':' + n(m)
    }
}

function FormattedDate(date) {
    var m = date.getMonth() + 1
    var d = date.getDate()
    var w = date.getDay()
    var sw = '월'

    switch (w) {
        case 1:
            sw = '월'
            break;
        case 2:
            sw = '화'
            break;
        case 3:
            sw = '수'
            break;
        case 4:
            sw = '목'
            break;
        case 5:
            sw = '금'
            break;
        case 6:
            sw = '토'
            break;
        case 7:
            sw = '일'
            break;
    }

    return m + '월 ' + d + '일 ' + sw + '요일'
}