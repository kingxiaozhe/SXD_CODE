import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
// import DeviceInfo from "react-native-device-info";
import IntentLauncher from "react-native-intent-launcher";
import axios from "axios";

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
  const isDarkMode = useColorScheme() === "dark";

  const [updateSubmitLoading, setUpdateSubmitLoading] =
    useState<boolean>(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const _onPress = () => {
    console.log(123);
    const intervalId = setInterval(() => {
      _getByDeviceNo();
    }, 5000); // 每5秒执行一次
  };

  const _getByDeviceNo = () => {
    axios
      .post("http://43.138.208.118:8090/api/consumeOrder/getByDeviceNo", {
        deviceNo: "10001",
      })
      .then((response) => {
        setUpdateSubmitLoading(!!response.data.data);
        Alert.alert(String(!!response.data.data));
        IntentLauncher.startActivity({
          action: "com.sc.tv.vod",
          packageName: "com.ktv.vod.activity.init.FirstStartActivity", // 替换为你想启动的应用的包名
        });
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
    _getByDeviceNo();
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

          <Button title="Linking" onPress={_onPress} />

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
