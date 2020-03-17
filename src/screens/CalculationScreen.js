import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView } from "react-native";
import * as Calculation from "../Networking/Calculation"
import { ListItem, Button, Icon, Text, Header, CheckBox, Avatar } from "react-native-elements"
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
            sendList: [],
            checked: false

        }


        Calculation.fetchCalculationData().then(function (res, err) { //function
            const uid = firebase.auth().currentUser.uid
            this.setState({
                hostList: Calculation.searchCalculationHostByUId(uid),
                sendList: Calculation.searchCalculationSendByUId(uid)
            })
        }.bind(this))

        this.handleReloadPress()
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

    deleteCalculation = (calculationId) => {
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
                            icon={{ name: 'attatch-money', color: 'black' }}
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
                    </View></View>

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
                            icon={{ name: 'money', color: 'black' }}
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



                {/* <View style={{ marginTop: 20 }}> */}


                {/* </View> */}
                <CheckBox

                    center
                    title='보냈습니다!'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checked}
                    checkedColor='#0078CD'
                    onPress={() => this.setState({ checked: !this.state.checked })}
                />
            </View>

        );
    }


    calculationMenu() {

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

                <ScrollView style={{ marginTop: 0 }}>
                    <View style={{marginTop: 30}}/>
                    <View style={styles.textContainer}>

                        <Avatar
                            rounded
                            icon={{ name: 'check_circle', color: 'black' }}
                            overlayContainerStyle={{ backgroundColor: 'white' }}
                        />
                        <Text  style={{ textAlign: 'center', fontWeight: '500', fontSize: 25 }}> 받을 목록 </Text>
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
                            <View style={{ justifyContent: "center", alignItems: "flex" }}>
                                <Text> 없어용 </Text>
                            </View>
                            :

                            <AccordionList

                                marginTop={10}
                                style={styles.accordion}
                                list={this.state.hostList}
                                header={this._head}
                                body={this._body_1}
                                // height='100%'
                                width='100%'
                            />

                    }
                    {/* </View> */}
                    <View style={{marginTop: 50}}/>
                    
                    <View style={styles.textContainer}>
                        <Avatar
                            rounded
                            icon={{ name: 'check_circle_outline', color: 'black' }}
                            overlayContainerStyle={{ backgroundColor: 'white' }}
                        />
                        <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 25 }}>
                            보낼 목록
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
                        !this.state.hostList.length ? //실험
                            <Text> 없어용 </Text>
                            :
                            <AccordionList
                                marginTop={10}
                                style={styles.accordion}
                                list={this.state.hostList} //실험
                                header={this._head}
                                body={this._body_2}
                                width='100%'
                            />

                    }

                    <Button type='clear'

                        icon={<Icon name='cached'
                            color='#5d5d5d'
                            onPress={this.handleReloadPress}>
                        </Icon>}>
                    </Button>

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