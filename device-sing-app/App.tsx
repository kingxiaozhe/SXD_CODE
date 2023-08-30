import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
// import DeviceInfo from "react-native-device-info";

import axios from "axios";
// 引入 NativeModules
import { NativeModules, AppState } from "react-native";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
  Linking,
  Alert,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [appState, setAppState] = useState<String>(AppState.currentState);
  const isDarkMode = useColorScheme() === "dark";

  const [updateSubmitLoading, setUpdateSubmitLoading] =
    useState<boolean>(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const setupTimer = () => {
    // _getByDeviceNo();
    const intervalId = setInterval(() => {
      _getByDeviceNo();
    }, 2000); // 每5秒执行一次
  };

  const handleAppStateChange = (nextAppState: String) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      // 从后台回到前台时，重新设置定时器
      setupTimer();
    }
    setAppState(nextAppState);
  };

  const _getByDeviceNo = () => {
    axios
      .post("http://43.138.208.118:8090/api/consumeOrder/getByDeviceNo", {
        deviceNo: "10001",
      })
      .then((response) => {
        console.log(`appState=>${appState}`);
        const { duration } = response.data.data;
        console.log(`duration=>${duration}`);
        // 如果当前没有打开过，并且订单有值，则打开唱歌软件
        if (!updateSubmitLoading && response.data.data) {
          // sendData 是在原生模块自定义的方法，默认数据格式为字符串
          try {
            // SendModule 为我们自定义的原生模块
            const SendModule = NativeModules.SendModule;
            SendModule.openAppAndCloseAfter(
              "com.google.android.apps.chrome.Main",
              5000
            );
            setUpdateSubmitLoading(true);
          } catch (error) {
            console.log(`Error sending data${error}`);
          }
        }
        // 如果当前订单没有值，则设置关闭唱歌软件状态
        if (!response.data.data) {
          setUpdateSubmitLoading(false);
          //   SendModule.closeApp();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const imageStyle = {
    width: 200,
    height: 200,
    paddingBottom: 100,
    viewHeight: 300,
  };
  useEffect(() => {
    console.log(11111);
    const handleAppStateChange = (nextAppState: String) => {
      console.log(13123123123);
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // 从后台回到前台时的操作，例如重新设置定时器
        console.log("====123");
      }
      setAppState(nextAppState);
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      // 请求接口和其他操作
      _getByDeviceNo();
    }, 2000);

    return () => clearInterval(timer); // 清除定时器，以防止内存泄漏
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            alignItems: "center",
          }}
        >
          <Image
            style={imageStyle}
            source={require("./common/image/qrcode.png")}
          />

          {/* <Button title="Linking" onPress={_onPress} /> */}

          <Section title="扫码支付，开启共享K歌">
            {/* <ReloadInstructions /> */}
          </Section>
          {/* <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More"></Section>
          <LearnMoreLinks /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
