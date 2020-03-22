import React, { Component } from "react";
import { ImageBackground, StyleSheet, View, AsyncStorage } from "react-native";
import { Icon, Button, Header, Text, Divider, Input, Avatar } from "react-native-elements";
import firebase from 'firebase'
import 'firebase/firestore'

export default class SS_Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            email: '',
            emailVerfied: false,
            origin:' ',
            name: '',
            displayName:'귀여미',
            image_uri: 'http://emal.iptime.org/nextcloud/index.php/s/amL2tr7AY2jij5K/preview',
        }

        this.tryToSetProfileFirst()
    }

    onLogout = () => {
        firebase.auth().signOut()
        AsyncStorage.setItem("@loggedInUserID:uid", '')
        AsyncStorage.setItem("@loggedInUserID:email", '')
        AsyncStorage.setItem("@loggedInUserID:password", '')
        AsyncStorage.setItem("@loggedInUserID:emailVerified", false)
        AsyncStorage.setItem("@loggedInUserID:origin", '')
        this.props.navigation.navigate('Welcome')
    }

    onChnageID = () => {

    }

    async tryToSetProfileFirst() {
        var email = await AsyncStorage.getItem("@loggedInUserID:email")
        var emailVerified = await AsyncStorage.getItem("@loggedInUserID:emailVerified")
        var origin = await AsyncStorage.getItem("@loggedInUserID:origin")
        var name = await AsyncStorage.getItem("#loggedInUserId:fullName")

        if(email != undefined && emailVerified != undefined && origin != undefined && name != undefined) {
            this.setState({
                email: email,
                emailVerfied: emailVerified,
                origin: origin,
                name: name,
                isLoading: false,
            })
        } else {
            var user_uid = firebase.auth().currentUser.uid;

            firebase.firestore()
            .collection('users')
            .doc(user_uid)
            .get()
            .then(function(user) {
                if(user.exists) {
                    email = user.data().email;
                    emailVerified = user.data().emailVerified;
                    origin = user.data().origin;
                    name = user.data().fullName;
                    console.log(user.data())
                    this.setState({
                        email: email,
                        emailVerfied: emailVerified,
                        origin: origin,
                        name: name,
                        isLoading: false,
                    })

                    if(user.data().email != undefined && user.data().emailVerfied != undefined &&
                    user.data().origin != undefined && user.data().fullName != undefined) {
                        AsyncStorage.setItem("@loggedInUserID:email", user.data().email)
                        AsyncStorage.setItem("@loggedInUserID:emailVerified", user.data().emailVerfied ? 'true' : 'false')
                        AsyncStorage.setItem("@loggedInUserID:origin", user.data().origin)
                        AsyncStorage.setItem("@loggedInUserID:fullName", user.data().fullName)
                    }
                }
            }.bind(this))
            .catch(function(err) {
                alert(err.message)
                this.setState({
                    isLoading: true,
                })
            })
        }
    }

    render() {
        return(
            <>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>계정 정보 및 수정</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <Divider></Divider>
                <View style={styles.container}>
                    <View style={styles.titleContainer}>

                    </View>
                    <View style={styles.buttonContainer}>
                        <Input
                            placeholder='잠시만 기다려 주세요...'
                            autoCompleteType='off'
                            containerStyle={{paddingTop: 20}}
                            returnKeyType='done'
                            onChangeText={text => this.setState({displayName: text})}
                            value={this.state.email.toLowerCase()}
                            inputStyle={{color:'black'}}
                            label={'이메일'}
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={19}
                            editable={false}
                        />
                        <Input
                            placeholder='잠시만 기다려 주세요...'
                            autoCompleteType='off'
                            containerStyle={{paddingTop: 20}}
                            returnKeyType='done'
                            onChangeText={text => this.setState({displayName: text})}
                            value={this.state.name}
                            inputStyle={{color:'black'}}
                            label={'이름'}
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={19}
                            editable={false}
                        />
                        <Input
                            placeholder=''
                            autoCompleteType='off'
                            containerStyle={{paddingTop: 20}}
                            returnKeyType='done'
                            onChangeText={text => this.setState({displayName: text})}
                            value={this.state.origin.toUpperCase()}
                            inputStyle={{color:'black'}}
                            label={'소속'}
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={19}
                            editable={false}
                        />
                        <Input
                            placeholder=''
                            autoCompleteType='off'
                            containerStyle={{paddingTop: 20}}
                            returnKeyType='done'
                            onChangeText={text => this.setState({displayName: text})}
                            value={this.state.emailVerfied ? '인증되었습니다' : '인증되지 않은 사용자 입니다.'}
                            inputStyle={{color:'black'}}
                            label={'이메일 인증 여부'}
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={19}
                            editable={false}
                        />
                    </View>
                    <View style={styles.footerContainer}>
                        <Button 
                            title="로그아웃"
                            onPress={() => this.onLogout()}
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
        alignItems: 'center',
        paddingTop: 25,
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        height: '50%',
        alignItems:'center',
        paddingTop: 25,
    },
    footerContainer: {
        height: '30%',
        justifyContent: 'flex-end'
    },
})