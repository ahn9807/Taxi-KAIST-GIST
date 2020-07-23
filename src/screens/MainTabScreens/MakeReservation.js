import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from "react-native"
import { Button, Icon, Header, Input } from "react-native-elements";
import { color } from 'react-native-reanimated';
import SelectLocationPanel from '../../components/SelectLocationPanel'
import SlidingUpPanel from 'rn-sliding-up-panel';
import findRegionByName from '../../Region/Regions';
import KAIST from '../../Region/KAIST';

export default class MakeReservation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialRegionName: 'KAIST',
            departure: '도착지',
            destination: '출발지',
            date: '날짜',
            startTime: '언제부터',
            endTime: '언제까지',
            comment: null
            //selectedTime?
        }




    }

    departureClickCallback = () => {
        this._panel.show();
    }

    destinationClickCallback = () => {

        this._destination_panel.show();
    }

    dateClickCallback = () => {

    }

    startTimeClickCallback = () => {

    }

    endTimeClickCallback = () => {

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
                            <Text style={styles.inputText}>
                                도착지
                            </Text>
                            <Text style={styles.titleText}>
                                {this.state.departure}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ width: 30 }}>
                            <Icon
                                name='arrow-right'
                                type='feather'
                                color='black'

                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.locationDetailInput}
                            onPress={() => this.destinationClickCallback()}
                        >
                            <Text style={styles.inputText}>
                                출발지
                            </Text>
                            <Text style={styles.titleText}>
                                {this.state.destination}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Text> ??? </Text> */}
                    <View style={{ marginTop: '5%', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.dateInput}
                            onPress={() => this.locationOnClick}

                        >
                            <Text style={styles.inputText}>
                                {this.state.date}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.locationInput}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.locationDetailInput}
                            onPress={() => this.locationOnClick}

                        >
                            <Text style={styles.inputText}>
                                {this.state.startTime}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ width: '8%' }}>
                            <Icon
                                name='arrow-right'
                                type='feather'
                                color='black'

                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.locationDetailInput}
                            onPress={() => this.locationOnClick}
                        >
                            <Text style={styles.inputText}>
                                {this.state.endTime}
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
                            onPress={() => this.createReservation}

                        >
                            <Text style={styles.createReservationText}>
                                택시 팟 만들기
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <SlidingUpPanel 
                    ref = {c => this._panel = c}
                    backdropOpacity = {0}
                    allowDragging = {false}
                >
                    <SelectLocationPanel
                        onTouchClose = {()=>this._panel.hide()}
                        locationList = {findRegionByName(this.state.initialRegionName).defaultMarkers}
                        callback = {(s)=>{this.setState({departure: s})}}
                    />
                </SlidingUpPanel>
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
        justifyContent: 'center'

    },
    locationInput: {
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationDetailInput: {
        backgroundColor: '#D5D8DC',
        width: '36%',
        height: 100,
    },
    dateInput: {
        backgroundColor: '#D5D8DC',
        width: '80%',
        height: 60
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
        color: '#FFF',
        fontSize: 20,
    },
    titleText: {
        color: 'black',
        fontSize: 20
    },
    create: {
        // flexDirection:'column',
        // textAlign:'center',
        // marginTop: '10%', 
        marginLeft: '10%',
        width: '80%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0078CD',
        borderRadius: 20
    },
    createReservationText: {
        fontSize: 23,
        fontWeight: '500',
        color: '#FFF'
    }
})