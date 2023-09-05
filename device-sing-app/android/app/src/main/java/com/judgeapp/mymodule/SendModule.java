package com.judgeapp.mymodule;

import android.widget.Toast;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.app.ActivityManager;
import java.lang.Runtime;
import android.content.Context;
import android.os.Handler;
import java.io.IOException;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.ComponentName;
import java.util.logging.Logger;  
import android.content.pm.PackageManager;

public class SendModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

  public SendModule(ReactApplicationContext reactContext) {
    super(reactContext);
    // reactContext = context;
  }

  @Override
  public String getName() {
    return "SendModule";
  }

  // 向另外一个App发送数据的代码逻辑，发送端通过 Intent连接 B app,
  @ReactMethod
  public void sendData(String data) {
    Intent intent = new Intent();
    //ComponentName comp = new ComponentName("com.sc.tv.vod","com.ktv.vod.activity.init.FirstStartActivity"); 
    ComponentName comp = new ComponentName("com.android.chrome","com.google.android.apps.chrome.Main");  
    intent.setComponent(comp);  
    intent.setAction("android.intent.action.MAIN");  
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);  
    getReactApplicationContext().startActivity(intent);
  }

  @ReactMethod
    public void closeApp() {
        getCurrentActivity().finishAffinity();  // This will close the app
    }

    @ReactMethod
    public void closeAppAfterDelay(String packageName, int delayMillis) {
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                // ActivityManager am = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
                // if (am != null) {
                //     // Logger log = Logger.getLogger("forceStopPackage");  
                //     am.forceStopPackage("com.android.scan");
                //     // am.killBackgroundProcesses(packageName);
                // }
            }
        }, delayMillis);
    }

    @ReactMethod
    public void executeCommand(String command) {
        try {
            Runtime.getRuntime().exec(command);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void runAppCommand(String packageName, int delay) {
        new Thread(() -> {
            
        // log.info("This is test java util log");     
            try {
                Process process = Runtime.getRuntime().exec("am start -n " + packageName);
                Thread.sleep(delay);
                Runtime.getRuntime().exec("am force-stop " + packageName);
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }

    @ReactMethod
    public void exitApp() {
        System.exit(0);
    }

    @ReactMethod
    public void openAppAndCloseAfter(String packageName, int delayMillis) {
        Logger log = Logger.getLogger("openAppAndCloseAfter");  
        ReactApplicationContext context = getReactApplicationContext();
        PackageManager packageManager = context.getPackageManager();
        Intent launchIntent = new Intent();
        // Intent launchIntent1 = packageManager.getLaunchIntentForPackage(packageName);
        ComponentName comp = new ComponentName("com.android.chrome","com.google.android.apps.chrome.Main");  
        launchIntent.setComponent(comp);  
        launchIntent.setAction("android.intent.action.MAIN");  
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);  
        log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        
        if (launchIntent != null) {
            getReactApplicationContext().startActivity(launchIntent);

            // Schedule to close after delayMillis
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    // You may need another way to kill an app. This might not be optimal.
                    // android.os.Process.killProcess(android.os.Process.myPid());
                    log.info("================================");
                    Intent intent  = getReactApplicationContext().getPackageManager().getLaunchIntentForPackage("com.rncode");
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                    getReactApplicationContext().startActivity(intent);
                }
            }, delayMillis);
        }
    }
} 
