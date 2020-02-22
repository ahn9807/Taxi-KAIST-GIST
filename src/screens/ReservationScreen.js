import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, DatePickerIOS } from "react-native";
import { Header, Button, Icon, ListItem, Card, Divider, Overlay } from "react-native-elements";
import * as Reservation from '../Networking/Reservation'
import SlidingUpPanel from "rn-sliding-up-panel";
import Details from "../components/Details";
import DateTimePicker from '@react-native-community/datetimepicker'

export default class ReservationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            focusOnSource: this.props.route.params.focusOnSource,
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
        }
        Reservation.setRegion(this.state.regionName)
        Reservation.fetchReservationData().then(function(res, err) {
            if(this.state.focusOnSource) {
                this.state.listItem = Reservation.getReservationBySource(this.state.targetName)
            } else {
                this.state.listItem = Reservation.getReservationByDest(this.state.targetName)
            }
            console.log(this.state.listItem)
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
            if(this.state.focusOnSource) {
                this.state.listItem = Reservation.getReservationBySource(this.state.targetName)
            } else {
                this.state.listItem = Reservation.getReservationByDest(this.state.targetName)
            }
            console.log(this.state.listItem)
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
            <View style={styles.container}>
                <Header
                    leftComponent={<Button tyle='Solid' icon={<Icon name='keyboard-arrow-left' color='white' onPress={this.handleBackPress}></Icon>}></Button>}
                    rightComponent={<Button tyle='Solid' icon={<Icon name='cached' color='white' onPress={this.handleReloadPress}></Icon>}></Button>}
                    centerComponent={{ text: '택시 예약 조회 및 만들기', style: {color: '#fff', fontWeight:'bold'}}}
                />
                <View 
                    style={{justifyContent: 'center', alignItems: 'center'}}
                >
                    <Text>
                        {this.state.focusOnSource ? this.state.regionName+' -> '+this.state.targetName : this.state.targetName + ' -> ' + this.state.regionName}
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
                        {this.state.focusOnSource ? this.state.regionName+' -> '+this.state.targetName : this.state.targetName + ' -> ' + this.state.regionName}
                    </Text>
                    <Text>
                        예정 출발 시간
                    </Text>
                    <Text>
                        asdf
                    </Text>
                    <Text>
                        asdf
                    </Text>
                    <DateTimePicker
                        value={new Date()}
                    />
                    <Text>
                        최대 출발 시간
                    </Text>
                    <Button title="예약 하기">
                        
                    </Button>
                    <Button title="나가기" onPress={()=>this.setState({ makeNewReservation: false })}>

                    </Button>
                </Overlay>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'white'
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