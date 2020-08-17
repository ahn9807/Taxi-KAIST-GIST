import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
} from "react-native"
import { Button, Text, Divider } from "react-native-elements"
import * as Reservation from "../Networking/Reservation"



const PointReservationPanel =({enterItem, onTouchClose, handleReloadPress, fullName})=>{ 

    
    function maskName(nameArray){
        console.log("name"+nameArray)
        let tempArray=Array.from(nameArray)
   
        for(let i=0;i<nameArray.length;i++){
            let tempString=""
            for(let j=0;j<nameArray[i].length;j++){
                if(j%2==1){
                    tempString+="*"
                }else{
                    tempString+=nameArray[i][j]
                }
            }
            tempArray[i]=tempString+" "
        }
        return tempArray
    }

    return (
        <View style={styles.container}>

                <Text>
                    참여 하시겠습니까?{"\n"}
                    내 포인트: 10000{"\n"}
                    차감 포인트: 0
                </Text>

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
                        // 여기서 함수 실행

                        enterItem.fullName=fullName
                        // console.log(enterItem)
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
                                // 채팅방으로 바로 이동하시겠습니까? 넣으면 좋을듯. 

                            }
                        )
 
                    }}

                />
            
         
        </View>

    )
}

export default PointReservationPanel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
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