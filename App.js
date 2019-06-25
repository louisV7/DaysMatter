/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, StatusBar, Dimensions, Platform } from "react-native";
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
//redux 
import { Provider } from 'react-redux';
import configureStore from './src/redux/store/store.js';
//引入路由文件
import { Router } from './src/route.js';
//引入主题配置文件
import { theme } from './src/theme.js';
const AppContainer = createAppContainer(Router);
const store = configureStore();//创建store
const themeBgImg = theme.bg[0];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  setThemeBgImg(value) {
    try {
      AsyncStorage.getItem(
        'themeInfo',
        (error, result) => {
          if(result==null){
            try {
              AsyncStorage.setItem(
                'themeInfo',
                JSON.stringify(value),
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
          //alert('error==='+error+',result==='+result)
        }
      )
    } catch (error) {
      //alert('失败' + error);
    }
  }
  /*
  try {
              AsyncStorage.setItem(
                'themeInfo',
                JSON.stringify(value),
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
  */
  componentDidMount() {
    // 组件加载完毕之后，隐藏启动页
    this.setThemeBgImg(themeBgImg);
    this.timer = setTimeout(() => {
      SplashScreen.hide();
    }, 1000)
  }
  //卸载计时器
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);//同时为真的才执行卸载
  }
  render() {
    return (
      <Provider store={store}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <AppContainer />
      </Provider>
    )
  }
}
//#53CDFF