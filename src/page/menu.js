import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, ScrollView, SafeAreaView } from "react-native";
import { connect } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { STATUS_BAR_HEIGHT } from '../deviceInfo.js';
import { theme } from '../theme.js';
import { PaddingTop } from '../deviceInfo.js';
const height = STATUS_BAR_HEIGHT + 44;
const paddingTop = STATUS_BAR_HEIGHT;
class MenuScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {

    }
    render() {
        const { navigation } = this.props;
        //在这里跳转页面不能使用push
        return (
            <ScrollView>
                <SafeAreaView style={styles.container}>
                    <View style={[styles.header, { height: height, backgroundColor: theme.themeColor }]}>
                        <TouchableHighlight
                            onPress={() => navigation.goBack()}
                            underlayColor='rgba(0,0,0,0.2)'
                            style={{ width: 35, height: 35, borderRadius: 50, justifyContent: "center", alignItems: "center", }}
                        >
                            <Ionicons name='md-arrow-back' size={25} color="#ffffff"></Ionicons>
                        </TouchableHighlight>
                        <Text style={styles.header_title}>倒数日</Text>
                    </View>
                    <TouchableHighlight style={styles.classify_item_box}
                        onPress={() => navigation.goBack()}
                        underlayColor='rgba(0,0,0,0.2)'
                    >
                        <View style={styles.classify_item}>
                            <View style={{ width: 30, flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                                <FontAwesome5 name='qrcode' size={25} color="#B6BBBC"></FontAwesome5>
                            </View>
                            <Text style={styles.classify_item_title}>全部</Text>
                            <Text style={styles.classify_item_num}>0</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.classify_item_box}
                        onPress={() => navigation.goBack()}
                        underlayColor='rgba(0,0,0,0.2)'
                    >
                        <View style={styles.classify_item}>
                            <View style={{ width: 30, flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                                <AntDesign name='heart' size={25} color="#B6BBBC"></AntDesign>
                            </View>
                            <Text style={styles.classify_item_title}>纪念日</Text>
                            <Text style={styles.classify_item_num}>0</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.classify_item_box}
                        onPress={() => navigation.goBack()}
                        underlayColor='rgba(0,0,0,0.2)'
                    >
                        <View style={styles.classify_item}>
                            <View style={{ width: 30, flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                                <FontAwesome5 name='home' size={25} color="#B6BBBC"></FontAwesome5>
                            </View>
                            <Text style={styles.classify_item_title}>生活</Text>
                            <Text style={styles.classify_item_num}>0</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.classify_item_box}
                        onPress={() => navigation.navigate('History')}
                        underlayColor='rgba(0,0,0,0.2)'
                    >
                        <View style={styles.classify_item}>
                            <View style={{ width: 30, flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                                <FontAwesome name='history' size={25} color="#666"></FontAwesome>
                            </View>
                            <Text style={[styles.classify_item_title, { color: '#666' }]}>History</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.classify_item_box}
                        onPress={() => navigation.navigate('Setting')}
                        underlayColor='rgba(0,0,0,0.2)'
                    >
                        <View style={styles.classify_item}>
                            <View style={{ width: 30, flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                                <AntDesign name='setting' size={25} color="#666"></AntDesign>
                            </View>
                            <Text style={[styles.classify_item_title, { color: '#666' }]}>Setting</Text>
                        </View>
                    </TouchableHighlight>
                </SafeAreaView>
            </ScrollView>
        )
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingLeft: 10,
        alignItems: "flex-end",
        flexDirection: "row",
        paddingBottom: 6,
    },
    header_title: {
        color: '#ffffff',
        fontSize: 22,
        marginLeft: 10,
    },
    classify_item_box: {
        height: 50,
    },
    classify_item: {
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
    },
    classify_item_title: {
        color: '#999',
        marginLeft: 30,
        flex: 3
    },
    classify_item_num: {
        color: '#888',
        flex: 2,
        textAlign: 'right'
    }
})

function select(store) {
    return {
        GetDayReducer: store.GetDayReducer,
    }
}
export default connect(select)(MenuScreen);