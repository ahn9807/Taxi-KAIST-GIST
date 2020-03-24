import React, { Component } from "react";
import { ImageBackground, StyleSheet, View, ScrollView } from "react-native";
import { Icon, Button, Header, Text, Divider } from "react-native-elements";
import * as History from '../../Networking/History'
import firebase from 'firebase'
import 'firebase/firestore'
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';

export default class SS_History extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            tableHead: ['일자', '경로', '인원', '총 요금', '아낀 요금'],
            widthArr: [40, 80, 40, 40, 40],
            moneySaved: 0,
        }

        History.fetchHistoryDataById(firebase.auth().currentUser.uid)
            .then(function (res, err) {
                const data = History.getData()
                let moneyTemp = 0
                data.forEach(i => {
                    moneyTemp += i[4]
                })

                this.setState({
                    tableData: data,
                    moneySaved: moneyTemp
                })
                console.log("fetch")
                // console.log(doc.data())

            }.bind(this)
            )
    }



    render() {
        
        return (
            <View>
                <Header
                    leftComponent={<Button type='clear' onPress={() => this.props.navigation.pop()} icon={<Icon name='keyboard-arrow-left' color='black'></Icon>}></Button>}
                    centerComponent={<Text style={{ color: 'black', fontWeight: 'bold' }}>이용내역</Text>}
                    containerStyle={{ backgroundColor: 'white' }}
                />
                <Divider></Divider>
                <View style={styles.container}>
                    <View style={{ alignItems: 'center', marginBottom: 70 }}>
                        <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 25 }}>
                            지금까지 아낀 택시비
                        </Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 35 }}>
                            {this.state.moneySaved} 원
                        </Text>
                    </View>
                    <View style={{ marginTop: 30 }}>

                        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                            <Row data={this.state.tableHead}  flexArr={[2,7,1.5,2,2]} style={styles.header} textStyle={styles.text} />

                            {
                                this.state.tableData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        style={[styles.row, index % 2 && { backgroundColor: '#fff' }]}
                                        textStyle={styles.text}
                                        flexArr={[2,7,1.5,2,2]}
                                    />
                                ))
                            }
                        </Table>
                    </View>
                    {/* </ScrollView> */}
                    {/* </ScrollView> */}
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
    header: { height: 50, backgroundColor: '#fff' },
    buttonContainer: {
        height: '50%',
    },
    footerContainer: {
        height: '10%',
        justifyContent: 'flex-end'
    },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E2F3FF' }

})