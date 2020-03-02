import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Calculation from "../Networking/Calculation"
import { ListItem, Button, Icon } from "react-native-elements"
import firebase from 'firebase'
import 'firebase/firestore'
import { AccordionList } from "accordion-collapse-react-native";
import { Separator } from 'native-base';

export default class CalculationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            calculationList: [],
            hostList: [],
            sendList: []
        }


        Calculation.fetchCalculationData().then(function (res, err) { //function
            const uid = firebase.auth().currentUser.uid
            this.setState({
                calculationList: Calculation.searchCalculationByUId(uid),
                hostList: Calculation.searchCalculationHostByUId(uid),
                sendList: Calculation.searchCalculationSendByUId(uid)
            })
        }.bind(this))

    }


    handleReloadPress = () => { //arrow func로 해야 에러 안나는 이유?
        console.log(this.state.hostList)

        Calculation.fetchCalculationData().then(function (res, err) { //function
            const uid = firebase.auth().currentUser.uid
            this.setState({
                calculationList: Calculation.searchCalculationByUId(uid),
                hostList: Calculation.searchCalculationHostByUId(uid),
                sendList: Calculation.searchCalculationSendByUId(uid)
            })
        }.bind(this))
    }

    _head(item) {
        return (
            <Separator bordered style={{ alignItems: 'center' }}>
                <Text>{' ' + item.source + ' -> ' + item.dest + ' '}</Text>
            </Separator>
        );
    }

    _body(item) {
        return (
            <View style={{ padding: 10 }}>
                <Text style={{ textAlign: 'center' }}>{item.charge} 원</Text>
                <Text style={{ textAlign: 'center' }}>계좌 정보: {item.accountBank} {item.accountNumber}</Text>

                <Button title="정산 완료!"></Button>
            </View>

        );
    }

    render() {
        console.log(this.state.calculationList)
        return (
            <View style={styles.container}>

                {/* {
                    this.state.calculationList.map((l, i) => (
                        <ListItem
                            key={i}
                            title={' ' + l.source + ' -> ' + l.dest + ' '}
                            subtitle={l.charge}
                            bottomDivider
                        />
                    ))
                } */}
                
                <Text style={{ marginTop: 100 }}> 받을 목록 </Text>
                <AccordionList
                    style={styles.accordion}
                    list={this.state.hostList}
                    header={this._head}
                    body={this._body}
                />

                <Text style={{ marginTop: 50 }}> 보낼 목록 </Text>
                <AccordionList
                    style={styles.accordion}
                    list={this.state.sendList}
                    header={this._head}
                    body={this._body}
                />


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
        // alignItems: "center"
    },
    accordion: {
        flex: 1,


    },
    spinner: {
        marginTop: 200
    }
})