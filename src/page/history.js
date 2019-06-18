import React, {Component} from 'react';
import { View, StyleSheet,Text,FlatList,ScrollView } from "react-native";
import { connect } from 'react-redux';
import {Card} from 'react-native-shadow-cards';

import {history,calendar} from '../api.js';
import {getLunarDate,getLunarDateString,getTodayDate,getDay} from '../util.js';
const key='b469258df91094c4b3b82edabcad82c0';
const year=getTodayDate().year;
const month=getTodayDate().month;
const day=getTodayDate().day;
class HistoryScreen extends React.Component {
   
    constructor(props){
        super(props);
        this.state={
            historyData:[],
            todayDate:year+'年'+month+'月'+day,
            todayLunarDate:getLunarDateString(getLunarDate(year+'-'+month+'-'+day)),
            todayWeek:getDay(year+'-'+month+'-'+day),
            getDataFail:false,
            loaded:false
        }
    }
    componentDidMount(){
        const that=this;
        const date=month+'/'+day;
        that.fetch(history(date,key)).then((res)=>{
            if(res.error_code==0){
                that.setState({
                    historyData:res.result,
                    loaded:true
                })
            }else{
                alert('出错了')
                that.setState({
                    getDataFail:true
                })
            }
        })
    }
    fetch(url){
        
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
    historyItem({item}){
        return(
            <View style={[styles.historyItem,styles.inlineBlock]}>
                <View style={styles.historyItemLeft}>
                    <Text style={{fontSize: 18}}>{item.date.split('年')[0]}</Text>
                </View>
                <Text style={styles.historyItemCenter}>{item.date},{item.title}。</Text>
                <Text style={styles.historyItemRight}></Text>
            </View>
        )
    }
    render(){
        const {historyData,todayDate,todayLunarDate,getDataFail,loaded}=this.state;
        /*if(getDataFail){
            return (
                <View style={styles.getDataFail}>
                    <Text >数据获取失败，</Text>
                    <TouchableHighlight >
                        <Text>请重试</Text>
                    </TouchableHighlight>
                </View>
            )
        }*/
        if(!loaded){
            return (
                <View style={styles.loading}>
                    <Text style={{color:'#ffffff',fontSize:16}}>加载中...</Text>
                </View>
            )
        }else{
            return (
                <View style={styles.container}>
                    <Card cornerRadius={0} opacity={0.3} elevation={5} style={[styles.todayContainer,styles.inlineBlock]}>
                        <View style={styles.topLeft}>
                            <Text style={styles.date}>{todayDate}</Text>
                            <Text style={styles.LunarDate}>{todayLunarDate}</Text>
                        </View>
                        <Text style={styles.topRight}>星期五</Text>
                    </Card>
                    <ScrollView style={styles.historyContainer}>
                        <FlatList
                            data={historyData}
                            renderItem={this.historyItem.bind(this)}
                            keyExtractor={(item) => item.e_id}
                        />
                    </ScrollView>
                </View>
            )
        }
        
    }
}
var styles = StyleSheet.create({
    block: {
        flexDirection: "column",
    },
    inlineBlock: {
        flexDirection: "row",
    },
    container:{
        
    },
    todayContainer:{
        paddingLeft:20,
        paddingRight: 20,
        height:80,
        width:'100%',
        alignItems: "center", 
    },
    topLeft:{
        flex:3
    },
    date:{
        fontSize:20
    },
    LunarDate:{
        fontSize:16
    },
    topRight:{
        flex:2,
        fontSize:26,
        textAlign:'right'
    },
    historyContainer:{
        padding:20
    },
    historyItem:{
        marginBottom:12,
        justifyContent: "center", 
        alignItems: "center",
    },
    historyItemLeft:{
        flex:1,
        flexDirection: "row",
        alignItems: "flex-start",
        height:'100%'
    },
    historyItemCenter:{
        flex:4.5,
        fontSize: 16,
    },
    historyItemRight:{
        flex:0.5
    },
    getDataFail:{
        flex: 1,
        //flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        
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
        GetDayReducer : store.GetDayReducer,
    }
}
export default connect(select)(HistoryScreen);