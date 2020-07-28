import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from "react-native"
import { Button } from "react-native-elements"

const EnterReservationPanel =({enterItem})=>{
    return (
        <View style={styles.container}>
            <Text>
                {enterItem.source} ➤ {enterItem.dest}
            </Text>

            <Button
                title="호이호이"

            />
                
        </View>

    )
}

export default EnterReservationPanel;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})