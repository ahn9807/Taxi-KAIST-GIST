import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { PricingCard, Card } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';

const Details = ({ target, description, reservationButton }) => (
    <View style={styles.container}>
        <PricingCard
            containerStyle={styles.pricingCardContainer}
            color="#4f9deb"
            title="예약하기"
            price={target}
            info={description}
            button={{ title: '택시 조회하기', icon: 'local-taxi' }}
            onButtonPress={reservationButton}
        />
    </View>
)

export default Details;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems:'center',
        flex: 1,
    },
    pricingCardContainer: {
        width: '100%',
        position: 'absolute',
        flex: 1,
    }
})