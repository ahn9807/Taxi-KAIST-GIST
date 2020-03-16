import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import * as Calculation from "../Networking/Calculation"
import { ListItem, Button, Icon, Text, Header } from "react-native-elements"
import firebase from 'firebase'
import 'firebase/firestore'
import { AccordionList } from "accordion-collapse-react-native";
import { Separator } from 'native-base';

export default class CalculationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoadingHost: true,
            isLoadingSend: true,
            calculationList: [],
            hostList: [],
            sendList: []
        }


        Calculation.fetchCalculationData().then(function (res, err) { //function
            const uid = firebase.auth().currentUser.uid
            this.setState({
                hostList: Calculation.searchCalculationHostByUId(uid),
                sendList: Calculation.searchCalculationSendByUId(uid)
            })
        }.bind(this))

    }

    componentDidMount() {
        this.onLoad();
    }

    onLoad = () => {
        this.props.navigation.addListener('focus', () => {
            this.handleReloadPress();
        });
    };


    handleReloadPress = () => { //arrow func로 해야 에러 안나는 이유?
        console.log(this.state.hostList)
        this.setState({
            isLoadingHost: true,
            isLoadingSend: true,
        })

        Calculation.fetchCalculationData().then(function (res, err) { //function
            const uid = firebase.auth().currentUser.uid
            this.setState({
                hostList: Calculation.searchCalculationHostByUId(uid),
                sendList: Calculation.searchCalculationSendByUId(uid),
                isLoadingSend: false,
                isLoadingHost: false
            })
        }.bind(this))
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
                this.handleReloadPress()
            }.bind(this))
        )

    }

    deleteCalculation =(calculationId)=>{
        Calculation.deleteCalculation(calculationId).then(
            Calculation.fetchCalculationData().then(function (res, err) { //function
                const uid = firebase.auth().currentUser.uid
                this.setState({
                    hostList: Calculation.searchCalculationHostByUId(uid),
                    sendList: Calculation.searchCalculationSendByUId(uid)
                })
                this.handleReloadPress()
            }.bind(this))
        )
    }

    _head(item) {
        return (
            <Separator bordered style={{ alignItems: 'flex-start', marginBottom: 5 }}>
                <View style={styles.header}>
                    <Text style={{fontSize: 20}}
                    >{' ' + item.source + ' ➤ ' + item.dest + ' '}</Text>
                </View>
            </Separator>
        );
    }

    _body = (item) => {
        return (
            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>인당 {item.charge}원</Text>
                <Text style={{ textAlign: 'center' }}>계좌 정보: {item.accountBank} {item.accountNumber}</Text>
            <View style={styles.buttonGroup}> 
                <Button title="정산 취소"
                    titleStyle={{ textAlign: 'center', fontWeight: 'bold', color: 'black'}}
                    onPress={() => { this.deleteCalculation(item.calculationId) }}
                    buttonStyle={{ borderRadius: 30, width: 150, backgroundColor: "#fff"}}
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

        );
    }

    calculationMenu(){

    }

    render() {
        return (
            <View style={styles.container}>

                <Header
                    placement='left'
                    containerStyle={{ backgroundColor: '#fffa', borderBottomColor: 'transparent' }}
                    // leftComponent={<Button type='clear' icon={<Icon name='keyboard-arrow-left' color='black' onPress={this.handleBackPress}></Icon>}></Button>}
                    rightComponent={<Button type='clear' titleStyle={{ color: 'black' }} icon={<Icon name='menu' type='feather' color='black' onPress={this.calculationMenu}></Icon>}></Button>}
                    leftComponent={{ text: ' 정산하기', style: { color: 'black', fontWeight: 'bold', fontSize: 23, } }}
                />

                <View style={{ alignItems: "flex-start" }}>

                    <Text style={{ marginTop: 30, marginBotton: 5, fontSize: 25, }}> 받을 목록 </Text>
                </View>
                {this.state.isLoadingHost ?
                    <View>
                        <ActivityIndicator
                            style={styles.spinner}
                            size='large'
                        />
                    </View>
                    :
                    !this.state.hostList.length ?
                        <View style={{justifyContent: "center", alignItems: "flex"}}>
                            <Text> 없어용 </Text>
                        </View>
                        :
             
                        <AccordionList
                            
                            marginTop={10}
                            style={styles.accordion}
                            list={this.state.hostList}
                            header={this._head}
                            body={this._body}
                            width='80%'
                        />
                   
                }
                <Text style={{ marginBottom: 100, fontSize: 25 }}> 보낼 목록 </Text>
                {this.state.isLoadingSend ?
                    <View>
                        <ActivityIndicator
                            style={styles.spinner}
                            size='large'
                        />
                    </View>
                    :
                    !this.state.sendList.length ?
                        <Text> 없어용 </Text>
                        :
                        <AccordionList
                            marginTop={10}
                            style={styles.accordion}
                            list={this.state.sendList}
                            header={this._head}
                            body={this._body}
                            width='80%'
                        />

                }

                <Button type='clear'

                    icon={<Icon name='cached'
                        color='#5d5d5d'
                        onPress={this.handleReloadPress}>
                    </Icon>}>
                </Button>
            </View>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    accordion: {
        flex: 1,
        // justifyContent: "center"
        // alignItems: "center"


    },
    header:{
        height: 150,
        justifyContent: 'center',
        // alignItems: 'flex-start'
        
        
    },
    spinner: {
        marginTop: 200
    },
    buttonGroup:{
        flexDirection: "row",
    }
})