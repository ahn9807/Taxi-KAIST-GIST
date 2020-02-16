import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Header, Button, Icon, ListItem, Card, Divider } from "react-native-elements";
import * as Reservation from '../Networking/Reservation'

export default class ReservationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            focusOnSource: false,
            regionName: 'KAIST',
            targetName: '둔산동 갤러리아',
            listItem: null,
            today: Date.now(),
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

    render() {
        return(
            <View style={styles.container}>
                <Header
                    leftComponent={<Button tyle='Solid' icon={<Icon name='keyboard-arrow-left' color='white' onPress={this.handleBackPress}></Icon>}></Button>}
                    rightComponent={<Button tyle='Solid' icon={<Icon name='cached' color='white' onPress={this.handleReloadPress}></Icon>}></Button>}
                    centerComponent={{ text: '택시 예약 조회 및 만들기', style: {color: '#fff', fontWeight:'bold'}}}
                />
                <Card 
                    containerStyle={styles.mainCardContainer}
                    title={this.state.regionName+'->'+this.state.targetName}
                >
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
                </Card>
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
                    {this.state.isLoading == false &&
                        this.state.listItem.map((l ,i) => (
                            <ListItem  
                                key={i}
                                title={'  ' + FormattedDate(l.startTime) + ' 부터' + '          ' + FormattedDate(l.endTime) + ' 까지'}
                                rightIcon={{name:'chevron-right'}}
                                bottomDivider
                                badge={{value: ' '+l.users.length + ' '}}
                            />
                        ))
                    }
                </ScrollView>
                <Card containerStyle={styles.makeReservationCardContainer}>
                    <Button title="새 예약 만들기"/>
                </Card>
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