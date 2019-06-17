import React, { Component } from 'react';
import { View, StyleSheet,TouchableHighlight,Text,StatusBar } from "react-native";
import { connect } from 'react-redux';
import {Card} from 'react-native-shadow-cards';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';

import { history, calendar } from '../api.js';
import { increase_success, increase_fail, delete_success, delete_fail } from '../redux/actions/GetDayAction.js';
import { getLunarDate, getLunarDateString } from '../util.js';
import { _deleteFile, _writeFile, _readFile, _fileEx } from '../react_native_fs.js';
const fileName = 'days.txt';
class PastDayDetail extends React.Component {
    //标题
    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <TouchableHighlight
                onPress={() => navigation.push('bottomTabNavigator')}
                underlayColor='rgba(0,0,0,0.2)'
                style={styles.headerRightButtonBox}
            >
                <Text style={styles.headerRightButton}>列表</Text>
            </TouchableHighlight>
        ),
    });
    constructor(props) {
        super(props);
        this.state = {
            dayID:props.navigation.getParam('id','-1'),
            detailInfo:{}
        }
    }
    componentDidMount(){
        const that = this;
        const {dayID}=that.state;
        if(dayID!='-1'){
            that.showDetail();
        }
    }
    //编辑时的信息
    showDetail(){
        let data={};
        const that = this;
        const {dayID}=that.state;
        _fileEx(fileName, function (res) {
            if (res) {
                _readFile(fileName, function (res) {
                    data = JSON.parse(res);
                    that.setState({
                        detailInfo:data[dayID]
                    })
                })
            } else {
            }
          })
    }
    render() {
        const {navigation}=this.props;
        const {detailInfo}=this.state;
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#4E4D53"
                    barStyle="light-content"
                />
                <Card style={styles.daysContainer}>
                    <LinearGradient colors={['#767B7E', '#4B4A50', '#323137']} style={styles.title}>
                        <Text style={{color:'#ffffff',fontSize:18}}>{detailInfo.title}{detailInfo.dateStatus}</Text>
                    </LinearGradient>
                    <View style={[styles.days,styles.inlineBlock]}>
                        <Text style={{fontSize:66,fontWeight:'bold',flexDirection: "row",alignItems: "center",marginTop:20}}>{detailInfo.dayNum}</Text>
                        <Text style={{fontSize:14,marginTop:25}}>{detailInfo.unit}</Text>
                    </View>
                    <Text style={styles.date}>{detailInfo.date}{detailInfo.week}</Text>
                </Card>
                <View style={[styles.bottomBar,styles.inlineBlock]}>
                    <TouchableHighlight onPress={() => navigation.push('bottomTabNavigator')} underlayColor='rgba(0,0,0,0.2)' style={styles.barItem}>
                        <View style={[styles.barItemBox,styles.inlineBlock]}>
                            <Entypo style={styles.baricon} name='list' size={25} color="#999999"></Entypo>
                            <Text style={styles.barText}>列表</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => navigation.push('AddDay')} underlayColor='rgba(0,0,0,0.2)' style={styles.barItem}>
                        <View style={[styles.barItemBox,styles.inlineBlock]}>
                            <Entypo style={styles.baricon} name='add-to-list' size={25} color="#999999"></Entypo>
                            <Text style={styles.barText}>新增</Text>
                        </View>
                    </TouchableHighlight>
                </View>
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
    headerRightButtonBox: {
        marginRight: 20,
        borderRadius: 5, 
        justifyContent: "center", 
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff",
        width:60,
        height:30
    },
    headerRightButton: {
        color: '#ffffff'
    },
    container: {
        flex:1,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor:'#F4F8FB',
        position:'relative'
    },
    daysContainer:{
        width:200,
        height:200,
        marginTop: 120,
    },
    title:{
        flexDirection: "row",
        justifyContent: "center", 
        alignItems: "center",
        height:50,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    days:{
        justifyContent: "center", 
        //alignItems: "center",
        height:110,
    },
    date:{
        width:'100%',
        lineHeight:40,
        textAlign:'center',
        fontSize:16
    },
    bottomBar:{
        position:"absolute",
        bottom:30,
        left:0,
        right:0,
        justifyContent: "center", 
        alignItems: "center",
    },
    barItem:{
        flex:1,
        height:40,
        justifyContent: "center", 
        alignItems: "center",
    },
    barItemBox:{
        justifyContent: "center", 
        alignItems: "center",
    },
    baricon:{

    },
    barText:{
        fontSize:18,
        color:'#999999',
        marginLeft: 10,
    }
})


function select(store) {
    return {
        GetDayReducer: store.GetDayReducer,
    }
}
export default connect(select)(PastDayDetail);