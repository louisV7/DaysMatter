import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Switch, TextInput, ToastAndroid } from "react-native";
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { history, calendar } from '../api.js';
import { increase_success, increase_fail, delete_success, delete_fail } from '../redux/actions/GetDayAction.js';
import { getLunarDate, getLunarDateString, getTodayDate, getDiffDate, getDay, arr_slice_deep_copy } from '../util.js';
import { _deleteFile, _writeFile, _readFile, _fileEx } from '../react_native_fs.js';
import DatePicker from '../components/datePicker.js';
import ConfirmModal from '../components/confirmModal.js';
import Repeat from '../components/repeat.js';
import Picker from '../components/picker.js';
const fileName = 'days.txt';
const year = getTodayDate().year;
const month = getTodayDate().month;
const day = getTodayDate().day;

const Toast = (props) => {
    if (props.visible) {
        ToastAndroid.showWithGravityAndOffset(
            props.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        return null;
    }
    return null;
};
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
            confirmModalVisible: false,
            modalVisible: true,
            toastVisible: false,
            message: '出错',
            switchThumbColor: '',
            repeatText: '不重复',
            pickerData:[],
            defaultIndexs:[1,0]
        }
        this.saveInfo = this.saveInfo.bind(this);
        this.deleteday = this.deleteday.bind(this);
        this.setRepeat = this.setRepeat.bind(this);
    }
    componentDidMount() {
        const that = this;
        const { dayID } = that.state;
        if (dayID != '-1') {
            that.showDetail();
        }
        that.props.navigation.setParams({ navigatePress: that.saveInfo });
        that.createData()
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
                                switchThumbColor: data[index].isTop ? '#53CDFF' : ''
                            })
                        }
                    })
                })
            } else {
                /*that.setState({
                    toastVisible:true,
                    message:'出错了，请刷新'
                })*/
            }
        })
    }
    //删除
    deleteday() {
        const that = this;
        that.setState({
            confirmModalVisible: true,
        })
    }
    //重复
    setRepeat() {
        const that = this;
        that.setState({
            modalVisible: true,
        })
    }
    //保存事件
    saveInfo() {
        const that = this;
        let { dayID, title, date, week, isTop } = that.state;
        const { navigation } = that.props;
        let data = [];
        let obj = {};
        let copyData
        title = title != '' ? title : '某天';
        date = date != '' ? date : year + '-' + month + '-' + day;
        _fileEx(fileName, function (res) {
            if (res) {
                _readFile(fileName, function (res) {
                    data = JSON.parse(res);
                    if (data.length == 0) {
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
                    } else {
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
                            if (isTop) {
                                data.forEach((item, index) => {
                                    if (item.id != dayID) {
                                        item.isTop = false;
                                    } else {
                                        item.isTop = true;
                                    }
                                })
                            }
                        } else {//新增
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
        const that = this;
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
                /*that.setState({
                    toastVisible:true,
                    message:'出错了，请重试'
                })*/
            }
        })
    }
    //确认框关闭打开
    onCloseModal(value) {
        const that = this;
        const { dayID } = this.state;
        if (value) {
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
        } else {
            /*that.setState({
                toastVisible:true,
                message:'出错了，请重试'
            })*/
        }
    }

    createData() {
        let arr1 = ['不', '周', '月', '年', '天'];
        let rightArr = [];
        let leftArr = [];
        let pickerData=[];
        for (let i = 0; i < arr1.length; i++) {
            let obj = {
                id: i,
                label: arr1[i] + '重复'
            };
            rightArr.push(obj);
        }
        for (let i = 0; i < 100; i++) {
            let obj = {
                id: i,
                label: i == 0 ? '不重复' : i == 1 ? '每' : '每' + i
            };
            leftArr.push(obj);
        }
        for(let i=0;i<rightArr.length;i++){
            let obj={
                label:rightArr[i].label,
                children:leftArr
            }
            pickerData.push(obj);
        }
        this.setState({
            pickerData:pickerData
        })
        //alert(leftArr[0].text)
    }
    onChange(arr) { // 选中项改变时触发, arr为当前每一级选中项索引，如选中B和Y，此时的arr就等于[1,1]
        console.log(arr)
      }
      onOk(arr) { // 最终确认时触发，arr同上
        console.log(arr)
      }
    render() {
        const { title, isTop, date, week, dayID, confirmModalVisible, modalVisible, message, toastVisible, switchThumbColor, repeatText } = this.state;
        return (
            <View style={styles.container}>
                <View style={{ padding: 20, width: '100%' }}>
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
                            //minDate={year + '-' + month + '-' + day}
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
                        <Switch style={styles.isTop} trackColor={'#53CDFF'} thumbColor={switchThumbColor} value={isTop} onValueChange={(value) => this.setState({
                            isTop: value,
                            switchThumbColor: value ? '#53CDFF' : ''
                        })}></Switch>
                    </View>
                    <View style={[styles.inlineBlock, styles.infoItem]}>
                        <View style={styles.icon}>
                            <Feather name='repeat' size={25} color="#999999"></Feather>
                        </View>
                        <Text style={styles.icon} >重复</Text>
                        <TouchableHighlight
                            onPress={() => this.setRepeat()}
                            underlayColor='#ffffff' style={styles.textinput}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", }}>
                                <Text style={{ marginRight: 20 }}>{repeatText}</Text>
                                <MaterialIcons name='arrow-drop-down' size={25} color="#999999"></MaterialIcons>
                            </View>
                        </TouchableHighlight>

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
                    confirmModalVisible={confirmModalVisible}
                    title='提示'
                    content='删除后无法恢复，确定删除吗？'
                    confirmBtnText='删除'
                    cancelBtnText='取消'
                />
                <Toast
                    visible={toastVisible}
                    message={message}
                />
                <Picker
                    options={this.state.pickerData}
                    defaultIndexs={this.state.defaultIndexs}
                    onChange={this.onChange.bind(this)}
                    onOk={this.onOk.bind(this)}>></Picker>
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
        flex: 1
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