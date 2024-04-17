/** @format */

import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import { inject, observer } from "mobx-react";
import ScreenContainer from "../Components/ScreenContainer/ScreenContainer";
import R from "../Utils/R";
import Styles from "./styles";
import { USER_TYPE } from "../Utils/Enums";
import firebase from "firebase";

@inject("userStore")
@observer
export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: new Animated.Value(0),
      donateBloodAnimated: new Animated.Value(0),
      requestBloodAnimated: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { animated, donateBloodAnimated, requestBloodAnimated } = this.state;

    // Slide up animation
    this.runAnimation(animated, 1, 1200);
    this.runAnimation(donateBloodAnimated, 1, 1550);
    this.runAnimation(requestBloodAnimated, 1, 1700);

    // Once slide up animation is completed, after some delay, start fade out animation
    setTimeout(() => {
      this.runAnimation(animated, 15, 1000);
      this.runAnimation(donateBloodAnimated, 0, 1000);
      this.runAnimation(requestBloodAnimated, 0, 1000);
    }, 3000);

    // Once all animation is completed, navigate to appropriate screen
    setTimeout(() => {
      this.navigateToScreen();
    }, 4000);
  }

  navigateToScreen = () => {
    const { userStore } = this.props;
    const { navigation } = this.props;
    const { firstTimeInstall } = userStore;

    // If user is opening app for the first time. navigate to tutorial screen.
    if (firstTimeInstall) {
      R.HelperFunctions.resetStack(navigation, "TutorialScreen");
      return;
    }

    // If user is logged in then, navigate to dashboard else go to login screen
    if (userStore?.isUserLoggedIn) {
      const userType = userStore?.userType;

      if (userType === USER_TYPE.DONOR) {
        R.HelperFunctions.resetStack(navigation, "Donor");
      } else if (userType === USER_TYPE.HOSPITAL) {
        R.HelperFunctions.resetStack(navigation, "Hospital");
      } else {
        R.HelperFunctions.resetStack(navigation, "Admin");
      }
    } else {
      R.HelperFunctions.resetStack(navigation, "Login");
    }
  };

  // Common function to run animation
  runAnimation = (animated, toValue, duration) => {
    Animated.timing(animated, {
      toValue,
      duration,
      easing: Easing.in,
      useNativeDriver: true,
    }).start();
  };

  // Blood drop image style
  imageAnimatingStyle = () => {
    const { animated } = this.state;
    const { height } = R.Dimension;

    const translationInterpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
      extrapolate: "clamp",
    });

    const opacityInterpolation = animated.interpolate({
      inputRange: [0, 1, 15],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    return {
      ...Styles.logoStyle,
      transform: [
        { translateY: translationInterpolation },
        { scale: animated },
      ],
      opacity: opacityInterpolation,
    };
  };

  textAnimatedStyle = (animated) => {
    const { height } = R.Dimension;

    const translationInterpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
      extrapolate: "clamp",
    });

    return {
      transform: [
        { translateY: translationInterpolation },
        { scale: animated },
      ],
    };
  };

  render() {
    const { donateBloodAnimated, requestBloodAnimated } = this.state;

    const imageStyle = this.imageAnimatingStyle();
    const donateBloodTextStyle = this.textAnimatedStyle(donateBloodAnimated);
    const requestBloodTextStyle = this.textAnimatedStyle(requestBloodAnimated);

    return (
      <ScreenContainer>
        <View style={Styles.containerStyle}>
          <Animated.Image
            source={R.Images.Logo}
            style={imageStyle}
            resizeMode="contain"
          />

          <Animated.Text
            style={[Styles.donateBloodTextStyle, donateBloodTextStyle]}
          >
            Donate Blood
          </Animated.Text>
          <Animated.Text
            style={[Styles.requestBloodTextStyle, requestBloodTextStyle]}
          >
            Request Blood
          </Animated.Text>
        </View>
      </ScreenContainer>
    );
  }
}
