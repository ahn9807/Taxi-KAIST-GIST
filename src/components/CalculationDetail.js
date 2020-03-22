import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    KeyboardAvoidingView

} from 'react-native';
import { Button, Input, Text, Icon, Divider, Overlay } from 'react-native-elements'
import firebase from 'firebase'
import 'firebase/firestore'
import Modal from "react-native-modal"
import * as Calculation from "../Networking/Calculation"

export default class CalculationDetail extends Component { //클래스형 컴포넌트인데... 여기 분류에 있어도 되겠지?
    constructor(props) {
        super(props)
        this.state = {
            charge: 0,
            dividedCharge: 0,
            index: 0,
            length: 0,
            accountBank: '',
            accountNumber: undefined,
            isModalVisible: false,
        }

        this.setState({
            accountNumber: this.props.userInfo.accountNumber,
            accountBank: this.props.userInfo.accountBank
        })

    }

    componentWillReceiveProps(nextProps) {
        console.log("recive")
        this.setState({
            accountNumber: nextProps.userInfo.accountNumber,
            accountBank: nextProps.userInfo.accountBank
        })
    }

    selectBankModal = () => {
        console.log(13333)
        this.setState({ isModalVisible: !this.state.isModalVisible })
        console.log("passed")
    }



    closeBankModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    calculate = () => {
        const calculationInfo = this.props.calculationInfo
        const userInfo = this.props.userInfo

        const payment = this.state.charge / calculationInfo.users.length
        console.log(payment)
        const { accountNumber } = this.state
        console.log(accountNumber + "fsddffff")

        Calculation.makeCalculation({
            calculationId: calculationInfo.id,

            source: calculationInfo.source,
            dest: calculationInfo.dest,
            startTime: calculationInfo.startTime,
            endTime: calculationInfo.endTime,

            hostId: firebase.auth().currentUser.uid,
            users: calculationInfo.users,

            accountBank: this.state.accountBank, 
            accountNumber: this.state.accountNumber,
            charge: payment
        }).then(function (res, err) {
            if (res == false) {
                console.log('failed')
            } else {
                this.props.onSubmit()
                this.props.offSlidingPanel()
                // this.setState({charge: 0})
                console.log('success')
            }
        }.bind(this))



    }

    render() {
        const calculationInfo = this.props.calculationInfo
        const userInfo = this.props.userInfo

        // console.log("dsdfg" + this.state.accountBank)
        // 탑승인원 default를 user length로 주고, 변경 가능하게 하기( 안 탄 사람이 있을수도 있으니까 )
        // undefined error debugging needed{calculationInfo.users.length} 왜 length만???
        // modal/overlay select, 은행바꾸기 부분 구현 해야 함. 아마도 interactionmanager이해해서 state 다룰 수 있으면 할만할 듯.
        // form을 써도 좋을 듯
        return (

            <KeyboardAvoidingView style={styles.container} behavior='padding'>

                <View style={styles.pricingCardContainer}>

                    <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 15 }} >
                        {calculationInfo.source} 에서 {calculationInfo.dest}
                    </Text>

                    <Text style={styles.textTemp}> 탑승인원: {calculationInfo.users.length} </Text>

                    <View style={styles.inputStyle}>
                        <Text style={styles.textTemp} > 요금 </Text>

                        <Input
                            placeholder='얼마가 나왔나요?'
                            onChangeText={text => this.setState({ charge: text })}
                            value={this.state.charge}
                            inputStyle={{ color: 'black' }}
                            leftIcon={{ name: 'attach-money', color: 'white' }}
                            autoCapitalize='none'
                            width='50%'
                        />
                    </View>
                    <Text style={styles.textTemp2}> 수금 계좌 </Text>

                    <View style={styles.inputStyle}>

                 
                            <Button title={this.state.accountBank}
                                type="outline"
                                icon={
                                    <Icon
                                        name="details"
                                        size={20}

                                    />
                                }
                                iconRight
                                color="black"
                                onPress={this.selectBankModal}

                            />

                        {userInfo.accountNumber != undefined ?
                            <Input
                                placeholder={
                                    userInfo.accountNumber
                                }
                                onChangeText={text => this.setState({ accountNumber: text })}
                                value={this.state.accountNumber}
                                defaultValue={userInfo.accountNumber}
                                inputStyle={{ color: 'black' }}
                                leftIcon={{ name: 'attach-money', color: 'white' }}
                                autoCapitalize='none'
                                width='50%'
                            />
                            :
                            <Input
                                placeholder={
                                    "계좌번호 입력"
                                }
                                onChangeText={text => this.setState({ accountNumber: text })}
                                value={this.state.accountNumber}
                                defaultValue={userInfo.accountNumber}
                                inputStyle={{ color: 'black' }}
                                leftIcon={{ name: 'attach-money', color: 'white' }}
                                autoCapitalize='none'
                                width='50%'
                            />

                        }


                    </View>

                    <Modal isVisible={this.state.isModalVisible} backdropOpacity={0.2}>
                        <TouchableOpacity style={styles.modalContainer}
                            onPressOut={() => { this.closeModal }} //아직 나가기 안함
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                                수금 계좌 은행명을 입력해주세요
                            </Text>
                
                            <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 20 }}>
                                ex) 국민은행 => 국민 , 카카오뱅크 => 카카오
                            </Text>
                            <View style={{width: '38%', alignItems: 'center'}}>
                            <Input
                                placeholder={
                                    "수금 계좌 은행명"
                                }
                                onChangeText={text => this.setState({ accountBank: text })}
                                value={this.state.accountBank}
                                inputStyle={{ color: 'black' }}
                                // leftIcon={{ name: 'attach-money', color: 'white' }}
                                autoCapitalize='none'
                                width='50%'
                            />
                            </View>

                
                            <Button title="완료"
                               buttonStyle={styles.modalButton}
                               containerStyle={{ width: 100 }}
                                onPress={this.closeBankModal}
                            />
                        </TouchableOpacity>
                      

                    </Modal>

                    <Divider />

                    <Button
                        title={"정산하기"}
                        titleStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        buttonStyle={{ borderRadius: 30, width: 250 }}
                        containerStyle={{ marginBottom: 20, marginTop: 10 }}
                        icon={{ name: 'local-taxi', color: 'white' }}
                        onPress={this.calculate}
                    />
                </View>

            </KeyboardAvoidingView>


        )

    }



}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'flex-end',
        flex: 1,
    },
    pricingCardContainer: {
        paddingTop: 25,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        position: 'absolute',
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    inputStyle: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTemp: {
        fontSize: 18,
        marginBottom: 20
    },
    textTemp2: {
        fontSize: 18,
        marginTop: 20
    },
    modalContainer: {
        // width: '70%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20
    },
    modalButton:{
        // width: '70%',
        marginTop: 10,
        backgroundColor: '#29AEEC',
        borderRadius: 3

    }

})