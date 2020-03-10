import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View, Picker, ImageBackground, KeyboardAvoidingView } from "react-native";
import firebase from 'firebase'
import 'firebase/firestore'
import { Input, Text, Button, Header, Icon, Card, Divider, Overlay } from "react-native-elements";
import SlidingUpPanel from "rn-sliding-up-panel";
import KAIST from "../Region/KAIST";

export default class SignupScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            displayName: '',
            email: '',
            password: '',
            confirmPassword: '',
            emailVerified: false,
            origin: null, //기본
            showPanel: false,
        }
    }

    onRegister = () => {
        const { email, password, confirmPassword } = this.state
        if(password != confirmPassword) {
            alert('비밀번호가 일치하지 않습니다')
            return
        }

        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => {
                const { navigation } = this.props
                const { displayName, email, emailVerified, origin } = this.state
                const data = {
                    email: email,
                    displayName: displayName,
                    emailVerified: emailVerified,
                    appIdentifire: 'test app',
                    origin: origin 
                }
                var user_uid = response.user.uid
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .set(data)
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .get()
                    .then(function (user) {
                        alert('회원가입 완료')
                        navigation.navigate('Welcome')
                    }).catch(function (err) {
                        alert(err.message)
                    })
            }).catch(function (err) {
                alert(err.message)
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
                    centerComponent={<Text style={{color:'white', fontWeight:'bold'}}>회원가입</Text>}
                    containerStyle={{backgroundColor:'transparent'}}
                />
                <KeyboardAvoidingView style={styles.container} behavior='padding'>
                    <View style={styles.titleContainer}>
                        <Text h3 style={{color: 'white', marginTop: 15, textAlign: 'justify'}}>
                            {'우리들의 택시 승강장 \n지금 택시 승강장을\n시작해보세요.'}
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Divider
                            style={{backgroundColor:'white'}}
                        />
                        <Input
                            placeholder=' Full name'
                            onChangeText={text => this.setState({ displayName: text })}
                            value={this.state.displayName}
                            inputStyle={{color:'white'}}
                            autoCompleteType='name'
                            leftIcon={{ name:'people', color:'white'}}
                            autoCapitalize='none'
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
                        <Input
                            placeholder=' Password'
                            onChangeText={text => this.setState({ password: text })}
                            value={this.state.password}
                            secureTextEntry={true}
                            inputStyle={{color:'white'}}
                            autoCompleteType='password'
                            leftIcon={{ name:'lock', color:'white'}}
                            autoCapitalize='none'
                        />
                        <Input
                            placeholder=' Confirm Password'
                            onChangeText={text => this.setState({ confirmPassword: text })}
                            value={this.state.confirmPassword}
                            secureTextEntry={true}
                            inputStyle={{color:'white'}}
                            autoCompleteType='password'
                            leftIcon={{ name:'lock', color:'white'}}
                            autoCapitalize='none'
                        />
                        <Button 
                            title={this.state.origin == null ? "학교를 선택해 주세요" : "[ "+this.state.origin + " ]" + " 에서 택시를 부를께요"}
                            type="clear"
                            titleStyle={{color:'white',}}
                            onPress={() => this.setState({
                                origin: 'kaist', //기본값은 KAIST 로 설정되어 있음 
                                showPanel: true
                            })}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 5, marginTop: 0}}
                            icon={{name:'account-balance', color:'white'}}
                        />
                        <Divider
                            style={{backgroundColor:'white'}}
                        />
                        <Button 
                            title="회원 가입"
                            onPress={() => this.onRegister()}
                            buttonStyle={{borderRadius: 30, width:'100%'}}
                            containerStyle={{marginBottom: 5, marginTop: 20}}
                        />
                    </View>
                    <View style={styles.footerContainer}>

                    </View>
                </KeyboardAvoidingView>
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