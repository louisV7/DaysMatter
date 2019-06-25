/**
 * @format
 */

import {AppRegistry,View,Text,StyleSheet} from 'react-native';
import React, { Component } from 'react';
import App from './App';
import {name as appName} from './app.json';
import _ from 'lodash';
//0.56(不包括)版本之前
/*Text.prototype.render = _.wrap(Text.render, function (func, ...args) {
    let originText = func.apply(this, args)
    return React.cloneElement(originText, {allowFontScaling: false,style:[
        originText.props.style,
        styles.defaultFontFamily
    ]})
})*/
//0.56(包括)版本之后
/*Text.render = _.wrap(Text.render, function (func, ...args) {
    let originText = func.apply(this, args)
    return React.cloneElement(originText, {allowFontScaling: false,style:[
        originText.props.style,
        styles.defaultFontFamily
    ]})
})
var styles = StyleSheet.create({
    defaultFontFamily:{
        fontFamily: '刻石录颜体',
    }
})*/
AppRegistry.registerComponent(appName, () => App);
