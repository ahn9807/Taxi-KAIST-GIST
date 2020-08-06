import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView, Clipboard } from "react-native";
import * as Calculation from "../Networking/Calculation"
import { ListItem, Button, Icon, Text, Header, CheckBox, Avatar, Divider } from "react-native-elements"
import firebase from 'firebase'
import 'firebase/firestore'
import { AccordionList } from "accordion-collapse-react-native";
import { Separator } from 'native-base';

export default class CalculationDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoadingHost: false,
            isLoadingSend: false,
            calculationList: [],
            hostList: [],
            sendList: [],
            checked: false

        }
    }

    componentWillReceiveProps(newProps){
        console.log("newPro")
        this.setState({
            isLoadingHost: newProps.isLoadingHost,
            isLoadingSend: newProps.isLoadingSend,
            hostList: newProps.hostList,
            sendList: newProps.sendList,
        })
    }

    completeCalculation = (calculationId) => {
        console.log("???")

        Calculation.completeCalculation(calculationId).then(
            Calculation.fetchCalculationData().then(function (res, err) { //function
                const uid = firebase.auth().currentUser.uid
                this.setState({
                    hostList: Calculation.searchCalculationHostByUId(uid),
                    sendList: Calculation.searchCalculationSendByUId(uid)
                })
                this.props.handleReloadHost()
            }.bind(this))
        )
    }

    deleteCalculation = (calculationId) => {
        Calculation.deleteCalculation(calculationId).then(
            Calculation.fetchCalculationData().then(function (res, err) { //function
                const uid = firebase.auth().currentUser.uid
                this.setState({
                    hostList: Calculation.searchCalculationHostByUId(uid),
                    sendList: Calculation.searchCalculationSendByUId(uid)
                })
                this.props.handleReloadHost()
            }.bind(this))
        )
    }

    _head(item) {
        return (
            <Separator bordered style={{  marginBottom: 5 }}>
                <View style={styles.header}>

                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}
                    >{' ' + item.source + ' ➤ ' + item.dest + ' '}</Text>
                </View>
            </Separator>
        );
    }

    _body_1 = (item) => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.sdContainer}>
                    <View style={{ marginRight: 10 }}>
                        <Avatar
                            rounded
                            icon={{ name: 'money', color: 'black', type: 'font-awesome' }}
                            overlayContainerStyle={{ backgroundColor: 'white' }}
                        />
                    </View>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500', fontSize: 25 }}>
                        {item.charge} 원
                    </Text>
                </View>

                <View style={styles.sdContainer}>
                    <View style={{ marginRight: 10 }}>
                        <Avatar
                            rounded
                            icon={{ name: 'send', color: 'black' }}
                            overlayContainerStyle={{ backgroundColor: 'white' }}
                        />
                    </View>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500', fontSize: 25 }}>
                        {item.accountBank} {item.accountNumber}
                    </Text>
                </View>


                <View style={{ alignItems: "center" }}>
                    <View style={styles.buttonGroup}>
                        <Button title="정산 취소"
                            titleStyle={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}
                            onPress={() => { this.deleteCalculation(item.calculationId) }}
                            buttonStyle={{ borderRadius: 30, width: 150, backgroundColor: "#fff" }}
                            containerStyle={{ marginBottom: 20, marginTop: 10, marginRight: 10 }}
                            icon={{ name: 'local-taxi', color: 'black' }}

                        ></Button>

                        <Button title="정산 완료!"
                            titleStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                            onPress={() => { this.completeCalculation(item.calculationId) }}
                            buttonStyle={{ borderRadius: 30, width: 150 }}
                            containerStyle={{ marginBottom: 20, marginTop: 10 }}
                            icon={{ name: 'local-taxi', color: 'white' }}
                        ></Button>
                    </View>
                </View>
            </View>
        );
    }

    _body_2 = (item) => {
        return (
            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                {/* <Text style={styles.textDetail}>{"     - "}인당 {item.charge}원</Text> */}
                {/* <Text style={styles.textDetail}>{"     - "}계좌 정보: {item.accountBank} {item.accountNumber}</Text> */}
                <View style={styles.sdContainer}>
                    <View style={{ marginRight: 10 }}>
                        <Avatar
                            rounded
                            icon={{ name: 'money', color: 'black', type: 'font-awesome'  }}
                            overlayContainerStyle={{ backgroundColor: 'white' }}
                        />
                    </View>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500', fontSize: 25 }}>
                        {item.charge} 원
                    </Text>
                </View>

                <View style={styles.sdContainer}>
                    <View style={{ marginRight: 10 }}>
                        <Avatar
                            rounded
                            icon={{ name: 'send', color: 'black' }}
                            overlayContainerStyle={{ backgroundColor: 'white' }}
                        />
                    </View>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500', fontSize: 25 }}>
                        {item.accountBank} {item.accountNumber}
                    </Text>
                </View>


                <View style={{ alignItems: "center" }}>
                    <View style={styles.buttonGroup}>
                        <Button title="계좌 복사"
                            titleStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                            onPress={() => {
                                Clipboard.setString(item.accountBank +' '+item.accountNumber)
                                alert('계좌가 복사되었습니당'); //toast
                            }}
                            buttonStyle={{ borderRadius: 30, width: 150 }}
                            containerStyle={{ marginBottom: 20, marginTop: 10 }}
                            icon={{ name: 'copy', color: 'white', type: 'font-awesome'  }}
                        ></Button>

                        
                        <CheckBox
                            // style={{borderRadius: 10}}
                            containerStyle={{borderRadius: 30, width: 150, marginBottom: 20, marginTop: 10 }}
                            center
                            title='보냄 체크!'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.checked}
                            checkedColor='#0078CD'
                            onPress={() => this.setState({ checked: !this.state.checked })}
                        />
                    </View>
                </View>
            </View>
        );
    }


    calculationMenu() {

    }

    render() {
        return (
            <View style={styles.container}>
             
                <ScrollView style={{ marginTop: 0 }}>
                    <View style={{flex:1, backgroundColor:'white'}}>
                        <Divider></Divider>
                        <Text style={{ color: '#333', fontWeight:'bold', fontSize: 15, marginTop: 5, marginBottom: 5, marginLeft: 8}}>
                            {"  받을 목록"}
                        </Text>
                    </View>

                    {/* <View style={{}}> */}
                    {this.state.isLoadingHost ?
                        <View>
                            <ActivityIndicator
                                style={styles.spinner}
                                size='large'
                            />
                        </View>
                        :
                        !this.state.hostList.length ?
                            null
                            :

                            <AccordionList
                                style={styles.accordion}
                                list={this.state.hostList}
                                header={this._head}
                                body={this._body_1}
                                width='100%'
                            />

                    }
                    {/* </View> */}
                    <View style={{flex:1, backgroundColor:'white'}}>
                        <Divider></Divider>
                        <Text style={{ color: '#333', fontWeight:'bold', fontSize: 15, marginTop: 5, marginBottom: 5, marginLeft: 8}}>
                            {"  보낼 목록"}
                        </Text>
                    </View>
                    {this.state.isLoadingSend ?
                        <View>
                            <ActivityIndicator
                                style={styles.spinner}
                                size='large'
                            />
                        </View>
                        :
                        !this.state.sendList.length ? 
                            null
                            :
                            <AccordionList
                                style={styles.accordion}
                                list={this.state.sendList} 
                                header={this._head}
                                body={this._body_2}
                                width='100%'
                            />

                    }

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch"
    },
    accordion: {
        flex: 1,
        // justifyContent: "center"
        // alignItems: "center"
    },
    sdContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        padding: 5,
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 2,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        borderRadius: 5,
        padding: 5,
        marginLeft: 10,
        marginRight: 50,
        marginBottom: 2

    },
    header: {
        // height: 150,
        // justifyContent: 'center',
        // alignItems: 'flex-start'


    },
    spinner: {
        marginTop: 100
    },
    buttonGroup: {
        flexDirection: "row",
        alignItems: "center"
    },
    textDetail: {
        textAlign: "left",
        fontSize: 16,

    }
})