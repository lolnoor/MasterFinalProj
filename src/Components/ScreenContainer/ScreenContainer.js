/** @format */

import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import R from "../../Utils/R";
import Styles from "./styles";
import LottieView from "lottie-react-native";
import AppText from "../AppText/AppText";

export default function ScreenContainer(props) {
  const insets = useSafeAreaInsets();

  const { loading } = props;

  return (
    <LinearGradient
      colors={["#FBFBFD", "#FBFBFD"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={Styles.containerStyle}
    >
      <SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
        {props.children}

        {loading && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <LottieView
              source={require("../../../assets/Animations/animation.json")}
              autoPlay
              loop
              speed={0.5}
              style={{
                width: 75,
                height: 75,
              }}
            />
            <AppText style={{ marginTop: 20 }}>Loading information</AppText>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
