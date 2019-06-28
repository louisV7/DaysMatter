package com.daysmatter;

import android.app.Application;


import com.beefe.picker.PickerViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;//极光推送

public class MainApplication extends Application implements ReactApplication {
    private boolean SHUTDOWN_TOAST = true;//关闭初始化成功的toast框
    private boolean SHUTDOWN_LOG = false;//极光推送
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerViewPackage(),
            new AsyncStoragePackage(),
            new SplashScreenReactPackage(),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new RNGestureHandlerPackage(),
            new JPushPackage(SHUTDOWN_TOAST,SHUTDOWN_LOG)//极光推送
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    
 
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  
}
