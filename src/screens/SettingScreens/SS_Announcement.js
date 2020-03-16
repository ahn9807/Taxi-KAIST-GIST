import React, { Component } from "react";
import { ImageBackground, StyleSheet, View, ActivityIndicator } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import SettingListView from "../../components/SettingListView";
import { fetchAnnoucement, getAnnoucement } from "../../Networking/Annoucement";

export default class SS_Announcement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            sections: null,
        }
        fetchAnnoucement().then(function(res) {
            var sections = [{
                data: getAnnoucement(),
            }]
            this.setState({
                loading: false,
                sections: sections,
            })
        }.bind(this))
    }

    render() {
        return(
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={()=>this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{color:'black', fontWeight:'bold'}}>공지사항</Text>}
                    containerStyle={{backgroundColor:'white'}}
                />
                <Divider></Divider>
                {this.state.loading && 
                    <ActivityIndicator
                        style={styles.spinner}
                    />
                }
                <SettingListView sections={this.state.sections}/>
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
    spinner: {
        marginTop: 200
    }
})