import React, { Component } from "react";
import { ImageBackground, StyleSheet, View, AsyncStorage } from "react-native";
import { Icon, Button, Header, Text, Divider, Input, Avatar } from "react-native-elements";
import firebase from 'firebase'
import 'firebase/firestore'

export default class SS_Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'testemail@gist.ac.kr',
            fullname: '안준호',
            origin:'GiSt',
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
        this.props.navigation.navigate('Welcome')
    }

    onChnageID = () => {

    }

    async tryToSetProfileFirst() {

    }

    changeProfileImage() {
        alert('change profile image')
    }

    render() {
        return(
            <>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>프로필</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <Divider></Divider>
                <View style={styles.container}>
                    <View style={styles.titleContainer}>

                    </View>
                    <View style={styles.buttonContainer}>
                        <Text h3 style={{color: 'black', marginTop: 15, textAlign: 'center'}}>
                            {this.state.email}
                        </Text>
                        <Text h3 style={{color: 'black', marginTop: 15, textAlign: 'center'}}>
                            {this.state.fullname}
                        </Text>
                        <Text h3 style={{color: 'black', marginTop: 15, textAlign: 'center'}}>
                            {this.state.origin.toUpperCase()}
                        </Text>
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