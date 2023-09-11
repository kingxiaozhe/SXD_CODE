import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import backgroundImage from "./assets/pic_hd_new.jpg";
import assets_qrcode from "./assets/assets_qrcode.png";
// import DeviceInfo from "react-native-device-info";
import DeviceInfo from "react-native-device-info";
import { exitApp } from "react-native-exit-app"; // 导入退出应用函数
import QRCode from "qrcode-generator";

import axios from "axios";

import {
  NativeModules,
  AppState,
  ImageBackground,
  TouchableOpacity,
  Modal,
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
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
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
            color: Colors.white,
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [deviceNo, setDeviceNo] = useState(10001);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const DOMAIN_URL = "https://www.sharesingk.com";
  const { width } = Dimensions.get("window");

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
      marginTop: 65,
    },
    block: {
      flex: 1, // 平均分配容器的空间
      justifyContent: "center", // 垂直居中
      alignItems: "center", // 水平居中
      height: 50,
      borderWidth: 0, // 可选的边框，让每个块看起来更清晰
      borderColor: "#ddd",
    },
    blockCenter: {
      flex: 1, // 平均分配容器的空间
      justifyContent: "center", // 垂直居中
      alignItems: "center", // 水平居中
      height: 50,
      borderWidth: 0, // 可选的边框，让每个块看起来更清晰
      borderColor: "#ddd",
      marginTop: -5,
      borderBottomLeftRadius: 60,
      borderBottomRightRadius: 60,
    },
    textStyle: {
      fontSize: 20, // 设置字体大小为24
      color: "white",
      paddingBottom: 5,
      fontWeight: "bold",
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
      fontSize: width * 0.03,
    },
    square: {
      width: width * 0.25,
      height: width * 0.25,
      borderRadius: 20,
      justifyContent: "center", // 垂直居中
      alignItems: "center", // 水平居中
    },
    triggerText: {
      fontSize: 18,
      color: "blue",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      width: 300, // 设置宽度
      height: 200, // 设置高度
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
    },
    passwordInput: {
      width: "100%",
      padding: 10,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      marginBottom: 10,
    },
    submitButton: {
      backgroundColor: "blue",
      padding: 10,
      borderRadius: 5,
      width: 100, // 设置宽度
      height: 50, // 设置高度
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      textAlign: "center",
    },
  });

  const urlToEncodeFn = (deviceNo: string): void => {
    const urlToEncode = `https://www.sharesingk.com/pages/home/home?deviceNo=${deviceNo}`; // 替换为你想生成二维码的URL

    const qr = QRCode(0, "M");
    qr.addData(urlToEncode);
    qr.make();
    const qrCodeDataUrl = qr.createDataURL(10, 0);
    setQrCodeDataUrl(qrCodeDataUrl);
  };
  const setupTimer = () => {
    // _getByDeviceNo();
    const intervalId = setInterval(() => {
      _getOrderByDeviceNo();
    }, 15000); // 每5秒执行一次
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handlePasswordSubmit = () => {
    if (password === "gxkg") {
      // 替换为你的密码
      Alert.alert("成功", "密码正确！");
      setIsModalVisible(false);
      const SendModule = NativeModules.SendModule;
      SendModule.exitApp();
      // 退出应用
      //   exitApp();
    } else {
      Alert.alert("错误", "密码错误，请重试！");
    }
  };

  const getMacAddress = async () => {
    const serialNumber = await DeviceInfo.getSerialNumber();
    console.log("Device Serial Number:", serialNumber);
  };

  const handleAppStateChange = (nextAppState: String) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      // 从后台回到前台时，重新设置定时器
      setupTimer();
    }
    setAppState(nextAppState);
  };

  const _getByDeviceNo = async () => {
    const serialNumber = await DeviceInfo.getSerialNumber();
    const deviceName = await DeviceInfo.getDeviceName();
    axios
      .post(`${DOMAIN_URL}/api/device/register`, {
        uniqueMark: serialNumber == "unknown" ? "AB123456789C" : serialNumber,
        name: deviceName,
      })
      .then((response) => {
        // Alert.alert(response.data.data.id);
        setDeviceNo(response.data.data.id || 101010);
        urlToEncodeFn(response.data.data.id);
        console.log(`Successfully registered${response}`);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const _getOrderByDeviceNo = () => {
    axios
      .post(`${DOMAIN_URL}/api/consumeOrder/getByDeviceNo`, {
        deviceNo,
      })
      .then((response) => {
        console.log(`appState=>${appState}`);
        if (response.data.data) {
          const { duration } = response.data.data;
          console.log(`duration=>${duration}`);
          // 如果当前没有打开过，并且订单有值，则打开唱歌软件
          if (!updateSubmitLoading && response.data.data) {
            // sendData 是在原生模块自定义的方法，默认数据格式为字符串
            try {
              // SendModule 为我们自定义的原生模块
              const SendModule = NativeModules.SendModule;
              SendModule.openAppAndCloseAfter(
                //"com.google.android.apps.chrome.Main",
                "com.ktv.vod.activity.init.FirstStartActivity",
                duration
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
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const imageStyle = {
    width: width * 0.15,
    height: width * 0.15,
    marginTop: 35,
    flex: 1,
  };
  useEffect(() => {
    console.log(11111);
    _getByDeviceNo();
    const handleAppStateChange = (nextAppState: String) => {
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
      _getOrderByDeviceNo();
    }, 2000);

    return () => clearInterval(timer); // 清除定时器，以防止内存泄漏
  });

  // 处理返回键事件
  const handleBackButton = () => {
    // 屏蔽返回键的默认行为
    return true;
  };

  const disableHomeButton = () => {
    const SendModule = NativeModules.SendModule;
    SendModule.disableHomeButton();
  };

  useEffect(() => {
    // 添加返回键事件监听
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    // 移除事件监听
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <ImageBackground source={backgroundImage} style={styles.image}>
        <View style={styles.containerView}>
          <View style={styles.block}>
            <Text style={styles.textFont}>系统版本：1.0.0.1</Text>
          </View>
          <View style={styles.blockCenter}>
            <Text style={styles.textStyle}></Text>
          </View>
          <View style={styles.block}>
            <TouchableWithoutFeedback
              onLongPress={toggleModal} // 长按事件处理函数
              delayLongPress={500} // 长按触发的延迟时间（毫秒）
            >
              <Text style={styles.textFont}>设备编号：{deviceNo}</Text>
            </TouchableWithoutFeedback>
            <Button title="Disable Home Button" onPress={disableHomeButton} />
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={toggleModal}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>输入密码</Text>
                    <TextInput
                      secureTextEntry
                      placeholder="请输入密码"
                      value={password}
                      onChangeText={setPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handlePasswordSubmit}
                    >
                      <Text style={styles.buttonText}>确认</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={styles.square}>
            <Image
              source={{ uri: qrCodeDataUrl || "" }}
              style={{ ...imageStyle }}
              resizeMode="contain"
              v-if="qrCodeDataUrl"
            />
            {/* <QRCode
              value={urlToEncode}
              size={200} // 设置二维码的尺寸
            /> */}
          </View>
          <Section title={"联系热线: 13333333333"}>
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
    textAlign: "right",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "right",
    float: "right",
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

// let arrayData = [];
// let arrayDoms = [];

// for (let i = 0; i < $(".mod_content_center").length; i++) {
//   const t = $(".mod_content_center")[i];
//   const tHtml = t.innerHTML
//     .replaceAll('<font color="red">', "")
//     .replaceAll("</font>", "");
//   arrayDoms.push(tHtml);
// }

// $("PageNext").click();
