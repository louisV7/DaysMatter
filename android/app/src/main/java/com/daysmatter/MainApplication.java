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
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;//极光推送

//分享
import com.daysmatter.module.SharePackage;
import com.umeng.socialize.Config;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;
import com.umeng.commonsdk.UMConfigure;

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
            new RNCViewPagerPackage(),
            new PickerViewPackage(),
            new AsyncStoragePackage(),
            new SplashScreenReactPackage(),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new RNGestureHandlerPackage(),
            new JPushPackage(SHUTDOWN_TOAST,SHUTDOWN_LOG),//极光推送
            new SharePackage() //分享
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
    Config.shareType = "react native";//分享，此处配置类型，供后台分析各渠道时使用
    // 初始化Umeng分享
    UMConfigure.init(this,"5d1d9b930cafb22bdf001287","umeng",UMConfigure.DEVICE_TYPE_PHONE,"");
  }
  // 配置平台key、secret信息
  {
    //PlatformConfig.setWeixin("微信Key", "微信Secret");
    //PlatformConfig.setQQZone("qq app id", "QQ Secret");
    //PlatformConfig.setSinaWeibo("微博key", "微博Secret", "www.baidu.com");
    PlatformConfig.setWeixin("wx083bf496cbc48aec", "750e9075fa521c82274a9d548c399825");
    //PlatformConfig.setQQZone("1106207359", "3JjbG8aXMuh5w0sV");
    PlatformConfig.setSinaWeibo("2733400964", "fac50980a44e3e3afd4bc968ea572887", "www.baidu.com");
  }
  
}
