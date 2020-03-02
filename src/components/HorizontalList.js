import React from 'react'
import { View, ScrollView } from "react-native"
import { Text, Avatar, Badge } from "react-native-elements"

const HorizontalList = (ReservationInfo) => (
    <View style={{width:'100%', justifyContent:'space-around', alignItems:'center', flexDirection:'row'}}>
        <View>
            <Text h5 style={{color: 'black', textAlign: 'center'}}>
                {'3/2'}
            </Text>
            <Badge value=' 0 '/>
        </View>
        <View>
            <Text h5 style={{color: 'black', textAlign: 'center'}}>
                {'3/2'}
            </Text>
            <Badge value=' 0 '/>
        </View>
        <View>
            <Text h5 style={{color: 'black', textAlign: 'center'}}>
                {'3/2'}
            </Text>
            <Badge value=' 0 '/>
        </View>
        <View>
            <Text h5 style={{color: 'black', textAlign: 'center'}}>
                {'3/2'}
            </Text>
            <Badge value=' 0 '/>
        </View>
        <View>
            <Text h5 style={{color: 'black', textAlign: 'center'}}>
                {'3/2'}
            </Text>
            <Badge value=' 0 '/>
        </View>
        <View>
            <Text h5 style={{color: 'black', textAlign: 'center'}}>
                {'3/2'}
            </Text>
            <Badge value=' 0 '/>
        </View>
        <View>
            <Text h5 style={{color: 'black', textAlign: 'center'}}>
                {'3/2'}
            </Text>
            <Badge value=' 0 '/>
        </View>
    </View>
)

export default HorizontalList