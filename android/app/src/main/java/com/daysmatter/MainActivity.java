package com.daysmatter;

import com.facebook.react.ReactActivity;
//为了完成 react-native-gesture-handler在 Android 上的安装
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

// 启动页设置添加代码
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

import java.lang.Override;
import cn.jpush.android.api.JPushInterface;//极光推送

//分享
import com.daysmatter.module.ShareModule;
import com.umeng.socialize.UMShareAPI;
public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 这里定义了在加载js的时候，同时弹起启动屏
        // 第二个参数true，是启动页全屏显示，隐藏了状态栏。
        SplashScreen.show(this, true);
        

        JPushInterface.init(this);//极光推送

        ShareModule.initActivity(this);//分享
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "DaysMatter";
    }
//为了完成 react-native-gesture-handler在 Android 上的安装
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
    //极光推送
    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
    //极光推送
}
