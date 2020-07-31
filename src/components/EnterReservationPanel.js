import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
} from "react-native"
import { Button, Text, Divider } from "react-native-elements"
import * as Reservation from "../Networking/Reservation"

// 이름 표시를 위해 reservation 만들때 이름정보 추가해야함(fullname)
// 인원 누르면 토글되는 구조로.  
const EnterReservationPanel =({enterItem, onTouchClose, handleReloadPress})=>{
    return (
        <View style={styles.container}>

            <Text style={{fontSize: 30, textAlign: 'center', fontWeight: 'bold', marginBottom: 30}}>
                {enterItem.source} ➤ {enterItem.dest}
            </Text>
            <Text style={{fontSize: 20, textAlign: 'center', color: '#0078CD'}}>
                {FormattedDate(enterItem.startTime)} ~ {FormattedDate(enterItem.endTime)}
            </Text>
            <Text style={{textAlign: 'center', marginBottom: 20}}>
                인원: {enterItem.users.length}/4
            </Text>
            <Divider/>
            <View style={styles.buttonGroup}>
                <Button
                    title="닫기"
                    titleStyle={{ textAlign: 'center', fontWeight: 'bold', color: '#0078CD' }}
                    buttonStyle={styles.button}
                    onPress={()=>{onTouchClose()}}
                    // elevation={5}
                />
                    {/* <Text>닫기</Text> */}
                {/* </Button> */}
                
                <Button
                    title="참여하기"
                    buttonStyle={styles.button2}
                    titleStyle={{ textAlign: 'center', fontWeight: 'bold', color: '#FFF' }}
                    onPress={()=>{
                        console.log(enterItem)
                        
                        Reservation.makeReservation(enterItem)
                        .then(
                            function(res,err) {
                                if(res == false) {
                                    console.log('failed')
                                } else {
                                    LocalNotification(this.state.selectedEndTime - (1000 * 60 * 30), '택승', '택시타기 30분 전입니다')
                                    LocalNotification(this.state.selectedEndTime - (1000 * 60 * 10), '택승', '택시타기 10분 전입니다!!\n나갈 준비 해주세요~')
                                    LocalNotification(this.state.selectedEndTime - (1000 * 60 * 5), '택승', '택시타기 5분 전입니다!!')
                                    console.log('success')
                             
                                    // this.handleReloadPress()
                                }
                                handleReloadPress()
                                onTouchClose()
                            }
                        )
 
                    }}

                />

            </View>
               
            
         
        </View>

    )
}

export default EnterReservationPanel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 250,
        // bottom: 0,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        // // top: 0,
        left: -2,
        right: -2,
        bottom: -21,
        borderRadius: 30,
        overflow: 'hidden'
    },
    textContainer:{
        flex: 1,
        backgroundColor: 'white',
        
        // height: ,
        // justifyContent: 'center',
        // // position: 'absolute',
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '10%'
    },
    button: {
        width: '80%',
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,

        // flex: 2
    },
    button2: {
        width: '80%',
        backgroundColor: '#0078CD',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,


        // flex: 2
    }
})

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

function FormattedDate(date) {
    var f = new Date(date)
    var d = f.getDate()
    var h = f.getHours()
    var m = f.getMinutes()

    return d + '일 ' + n(h) + ':' + n(m)
}