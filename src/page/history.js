import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, ActivityIndicator, TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import { Card } from 'react-native-shadow-cards';

import { history, calendar, laohuangli } from '../api.js';
import { getLunarDate, getLunarDateString, getTodayDate, getDay } from '../util.js';
const key = 'b469258df91094c4b3b82edabcad82c0';
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
            avoid: ''
        }
    }
    componentDidMount() {
        const that = this;
        const date = month + '/' + day;
        that.fetch(history(date, key)).then((res) => {
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
        that.fetch(laohuangli(year + '-' + month + '-' + day, 'c18aec5d6c41cb971544cb2c7c919b9f')).then((res) => {
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
        })
    }
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
    render() {
        const { historyData, todayDate, todayLunarDate, loaded, suitable, avoid } = this.state;
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
        backgroundColor: "rgba(0,0,0,0.3)",

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


function select(store) {
    return {
        GetDayReducer: store.GetDayReducer,
    }
}
export default connect(select)(HistoryScreen);