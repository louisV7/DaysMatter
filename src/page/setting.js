import React, { Component } from 'react';
import { StatusBar, Platform, StyleSheet, View, Text, TouchableHighlight } from "react-native";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { PaddingTop } from '../deviceInfo.js';

import { theme } from '../theme.js';
import { STATUS_BAR_HEIGHT } from '../deviceInfo.js';

const height = STATUS_BAR_HEIGHT + 44;
const paddingTop = STATUS_BAR_HEIGHT;
export default class DaysScreen extends React.Component {
    //标题
    static navigationOptions = ({ navigation }) => ({

    });
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={[styles.container]}>
                <TouchableHighlight style={styles.setItem} underlayColor='rgba(0,0,0,0.2)' onPress={() => navigation.push('BackGround')}>
                    <View style={{flex:1,flexDirection: "row",justifyContent: "center",alignItems: "center",}}>
                        <Foundation style={styles.itemleft} name='background-color' size={25} color="#999999"></Foundation>
                        <Text style={styles.itemcenter}>背景图片</Text>
                        <View style={styles.itemright}>
                            <AntDesign name='right' size={20} color="#999999"></AntDesign>
                        </View>
                    </View>
                </TouchableHighlight>
                
            </View>
        )
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: 20,
    },
    setItem: {
        width: '100%',
        height: 60,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
    },
    itemleft: {
        flex: 1
    },
    itemcenter: {
        flex: 3.5,
        fontSize: 16,
    },
    itemright: {
        flex: 1.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
   
})