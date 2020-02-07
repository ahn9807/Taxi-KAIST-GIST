import { Component } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default class SignupScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true
        }
        this.tryToLoginFirst()
    }

    render() {
        if(this.state.isLoading == true) {
            return(
                <ActivityIndicator
                    style={styles.spinner}
                    size='large'
                />
            )
        }
    }
}

const styles = StyleSheet.create({
    spinner: {
        marginTop: 200
    }
})