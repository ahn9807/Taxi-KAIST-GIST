import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { PricingCard, Card, Button, Text, Badge, Divider, ListItem, Avatar, Input } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import tabBarHeight from '../tools/TabBarHeight'
import HorizontalList from './HorizontalList';

const ReservationDetails = ({ startTime, endTime, startTimeButton, comment, endTimeButton, bottomButtonCallback }) => (
    <View style={styles.container}>
        <View style={styles.pricingCardContainer}>
            <View style={styles.sdContainer} onPress={startTimeButton}>
                <View>
                    <Avatar
                        rounded
                        icon={{name:'flight-takeoff', color:'black'}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                    />
                </View>
                <Input
                    placeholder=' Password'
                    onChangeText={text => this.setState({ password: text })}
                    value={'test'}
                    secureTextEntry={true}
                    inputStyle={{color:'white'}}
                    autoCapitalize='none'
                />
            </View>
            <TouchableOpacity style={styles.sdContainer} onPress={startTimeButton}>
                <View>
                    <Avatar
                        rounded
                        icon={{name:'flight-takeoff', color:'black'}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                    />
                </View>
                <Text style={{color: '#fff', textAlign: 'center', fontWeight:'500', fontSize: 25}}>
                    {startTime == null ? '  터치해서 시간 선택' : '  출발 시작  '+FormattedDate(new Date(startTime), true)}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sdContainer} onPress={endTimeButton}>
                <View>
                    <Avatar
                        rounded
                        icon={{name:'flight-land', color:'black'}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                    />
                </View>
                <Text style={{color: '#fff', textAlign: 'center', fontWeight:'500', fontSize: 25}}>
                    {endTime == null ? '  터치해서 시간 선택' : '  출발 마감  '+FormattedDate(new Date(endTime), true)}
                </Text>
            </TouchableOpacity>
            <Button 
                title="예약하기"
                titleStyle={{ textAlign:'center', fontWeight: 'bold'}}
                onPress={bottomButtonCallback}
                buttonStyle={{borderRadius: 30, width:250 }}
                containerStyle={{marginBottom: 20, marginTop: 10}}
                icon={{name: 'local-taxi', color: 'white'}}
            />
        </View>
    </View>
)

export default ReservationDetails;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'flex-end',
        flex: 1,
    },
    pricingCardContainer: {
        paddingTop: 25,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        position: 'absolute',
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
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
    }

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