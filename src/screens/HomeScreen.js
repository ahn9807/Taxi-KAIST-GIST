import React, { Component } from "react";
import { Text, View } from "react-native";
import { BaseRouter } from "@react-navigation/native";

export default class HomeScreen extends Component {
    render() {
        return(
            <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                <Text>
                    {this.props.route.params.id}
                </Text>
            </View>
        )
    }
}