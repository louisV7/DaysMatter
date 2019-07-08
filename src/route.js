import React, { Component } from 'react';
import { StatusBar, Platform } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
//路由文件
import Days from './page/days';
import AddDay from './page/addDay.js';
import History from './page/history.js';
import PastDayDetail from './page/pastDayDetail.js';
import Setting from './page/setting';
import BackGround from './page/backGround.js';
import Menu from './page//menu.js';

import { createStackNavigator, createAppContainer, createBottomTabNavigator,createDrawerNavigator } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';//https://oblador.github.io/react-native-vector-icons/图标地址
import AntDesign from 'react-native-vector-icons/AntDesign'
import { STATUS_BAR_HEIGHT } from './deviceInfo.js';
import {theme} from './theme.js';
const height = STATUS_BAR_HEIGHT + 44;
const paddingTop = STATUS_BAR_HEIGHT;
//底部tabbar的图标
const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let IconComponent = FontAwesome;
    let iconName;
    if (routeName === 'Days') {
        iconName = 'calendar';
        // We want to add badges to home tab icon
        //IconComponent = HomeIconWithBadge;
    } else if (routeName === 'History') {
        iconName = 'history';
    }else if(routeName === 'Setting'){
        IconComponent=AntDesign;
        iconName = 'setting';
    }

    // You can return any component that you like here!
    return <IconComponent name={iconName} size={25} color={tintColor} />;
};

//侧滑抽屉

const MyDrawerNavigator=createDrawerNavigator(
    {
        Menu: {
            screen: Menu,
            navigationOptions: {
                title: '倒数日',
                headerStyle: {
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    height: height,
                    paddingTop: paddingTop
                },
                headerTintColor: '#666',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTransparent: true
            }
        },
    })

//底部tabbar
const TabNavigator = createBottomTabNavigator(
    {
        Days: createStackNavigator(
            {
                Days: {
                    screen: Days,
                    navigationOptions: {
                        title: '倒数日',
                        headerStyle: {
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            height: height,
                            paddingTop: paddingTop
                        },
                        headerTintColor: '#666',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTransparent: true
                    }
                },
            }
        ),
        History: createStackNavigator(
            {
                History: {
                    screen: History,
                    navigationOptions: {
                        title: '历史上的今天',
                        headerStyle: {
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            height: height,
                            paddingTop: paddingTop
                        },
                        headerTintColor: '#666',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTransparent: true
                    }
                }
            }
        ),
        Setting: createStackNavigator(
            {
                Setting: {
                    screen: Setting,
                    navigationOptions: {
                        title: '设置',
                        headerStyle: {
                            backgroundColor: theme.themeColor,
                            height: height,
                            paddingTop: paddingTop
                        },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTransparent: false
                    }
                }
            }
        )
    },
    {
        defaultNavigationOptions: ({ navigation }) => (
            {
                tabBarIcon: ({ focused, tintColor }) =>
                    getTabBarIcon(navigation, focused, tintColor),
            }
        ),
        tabBarOptions: {
            activeTintColor: '#666666',
            inactiveTintColor: '#999999',
            style: {
                backgroundColor:'rgba(0,0,0,0)',
            },
        },
    }
);
//创建全局导航器createStackNavigator
 const StackNavigator = createStackNavigator(
    {
        bottomTabNavigator: {
            screen: TabNavigator,
            navigationOptions: {
                header: null
            }
        },
        //全局的stack 
        AddDay: {
            screen: AddDay,
        },
        PastDayDetail: {
            screen: PastDayDetail,
        },
        BackGround: {
            screen: BackGround,
        },
    },
    {
        initialRouteName: "bottomTabNavigator",
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: theme.themeColor,
                height: height,
                paddingTop: paddingTop
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            //headerTransparent: true
        }
    }
)
// 带有侧滑页的
export const DrawerNavigator = createDrawerNavigator(
    {
        StackNavigator: { 
            screen: StackNavigator
        },
    },
    {
        //drawerWidth: Screen.width * 0.9, // 展示的宽度
        drawerPosition: 'left', // 抽屉在左边还是右边
        contentComponent: Menu, // 自定义侧滑栏
        // swipeEnabled: false
    },
    
);

// 应用总的路由栈
/*export const AppNavigator = createStackNavigator({ DrawerNavigator }, {
    defaultNavigationOptions: {
        header: null
    }
});*/