import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, TouchableHighlight, ActivityIndicator, Image, StatusBar, Button } from "react-native";
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';//https://oblador.github.io/react-native-vector-icons/图标地址
import AsyncStorage from '@react-native-community/async-storage';

import { calendar } from '../api.js';
import { getDiffDate, getDay, repeatDate, insert_sort } from '../util.js';
import { _deleteFile, _writeFile, _readFile, _fileEx } from '../react_native_fs.js';
import { PaddingTop } from '../deviceInfo.js';
//引入主题配置文件
import { theme } from '../theme.js';
import { STATUS_BAR_HEIGHT } from '../deviceInfo.js';
const height = STATUS_BAR_HEIGHT + 44;
const year = 2019;
const key = '50c6f7517446dbb4d803a1c7f962ebaf';
const fileName = 'days.txt';
const themeBgImg = theme.bg[0];
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
        <Ionicons name='md-add' size={35} color="#666666" />
      </TouchableHighlight>
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      daysData: [],
      topDayData: {},
      loaded: false,//是否加载完成
      themeInfo: {}
    }
  }
  /*
  _deleteFile(fileName, function (res) {
      
    })
   
   */

  componentDidMount() {
    const that = this;
    that.getThemeBgImg();
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
          data = insert_sort(JSON.parse(res));
          that.setState({
            daysData: data,
            topDayData: data[that.top(data)]
          })
        })
      } else {

      }
    }
  }
  //获取背景图
  getThemeBgImg() {
    const that = this;
    try {
      AsyncStorage.getItem(
        'themeInfo',
        (error, result) => {
          if (result != null) {
            that.setState({
              themeInfo: JSON.parse(result)
            })
          } else {
            that.setState({
              themeInfo: themeBgImg
            })
            try {
              AsyncStorage.removeItem(
                'themeInfo',
                (error) => {
                  try {
                    AsyncStorage.setItem(
                      'themeInfo',
                      JSON.stringify(themeBgImg),
                      (error) => {
                        if (error) {
                          //alert('存值失败:', error);
                        } else {
                          //alert('存值成功!');
                        }
                      }
                    );
                  } catch (error) {
                    //alert('失败' + error);
                  }
                }
              );
            } catch (error) {
              //alert('失败' + error);
            }
          }
        }
      )
    } catch (error) {
      //alert('失败' + error);
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
              repeatDate: item.startday,
              dateStatus: getDiffDate(item.startday).text,
              dayNum: getDiffDate(item.startday).dayNum,
              week: getDay(item.startday),
              isTop: count == 0 ? true : false,
              isPast: getDiffDate(item.startday).text == '已过去' ? true : false,
              repeatText: '不重复'
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
      //console.log(data)
      data.forEach((item, index) => {
        let newDate = '';
        let isPast = getDiffDate(item.date).text == '已过去' ? true : false;
        if (isPast) {
          newDate = repeatDate(item.date, item.repeatText);
        } else {
          newDate = item.date;
        }
        dayItem = {
          id: item.id + '',
          unit: item.unit,
          title: item.title,
          date: item.date,
          repeatDate: newDate,
          dateStatus: getDiffDate(newDate).text,
          dayNum: getDiffDate(newDate).dayNum,
          week: getDay(newDate),
          isTop: item.isTop,
          isPast: getDiffDate(newDate).text == '已过去' ? true : false,
          repeatText: item.repeatText
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
    let pastTrue = [];
    let pastFalse = [];
    let result = [];
    let loaded = false;
    let data=[];
    //如果是还没过去的日期按照从小到大排序，是已经过去的日期按照从大到小排序
    _writeFile(fileName, JSON.stringify(daysArr), function (res) {
      if (res == 1) {
        _readFile(fileName, function (res) {
          data = JSON.parse(res);
          for (var i = 0; i < data.length; i++) {
            if (data[i].isPast) {
              pastTrue.push(data[i]);
            } else {
              pastFalse.push(data[i]);
            }
          }
          result = insert_sort(pastFalse, false).concat(insert_sort(pastTrue, true));
          that.setState({
            daysData: result,
            topDayData: result[that.top(result)],
            loaded: true
          })
        })
      }
    })

  }
  //置顶操作
  top(arr) {
    let index = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].isTop) {
        index = i;
        break;
      } else {
        index = 0;
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
    const { themeInfo } = this.state;
    return (
      <TouchableHighlight
        onPress={() => {
          navigation.push('PastDayDetail', {
            id: item.id,
            isPast: item.isPast
          })
        }}
        underlayColor='rgba(0,0,0,0.2)'
        style={{ height: 55, paddingLeft: 20, paddingRight: 20 }}
      >
        <View style={[styles.dayItem, styles.inlineBlock]}>
          <View style={styles.dayItemLeft}>
            <Text style={{ fontSize: 16 }}>{item.title}{item.dateStatus}</Text>
            <Text style={[styles.dayDate]}>{item.repeatDate} {item.week}</Text>
          </View>
          <View style={styles.dayItemRight}>
            <Text style={{
              textAlign: "right",
              fontSize: 20,
              fontWeight: 'bold',
            }}>{item.dayNum}</Text>
            <Text style={[styles.dayLogo]}>{item.unit}</Text>
          </View>

        </View>
      </TouchableHighlight>
    )
  }

  show() {
    const { daysData, topDayData, loaded, themeInfo } = this.state;
    const isNUll = daysData.length != 0 ? false : true
    const { navigation } = this.props;
    if (loaded) {
      if (isNUll) {
        return (
          <View style={[styles.NoEvent,{top:height}]}>
            <TouchableHighlight
              onPress={() => navigation.push('AddDay', {
                id: "-1"
              })}
              underlayColor='rgba(255,255,255,0.5)' style={{borderRadius: 12,}}>
              <View style={styles.addEventBox}>
                <Ionicons name='md-add' size={30} color="#666666" />
                <Text style={{ color:'#666666',fontSize: 20, flex: 1, marginLeft: 15 }}>添加新日子</Text>
              </View>
            </TouchableHighlight>
          </View>
        )
      } else {
        return (
          <ScrollView  >
            <View style={styles.TopDayCOntainer}>
              <Text style={[styles.topDayDataTitle]}>{topDayData.title}{topDayData.dateStatus}</Text>
              <View style={styles.inlineBlock}>
                <Text style={[styles.topDayDataDayNum]}>{topDayData.dayNum}</Text>
                <Text >{topDayData.unit}</Text>
              </View>
              <Text style={[styles.topDayDataDate]}>{topDayData.repeatDate} {topDayData.week}</Text>
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
    } {
      return (
        <View style={[styles.loading,{top:height}]}>
          <ActivityIndicator size="large" color={theme.loading} />
        </View>
      );
    }
  }
  //<Text style={{color:'#ffffff',fontSize:16}}>加载中...</Text>

  render() {
    const { themeInfo } = this.state;
    return <View style={[styles.container, { paddingTop: PaddingTop }]} >
      {
        JSON.stringify(themeInfo) != "{}" ? <Image resizeMode='cover' source={{ uri: themeInfo.img }} style={styles.backgroundImage} /> : null
      }
      {
        this.show()
      }
    </View>;
  }
}
/*

*/
var styles = StyleSheet.create({
  block: {
    flexDirection: "column",
  },
  inlineBlock: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "transparent"
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: null,
    width: null,
    zIndex: -1
  },
  TopDayCOntainer: {
    padding: 20,
    marginBottom: 20,
  },
  topDayDataTitle: {
    fontSize: 26,
    //fontFamily: '刻石录颜体',
  },
  topDayDataDayNum: {
    fontSize: 62,
    fontWeight: 'bold',
    //fontFamily: '台湾教育部标准楷书',
  },
  topDayDataDate: {
    //fontFamily: '王汉宗中隶书繁',
  },
  dayItemContainer: {

  },
  dayItem: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayItemLeft: {
    flex: 3.8,
  },
  dayTitle: {
    //fontSize: 16
  },
  dayDate: {
    fontSize: 14
  },
  dayItemRight: {
    flex: 1.2,
  },
  dayDayNum: {

  },
  dayLogo: {
    textAlign: "right",
    fontSize: 14
  },
 
  //以下是没有数据时的样式
  NoEvent: {
    flex:1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    left: 0,
    right: 0,
    bottom:0,
  },
  addEventBox: {
    width: 170,
    height: 45,
    borderRadius: 12,
    borderColor: '#666666',
    borderWidth: 2,
    borderStyle: 'solid',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  loading: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom:0,
    //flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",

  }
})


function select(store) {
  return {
    GetDayReducer: store.GetDayReducer,
  }
}
export default connect(select)(DaysScreen);