import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import * as Calculation from "../Networking/Calculation"
import { ListItem, Button, Icon, Text } from "react-native-elements"
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

    _head(item) {
        return (
            <Separator bordered style={{ alignItems: 'center' }}>
                <Text >{' ' + item.source + ' ➤ ' + item.dest + ' '}</Text>
            </Separator>
        );
    }

    _body = (item) => {
        return (
            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>{item.charge} 원</Text>
                <Text style={{ textAlign: 'center' }}>계좌 정보: {item.accountBank} {item.accountNumber}</Text>

                <Button title="정산 완료!"
                    titleStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                    onPress={() => { this.completeCalculation(item.calculationId) }}
                    buttonStyle={{ borderRadius: 30, width: 250 }}
                    containerStyle={{ marginBottom: 20, marginTop: 10 }}
                    icon={{ name: 'local-taxi', color: 'white' }}
                ></Button>
            </View>

        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ marginTop: 100, fontSize: 25 }}> 받을 목록 </Text>
                {this.state.isLoadingHost ?
                    <View>
                        <ActivityIndicator
                            style={styles.spinner}
                            size='large'
                        />
                    </View>
                    :
                    !this.state.hostList.length ?
                        <View>
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
                <Text style={{ marginTop: 50, fontSize: 25 }}> 보낼 목록 </Text>
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


    },
    spinner: {
        marginTop: 200
    }
})