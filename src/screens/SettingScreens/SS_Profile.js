import React, { Component } from "react";
import { ImageBackground, StyleSheet, View, StatusBar, ActivityIndicator, AsyncStorage } from "react-native";
import { Icon, Button, Header, Text, Divider, Input, Avatar, Overlay, Image} from "react-native-elements";
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import firebase from 'firebase'
import 'firebase/firestore'
import { TouchableOpacity } from "react-native-gesture-handler";

export default class SS_Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'testemail@gist.ac.kr',
            fullname: 'Test Name',
            origin:'GiSt',
            displayName:'',
            image_uri: '',
            nickNamePlaceHolder: '잠시만 기다려 주세요...',
            overlay: undefined,
        }

        this.tryToSetProfileFirst()
    }

    async tryToSetProfileFirst() {
        var email
        var emailVerified
        var origin
        var image
        var nickname

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
                nickname = user.data().displayName
                image = user.data().profileUri
                if(nickname == undefined) {
                    this.setState({
                        nickNamePlaceHolder: '아직 설정하시지 않았습니다.',
                        image_uri: image,
                    })
                } else {
                    this.setState({
                        email: email,
                        emailVerfied: emailVerified,
                        origin: origin,
                        isLoading: false,
                        image_uri: image,
                        displayName: nickname,
                    })
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

    getCameraPermissionAsync = async () => {
        console.log("카메라 퍼미션 요청 완료")
        var { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if(status !== 'granted') {
            alert('앨범 접근 권한이 필요합니다.')
        }
        var { status } = await Permissions.askAsync(Permissions.CAMERA)
        if(status !== 'granted') {
            alert('카메라 접근 권한이 필요합니다.')
        }
    }

    changeProfileImage = async () => {
        this.getCameraPermissionAsync()
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        }).then(async function(res) {
            if(!res.cancelled) {
                this.setState({ image_uri: res.uri })

                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.onload = function() {
                        resolve(xhr.response)
                    }
                    xhr.onerror = function(e) {
                        console.log(e)
                        reject(new TypeError('Network request failed'))
                    }
                    xhr.responseType = 'blob'
                    xhr.open('GET', res.uri, true)
                    xhr.send(null)
                })
    
                var storageRef = firebase.storage().ref('image/profileImages')
                var profileRef = storageRef.child(firebase.auth().currentUser.uid)
        
                const snapshot = await profileRef.put(blob)

                var downloadUri = await snapshot.ref.getDownloadURL()

                firebase.firestore().
                collection('users')
                .doc(firebase.auth().currentUser.uid)
                .update({profileUri: downloadUri}).then(function(res) {
                    alert('프로필 이미지 업로드 완료')
                }).catch(function(err) {
                    alert(err.message)
                })
                
                blob.close()
            }
        }.bind(this))
        .catch(function(e) {
            alert(e.message)
            this.setState({
                image_uri: undefined,
            })
        })
    }

    changeProfileNickName = () => {
        AsyncStorage.setItem("@displayName:아직 설정하지 않았습니다", this.state.displayName)

        firebase.firestore().
        collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({displayName: this.state.displayName})
        .then(function(res) {
            alert('닉네임 변경 완료')
        }).catch(function(e) {
            alert(e.message)
        }.bind(this))
    }

    render() {
        return(
            <>
                <StatusBar></StatusBar>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>프로필</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <Divider></Divider>
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Avatar
                            rounded
                            title={this.state.image_uri == undefined ? '?' : this.state.displayName[0]}
                            size='xlarge'
                            showEditButton
                            onPress={this.changeProfileImage}
                            source={{uri: this.state.image_uri}}
                            renderPlaceholderContent={this.state.image_uri == undefined ? <Text>title</Text> : <ActivityIndicator size='large'></ActivityIndicator>}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Input
                            placeholder={this.state.nickNamePlaceHolder}
                            autoCompleteType='off'
                            containerStyle={{paddingTop: 20}}
                            returnKeyType='done'
                            onChangeText={text => this.setState({displayName: text})}
                            value={this.state.displayName}
                            inputStyle={{color:'black'}}
                            label={'닉네임'}
                            autoCompleteType='name'
                            autoCapitalize='none'
                            maxLength={19}
                            onEndEditing={this.changeProfileNickName}
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
        height: '10%',
        justifyContent: 'flex-end'
    },
})