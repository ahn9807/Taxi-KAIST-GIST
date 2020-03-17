import React, { Component } from "react";
import { ImageBackground, StyleSheet, View, KeyboardAvoidingView, AsyncStorage } from "react-native";
import { Icon, Button, Header, Text, Divider, Input } from "react-native-elements";
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'
import firebase from 'firebase'
import 'firebase/firestore'

export default class SS_Wallet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bankAccount: '',
            bankName: '',
        }

        this.tryToSetAccountFirst()
    }

    _handlingCardNumber(number) {
        this.setState({
          //cardNumber: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim(),
          bankAccount: number,
        });
    }

    _buttonTitle(name) {
        return (
            <Text style={{color: 'black', marginTop: 15, textAlign: 'auto', fontSize: 15, paddingBottom: 33.5,}}>
                {name + ' '}
            </Text>
        )
    }

    async tryToSetAccountFirst() {
        const bankAccount = await AsyncStorage.getItem('@loggedInUserID:backAccount')
        const bankName = await AsyncStorage.getItem('@loggedInUserID:bankName')
        if(bankAccount != null && bankName !=null) {
            this.setState({
                bankAccount: bankAccount,
                bankName: bankName,
            })
        } else {
            var user_uid = firebase.auth().currentUser.uid
            firebase.firestore()
            .collection('users')
            .doc(user_uid)
            .get()
            .then(function(user) {
                if(user.exists) {
                    var bankAccount = user.data().bankAccount
                    var backName = user.data().bankName

                    this.setState({
                        backName: backName,
                        bankAccount: bankAccount,
                    })
                }
            }.bind(this))
        }
    }

    onRegister() {
        if(this.state.bankAccount.length < 10 || this.state.bankName.length ==0) {
            alert('입력 정보가 누락되거나 잘못 되었습니다')
            return
        }
        const data = {
            bankAccount: this.state.bankAccount,
            bankName: this.state.bankName,
        }
        var userUid = firebase.auth().currentUser.uid
        firebase.firestore()
        .collection('users')
        .doc(userUid)
        .update(data).then(function(res) {
            alert('등록 완료 되었습니다')
        }).catch(function(err) {
            alert('인터넷 접속을 확인해 주세요')
        })

        AsyncStorage.setItem('@loggedInUserID:backAccount', this.state.bankAccount)
        AsyncStorage.setItem('@loggedInUserID:bankName',this.state.bankName)
    }

    render() {
        return(
            <>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>계좌 정보</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <Divider></Divider>
                <View style={styles.container} behavior='padding'>
                    <View style={styles.titleContainer}>
                        <Text h3 style={{color: 'black', marginTop: 15, textAlign: 'center'}}>
                            {'결제 정보 입력'}
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Input
                            placeholder='00000000000000'
                            autoCompleteType='off'
                            keyboardType='number-pad'
                            onChangeText={text => this._handlingCardNumber(text)}
                            value={this.state.bankAccount}
                            inputStyle={{color:'black'}}
                            label={'계좌번호'}
                            returnKeyType='done'
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={19}
                        />
                        <Input
                            placeholder='국민은행'
                            autoCompleteType='off'
                            containerStyle={{paddingTop: 20}}
                            returnKeyType='done'
                            onChangeText={text => this.setState({bankName: text})}
                            value={this.state.bankName}
                            inputStyle={{color:'black'}}
                            label={'은행 정보'}
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={19}
                        />
                    </View>
                    <View style={styles.footerContainer}>
                        <Text h5 style={{color: 'black', marginTop: 15, textAlign: 'left'}}>
                            {'• 신용(체크) 카드: 현재 카드를 이용한 자동 결제 시스템은 구현중입니다.'}
                        </Text>
                        <Text h5 style={{color: 'black', marginTop: 15, textAlign: 'left'}}>
                            {'• 선택하신 계좌 정보로 동승자에게 결제하신 택시 요금에 대한 정산이 청구됩니다.'}
                        </Text>
                        <Button 
                            title="계좌 정보 등록"
                            onPress={() => this.onRegister()}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 5, marginTop: 20}}
                        />
                    </View>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        height: '20%',
        alignItems: 'center',
    },
    buttonContainer: {
        height: '40%',
    },
    footerContainer: {
        flex: 1,
        paddingBottom: 20,
        justifyContent: 'flex-start'
    },
})