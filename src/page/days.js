import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';//https://oblador.github.io/react-native-vector-icons/图标地址

import { history, calendar } from '../api.js';
import { increase_success, increase_fail, delete_success, delete_fail } from '../redux/actions/GetDayAction.js';
import { getDiffDate, getDay, getLunarDate, getLunarDateString } from '../util.js';
import { _deleteFile, _writeFile, _readFile, _fileEx } from '../react_native_fs.js';
const year = 2019;
const key = '50c6f7517446dbb4d803a1c7f962ebaf';
const fileName = 'days.txt';
class DaysScreen extends React.Component {
  //标题
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableHighlight
        onPress={() => navigation.push('AddDay', {
          id: "-1"
        })}
        underlayColor='rgba(0,0,0,0.2)'
        style={{ marginRight: 20, width: 35, height: 35, borderRadius: 50, justifyContent: "center", alignItems: "center", }}
      >
        <Ionicons name='md-add' size={35} color="#ffffff" />
      </TouchableHighlight>
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      daysData: [],
      topDayData: {},
      loaded: false,//是否加载完成
    }
  }
  /*
   _deleteFile(fileName, function (res) {
      
    })
   
   */
  componentDidMount() {
    const that = this;
    _fileEx(fileName, function (res) {
      if (res) {
        that.updateData();
      } else {
        that.initData();
      }
    })


  }
  componentWillReceiveProps(nextProps) {
    let data = [];
    const that = this;
    if (nextProps.GetDayReducer != null) {
      if (nextProps.GetDayReducer.message == 'success') {
        _readFile(fileName, function (res) {
          data = JSON.parse(res);
          that.setState({
            daysData: data,
            topDayData: data[that.top(data)]
          })
        })
      } else {

      }
    }
  }
  // 第一次进入app初始化数据
  initData() {
    const that = this;
    let daysArr = [];
    let dayItem = {};
    let count = 0;
    that.fetch(calendar(year, key)).then((res) => {
      if (res.error_code == 0) {
        var holiday_list = res.result.data.holiday_list;
        holiday_list.push({
          "name": "元旦",
          "startday": "2020-1-1"
        })
        holiday_list.forEach((item, index) => {
          if (getDiffDate(item.startday).text != '已过去') {
            dayItem = {
              id: count + '',
              unit: '天',
              title: item.name == '元旦' ? "New year " : item.name,
              date: item.startday,
              dateStatus: getDiffDate(item.startday).text,
              dayNum: getDiffDate(item.startday).dayNum,
              week: getDay(item.startday),
              isTop: count == 0 ? true : false,
              isPast: getDiffDate(item.startday).text == '已过去' ? true : false
            }
            daysArr.push(dayItem);
            count++;
          }
        })
        that.setDaydata(daysArr);
      } else {
        //错误处理
      }
    })
  }
  //以后每次进入都更新数据
  updateData() {
    const that = this;
    let dataArr = [];
    let dayItem = {};
    let data = [];
    _readFile(fileName, function (res) {
      data = JSON.parse(res);
      data.forEach((item, index) => {

        dayItem = {
          id: item.id + '',
          unit: item.unit,
          title: item.title,
          date: item.date,
          dateStatus: getDiffDate(item.date).text,
          dayNum: getDiffDate(item.date).dayNum,
          week: getDay(item.date),
          isTop: item.isTop,
          isPast: getDiffDate(item.date).text == '已过去' ? true : false
        }
        dataArr.push(dayItem);
      })
      _deleteFile(fileName, function (res) {
        if (res == 1) {
          that.setDaydata(dataArr);
        } else {

        }
      })
    })
  }
  //设置state数据
  setDaydata(daysArr) {
    const that = this;
    let data = [];
    let loaded = false;
    _writeFile(fileName, JSON.stringify(daysArr), function (res) {
      if (res == 1) {
        _readFile(fileName, function (res) {
          data = JSON.parse(res);
          that.setState({
            daysData: data,
            topDayData: data[that.top(data)],
            loaded: true
          })
        })
      }
    })
  }
  //置顶操作
  top(arr) {
    let index=0;
    for(var i=0;i<arr.length;i++){
      if(arr[i].isTop){
        index=i;
        break;
      }else{
        index=0;
      }
    }
    return index;
  }
  //获取当年的节日
  fetch(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          resolve(responseData);
        })
        .catch((error) => {
          reject(error);
        })
    })
  }
  //列表渲染
  dayItemRender({ item }) {
    const { navigation } = this.props;
    return (
      <TouchableHighlight
        onPress={() => {
          item.isPast
            ? navigation.push('PastDayDetail', {
              id: item.id
            })
            : navigation.push('AddDay', {
              id: item.id
            })
        }}
        underlayColor='rgba(0,0,0,0.2)'
        style={{ height:55, paddingLeft: 20, paddingRight: 20 }}
      >
        <View style={[styles.dayItem, styles.inlineBlock]}>
          <View style={styles.dayItemLeft}>
            <Text style={styles.dayTitle}>{item.title}{item.dateStatus}</Text>
            <Text style={styles.dayDate}>{item.date} {item.week}</Text>
          </View>
          <View style={styles.dayItemRight}>
            <Text style={styles.dayDayNum}>{item.dayNum}</Text>
            <Text style={styles.dayLogo}>{item.unit}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  
  show() {
    const { daysData, topDayData, loaded } = this.state;
    const isNUll = daysData.length != 0 ? false : true
    const { navigation } = this.props;
    if (loaded) {
      if (isNUll) {
        return (
          <View style={styles.NoEvent}>
            <TouchableHighlight
              onPress={() => navigation.push('AddDay', {
                id: "-1"
              })}
              underlayColor='#B9B8B6'>
              <View style={styles.addEventBox}>
                <Ionicons name='md-add' size={30} color="#B9B8B6" />
                <Text style={{ color: '#B9B8B6', fontSize: 20, flex: 1, marginLeft: 15 }}>添加新日子</Text>
              </View>
            </TouchableHighlight>
          </View>
        )
      } else {
        return (
          <ScrollView>
            <View style={styles.TopDayCOntainer}>
              <Text style={styles.topDayDataTitle}>{topDayData.title}{topDayData.dateStatus}</Text>
              <View style={styles.inlineBlock}>
                <Text style={styles.topDayDataDayNum}>{topDayData.dayNum}</Text>
                <Text>{topDayData.unit}</Text>
              </View>
              <Text style={styles.topDayDataDate}>{topDayData.date} {topDayData.week}</Text>
            </View>
            <View style={styles.dayItemContainer}>
              <FlatList
                data={daysData}
                renderItem={this.dayItemRender.bind(this)}
                keyExtractor={(item) => item.id}
              >
              </FlatList>
            </View>
          </ScrollView>
        )
      }
    }{
      return (
        <View style={styles.loading}>
          <Text style={{color:'#ffffff',fontSize:16}}>加载中...</Text>
        </View>
      );
    }
  }

  render() {
    return this.show() 
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
  TopDayCOntainer: {
    padding: 20,
    marginBottom: 20,
  },
  topDayDataTitle: {
    fontSize: 26,
  },
  topDayDataDayNum: {
    fontSize: 62,
    fontWeight: 'bold',
  },
  topDayDataDate: {

  },
  dayItemContainer: {

  },
  dayItem: {
    height:55,
    justifyContent: "center",
    alignItems: "center",
  },
  dayItemLeft: {
    flex: 3.8,
  },
  dayTitle: {
    fontSize: 16
  },
  dayDate: {
    color: '#999999',
    fontSize: 14
  },
  dayItemRight: {
    flex: 1.2,
  },
  dayDayNum: {
    textAlign: "right",
    fontSize: 20,
    fontWeight: 'bold',
  },
  dayLogo: {
    textAlign: "right",
    color: '#999999',
    fontSize: 14
  },
  //以下是没有数据时的样式
  NoEvent: {
    height: '100%',
    backgroundColor: '#F2F0EE',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addEventBox: {
    width: 170,
    height: 45,
    borderRadius: 12,
    borderColor: '#B9B8B6',
    borderWidth: 2,
    borderStyle: 'solid',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  loading:{
    flex: 1,
    //flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    
  }
})


function select(store) {
  return {
    GetDayReducer: store.GetDayReducer,
  }
}
export default connect(select)(DaysScreen);