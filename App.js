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
import { DrawerNavigator } from './src/route.js';
const AppContainer = createAppContainer(DrawerNavigator);
const store = configureStore();//创建store

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  componentDidMount() {
    // 组件加载完毕之后，隐藏启动页
      this.timer = setTimeout(() => {
        SplashScreen.hide();
      }, 900)
  }
  //卸载计时器
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);//同时为真的才执行卸载
  }
  /*
  <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
  */
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}
//#53CDFF