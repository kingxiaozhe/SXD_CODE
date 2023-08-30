package com.judgeapp.mymodule;
import com.judgeapp.mymodule.SendModule;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import android.util.Log;

public class SendModulePackage implements ReactPackage {
  private static final String TAG = "MainActivity";

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();

    modules.add(new SendModule(reactContext)); // 将自定义的原生模块添加到模块包中
    return modules;
  }

}
