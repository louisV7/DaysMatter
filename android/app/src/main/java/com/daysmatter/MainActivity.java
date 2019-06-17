package com.daysmatter;

import com.facebook.react.ReactActivity;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

// 启动页设置添加代码
//import android.os.Bundle;
//import com.facebook.react.ReactActivity;
//import org.devio.rn.splashscreen.SplashScreen; 
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    /*@Override
    protected void onCreate(Bundle savedInstanceState) {
        // 这里定义了在加载js的时候，同时弹起启动屏
        // 第二个参数true，是启动页全屏显示，隐藏了状态栏。
        SplashScreen.show(this, true);
        super.onCreate(savedInstanceState);
    }*/

    @Override
    protected String getMainComponentName() {
        return "DaysMatter";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
        };
    }
}
