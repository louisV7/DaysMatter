/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, StatusBar,  } from "react-native";
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';//https://oblador.github.io/react-native-vector-icons/图标地址
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
//路由文件
import Days from './src/page/days.js';
import AddDay from './src/page/addDay.js';
import History from './src/page/history.js';
import PastDayDetail from './src/page/pastDayDetail.js';
import GuidePage from './src/page/guidePage.js';
//redux 
import { Provider } from 'react-redux';
import configureStore from './src/redux/store/store.js';
const store = configureStore();//创建store
let appInitialRouteName='bottomTabNavigator';

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
  }

  // You can return any component that you like here!
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};
const TabNavigator = createBottomTabNavigator(
  {
    Days: createStackNavigator(
      {
        Days: {
          screen: Days,
          navigationOptions: {
            title: '倒数日',
            headerStyle: {
              backgroundColor: '#53CDFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }
        }
      }
    ),
    History: createStackNavigator(
      {
        History: {
          screen: History,
          navigationOptions: {
            title: '历史上的今天',
            headerStyle: {
              backgroundColor: '#53CDFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
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
      activeTintColor: '#53CDFF',
      inactiveTintColor: '#AFB1BE',
    },
  }
);
//创建全局导航器createStackNavigator
const AppStack = createStackNavigator(
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
    /*GuidePage: {
      screen: GuidePage,
    }*/
  },
  {
    initialRouteName: "bottomTabNavigator",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#53CDFF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
)
const AppContainer = createAppContainer(AppStack);
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirst:false,
    }
  }
  componentDidMount() {
    // 组件加载完毕之后，隐藏启动页
    SplashScreen.hide();
    //this.openApp();
  }
  openApp() {
    const that=this;
    //AsyncStorage.removeItem('isFirst')
    AsyncStorage.getItem('isFirst', (error, result) => {

      if (result == 'false') {
        return (
          <Provider store={store}>
            <StatusBar
              backgroundColor="#53CDFF"
              barStyle="light-content"
            />
            <AppContainer />
          </Provider>
        )
      } else {
        // 存储
        AsyncStorage.setItem('isFirst', 'false', (error) => {
          if (error) {
            alert(error);
          }
        });
        return <GuidePage></GuidePage>
      }
    });
  }
  render() {
    const that=this;
    return (
      <Provider store={store}>
        <StatusBar
          backgroundColor="#53CDFF"
          barStyle="light-content"
        />
        <AppContainer />
      </Provider>
    )
  }
}
