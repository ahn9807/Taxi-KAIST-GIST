import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { PricingCard, Card, Button, Text, Badge, Divider, ListItem, Avatar } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import tabBarHeight from '../tools/TabBarHeight'
import HorizontalList from './HorizontalList';

const Details = ({ source, dest, dateCallback, selectedDate, reservationInfo, reservationButton }) => (
    <View style={styles.container}>
        <View style={styles.pricingCardContainer}>
            <TouchableOpacity style={styles.sdContainer} onPress={dateCallback}>
                <View>
                    <Avatar
                        rounded
                        icon={{name:'date-range', color:'black'}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                    />
                    <Badge
                        status="success"
                        value={reservationInfo}
                        containerStyle={{ position: 'absolute', top: -3, right: -6 }}
                    />
                </View>
                <Text style={{color: '#fff', textAlign: 'center', fontWeight:'500', fontSize: 25}}>
                    {'  '+selectedDate.getFullYear() + '년 ' + (selectedDate.getMonth() + 1) + '월 ' + selectedDate.getDate() + '일'}
                </Text>
            </TouchableOpacity>
            <View style={styles.sdContainer}>
                <View>
                    <Avatar
                        rounded
                        icon={{name:'flight-takeoff', color:'black'}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                    />
                </View>
                <Text style={{color: '#fff', textAlign: 'center', fontWeight:'500', fontSize: 25}}>
                    {'  '+source}
                </Text>
            </View>
            <View style={styles.sdContainer}>
                <View>
                    <Avatar
                        rounded
                        icon={{name:'flight-land', color:'black'}}
                        overlayContainerStyle={{backgroundColor: 'white'}}
                    />
                </View>
                <Text style={{color: '#fff', textAlign: 'center', fontWeight:'500', fontSize: 25}}>
                    {'  '+dest}
                </Text>
            </View>
            <Divider></Divider>

            <Button 
                title={"예약하기"}
                titleStyle={{ textAlign:'center', fontWeight: 'bold'}}
                onPress={reservationButton}
                buttonStyle={{borderRadius: 30, width:250 }}
                containerStyle={{marginBottom: 20, marginTop: 10}}
                icon={{name: 'local-taxi', color: 'white'}}
            />
        </View>
    </View>
)

export default Details;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'flex-end',
        flex: 1,
    },
    pricingCardContainer: {
        paddingTop: 25,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        position: 'absolute',
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    HorizontalListContainer: {
        width: '100%',
        height: 20,
        backgroundColor: 'white',
    },
    sdContainer: {
        flexDirection:'row', 
        justifyContent:'flex-start', 
        alignItems: 'center', 
        width: '90%',
        backgroundColor:'lightgrey', 
        borderRadius: 5, 
        padding: 5,
        marginLeft: 50,
        marginRight: 50, 
        marginBottom: 2,
    }

})