import React from 'react'
import { View, ScrollView } from "react-native"
import { Text, Avatar, Badge } from "react-native-elements"





const HorizontalList = (props) => (
    <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
        <ScrollView 
            style={{ height: 50, width: '100%'}} 
            horizontal={true}
        >
        </ScrollView>
    </View>
)

export default HorizontalList