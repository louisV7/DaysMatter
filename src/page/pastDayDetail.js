import React, { Component } from 'react';
import { View, StyleSheet,TouchableHighlight,Text,StatusBar } from "react-native";
import { connect } from 'react-redux';
import {Card} from 'react-native-shadow-cards';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { history, calendar } from '../api.js';
import { increase_success, increase_fail, delete_success, delete_fail } from '../redux/actions/GetDayAction.js';
import { getLunarDate, getLunarDateString } from '../util.js';
import { _deleteFile, _writeFile, _readFile, _fileEx } from '../react_native_fs.js';
import ConfirmModal from '../components/confirmModal.js';
const fileName = 'days.txt';
class PastDayDetail extends React.Component {
    //标题
    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor:navigation.getParam('isPast',false)?'#4B4A50':'#53CDFF',
          },
        headerRight: (
            <TouchableHighlight
                onPress={() => navigation.push('AddDay', {
                id: navigation.getParam('id','-1')
                })}
                underlayColor='rgba(0,0,0,0.2)'
                style={styles.headerRightButtonBox}
            >
                <Text style={styles.headerRightButton}>编辑</Text>
            </TouchableHighlight>
        ),
    });
    constructor(props) {
        super(props);
        this.state = {
            dayID:props.navigation.getParam('id','-1'),
            detailInfo:{},
            modalVisible: false,
        }
        this.deleteday = this.deleteday.bind(this);
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
    //删除
    deleteday() {
        const that = this;
        that.setState({
            modalVisible:true,
        })
    }
    updateRedux(text, arr) {
        const { dispatch, navigation } = this.props;
        const that=this;
        _deleteFile(fileName, function (res) {
            if (res == 1) {
                _writeFile(fileName, JSON.stringify(arr), function () {
                    if(res==1){
                        navigation.push('bottomTabNavigator');
                    }else{
                        /*that.setState({
                            toastVisible:true,
                            message:'出错了，请重试'
                        })*/
                    }
                    /*if (res == 1) {
                        text == 'edit' ? dispatch(increase_success()) : dispatch(delete_success());
                        navigation.push('bottomTabNavigator');
                    } else {
                        text == 'edit' ? dispatch(increase_fail()) : dispatch(delete_fail());
                        dispatch(increase_fail());

                    }*/
                })
            } else {
                /*that.setState({
                    toastVisible:true,
                    message:'出错了，请重试'
                })*/
            }
        })
    }
    //确认框关闭打开
    onCloseModal(value){
        const that = this;
        const { dayID} = this.state;
        if(value){
            _fileEx(fileName, function (res) {
                if (res) {
                    _readFile(fileName, function (res) {
                        data = JSON.parse(res);
                        data.splice(dayID, 1);
                        that.updateRedux('delete', data);
                    })
                } else {
                    /*that.setState({
                        toastVisible:true,
                        message:'出错了，请重试'
                    })*/
                }
            })
        }else{
            /*that.setState({
                toastVisible:true,
                message:'出错了，请重试'
            })*/
        }
    }
    render() {
        const {navigation}=this.props;
        const {detailInfo,modalVisible}=this.state;
        return (
            <View style={styles.container}>
                {
                    detailInfo.isPast?
                    <StatusBar
                        backgroundColor="#4B4A50"
                        barStyle="light-content"
                    />:null
                }
                <Card style={styles.daysContainer}>
                    <LinearGradient colors={detailInfo.isPast?['#767B7E', '#4B4A50', '#323137']:['#90E2F8','#53CDFF','#35A1D0']} style={styles.title}>
                        <Text allowFontScaling={false} style={{color:'#ffffff',fontSize:18}}>{detailInfo.title}{detailInfo.dateStatus}</Text>
                    </LinearGradient>
                    <View style={[styles.days,styles.inlineBlock]}>
                        <Text allowFontScaling={false} style={{fontSize:66,fontWeight:'bold',flexDirection: "row",alignItems: "center",marginTop:20}}>{detailInfo.dayNum}</Text>
                        <Text allowFontScaling={false} style={{fontSize:14,marginTop:25}}>{detailInfo.unit}</Text>
                    </View>
                    <Text allowFontScaling={false} style={styles.date}>{detailInfo.repeatDate}{detailInfo.week}</Text>
                </Card>
                <View style={[styles.bottomBar,styles.inlineBlock]}>
                    <TouchableHighlight onPress={() => navigation.push('bottomTabNavigator')} underlayColor='rgba(0,0,0,0.2)' style={styles.barItem}>
                        <View style={[styles.barItemBox,styles.inlineBlock]}>
                            <Entypo style={styles.baricon} name='list' size={25} color="#999999"></Entypo>
                            <Text allowFontScaling={false} style={styles.barText}>列表</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => navigation.push('AddDay')} underlayColor='rgba(0,0,0,0.2)' style={styles.barItem}>
                        <View style={[styles.barItemBox,styles.inlineBlock]}>
                            <Entypo style={styles.baricon} name='add-to-list' size={25} color="#999999"></Entypo>
                            <Text allowFontScaling={false} style={styles.barText}>新增</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.deleteday()} underlayColor='rgba(0,0,0,0.2)' style={styles.barItem}>
                        <View style={[styles.barItemBox,styles.inlineBlock]}>
                            <AntDesign style={styles.baricon} name='delete' size={25} color="#999999"></AntDesign>
                            <Text allowFontScaling={false} style={styles.barText}>删除</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <ConfirmModal 
                    onCloseModal={this.onCloseModal.bind(this)}
                    modalVisible={modalVisible}
                    title='提示'
                    content='删除后无法恢复，确定删除吗？'
                    confirmBtnText='删除'
                    cancelBtnText='取消'
                />
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