import React, {Component} from "react"
import { Text,
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    BackHandler,
    Modal
        

} from "react-native"
import { Button, ListItem, Overlay, Icon, Header  } from "react-native-elements"
import SlidingUpPanel from "rn-sliding-up-panel";

import * as Reservation from '../../Networking/Reservation'
import FilterLocationPanel from '../../components/FilterLocationPanel'
import DateTimePicker from 'react-native-modal-datetime-picker';
import findRegionByName from '../../Region/Regions';
import SwipeGestures from 'react-native-swipe-gestures'
import GestureRecognizer from "react-native-swipe-gestures";
import EnterReservationPanel from "../../components/EnterReservationPanel"
import PointReservationPanel from "../../components/PointReservationPanel"
import firebase from 'firebase'
import 'firebase/firestore'
import { AskPermission, sendPushNotification } from "../../components/LocalNotification";
import { Notifications } from 'expo'



export default class NewHomeScreen extends Component{
    constructor(props){
        super(props)
        this.state={
            initialRegionName: 'KAIST',
            isLoading: true,
            recentReservationList: [],
            fetchReservationList: [],
            showLocationPanel: false,
            showEnterPanel: false,
            showPointPanel: false,
            showDatePicker: false,
            filterLocation: null,
            filterDate:null,
            isFetching: false,
            enterItem: null,
            userInfo: {},
        }
      
        firebase.firestore() 
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(function (user) {
            // console.log(user.data().displayName)
            this.setState({ 
                // username: user.data().displayName,
                //             avatarUri: user.data().profileUri,
                            userInfo: user.data() })

        }.bind(this)
        );


        this.handleReloadPress()
    }

    componentDidMount() {
        AskPermission()
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

    handleReloadPress= () =>{
        console.log("heheheheh")
        this.setState({
            isLoading: true,
        })
        
        Reservation.setRegion(this.state.initialRegionName)
        Reservation.fetchReservationData().then(()=>{
            let fetchReservationData=Reservation.getRecentReservation()
            this.setState({
                fetchReservationList: fetchReservationData,
            })
        }).then(()=>{
            this.filterLocationDate()
            this.setState({
                // recentReservationList: this.state.fetchReservationList,
                isLoading: false,
                isFetching:false
            })
            
        })
    }

    _onRefresh=()=>{
        this.setState({
            isFetching:true
        }, ()=>{
            this.handleReloadPress()
            // this.temp()
        })
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
                    onPress={()=>{this.setState({
                        showEnterPanel: true,
                        enterItem: item,

                    })} }
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

    locationSelect=() =>{
        // this._home_location_panel.show();
        this.setState({showLocationPanel: true})

    }
    
    dateSelect=() =>{
        this.setState({showDatePicker: true})
    }

    judgeFilterDate=(date, elem)=>{
        let dateSelected=new Date(date)
        let start=new Date(elem.startTime)
        let end=new Date(elem.endTime)
        console.log("judge " + start.getDate(), end.getDate(), dateSelected.getDate())
        return dateSelected.getDate()==start.getDate() || dateSelected.getDate() == end.getDate()
        
        // return true
    } 

    filterLocationDate=() =>{ //parameter needed?

        let filterArray=this.state.fetchReservationList

        if(this.state.filterLocation!=null){
            filterArray=filterArray.filter(r => r.source==this.state.filterLocation || r.dest==this.state.filterLocation)
        }

        if(this.state.filterDate!=null){
            filterArray=filterArray.filter( e => this.judgeFilterDate(this.state.filterDate, e))
        }
        this.setState({
            recentReservationList: filterArray,
            showDatePicker: false,
            showLocationPanel: false
        })

    }


    render(){
        return(
        <View style={styles.container}>
            

            <Header
                containerStyle={{ backgroundColor: '#fffa', borderBottomColor: 'transparent', marginBottom: 20 }}
                centerComponent={{ text: '택시 탈 사람 찾기', style: { color: 'black', fontWeight: 'bold', fontSize: 25 } }}

            />
            <View style={styles.buttonGroup}>
                <Button
                    title='장소 선택'
                    containerStyle={{ width: 90}}
                    onPress={this.locationSelect}
                />

                <Button
                    title='일자 선택'
                    containerStyle={{paddingLeft: 20, width: 110}}
                    onPress={this.dateSelect}
                />
                <Button
                    title='여정 추가'
                    containerStyle={{paddingLeft: 20, width: 110}}
                    onPress={this.makeReservation}
                />
                

            </View>

            <View style={styles.filterCondition}> 
                {this.state.filterLocation==null ?
                null:
                <View style={styles.filterDelete}>
                    <Text>  장소: {this.state.filterLocation} </Text>
                    <TouchableOpacity
                        // style={styles.locationFilterDelete}
                        onPress={() => {this.setState({
                            filterLocation: null
                        }, ()=>{
                            this.filterLocationDate()
                        })
                    }}
                    >
                        <Icon
                            name='cancel'
                            type='material'
                        />
                    </TouchableOpacity>
                </View>
                }
                {this.state.filterDate == null ?
                    null :
                    <View style={styles.filterDelete}>
                        <Text>  날짜: {this.state.filterDate.getMonth()+1}/{this.state.filterDate.getDate()} </Text>
                        <TouchableOpacity
                            // style={styles.locationFilterDelete}
                            onPress={() => {this.setState({
                                filterDate: null
                            }, ()=>{
                                this.filterLocationDate()
                            })
                        }}
                        >
                            <Icon
                                name='cancel'
                                type='material'
                            />
                        </TouchableOpacity>
                    </View>

                }
            </View>

            {this.state.isLoading?
                <View style={{flex:1, alignItems:'center', marginTop: 200}}>
                    <ActivityIndicator size='large'/>
                </View>
                :
       
                //react.memo 사용 고려할 것 . 
                // />  

                <FlatList
                    style={styles.flatlist}
                    data={this.state.recentReservationList}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    windowSize={7}
                    onRefresh={()=> this._onRefresh()}
                    refreshing={this.state.isFetching}
                 />

            }

            {/* <View style={styles.overlay}> */}
            <Overlay
               visible={this.state.showLocationPanel}
               height='auto'
               overlayBackgroundColor='#fffa'>

                <FilterLocationPanel
                        // onTouchClose={() => this._home_location_panel.hide()}
                        onTouchClose={() => {
                            console.log("preeee")
                            this.setState({showLocationPanel:false })
                        
                        }}
                        locationList={findRegionByName(this.state.initialRegionName).defaultMarkers}
                        callback={(location)=>{
                            console.log("loc " + location)
                            this.setState({filterLocation: location}, ()=>{
                                this.filterLocationDate()
                            })
                            
                        }}
                />
            </Overlay>
            
            <DateTimePicker
                    isVisible={this.state.showDatePicker}
                    mode='date'
                    onCancel={() => this.setState({ showDatePicker: false })}
                    locale='ko_KR'
                    onConfirm={(date) => {
                        // this.filterDate(date).then(
                        this.setState({filterDate: date,
                                    showDatePicker: false
                        }, ()=>{
                           this.filterLocationDate() 
                        })
                    }
                }
            />

            <Overlay
               visible={this.state.showEnterPanel}
               height={200}
            //    overlayBackgroundColor='#fffa'
               onBackdropPress={()=>{ this.setState({showEnterPanel: false})}}

               >
                
                <EnterReservationPanel
                    enterItem={this.state.enterItem}
                    showPointPanel={()=>{
                        this.setState({
                            showPointPanel: true,
                            showEnterPanel: false
                        }, ()=> ( console.log("hoho " + this.state.showPointPanel)))
                    }}
                    onTouchClose={() => {
                        this.setState({showEnterPanel:false })
                    
                    }}
                    handleReloadPress={this.handleReloadPress}
                    fullName={this.state.userInfo.fullName}
                    
                
                />
            </Overlay>

            <Overlay
               visible={this.state.showPointPanel}
               height={200}
            //    overlayBackgroundColor='#fffa'
               onBackdropPress={()=>{ this.setState({showEnterPanel: false})}}

               >
                
                <PointReservationPanel
                    enterItem={this.state.enterItem}
                    onTouchClose={() => {
                        this.setState({showPointPanel:false })
                    
                    }}
                    handleReloadPress={this.handleReloadPress}
                    fullName={this.state.userInfo.fullName}

                />
                
            </Overlay>

   
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
        // marginBottom:10, 
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
        justifyContent: 'center',
        // marginBottom: 5
    },
    filterCondition:{
        // marginLeft: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    overlay:{
        // position: 'absolute'
    },
    filterDelete:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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