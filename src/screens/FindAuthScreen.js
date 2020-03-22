import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View, Picker, ImageBackground, KeyboardAvoidingView } from "react-native";
import firebase from 'firebase'
import 'firebase/firestore'
import { Input, Text, Button, Header, Icon, Card, Divider, Overlay } from "react-native-elements";
import SlidingUpPanel from "rn-sliding-up-panel";
import KAIST from "../Region/KAIST";

export default class FindAuth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            fullName: '',
            email: '',
            nickName: '',
            password: '',
            confirmPassword: '',
            emailVerified: false,
            origin: null, //기본
            showPanel: false,
        }
    }

    onResetPassword = () => {
        firebase.auth().
        sendPasswordResetEmail(this.state.email).then(function() {
            alert('메일함을 확인해 보세요')
        }).catch(function(error) {
            alert('잘못된 이메일 입니다.')
        })
    }

    handleBackPress = () => {
        this.props.navigation.navigate('Welcome')
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <ImageBackground
                    source={require('../../images/testBackLogin.jpg')}
                    style={{ width: '100%', height: '100%'}}
                    resizeMode='cover'
                >
                   <ActivityIndicator
                        style={{marginTop: 200}}
                        size='large'
                    />
                </ImageBackground>
            )
        }
        return (
            <ImageBackground
                source={require('../../images/testBackLogin.jpg')}
                style={{ width: '100%', height: '100%'}}
                resizeMode='cover'
            >
                <Header
                    leftComponent={<Button type='clear' onPress={this.handleBackPress} icon={<Icon name='keyboard-arrow-left' color='white'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'white', fontWeight:'bold'}}>비밀번호 찾기</Text>}
                    containerStyle={{backgroundColor:'transparent'}}
                />
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text h3 style={{color: 'white', marginTop: 15, textAlign: 'justify'}}>
                            {'비밀 번호 재설정을\n위해서 메일 주소를\n적어주세요'}
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Divider
                            style={{backgroundColor:'white'}}
                        />
                        <Input
                            placeholder=' email@college.ac.kr'
                            onChangeText={text => this.setState({ email: text })}
                            value={this.state.email}
                            inputStyle={{color:'white'}}
                            autoCompleteType='email'
                            leftIcon={{ name:'email', color:'white'}}
                            autoCapitalize='none'
                        />
                        <Divider
                            style={{backgroundColor:'white'}}
                        />
                        <Button 
                            title="비밀 번호 변경"
                            onPress={() => this.onResetPassword()}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 5, marginTop: 20}}
                        />
                    </View>
                    <View style={styles.footerContainer}>

                    </View>
                </View>
                <Overlay
                        visible={this.state.showPanel}
                        height='auto'
                        overlayBackgroundColor='#fffa'
                >
                    <View style={styles.selectCollegeContainer}>
                        <Text h4 style={{color: 'black', marginTop: 50, textAlign: 'center', fontWeight:'bold'}}>
                            {'학교 선택'}
                        </Text>
                        <Picker 
                            selectedValue={this.state.origin}
                            onValueChange={origin => this.setState({ origin: origin })}
                        >
                            <Picker.Item label="KAIST" value="kaist"/>
                            <Picker.Item label="GIST" value="gist"/>
                        </Picker>
                        <Button 
                            title="확인"
                            onPress={() => this.setState({
                                showPanel: false
                            })}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 50, marginTop: 5, marginLeft: 20, marginRight: 20}}
                        />
                    </View>
                </Overlay>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        height: '60%',
    },
    footerContainer: {
        height: '10%',
        justifyContent: 'flex-end'
    },
    selectCollegeContainer: {
        width: '100%',
        backgroundColor: '#fff5'
    }
})