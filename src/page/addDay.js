import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Switch, TextInput, Modal } from "react-native";
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { history, calendar } from '../api.js';
import { increase_success, increase_fail, delete_success, delete_fail } from '../redux/actions/GetDayAction.js';
import { getLunarDate, getLunarDateString, getTodayDate, getDiffDate, getDay } from '../util.js';
import { _deleteFile, _writeFile, _readFile, _fileEx } from '../react_native_fs.js';
import DatePicker from '../components/datePicker.js';
import ConfirmModal from '../components/confirmModal.js';
const fileName = 'days.txt';
const year = getTodayDate().year;
const month = getTodayDate().month;
const day = getTodayDate().day;
class AddDaysScreen extends React.Component {
    //标题
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('id') == "-1" ? "添加新日子" : "编辑事件",
        headerRight: (
            <TouchableHighlight
                onPress={() => navigation.state.params.navigatePress()}
                underlayColor='rgba(0,0,0,0.2)'
                style={styles.headerRightButtonBox}
            >
                <Text style={styles.headerRightButton}>保存</Text>
            </TouchableHighlight>
        ),
    });
    constructor(props) {
        super(props);
        this.state = {
            dayID: props.navigation.getParam('id', '-1'),
            title: '',
            date: '',
            week: '',
            isTop: false,
            modalVisible: false,
        }
        this.saveInfo = this.saveInfo.bind(this);
        this.deleteday = this.deleteday.bind(this);
    }
    componentDidMount() {
        const that = this;
        const { dayID } = that.state;
        if (dayID != '-1') {
            that.showDetail();
        }
        that.props.navigation.setParams({ navigatePress: that.saveInfo });
    }
    //编辑时的信息
    showDetail() {
        let data = {};
        const that = this;
        const { dayID } = that.state;
        _fileEx(fileName, function (res) {
            if (res) {
                _readFile(fileName, function (res) {
                    data = JSON.parse(res);
                    data.forEach((item, index) => {
                        if (dayID == item.id) {
                            that.setState({
                                title: data[index].title,
                                date: data[index].date,
                                week: data[index].week,
                                isTop: data[index].isTop,
                            })
                        }
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
    //保存事件
    saveInfo() {
        const that = this;
        let { dayID, title, date, week, isTop } = that.state;
        const { navigation } = that.props;
        let data = [];
        let obj = {};
        title = title != '' ? title : '某天';
        date = date != '' ? date : year + '-' + month + '-' + day;
        _fileEx(fileName, function (res) {
            if (res) {
                _readFile(fileName, function (res) {
                    data = JSON.parse(res);
                    if(data.length==0){
                        obj = {
                            id: 0 + '',
                            unit: '天',
                            title: title,
                            date: date,
                            dateStatus: getDiffDate(date).text,
                            dayNum: getDiffDate(date).dayNum,
                            week: getDay(date),
                            isTop: isTop,
                            isPast: getDiffDate(date).text == '已过去' ? true : false
                        }
                        data.push(obj);
                    }else{
                        if (dayID != '-1') {//编辑
                            data[dayID] = {
                                id: data[dayID].id + '',
                                unit: data[dayID].unit,
                                title: title,
                                date: date,
                                dateStatus: getDiffDate(date).text,
                                dayNum: getDiffDate(date).dayNum,
                                week: getDay(date),
                                isTop: isTop,
                                isPast: getDiffDate(date).text == '已过去' ? true : false
                            }
                        } else {
                            obj = {
                                id: (data[data.length - 1].id * 1 + 1) + '',
                                unit: '天',
                                title: title,
                                date: date,
                                dateStatus: getDiffDate(date).text,
                                dayNum: getDiffDate(date).dayNum,
                                week: getDay(date),
                                isTop: isTop,
                                isPast: getDiffDate(date).text == '已过去' ? true : false
                            }
                            data.push(obj);
                        }
                    }
                    that.updateRedux('edit', data);
                    
                })
            } else {
                
                
            }
        })
    }
    updateRedux(text, arr) {
        const { dispatch, navigation } = this.props;
        _deleteFile(fileName, function (res) {
            if (res == 1) {
                _writeFile(fileName, JSON.stringify(arr), function () {
                    if (res == 1) {
                        text == 'edit' ? dispatch(increase_success()) : dispatch(delete_success());
                        navigation.push('bottomTabNavigator');
                    } else {
                        text == 'edit' ? dispatch(increase_fail()) : dispatch(delete_fail());
                        dispatch(increase_fail());

                    }
                })
            } else {

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
                }
            })
        }else{

        }
    }
    render() {
        const { title, isTop, date, week, dayID, modalVisible } = this.state;
        return (
            <View style={styles.container}>
                <View style={{padding:20,width:'100%'}}>
                    <View style={[styles.inlineBlock, styles.infoItem]}>
                        <View style={styles.icon}>
                            <AntDesign name='carryout' size={25} color="#999999"></AntDesign>
                        </View>
                        <TextInput style={styles.textinput}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={'#53CDFF'}
                            selectionColor={'#53CDFF'}
                            placeholder='点击这里输入事件名称'
                            onChangeText={(text) => this.setState({ title: text })} value={title}></TextInput>
                    </View>
                    <View style={[styles.inlineBlock, styles.infoItem]}>
                        <View style={styles.icon}>
                            <AntDesign name='calendar' size={25} color="#999999"></AntDesign>
                        </View>
                        <Text style={styles.icon} >日期</Text>
                        <DatePicker style={styles.datePicker}
                            date={date}
                            mode="date"
                            format="YYYY-MM-DD"
                           // minDate={year + '-' + month + '-' + day}
                            customStyles={customStyles}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        >

                        </DatePicker>
                    </View>
                    <View style={[styles.inlineBlock, styles.infoItem]}>
                        <View style={styles.icon}>
                            <MaterialCommunityIcons name='format-wrap-top-bottom' size={25} color="#999999"></MaterialCommunityIcons>
                        </View>
                        <Text style={styles.icon} >置顶</Text>
                        <Switch style={styles.isTop} trackColor={'#53CDFF'} value={isTop} onValueChange={(value) => this.setState({ isTop: value })}></Switch>
                    </View>
                    <TouchableHighlight
                        onPress={() => this.saveInfo()}
                        underlayColor='rgba(0,0,0,0.2)' style={[styles.eventButtonSave, styles.eventButtonItem]} >
                        <Text style={styles.eventButtonText}>保存</Text>
                    </TouchableHighlight>
                    {
                        dayID == "-1"
                            ? null
                            : <TouchableHighlight onPress={() => this.deleteday()}
                                underlayColor='rgba(0,0,0,0.2)' style={[styles.eventButtonDelete, styles.eventButtonItem]} >
                                <Text style={styles.eventButtonText} >删除</Text>
                            </TouchableHighlight>
                    }
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
var customStyles = StyleSheet.create({
    dateInput: {
        width: '100%',
        borderColor: "transparent",
        alignItems: 'flex-start'
    },
    placeholderText: {
        textAlign: 'left',
    }
})
var styles = StyleSheet.create({
    headerRightButtonBox: {
        marginRight: 20,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff",
        width: 60,
        height: 30
    },
    headerRightButton: {
        color: '#ffffff'
    },
    block: {
        flexDirection: "column",
    },
    inlineBlock: {
        flexDirection: "row",
    },
    container: {
        alignItems: "center",
        position: "relative",
        flex:1
    },
    infoItem: {
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        borderBottomColor: '#999999',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        marginTop: 12,
    },
    textinput: {
        flex: 5
    },
    datePicker: {
        flex: 4,
    },
    icon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    isTop: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
        flex: 4,
        marginRight: 10
    },
    eventButtonItem: {
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        borderRadius: 10,
        height: 40,
    },
    eventButtonSave: {
        backgroundColor: "#53CDFF",
        marginBottom: 20,
        marginTop: 40
    },
    eventButtonDelete: {
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    eventButtonText: {
        fontSize: 16,
        color: '#ffffff',
        lineHeight: 40,
        textAlign: 'center',
    }

})


function select(store) {
    return {
        GetDayReducer: store.GetDayReducer,
    }
}
export default connect(select)(AddDaysScreen);