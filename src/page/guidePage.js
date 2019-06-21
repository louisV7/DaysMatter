import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, TouchableHighlight } from "react-native";
export default class GuidePage extends React.Component {
      //加载计时器
      componentDidMount(){
        this.timer=setTimeout(()=>{
            this.props.navigation.navigate('bottomTabNavigator');//7秒后进入底部导航主页
        },7000)
    }
    //卸载计时器
    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);//同时为真的才执行卸载
    }
    render (){
        return (
            <View style={styles.container}>
                <Text allowFontScaling={false}>我是引导页</Text>
            </View>
        )
    }
}
var styles = StyleSheet.create({
    block: {
        flexDirection: "column",
      },
      inlineBlock: {
        flexDirection: "row",
      },
      container: {
        flex: 1,
        position:"relative",
      },
});