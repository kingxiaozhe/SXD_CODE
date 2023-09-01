import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import backgroundImage from "./assets/pic_hd.jpg";
import assets_qrcode from "./assets/assets_qrcode.png";
// import DeviceInfo from "react-native-device-info";

import axios from "axios";
// 引入 NativeModules
import { NativeModules, AppState, ImageBackground } from "react-native";

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
    flex: 1,
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      width: "100%",
      height: "100%",
      flex: 1,
      resizeMode: "cover", // 或 'contain'
      justifyContent: "center", // 居中显示子组件
    },
    containerView: {
      flexDirection: "row", // 设置子元素为水平排列
      marginBottom: 60,
    },
    block: {
      flex: 1, // 平均分配容器的空间
      justifyContent: "center", // 垂直居中
      alignItems: "center", // 水平居中
      height: 50,
      borderWidth: 0, // 可选的边框，让每个块看起来更清晰
      borderColor: "#ddd",
    },
    textStyle: {
      fontSize: 24, // 设置字体大小为24
      color: "white",
      paddingBottom: 5,
    },
    blockLeft: {
      flex: 1, // 平均分配容器的空间
      justifyContent: "center", // 垂直居中
      alignItems: "center", // 水平居中
      height: 50,
      borderWidth: 0, // 可选的边框，让每个块看起来更清晰
      borderColor: "#ddd",
    },
    blockRight: {
      flex: 1, // 平均分配容器的空间
      justifyContent: "flex-end", // 垂直居中
      alignItems: "center", // 水平居中
      height: 50,
      borderWidth: 0, // 可选的边框，让每个块看起来更清晰
      borderColor: "#ddd",
    },
    textFont: {
      color: "white",
    },
  });

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
    return;
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
      <ImageBackground source={backgroundImage} style={styles.image}>
        <View style={styles.containerView}>
          <View style={styles.block}>
            <Text style={styles.textFont}>系统版本：1.0.0.1</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textStyle}>欢迎来到共享K歌</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.textFont}>设备编号：10001</Text>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image style={{ ...imageStyle }} source={assets_qrcode} />
          <Section title="1.打开微信 2.扫描上方二维码">
            {/* <ReloadInstructions /> */}
          </Section>
          {/* <Button title="Linking" onPress={_onPress} /> */}
        </View>
      </ImageBackground>
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
