import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View, AsyncStorage, ImageBackground } from "react-native";
import { Button, Image, Icon, Text, Divider, Input } from "react-native-elements";
import firebase from 'firebase'
import 'firebase/firestore'

export default class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            email: '',
            password: '',
        }
        this.tryToLoginFirst()
    }

    async tryToLoginFirst() {
        const email = await AsyncStorage.getItem("@loggedInUserID:email")
        const password = await AsyncStorage.getItem('@loggedInUserID:password')
        const id = await AsyncStorage.getItem('@loggedInUserID:uid')
        const emailVerified= await AsyncStorage.getItem('@loggedInUserID:emailVerified') 
        if(
            id != null &&
            id != '' &&
            id.length > 0 &&
            password != null &&
            password != '' &&
            password.length > 0
        ) {
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then(response => {
                    var user_uid = response.user.uid
                    const { navigation } = this.props
                    firebase.firestore()
                        .collection('users')
                        .doc(id)
                        .get()
                        .then(function(user) {
                            if(user.exists) {
                                if(user.data().emailVerified){
                                    this.setState({
                                        isLoading: false
                                    })
                                    navigation.navigate('Main', user.data())
                                }
                                else{
                                    this.setState({
                                        isLoading: false
                                    })
                                    navigation.navigate('EmailAuth', user.data())
                                }
                            }
                        }.bind(this))
                        .catch(function(err) {
                            alert(err.message)
                            this.setState({
                                isLoading: false
                            })
                        })
                }).catch(err => {
                    alert(err.message)
                    this.setState({
                        isLoading: false
                    })
                })
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    onPressLogin = () => {
        this.setState({
            isLoading: true,
        })
        const { email, password, emailVerified } = this.state
        if (email.length <= 0 || password.length <= 0) {
            alert('이메일 주소와 비밀번호를 입력해 주세요')
            this.setState({
                isLoading: false,
            })
            return
        }
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                const { navigation } = this.props
                var user_uid = response.user.uid
                firebase.firestore()
                    .collection('users')
                    .doc(user_uid)
                    .get()
                    .then(function (user) {
                        if (user.exists) {
                            AsyncStorage.setItem("@loggedInUserID:uid", user_uid)
                            AsyncStorage.setItem("@loggedInUserID:email", email)
                            AsyncStorage.setItem("@loggedInUserID:password", password)
                            
                            if (user.data().emailVerified) {
                                navigation.navigate('Main', user.data())
                            } else {
                                navigation.navigate('EmailAuth', user.data())
                            }
                        } else {
                            alert('로그인 실패하였습니다. 다시 한번 시도해 보세요')
                            this.setState({
                                isLoading: false
                            })
                        }
                    }).catch(function (err) {
                        alert(err.message)
                        this.setState({
                            isLoading: false
                        })
                    })
            }).catch(function (err) {
                alert(err.message)
                this.setState({
                    isLoading: false
                })
            }.bind(this))
    }

    render() {
        if(this.state.isLoading == true) {
            return(
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
        } else 
        {
            return(
                <ImageBackground
                    source={require('../../images/testBackLogin.jpg')}
                    style={{ width: '100%', height: '100%'}}
                    resizeMode='cover'
                >
                    <View style={styles.container}>
                        <View style={styles.titleContainer}>
                            <Text h3 style={{color: 'white', marginTop: 30, textAlign: 'center'}}>
                                {'여기에 택승 \n로고가 들어가요'}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Input
                                placeholder='  email@college.ac.kr'
                                onChangeText={text => this.setState({ email: text })}
                                value={this.state.email}
                                inputStyle={{color:'white'}}
                                autoCompleteType='username'
                                leftIcon={{ name: 'email', color: 'white'}}
                                autoCapitalize='none'
                            />
                            <Input
                                placeholder='  Password'
                                onChangeText={text => this.setState({ password: text })}
                                value={this.state.password}
                                secureTextEntry={true}
                                inputStyle={{color:'white'}}
                                autoCompleteType='password'
                                leftIcon={{ name: 'lock', color: 'white'}}
                                autoCapitalize='none'
                            />
                            <Button title=" 로그인"
                                    titleStyle={{ fontWeight: 'bold'}}
                                    onPress={this.onPressLogin}
                                    buttonStyle={{borderRadius: 30, width:'100%'}}
                                    containerStyle={{marginBottom: 10, marginTop: 10}}
                                    icon={
                                        <Icon
                                            name='lock-open'
                                            color='#fff'
                                        />
                                    }
                            />
                            <Text h5 style={{color: 'white', textAlign: 'center', fontWeight:'bold'}}>
                                {'가입하는데 오래 안결려요!! 지금 가입해요~'}
                            </Text>
                            <Button title="회원가입"
                                    titleStyle={{ fontWeight: 'bold'}}
                                    onPress={()=>{this.props.navigation.navigate('Signup')}}
                                    buttonStyle={{borderRadius: 30, width:'100%'}}
                                    containerStyle={{marginBottom: 5, marginTop: 5}}
                            />
                            <Button title="아이디/비밀번호 찾기"
                                    titleStyle={{ fontSize: 13, color:'white'}}
                                    type="clear"
                                    onPress={()=>this.props.navigation.navigate('FindAuth')}
                            />
                        </View>
                        <View style={styles.footerContainer}>
                            <Text h5 style={{color: 'white', textAlign: 'center'}}>
                                {'택승 ver 1.0 \n 버그 제보: ahn9807@gmail.com'}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
            )
        }
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
        height: '50%',
    },
    footerContainer: {
        height: '10%',
        justifyContent: 'flex-end'
    },
})