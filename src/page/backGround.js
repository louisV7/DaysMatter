import React, { Component } from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableHighlight, ScrollView, Image, FlatList } from "react-native";
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import { getDiffDate, getDay, repeatDate, insert_sort, arr_slice_deep_copy } from '../util.js';
import { PaddingTop } from '../deviceInfo.js';
import { _deleteFile, _writeFile, _readFile, _fileEx } from '../react_native_fs.js';
import { theme } from '../theme.js';
import { STATUS_BAR_HEIGHT } from '../deviceInfo.js';

const height = STATUS_BAR_HEIGHT + 44;
const paddingTop = STATUS_BAR_HEIGHT;
const fileName = 'days.txt';
export default class DaysScreen extends React.Component {
    //标题
    static navigationOptions = ({ navigation }) => ({
        title: '设置背景图片',
        headerRight: (
            <TouchableHighlight
                onPress={() => navigation.state.params.navigatePress()}
                underlayColor='rgba(0,0,0,0.2)'
                style={styles.headerRightButtonBox}
            >
                <Text style={styles.headerRightButton} >使用</Text>
            </TouchableHighlight>
        ),
    });
    constructor(props) {
        super(props);
        this.state = {
            imgData: theme.bg,
            daysData: [],
            topDayData: {},
            currentImg: theme.bg[0].img,
            currentImgIndex:0
        }
        this.selectBgImg = this.selectBgImg.bind(this);
        this.useBgImg = this.useBgImg.bind(this);
    }
    componentWillMount() {
        const that = this;
        that.getData();
        that.getThemeBgImg();
    }
    componentDidMount() {
        const that = this;
        that.props.navigation.setParams({ navigatePress: that.useBgImg });
    }
    //获取背景图
    getThemeBgImg() {
        const that = this;
        try {
            AsyncStorage.getItem(
                'themeInfo',
                (error, result) => {
                    if (error) {
                        //alert('取值失败:' + error);
                    } else {
                        //console.log(result)
                        that.setState({
                            currentImg: JSON.parse(result).img,
                            currentImgIndex:JSON.parse(result).id
                        })
                    }
                }
            )
        } catch (error) {
            //alert('失败' + error);
        }
    }
    selectBgImg(value) {
        this.setState({
            currentImg: value.img,
            currentImgIndex:value.id
        })
    }
    useBgImg() {
        const { currentImg,currentImgIndex } = this.state;
        let obj = {
            id: currentImgIndex,
            img: currentImg
        }
        this.setThemeBgImg(obj);
    }
    setThemeBgImg(value) {
        const { navigation } = this.props;
        //alert(value.img)
        try {
            AsyncStorage.removeItem(
                'themeInfo',
                (error) => {
                    try {
                        AsyncStorage.setItem(
                            'themeInfo',
                            JSON.stringify(value),
                            (error) => {
                                if (error) {
                                    //alert('存值失败:', error);
                                } else {
                                    //alert('存值成功!');
                                    navigation.push('bottomTabNavigator')
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
    
    getData() {
        const that = this;
        let pastTrue = [];
        let pastFalse = [];
        let data = [];
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
                daysData: arr_slice_deep_copy(result).splice(0, 3),
                topDayData: result[that.top(result)],
            })
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
    //列表渲染
    dayItemRender({ item }) {
        const { navigation } = this.props;
        const { themeInfo } = this.state;
        return (
            <View style={{ height: 45, paddingLeft: 20, paddingRight: 20 }}>
                <View style={[styles.dayItem, styles.inlineBlock]}>
                    <View style={styles.dayItemLeft}>
                        <Text  style={{ fontSize: 16 }}>{item.title}{item.dateStatus}</Text>
                        <Text  style={[styles.dayDate]}>{item.repeatDate} {item.week}</Text>
                    </View>
                    <View style={styles.dayItemRight}>
                        <Text  style={{
                            textAlign: "right",
                            fontSize: 14,
                            fontWeight: 'bold',
                            //color: themeInfo.textColor
                            //color: item.isPast ? '#999999' : '#666666'
                        }}>{item.dayNum}</Text>
                        <Text  style={[styles.dayLogo]}>{item.unit}</Text>
                    </View>

                </View>
            </View>
        )
    }
    render() {
        const { navigation } = this.props;
        const {imgData, topDayData, daysData, currentImg,currentImgIndex } = this.state;
        return (
            <View style={[styles.container]}>
                <StatusBar
                    animated={true}
                    barStyle="light-content"
                />
                <View style={styles.styleShow}>
                    <View style={styles.daysPage}>
                        <View style={styles.header}>
                            <Text style={{ fontWeight: 'bold', color: '#666', fontSize: 20, flex: 1 }}>倒数日</Text>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", }}>
                                <Ionicons name='md-add' size={35} color="#666666" />
                            </View>
                        </View>
                        <Image
                            resizeMode='cover'
                            style={styles.backgroundImage}
                            source={{ uri: currentImg }}
                        />
                        <View style={{ marginTop: 10 }}>
                            <View style={styles.TopDayCOntainer}>
                                <Text  style={[styles.topDayDataTitle]}>{topDayData.title}{topDayData.dateStatus}</Text>
                                <View style={styles.inlineBlock}>
                                    <Text  style={[styles.topDayDataDayNum]}>{topDayData.dayNum}</Text>
                                    <Text  >{topDayData.unit}</Text>
                                </View>
                                <Text  style={[styles.topDayDataDate]}>{topDayData.repeatDate} {topDayData.week}</Text>
                            </View>
                            <View style={styles.dayItemContainer}>
                                <FlatList
                                    data={daysData}
                                    renderItem={this.dayItemRender.bind(this)}
                                    keyExtractor={(item) => item.id}
                                >
                                </FlatList>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.bgImgSelectBox}>
                    <ScrollView horizontal={true} 
                    ref={scrollView => {
                        if(scrollView !== null){
                            setTimeout(()=>{
                                scrollView.scrollTo({x:currentImgIndex*50,y:0,animated:true},1) 
                            })
                        }}}
                     showsHorizontalScrollIndicator={false}>
                        {
                            imgData.map((item,index)=>{
                                return (
                                    <TouchableHighlight key={index} underlayColor='rgba(0,0,0,0.2)' style={styles.imgItem}
                                        onPress={() => this.selectBgImg(item)}
                                    >
                                        <View style={[styles.imgItemView]}>
                                            <Image
                                                style={{ width: 60, height: 65, borderRadius: 12,}}
                                                source={{uri:item.img}}
                                                
                                            />
                                            {
                                                currentImgIndex==index?
                                                <View style={styles.checkcircle} >
                                                    <AntDesign  name='checkcircle' size={25} color={theme.themeColor}></AntDesign>
                                                </View>:null
                                            }
                                        </View>
                                    </TouchableHighlight>
                                )
                            })
                        }
                    </ScrollView>
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
    container: {
        flex: 1,
        backgroundColor: '#eeeeee'
    },
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
    styleShow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        marginTop: 20,
    },
    bgImgSelectBox: {
        padding: 10,
        height: 100
    },
    imgItem: {
        borderRadius: 12,
        width: 60,
        height: 65,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    imgItemView:{
        width:'100%',
        height:'100%',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position:"relative"
    },
    checkcircle:{
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,0.3)',
        borderRadius: 12,
        position:"absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    daysPage: {
        backgroundColor: "transparent",
        width: '80%',
        height: '100%',
        position: "relative",
    },
    header: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
        height: 50
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
        fontSize: 16,
        //fontFamily: '刻石录颜体',
    },
    topDayDataDayNum: {
        fontSize: 52,
        fontWeight: 'bold',
        //fontFamily: '台湾教育部标准楷书',
    },
    topDayDataDate: {
        //fontFamily: '王汉宗中隶书繁',
    },
    dayItemContainer: {

    },
    dayItem: {
        height: 45,
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
        fontSize: 12
    },
    dayItemRight: {
        flex: 1.2,
    },
    dayDayNum: {

    },
    dayLogo: {
        textAlign: "right",
        fontSize: 12
    },
})