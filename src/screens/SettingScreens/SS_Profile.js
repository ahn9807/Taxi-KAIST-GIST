import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon, Button, Header, Text, Divider, Input, Avatar } from "react-native-elements";

export default class SS_Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'testemail@gist.ac.kr',
            fullname: 'Test Name',
            origin:'GiSt',
            displayName:'귀여미',
            image_uri: 'http://emal.iptime.org/nextcloud/index.php/s/amL2tr7AY2jij5K/preview',
        }

        this.tryToSetProfileFirst()
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
                        <Avatar
                            rounded
                            size='xlarge'
                            onEditPress={this.changeProfileImage}
                            showEditButton
                            source={{uri: this.state.image_uri}}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Input
                            placeholder='아직 설정 하지 않으셨군요!'
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