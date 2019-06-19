import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Switch, TextInput, ToastAndroid, Modal, Picker, FlatList } from "react-native";
//import Picker from 'react-native-picker';
export default class Repeat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: '',
            leftArr: [],
            rightArr: []
        }
    }
    componentWillMount() {
        this.createData();
    }
    createData() {
        let arr1 = ['不', '周', '月', '年', '天'];
        let rightArr = [];
        let leftArr = [];
        for (let i = 0; i < arr1.length; i++) {
            let obj = {
                id: i,
                text: arr1[i] + '重复'
            };
            rightArr.push(obj);
        }
        for (let i = 0; i < 100; i++) {
            let obj = {
                id: i,
                text: i == 0 ? '不重复' : i == 1 ? '每' : '每' + i
            };
            leftArr.push(obj);
        }
        this.setState({
            leftArr: leftArr,
            rightArr: rightArr
        })
        //alert(leftArr[0].text)
    }

    render() {
        const { modalVisible, } = this.props;
        const { language, leftArr, rightArr } = this.state;
        const Items = leftArr.map((obj, index) => {
            return <Picker.Item key={index} label={obj.text} value={obj.text} />
           })
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={modalVisible}

                onRequestClose={() => this.props.isOpen()}
                style={styles.container}
            >
                <View style={styles.bg}>
                    <View style={styles.pickerCotainer}>
                        <View style={styles.pickerTop}>
                            <Text style={{ flex: 1, textAlign: 'left' }}>取消</Text>
                            <Text style={{ flex: 3, textAlign: 'center' }}>标题</Text>
                            <Text style={{ flex: 1, textAlign: 'right' }}>确定</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Picker
                                androidmode={'dropdown'}
                                style={styles.pickerList}
                                selectedValue={language}
                                onValueChange={(lang) => this.setState({ language: lang })}>
                                {Items}
                            </Picker>
                            <Picker
                                androidmode={'dropdown'}
                                style={styles.pickerList}
                                selectedValue={language}
                                onValueChange={(lang) => this.setState({ language: lang })}>
                                {this.state.rightArr.map((item, index) => <Picker.Item label={item.text} value={item.text} key={index} />)}
                            </Picker>
                        </View>
                    </View>
                </View>
            </Modal>
        )

    }
}
/*
<Picker
                                    androidmode ={'dropdown'}
                                    style={styles.pickerList}
                                    selectedValue={language}
                                    onValueChange={(lang) => this.setState({ language: lang })}>
                                    {
                                        leftArr.map((item,index)=>{
                                             return <Picker.Item style={styles.pickerItem} key={index} label={item.text} value={item.text} />
                                        })
                                    }
                                </Picker>
                                <Picker
                                    androidmode ={'dropdown'}
                                    style={styles.pickerList}
                                    selectedValue={language}
                                    onValueChange={(lang) => this.setState({ language: lang })}>
                                    {
                                        rightArr.map((item,index)=>{
                                             return <Picker.Item style={styles.pickerItem} key={index} label={item.text} value={item.text} />
                                        })
                                    }
                                </Picker>
*/
var styles = StyleSheet.create({
    container: {
        //backgroundColor:'rgba(0,0,0,0.3)',
        flex: 1,
    },
    bg: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flex: 1,
        position: "relative",
    },
    pickerCotainer: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        height: 300,
        backgroundColor: '#ffffff'
    },
    pickerTop: {
        flexDirection: 'row',
    },
    pickerList: {
        flex: 1,
        height: '100%'
    },
    picker: {

    },
})