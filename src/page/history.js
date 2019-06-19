import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, ActivityIndicator, TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import { Card } from 'react-native-shadow-cards';
import Feather from 'react-native-vector-icons/Feather';//cloud-rain
import Ionicons from 'react-native-vector-icons/Ionicons';//多云：ios-partly-sunny，晴天：md-sunny

import { history, calendar, laohuangli, weather, baiduMap } from '../api.js';
import { getLunarDate, getLunarDateString, getTodayDate, getDay } from '../util.js';
const historyKey = 'b469258df91094c4b3b82edabcad82c0';
const weatherKey = 'ede618bbdfe67ab7f4d22558c12f0ad7';
const ChinaCalendarKey = 'c18aec5d6c41cb971544cb2c7c919b9f';
const baiduAK = '7d23xGmMmVSaORGuq0G5G4Y7QvTMLfZh';
//const baiduMcode='97:DD:AF:D4:79:E8:6D:50:5E:7B:2F:E1:D2:F0:85:73:E4:A1:C5:27;com.daysmatter';//开发版的

const year = getTodayDate().year;
const month = getTodayDate().month;
const day = getTodayDate().day;
class HistoryScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            historyData: [],
            todayDate: year + '年' + month + '月' + day,
            todayLunarDate: getLunarDateString(getLunarDate(year + '-' + month + '-' + day)),
            todayWeek: getDay(year + '-' + month + '-' + day),
            loaded: false,
            suitable: '',
            avoid: '',
            weatherData: {}
        }
    }
    componentDidMount() {
        const that = this;
        const date = month + '/' + day;
        //天气
        that.getWeather();
        //历史上的今天
        that.fetch(history(date, historyKey)).then((res) => {
            if (res.error_code == 0) {
                that.setState({
                    historyData: res.result,
                    loaded: true
                })
            } else {
                that.setState({
                    historyData: [],
                    loaded: true
                })
            }
        })

        //老黄历
        /*that.fetch(ChinaCalendar(year + '-' + month + '-' + day, ChinaCalendarKey)).then((res) => {
            if (res.error_code == 0) {
                that.setState({
                    suitable: res.result.yi,
                    avoid: res.result.ji
                })
            } else {
                that.setState({
                    suitable: '',
                    avoid: ''
                })
            }
        })*/
    }
    //获取天气
    getWeather() {
        let city = '';
        const that = this;
        that.getCityLocation()
            .then(res => {
                //alert(res.result.addressComponent.city)
                city = res.result.addressComponent.city;
                //console.log('获取当前位置', res.result.addressComponent.city);
                //console.log('获取天气的api', weather(city.substr(0,city.length-1), weatherKey));
                that.fetch(weather(city.substr(0, city.length - 1), weatherKey)).then((res) => {
                    //console.log(res.result)
                    if (res.error_code == 0) {
                        that.setState({
                            weatherData: res.result,
                        })
                    } else {
                        that.setState({
                            weatherData: {},
                        })
                    }
                })
            })
            .catch(err => {
                //logWarn('获取失败' + err);
            });
    }
    //获取经纬度
    getLongitudeAndLatitude() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    resolve([location.coords.longitude, location.coords.latitude]);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    };
    //获取城市定位信息
    getCityLocation() {
        const that = this;
        return new Promise((resolve, reject) => {
            that.getLongitudeAndLatitude()
                //获取经纬度的方法返回的是经纬度组成的数组
                .then(locationArr => {
                    let longitude = locationArr[0];
                    let latitude = locationArr[1];
                    //alert('longitude=='+longitude+',latitude=='+latitude)
                    //alert(baiduMap(baiduAK,latitude,longitude))
                    that.fetch(baiduMap(baiduAK, latitude, longitude)).then((res) => {
                        //console.log(res)
                        //alert(res.status)//240
                        if (res.status == 0) {
                            resolve(res)
                        } else {
                            reject(res.code);
                        }
                    })
                        .catch(error => {
                            reject(error.code);
                        });

                })
                .catch(data => {
                    reject(data.code);
                });
        });
    };
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
    //历史列表
    historyItem({ item }) {
        return (
            <View style={[styles.historyItem, styles.inlineBlock]}>
                <View style={styles.historyItemLeft}>
                    <Text style={{ fontSize: 18 }}>{item.date.split('年')[0]}</Text>
                </View>
                <Text style={styles.historyItemCenter}>{item.date},{item.title}。</Text>
                <Text style={styles.historyItemRight}></Text>
            </View>
        )
    }
    //天气渲染
    weatherRender() {
        const { weatherData } = this.state;
        //console.log(weatherData)
        if (JSON.stringify(weatherData) != '{}') {
            return (
                <View style={styles.weatherContainer}>
                    <View style={styles.weatherItem}>
                        <Feather style={{ marginRight: 5 }} name='cloud-rain' size={25} color="#999999"></Feather>
                        <Text style={{ fontSize: 18, marginRight: 20 }}>{weatherData.realtime.info}</Text>
                        {
                            weatherData.realtime.temperature != '' ?
                                <Text style={{ fontSize: 35, fontWeight: "bold" }}>{weatherData.realtime.temperature}℃</Text>
                                : null
                        }
                    </View>
                    <View style={styles.weatherItem}>
                        {
                            weatherData.realtime.humidity != '' ?
                                <Text style={{ marginRight: 15 }}>湿度：{weatherData.realtime.humidity}</Text>
                                : null
                        }
                        <Text style={{ marginRight: 10 }}>{weatherData.realtime.direct} {weatherData.realtime.power}</Text>
                        {
                            weatherData.realtime.aqi != '' ?
                                <Text>空气指数：{weatherData.realtime.aqi}</Text>
                                : null
                        }
                    </View>
                </View>
            )
        }else{
            return null;
        }

    }
    render() {
        const { historyData, todayDate, todayLunarDate, loaded, suitable, avoid, weatherData } = this.state;
        const { navigation } = this.props;
        if (!loaded) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#53CDFF" />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Card cornerRadius={0} opacity={0.3} elevation={5} style={styles.todayContainer}>
                        <View style={styles.todayDate} >
                            <View style={styles.topLeft}>
                                <Text style={styles.date}>{todayDate}</Text>
                                <Text style={styles.LunarDate}>{todayLunarDate}</Text>
                            </View>
                            <Text style={styles.topRight}>星期五</Text>
                        </View>
                        {this.weatherRender()}
                    </Card>
                    <ScrollView style={styles.historyContainer}>
                        {
                            historyData.length != 0 ?
                                <FlatList
                                    data={historyData}
                                    renderItem={this.historyItem.bind(this)}
                                    keyExtractor={(item) => item.e_id}
                                />
                                : <View style={styles.limit}>
                                    <Text style={{ fontSize: 18 }}>您要访问的数据去月球了</Text>
                                    <TouchableHighlight underlayColor='#ffffff' onPress={() => navigation.push('AddDay', {
                                        id: "-1"
                                    })}>
                                        <Text style={{ color: '#53CDFF', fontSize: 18, marginTop: 10 }}>去添加你的新日子吧！</Text>
                                    </TouchableHighlight>
                                </View>
                        }
                    </ScrollView>

                </View>
            )
        }

    }
}
//<Text style={styles.city}>{weatherData.city}</Text>
/*
老黄历
<View style={styles.stuff}>
    {
        suitable != '' ?
            <View style={styles.stuffItem}>
                <Text style={styles.suitable}>宜</Text>
                <Text style={{ flex: 7, paddingLeft: 5, color: '#999999' }}>{suitable}</Text>
            </View>
            : null
    }
    {
        avoid != '' ?
            <View style={[styles.stuffItem, styles.stuffItem1]}>
                <Text style={styles.avoid}>忌</Text>
                <Text style={{ flex: 7, paddingLeft: 5, color: '#999999' }}>{avoid}</Text>
            </View>
            : null
    }
</View>

*/
var styles = StyleSheet.create({
    block: {
        flexDirection: "column",
    },
    inlineBlock: {
        flexDirection: "row",
    },
    container: {
        flex: 1
    },
    todayContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        //height:120,
        width: '100%',
        marginBottom: 15
    },
    todayDate: {
        width: '100%',
        flexDirection: "row",
    },
    topLeft: {
        flex: 3
    },
    date: {
        fontSize: 18
    },
    LunarDate: {
        fontSize: 14,
        color: '#999999'
    },
    topRight: {
        flex: 2,
        fontSize: 26,
        textAlign: 'right'
    },
    weatherContainer: {
        width: '100%',
    },
    city: {
        width: '100%',
        textAlign: "center",
        lineHeight: 40
    },
    weatherItem: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
    },

    historyContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
        //marginBottom:40
    },
    historyItem: {
        marginBottom: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    historyItemLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        height: '100%'
    },
    historyItemCenter: {
        flex: 4.5,
        fontSize: 16,
    },
    historyItemRight: {
        flex: 0.5
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",

    },
    //历史获取出错
    limit: {
        width: '100%',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 70
    }
})
/*
老黄历
stuff: {
        width: '100%',
        marginTop: 10,
    },
    stuffItem: {
        flexDirection: "row",
    },
    stuffItem1: {
        marginTop: 10,
    },
    suitable: {
        flex: 1,
        color: '#288E09',
        borderRightWidth: 1,
        borderRightColor: '#999999',
        textAlign: "center"
    },
    avoid: {
        flex: 1,
        color: '#F84D33',
        borderRightWidth: 1,
        borderRightColor: '#999999',
        textAlign: "center"
    },
*/

function select(store) {
    return {
        GetDayReducer: store.GetDayReducer,
    }
}
export default connect(select)(HistoryScreen);