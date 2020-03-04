import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";

export default class SS_Account extends Component {
    render() {
        return(
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>계정</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <Divider></Divider>
                <View style={styles.container}>

                </View>
            </View>
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
        height: '50%',
    },
    footerContainer: {
        height: '10%',
        justifyContent: 'flex-end'
    },
})