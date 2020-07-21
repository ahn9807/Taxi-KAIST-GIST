import React, {Component} from "react"
import { Text,
    StyleSheet,
    View,
    FlatList
        

} from "react-native"
import { Button, ListItem } from "react-native-elements"
import SlidingUpPanel from "rn-sliding-up-panel";

import * as Reservation from '../../Networking/Reservation'


export default class NewHomeScreen extends Component{
    constructor(props){
        super(props)
        this.state={
            initialRegionName: 'KAIST',

            recentReservationList: [],

        }

        this.handleReloadPress()
    }

    //componentdidmount시 onload 구현할 것 .
    
    handleReloadPress= () =>{
        console.log("heheheheh")
        Reservation.setRegion(this.state.initialRegionName)
        Reservation.fetchReservationData().then(()=>{
            this.setState({
                recentReservationList: Reservation.getRecentReservation()
            })
        })
        // .bind(this))   
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, index }) => (

        <View style={{flex: 1, justifyContent: 'center'}}>
             <View style={styles.elem}>
                <ListItem
                    style={styles.reserveList}
                    title={' ' + item.source + ' ➤ ' + item.dest + ' '}
                    subtitle={<Text style={{color: '#0078CD'}}>{' ' + FormattedDate(item.startTime) + ' ~ ' + FormattedDate(item.endTime)}</Text>}
                    badge={{ value: ' ' + item.users.length + ' ' }}
                    // onPress
                    // onLongPress
                />


             </View>
        </View>
    
    )

    makeReservation= () =>{
        console.log("make it")
        this.props.navigation.navigate('MakeReservation')
        
    }
    
    render(){
        return(
        <View style={styles.container}>
            <Text style={{ color: '#000', marginTop: 30, marginBottom: 10, textAlign: 'center', fontWeight: '500', fontSize: 30 }}>
                택시 탈 사람 ㅎㅎ
            </Text>
            
             <View style={styles.buttonGroup}>
                <Button
                    title='장소 선택'
                    containerStyle={{paddingLeft: 20, width: 90}}

                />
                <Button
                    title='시간 선택'
                    containerStyle={{paddingLeft: 20, width: 90}}
                />
                <Button
                    title='여정 추가'
                    containerStyle={{paddingLeft: 20, width: 90}}
                    onPress={this.makeReservation}
                />
                

            </View>


            <FlatList
                style={styles.flatlist}
                data={this.state.recentReservationList}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                windowSize={7}
                //react.memo 사용 고려할 것 . 
            />

            <Button
                title='ㅎㅇ'
                onPress={()=>{this.handleReloadPress}}
            />


        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatlist:{
        flex:1, 
        borderRadius: 10,
        // backgroundColor:'white',
        margin:10, 
        marginBottom:10, 
        paddingTop:10, 
        paddingBottom:10, 
        paddingLeft:10, 
        // position:'absolute', 
        zIndex: 1
        // flexDirection: 'row',
        // justifyContent: 'center'
        // borderRadius: 3,
        // borderColor: '#0FBCFF'

    },
    elem:{
        flex:1, 
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    reserveList: {
        flex: 4,
        justifyContent: 'center',
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden'


    },
    buttonGroup:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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